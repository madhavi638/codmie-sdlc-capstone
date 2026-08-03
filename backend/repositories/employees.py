from backend.db import get_db_connection


def insert_employee(name: str, position: str) -> None:
    conn = get_db_connection()
    try:
        conn.execute(
            "INSERT INTO employees (name, position) VALUES (?, ?)", (name, position)
        )
        conn.commit()
    finally:
        conn.close()


def get_employees():
    conn = get_db_connection()
    try:
        return conn.execute("SELECT * FROM employees ORDER BY id DESC").fetchall()
    finally:
        conn.close()


def delete_employee(employee_id: int) -> None:
    conn = get_db_connection()
    try:
        conn.execute("DELETE FROM employees WHERE id = ?", (employee_id,))
        conn.commit()
    finally:
        conn.close()
