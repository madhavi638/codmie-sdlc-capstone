from backend.db import get_db_connection


def insert_attendance(employee_id: int, date: str, status: str) -> None:
    conn = get_db_connection()
    try:
        conn.execute(
            "INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, ?)",
            (employee_id, date, status),
        )
        conn.commit()
    finally:
        conn.close()


def delete_attendance(attendance_id: int) -> None:
    conn = get_db_connection()
    try:
        conn.execute("DELETE FROM attendance WHERE id = ?", (attendance_id,))
        conn.commit()
    finally:
        conn.close()


def get_attendance_with_names():
    conn = get_db_connection()
    try:
        return conn.execute(
            """
            SELECT attendance.id, employees.name, attendance.date, attendance.status
            FROM attendance
            JOIN employees ON attendance.employee_id = employees.id
            ORDER BY attendance.id DESC
            """
        ).fetchall()
    finally:
        conn.close()
