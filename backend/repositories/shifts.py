from backend.db import get_db_connection


def insert_shift(employee_id: int, shift_time: str) -> None:
    conn = get_db_connection()
    try:
        conn.execute(
            "INSERT INTO shifts (employee_id, shift_time) VALUES (?, ?)",
            (employee_id, shift_time),
        )
        conn.commit()
    finally:
        conn.close()


def delete_shift(shift_id: int) -> None:
    conn = get_db_connection()
    try:
        conn.execute("DELETE FROM shifts WHERE id = ?", (shift_id,))
        conn.commit()
    finally:
        conn.close()


def get_shifts_with_names():
    conn = get_db_connection()
    try:
        return conn.execute(
            """
            SELECT shifts.id, employees.name, shifts.shift_time
            FROM shifts
            JOIN employees ON shifts.employee_id = employees.id
            ORDER BY shifts.id DESC
            """
        ).fetchall()
    finally:
        conn.close()
