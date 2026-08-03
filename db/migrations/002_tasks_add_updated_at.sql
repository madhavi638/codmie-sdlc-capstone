-- Add updated_at column to tasks for auditability
PRAGMA foreign_keys = ON;

ALTER TABLE tasks ADD COLUMN updated_at TEXT;

-- backfill existing rows
UPDATE tasks SET updated_at = datetime('now') WHERE updated_at IS NULL;

-- NOTE: SQLite cannot easily set DEFAULT on existing columns via ALTER.
-- Application layer should set updated_at on updates.
