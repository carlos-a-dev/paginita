#!/usr/bin/env bash
set -euo pipefail

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
cd "$SCRIPT_DIR"
STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/paginita"
mkdir -p "$STATE_DIR"
chmod 700 "$STATE_DIR"

# The kernel releases this lock when the process exits, including after failures.
exec 9>"$STATE_DIR/deploy.lock"
if ! flock -n 9; then
  log "Another deployment is running. Exiting."
  exit 0
fi
trap 'log "Deployment failed at line $LINENO; the next run will retry."' ERR

FORCE_DEPLOY=0
for arg in "$@"; do
  case "$arg" in
    --force) FORCE_DEPLOY=1 ;;
    *) log "Unknown argument: $arg"; exit 1 ;;
  esac
done

log "Checking for remote changes..."
git fetch origin
UPSTREAM=$(git rev-parse --abbrev-ref '@{u}')
TARGET_COMMIT=$(git rev-parse "$UPSTREAM")
LAST_DEPLOYED=$(cat "$STATE_DIR/deployed-commit" 2>/dev/null || true)
if [ "$TARGET_COMMIT" = "$LAST_DEPLOYED" ] && [ "$FORCE_DEPLOY" -eq 0 ]; then
  if curl -fsS --max-time 10 http://127.0.0.1:1337/api/global >/dev/null 2>&1 &&
     curl -fsS --max-time 10 http://127.0.0.1:5000/ >/dev/null 2>&1; then
    log "Commit $TARGET_COMMIT is already deployed and healthy."
    exit 0
  fi
  log "The deployed commit is unhealthy; attempting recovery."
fi

# Do not create merge commits or discard production-specific working-tree changes.
git merge --ff-only "$UPSTREAM"
TARGET_COMMIT=$(git rev-parse HEAD)

# Cron has a minimal environment. Select the repository's tested runtime explicitly.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # NVM does not support nounset in every shell path.
  set +u
  . "$NVM_DIR/nvm.sh"
  nvm use --silent
  set -u
fi
REQUIRED_NODE=$(tr -d '[:space:]' < .nvmrc)
if [ "$(node --version)" != "v$REQUIRED_NODE" ]; then
  log "Node $REQUIRED_NODE is required. Install/select the version in .nvmrc."
  exit 1
fi
for executable in pnpm pm2 curl; do
  if ! command -v "$executable" >/dev/null; then
    log "Missing $executable in the selected Node environment."
    exit 1
  fi
done

log "Installing locked dependencies with $(node --version)..."
pnpm install --frozen-lockfile
log "Building backend and frontend..."
NODE_OPTIONS="${DEPLOY_NODE_OPTIONS:---max-old-space-size=3072}" pnpm -r --workspace-concurrency=1 build

log "Restarting production processes..."
mkdir -p backend/logs frontend/logs
pm2 startOrRestart ecosystem.config.cjs --env production --update-env

log "Checking application health..."
HEALTHY=0
for ((attempt=0; attempt<30; attempt++)); do
  if curl -fsS --max-time 10 http://127.0.0.1:1337/api/global >/dev/null 2>&1 &&
     curl -fsS --max-time 10 http://127.0.0.1:5000/ >/dev/null 2>&1; then
    HEALTHY=1
    break
  fi
  sleep 2
done
if [ "$HEALTHY" -ne 1 ]; then
  log "Application health checks failed. Inspect PM2 logs; deployment is not marked successful."
  exit 1
fi
pm2 save
printf '%s\n' "$TARGET_COMMIT" > "$STATE_DIR/deployed-commit.tmp"
mv "$STATE_DIR/deployed-commit.tmp" "$STATE_DIR/deployed-commit"
log "Successfully deployed $TARGET_COMMIT."
