from backend.db import get_db_connection


def insert_user(name: str, email: str, password: str) -> None:
    conn = get_db_connection()
    try:
        conn.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (name, email, password),
        )
        conn.commit()
    finally:
        conn.close()


def get_user_by_email(email: str):
    conn = get_db_connection()
    try:
        return conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    finally:
        conn.close()
