import os
import sqlite3


def get_db_path() -> str:
    return os.getenv("DATABASE_PATH", "database.db")


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    # enforce FK constraints
    conn.execute("PRAGMA foreign_keys = ON")
    return conn
