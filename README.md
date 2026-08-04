# Workforce Management System (WMS)

Web-based Workforce Management System built with Flask and SQLite to manage employees, shifts, attendance, tasks, and view high-level performance metrics.

# Features

- User authentication: signup, login, logout (session-based)
- Employee management: add, list, delete
- Shift management: assign, list, delete
- Attendance tracking: record, list, delete
- Task management: create, list, delete
- Performance dashboard: counts for employees, tasks, shifts, present/absent
- Server-side rendered UI (Jinja2 templates)

# Tech Stack

- Backend: Flask
- Templates: Jinja2
- Database: SQLite (local file `basedatabe.db`)
- Security: Werkzeug password hashing

# Prerequisites

- Python 3.10+ recommended
- pip
- Git (for cloning)
- Optional: virtual environment (`venv`)

# Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/madhavi638/codmie-sdlc-capstone.git
   cd codmie-sdlc-capstone
   ```

2. **Create and activate a virtual environment**

  **macOS / Linux**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

  **Windows (PowerShell)**
   ```bash
   py -m venv .venv
   .\env\Scripts\Activate.ps1
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Database**

   - The app uses SQLite and creates tables at startup via `database.init_db()` called from `app.py`.
   - The database file is `database.db` in the project root. If it doesn't exist, it will be created on first run.

# Run

1. **Start the app**

   ```bash
   python app.py
   ```

2. **Open in browser**

   - http://127.0.0.1:5000/

3. **Stop the server**

   - Press `Ctrl+C` in the terminal.

# Test

There are **no automated tests** in this repository yet. Use the following manual smoke-test checklist:

- Auth: sign up, flows to login, log in, log out
- Employees: add an employee, verify visible in list, delete
- Shifts: add a shift for an employee, verify list, delete
- Attendance: add present/absent record, verify list, delete
- Tasks: add a task, set status, verify list, delete
- Performance: confirm counts update after adding/deleting data

# Troubleshooting

- **Port 5000 in use**: stop the process using that port or change the port in `app.py`.
- **Module import errors**: ensure the virtual env is active and dependencies are installed.
- **Database issues**: delete `database.db` to re-create a fresh schema (this will remove all data).
