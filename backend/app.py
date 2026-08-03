from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import sqlite3

from backend.db import get_db_connection
from backend.migrations import run_migrations
from backend.repositories.employees import (
    insert_employee,
    get_employees,
    delete_employee,
)
from backend.repositories.shifts import (
    insert_shift,
    get_shifts_with_names,
    delete_shift,
)
from backend.repositories.attendance import (
    insert_attendance,
    get_attendance_with_names,
    delete_attendance,
)
from backend.repositories.tasks import (
    insert_task,
    get_tasks_with_names,
    delete_task,
    update_task_status,
)
from backend.repositories.users import insert_user, get_user_by_email


def create_app():
    app = Flask(
        __name__,
        template_folder="../frontend/templates",
        static_folder="../frontend/static",
    )
    app.secret_key = "your_secret_key"  # TODO: move to env var

    def login_required(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if "user_id" not in session:
                flash("Please login to access this page", "error")
                return redirect(url_for("login"))
            return f(*args, **kwargs)

        return decorated_function

    def get_statistics():
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM employees")
        no_of_employees = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM tasks")
        no_of_tasks = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM shifts")
        no_of_shifts = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM attendance WHERE status = 'Present'")
        no_of_present = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM attendance WHERE status = 'Absent'")
        no_of_absent = cursor.fetchone()[0]

        conn.close()
        return no_of_employees, no_of_tasks, no_of_shifts, no_of_present, no_of_absent

    @app.before_request
    def _ensure_migrations():
        # idempotent; cheap for sqlite
        run_migrations()

    @app.route("/health")
    def health():
        return jsonify({"status": "ok"})

    @app.route("/performance")
    @login_required
    def performance():
        (
            no_of_employees,
            no_of_tasks,
            no_of_shifts,
            no_of_present,
            no_of_absent,
        ) = get_statistics()
        return render_template(
            "performance.html",
            no_of_employees=no_of_employees,
            no_of_tasks=no_of_tasks,
            no_of_shifts=no_of_shifts,
            no_of_present=no_of_present,
            no_of_absent=no_of_absent,
        )

    @app.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == "POST":
            email = request.form["email"]
            password = request.form["password"]

            user = get_user_by_email(email)
            if user and check_password_hash(user["password"], password):
                session["user_id"] = user["id"]
                flash("Logged in successfully", "success")
                return redirect(url_for("index"))

            flash("Invalid email or password", "error")

        return render_template("login.html")

    @app.route("/signup", methods=["GET", "POST"])
    def signup():
        if request.method == "POST":
            name = request.form["name"]
            email = request.form["email"]
            password = request.form["password"]
            confirm_password = request.form["confirm_password"]

            if password != confirm_password:
                flash("Passwords do not match", "error")
                return redirect(url_for("signup"))

            hashed_password = generate_password_hash(password)

            try:
                insert_user(name, email, hashed_password)
                flash("Account created successfully", "success")
                return redirect(url_for("login"))
            except sqlite3.IntegrityError:
                flash("Email already exists", "error")

        return render_template("signup.html")

    @app.route("/logout")
    def logout():
        session.pop("user_id", None)
        flash("Logged out successfully", "success")
        return redirect(url_for("login"))

    @app.route("/")
    @login_required
    def index():
        return render_template("index.html")

    @app.route("/employees", methods=["GET", "POST"])
    @login_required
    def employees():
        if request.method == "POST":
            name = request.form["name"].strip()
            position = request.form["position"].strip()
            if not name or not position:
                flash("Name and Position are required", "error")
            else:
                insert_employee(name, position)
            return redirect(url_for("employees"))

        employees_rows = get_employees()
        return render_template("employees.html", employees=employees_rows)

    @app.route("/delete_employee/<int:employee_id>")
    @login_required
    def delete_employee_route(employee_id):
        delete_employee(employee_id)
        return redirect(url_for("employees"))

    @app.route("/shifts", methods=["GET", "POST"])
    @login_required
    def shifts():
        if request.method == "POST":
            employee_id = request.form["employee_id"]
            shift_time = request.form["shift_time"].strip()
            if not shift_time:
                flash("Shift time is required", "error")
            else:
                insert_shift(employee_id, shift_time)
            return redirect(url_for("shifts"))

        shifts_rows = get_shifts_with_names()
        employees_rows = get_employees()
        return render_template(
            "shifts.html", shifts=shifts_rows, employees=employees_rows
        )

    @app.route("/delete_shift/<int:shift_id>")
    @login_required
    def delete_shift_route(shift_id):
        delete_shift(shift_id)
        return redirect(url_for("shifts"))

    @app.route("/attendance", methods=["GET", "POST"])
    @login_required
    def attendance():
        if request.method == "POST":
            employee_id = request.form["employee_id"]
            date = request.form["date"].strip()
            status = request.form["status"].strip()
            if not date or status not in ("Present", "Absent"):
                flash("Valid date and status are required", "error")
            else:
                insert_attendance(employee_id, date, status)
            return redirect(url_for("attendance"))

        attendance_records = get_attendance_with_names()
        employees_rows = get_employees()
        return render_template(
            "attendance.html",
            attendance_records=attendance_records,
            employees=employees_rows,
        )

    @app.route("/delete_attendance/<int:attendance_id>")
    @login_required
    def delete_attendance_route(attendance_id):
        delete_attendance(attendance_id)
        return redirect(url_for("attendance"))

    @app.route("/tasks", methods=["GET", "POST"])
    @login_required
    def tasks():
        if request.method == "POST":
            employee_id = request.form["employee_id"]
            task = request.form["task"].strip()
            status = request.form["status"].strip()
            if not task or status not in ("Pending", "Completed"):
                flash("Task and valid status are required", "error")
            else:
                insert_task(employee_id, task, status)
            return redirect(url_for("tasks"))

        tasks_rows = get_tasks_with_names()
        employees_rows = get_employees()
        return render_template("tasks.html", tasks=tasks_rows, employees=employees_rows)

    @app.route("/tasks/<int:task_id>/status", methods=["POST"])
    @login_required
    def task_status_update(task_id):
        status = request.form.get("status")
        if status not in ("Pending", "Completed"):
            flash("Invalid status", "error")
            return redirect(url_for("tasks"))

        update_task_status(task_id, status)
        flash("Task status updated", "success")
        return redirect(url_for("tasks"))

    @app.route("/delete_task/<int:task_id>")
    @login_required
    def delete_task_route(task_id):
        delete_task(task_id)
        return redirect(url_for("tasks"))

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
