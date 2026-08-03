from backend.db import get_db_connection


def insert_task(employee_id: int, task: str, status: str) -> None:
    conn = get_db_connection()
    try:
        conn.execute(
            "INSERT INTO tasks (employee_id, task, status) VALUES (?, ?, ?)",
            (employee_id, task, status),
        )
        conn.commit()
    finally:
        conn.close()


def delete_task(task_id: int) -> None:
    conn = get_db_connection()
    try:
        conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        conn.commit()
    finally:
        conn.close()


def update_task_status(task_id: int, status: str) -> None:
    conn = get_db_connection()
    try:
        conn.execute("UPDATE tasks SET status = ? WHERE id = ?", (status, task_id))
        conn.commit()
    finally:
        conn.close()


def get_tasks_with_names():
    conn = get_db_connection()
    try:
        return conn.execute(
            """
            SELECT tasks.id, employees.name, tasks.task, tasks.status
            FROM tasks
            JOIN employees ON tasks.employee_id = employees.id
            ORDER BY tasks.id DESC
            """
        ).fetchall()
    finally:
        conn.close()
