import glob
import os
from pathlib import Path

from backend.db import get_db_connection


MIGRATIONS_DIR = Path(__file__).resolve().parents[1] / "db" / "migrations"


def _ensure_schema_migrations_table(conn):
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version TEXT PRIMARY KEY,
            applied_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
        """
    )


def run_migrations() -> None:
    """Apply SQL migrations in /db/migrations in lexical order (idempotent)."""
    MIGRATIONS_DIR.mkdir(parents=True, exist_ok=True)

    conn = get_db_connection()
    try:
        _ensure_schema_migrations_table(conn)

        applied = {
            row["version"]
            for row in conn.execute("SELECT version FROM schema_migrations").fetchall()
        }

        migration_files = sorted(glob.glob(str(MIGRATIONS_DIR / "*.sql")))
        for path in migration_files:
            version = os.path.basename(path)
            if version in applied:
                continue

            with open(path, "r", encoding="utf-8") as f:
                sql = f.read().strip()

            if not sql:
                conn.execute(
                    "INSERT INTO schema_migrations(version) VALUES (?)", (version,)
                )
                conn.commit()
                continue

            conn.executescript(sql)
            conn.execute("INSERT INTO schema_migrations(version) VALUES (?)", (version,))
            conn.commit()
    finally:
        conn.close()
