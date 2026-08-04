# Deploy assets

This directory contains local build/run scripts and a Dockerfile to containerize the Flask app.

## Local run (virtualenv)

from repo root:

```bash
cd deploy
./run-local.sh
# app available at http://localhost:3000
```

## Docker build/run

from repo root:

```bash
docker build -t wms -f deploy/Dockerfile .
docker run --rm -p 3000:3000 --env-file deploy/.env.template wms
```

## Configuration

- `PORT`: server port (default 3000)
- `FLASK_ENV`: `porduction` or `development`
- `SECRET_KEY`: flask session secret
- `DATABASE_PATH: path to SQLite db file (default database.db)
