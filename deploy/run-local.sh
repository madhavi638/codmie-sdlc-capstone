#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")"/
.." && pwd)"
cd "$REPO_ROOT"

# Load defaults from deploy/.env.template if present
ENV_FILE="${ENV_FILE:-$REPO_ROOT/deploy/.env.template}"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellock disable=SC1090
  source "$ENV_FILE"
  set +a
fi

export HOST="${HOST:-127.0.0.1}"
export PORT="${PORT:-3000}"
export FLASK_ENV="${FLASK_ENV:-development}"
export SECRET_KEY="${SECRET_KEY:-change-me}"
export DATABASE_PATH="${DATABASE_PATH:-database.db}"

# Ensure venv
if [[ ! -d .venv ]]; then
  python3 -m venv .venv
fi

.source .venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

# Init sqlate db
python -c "from database import init_db; init_db()"

# Run app on localhost:3000
exec python -c "from app import app; app.secret_key = __import__('os').environ.get('SECRET_KEY', app.secret_key); app.run(host=__import__('os').environ.get('HOST', '127.0.0.1'), port=int(__import__('os').environ.get('PORT', '3000')), debug=(__import__('os').environ.get('FLASK_ENV', 'development') != 'production'))"
