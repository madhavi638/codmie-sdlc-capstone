#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")"/
.." && pwd)"
cd "$REPO_ROOT"

IMAGE="${IMAGE:-wms}"
ENV_FILE="${ENV_FILE:-$REPO_ROOT/deploy/.env.template}"

docker build -t "$IMAGE" -f deploy/Dockerfile .

docker run --rm -p 3000:3000 --env-file "$ENV_FILE" "$IMAGE" 
