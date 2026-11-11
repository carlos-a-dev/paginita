#!/usr/bin/env bash
# Triggers a production deployment on demand and follows it until it finishes.
# Usage: PAGINITA_DEPLOY_REMOTE=user@host ops/deploy-now.sh [--force]
#
#   --force   rebuild and restart even if the current commit is already deployed
#
# The deployment runs detached on the server (setsid/nohup), so a dropped SSH
# connection cannot interrupt a build; rerun this script to see the outcome in
# deploy.log. If cron or another run is deploying, this run waits for it
# (deploy.sh --wait) instead of running a second deployment at the same time.
# Exits with deploy.sh's exit status.
#
# Environment:
#   PAGINITA_DEPLOY_REMOTE  ssh target (required)
#   PAGINITA_DEPLOY_PATH    checkout on the server (default /var/www/alvasori.net)
set -euo pipefail

REMOTE="${PAGINITA_DEPLOY_REMOTE:?Set PAGINITA_DEPLOY_REMOTE (user@host)}"
APP_PATH="${PAGINITA_DEPLOY_PATH:-/var/www/alvasori.net}"

ARGS=(--wait)
for arg in "$@"; do
  case "$arg" in
    --force) ARGS+=(--force) ;;
    -h|--help) sed -n '2,16p' "$0"; exit 0 ;;
    *) echo "Unknown argument: $arg" >&2; exit 1 ;;
  esac
done

TRIGGER="on demand by $(id -un)@$(hostname -s)"

# The server-side script arrives on stdin; values are passed as arguments, never
# interpolated into code.
ssh -o BatchMode=yes "$REMOTE" bash -s -- "$APP_PATH" "$TRIGGER" "${ARGS[@]}" <<'REMOTE'
set -euo pipefail
app_path=$1 trigger=$2; shift 2
state="${XDG_STATE_HOME:-$HOME/.local/state}/paginita"
mkdir -p "$state/runs"
run_log=$(mktemp "$state/runs/deploy-XXXXXX.log")

# Detached wrapper: run deploy.sh, record its exit status, then append the run's
# output to the shared deploy.log as one block.
DEPLOY_TRIGGER="$trigger" setsid nohup bash -c '
  "$1/deploy.sh" "${@:3}" > "$2" 2>&1; status=$?
  echo "EXIT $status" >> "$2"
  grep -v "^EXIT " "$2" >> "${2%/runs/*}/deploy.log"
' _ "$app_path" "$run_log" "$@" > /dev/null 2>&1 < /dev/null &
pid=$!   # setsid execs in place here (not a group leader), so this is the wrapper

echo "Deployment started on $(hostname). Run log: $run_log"
# Follow until the wrapper exits (tail --pid), then report its EXIT status.
status=0
# Read to the end (tail stops on its own) so tail never gets SIGPIPE.
tail -n +1 -F --pid="$pid" "$run_log" 2>/dev/null | {
  rc=1
  while IFS= read -r line; do
    case "$line" in
      "EXIT "*) rc=${line#EXIT } ;;
      *) printf '%s\n' "$line" ;;
    esac
  done
  exit "$rc"
} || status=$?
grep -q '^EXIT ' "$run_log" || { echo "Deployment ended without reporting a status; see $run_log" >&2; status=1; }
find "$state/runs" -name 'deploy-*.log' -mtime +14 -delete
exit "$status"
REMOTE
