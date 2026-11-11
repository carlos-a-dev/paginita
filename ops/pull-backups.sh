#!/usr/bin/env bash
# Copies production backups (made by ops/backup-db.sh) to this machine.
# Usage: ops/pull-backups.sh
#
# Environment overrides:
#   PAGINITA_BACKUP_REMOTE     ssh target, e.g. user@host (required)
#   PAGINITA_BACKUP_REMOTE_DIR remote directory (default backups/paginita, relative to its home)
#   PAGINITA_BACKUP_LOCAL_DIR  local directory (default ~/backups/alvasori-prod/paginita)
#   PAGINITA_BACKUP_LOCAL_KEEP_DAYS  days to keep locally (default 30)
#   PAGINITA_BACKUP_SSH_KEY    private key to use (optional). With a key restricted on
#                              the server by `command="rrsync -ro <dir>"`, set
#                              PAGINITA_BACKUP_REMOTE_DIR=. since rrsync roots paths there.
#
# Never mirrors deletions: an empty or wiped server can't erase local copies.
# Local files are pruned by age only, and never the newest one.
set -euo pipefail

REMOTE="${PAGINITA_BACKUP_REMOTE:?Set PAGINITA_BACKUP_REMOTE (user@host)}"
REMOTE_DIR="${PAGINITA_BACKUP_REMOTE_DIR:-backups/paginita}"
LOCAL_DIR="${PAGINITA_BACKUP_LOCAL_DIR:-$HOME/backups/alvasori-prod/paginita}"
KEEP_DAYS="${PAGINITA_BACKUP_LOCAL_KEEP_DAYS:-30}"
[[ "$KEEP_DAYS" =~ ^[0-9]+$ ]] || { echo "Invalid PAGINITA_BACKUP_LOCAL_KEEP_DAYS" >&2; exit 1; }

log() { echo "[$(date +'%F %T')] $*"; }

umask 077
mkdir -p "$LOCAL_DIR"
chmod 700 "$LOCAL_DIR"

SSH_CMD="ssh -o BatchMode=yes -o ConnectTimeout=20"
if [[ -n "${PAGINITA_BACKUP_SSH_KEY:-}" ]]; then
  [[ -r "$PAGINITA_BACKUP_SSH_KEY" && "$PAGINITA_BACKUP_SSH_KEY" != *" "* ]] || { echo "Unusable PAGINITA_BACKUP_SSH_KEY" >&2; exit 1; }
  SSH_CMD+=" -i $PAGINITA_BACKUP_SSH_KEY -o IdentitiesOnly=yes"
fi

rsync -a --chmod=F600 --include='paginita-*.db.gz' --include='paginita-*-uploads.tar.gz' --exclude='*' \
  -e "$SSH_CMD" "$REMOTE:$REMOTE_DIR/" "$LOCAL_DIR/"

# Verify the newest database copy decompresses and is a readable SQLite file.
newest="$(ls -t "$LOCAL_DIR"/paginita-*.db.gz 2>/dev/null | head -1 || true)"
[[ -n "$newest" ]] || { log "No database backups found in $LOCAL_DIR"; exit 1; }
python3 -I - "$newest" <<'PY'
import gzip, os, shutil, sqlite3, sys, tempfile
fd, path = tempfile.mkstemp(suffix=".db")
try:
    with os.fdopen(fd, "wb") as out, gzip.open(sys.argv[1], "rb") as src:
        shutil.copyfileobj(src, out)
    result = sqlite3.connect(path).execute("PRAGMA integrity_check").fetchone()[0]
    if result != "ok":
        sys.exit(f"Integrity check failed for {sys.argv[1]}: {result}")
finally:
    os.unlink(path)
PY

find "$LOCAL_DIR" -maxdepth 1 -name 'paginita-*' -type f -mtime +"$KEEP_DAYS" ! -name "$(basename "$newest")" -delete
age_hours=$(( ($(date +%s) - $(stat -c %Y "$newest")) / 3600 ))
log "Pulled to $LOCAL_DIR; newest $(basename "$newest") (${age_hours}h old), $(ls "$LOCAL_DIR" | wc -l) files"
if (( age_hours > 48 )); then
  log "WARNING: newest backup is over 48 hours old; check the server's backup cron."
  exit 2
fi
