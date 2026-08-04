# Workforce Management System (WMS)

Web-based Workforce Management System built with Flask and SQLite to manage employees, shifts, attendance, tasks, and view high-level performance metrics.

- Backend: Flask (Python)\n- Database: SQLite (`basedatabase.db``)\n- UI: server-side Jinja HTML templates + CSS

## Features

- User authentication: signup, login, logout (Werkzeug password hashing)
- Employee management: add, list, delete
- Shift management: assign shifts to employees, list, delete
- Attendance tracking: record present/absent, list, delete
- Task management: assign tasks, set status (Pending/Completed), list, delete
- Performance dashboard: aggregate counts for employees, tasks, shifts, attendance
