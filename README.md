# Workforce Management System (WMS)

Web-based Workforce Management System built with Flask and SQLite to manage employees, shifts, attendance, tasks, and view high-level performance metrics.

## Prerequisites

- Python 3.10+ (3.9+ may work depending on dependencies, but 3.10+ is recommended)
- pip (comes with most Python installs)
- (Optional but recommended) `venv` for virtual environments

## Setup

1. **Clone / download the project**
   - Ensure you are in the project root directory (where `app.py` and `requirements.txt` are located).

2. **Create and activate a virtual environment**

   **macOS / Linux**
   - `python3 -m venv .venv`
   - `source .venv/bin/activate`

   **Windows (PowerShell)**
   - `py -m venv .venv`
   - `.venv\Scripts\Activate.ps1`

   **Windows (cmd.exe)**
   - `py -m venv .venv`
   - `.venv\Scripts\activate.bat`

3. **Install dependencies**
   - `pip install -r requirements.txt`

4. **Database**
   - The application uses SQLite and expects a database file named `basedatabase.db`.
   - If the database is created automatically by the app, no manual step is required.
   - If your project requires an existing `basedatabase.db`, ensure it is present in the project root (or wherever your app expects it).

## Run

1. **Start the Flask application**
   - `python app.py`

2. **Open the application in your browser**
   - Visit: `http://127.0.0.1:5000/`

3. **Stop the server**
   - Press `Ctrl+C` in the terminal where it is running.

## Test

Automated tests are **not included** in this project.

### Smoke test checklist (manual)

Use the checklist below to confirm the app works end-to-end after setup:

1. **App boots**
   - Run `python app.py` and confirm the server starts without errors.
   - Load `http://127.0.0.1:5000/` and confirm you see the landing/login page.

2. **Authentication**
   - Sign up with a new username/password.
   - Log out.
   - Log back in with the same credentials.
   - Confirm incorrect password fails as expected.

3. **Employees**
   - Add an employee.
   - Confirm the employee appears in the employee list.
   - Delete the employee and confirm it is removed.

4. **Shifts**
   - Assign a shift to an employee.
   - Confirm it appears in the shift list.
   - Delete the shift and confirm it is removed.

5. **Attendance**
   - Record attendance (present/absent) for an employee.
   - Confirm it appears in the attendance list.
   - Delete the attendance record and confirm it is removed.

6. **Tasks**
   - Create/assign a task to an employee.
   - Confirm it appears in the task list with status `Pending`.
   - Update/mark the task as `Completed` (if supported in UI).
   - Delete the task and confirm it is removed.

7. **Dashboard / Metrics**
   - Open the performance/dashboard page.
   - Confirm aggregate counts reflect the current data (employees, tasks, shifts, attendance).

### Common troubleshooting

- **Port already in use**: stop the process using port 5000, or change the port in `app.py` if needed.
- **Module import errors**: confirm the virtual environment is activated and `pip install -r requirements.txt` completed successfully.
- **Database issues**: confirm `basedatabase.db` is present (if required) and the app has permission to create/write to it.