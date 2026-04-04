#!/usr/bin/env bash

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

git fetch origin
git checkout main
git pull --ff-only origin main

sudo docker compose build app
sudo docker compose up -d --force-recreate app nginx
sudo docker compose ps

APP_URL="${APP_URL:-}"

if [[ -z "$APP_URL" && -f .env ]]; then
  APP_URL="$(sed -n 's/^NEXT_PUBLIC_APP_URL=//p' .env | tail -n 1)"
fi

if [[ -n "$APP_URL" ]]; then
  curl -I "$APP_URL"
fi
