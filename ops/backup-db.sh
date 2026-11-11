#!/usr/bin/env bash
# Backs up the Strapi SQLite database and uploaded media.
# Usage: ops/backup-db.sh [label]   (cron runs it nightly)
#
# Environment overrides:
#   PAGINITA_BACKUP_DIR        destination (default ~/backups/paginita)
#   PAGINITA_BACKUP_KEEP_DAYS  days to keep (default 14; keep it well under the
#                              contact retention period so deleted records expire)
#   PAGINITA_COPY_MAX_DAYS     age limit for any other database copy (default 30; the
#                              privacy policy promises backups expire within 30 days)
#
# Each run also deletes database copies older than PAGINITA_COPY_MAX_DAYS in:
#   - ad-hoc snapshots under ${XDG_STATE_HOME:-~/.local/state}/paginita/backups
#   - the live database's directory (e.g. data.db.before-* copies)
#   - the repository root (stray *.db files)
# The live database and its -journal/-wal/-shm files are never touched.
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$APP_DIR/backend"
BACKUP_DIR="${PAGINITA_BACKUP_DIR:-$HOME/backups/paginita}"
KEEP_DAYS="${PAGINITA_BACKUP_KEEP_DAYS:-14}"
LABEL="${1:-nightly}"

[[ "$LABEL" =~ ^[A-Za-z0-9_-]+$ ]] || { echo "Invalid label: $LABEL" >&2; exit 1; }
[[ "$KEEP_DAYS" =~ ^[0-9]+$ ]] || { echo "Invalid PAGINITA_BACKUP_KEEP_DAYS" >&2; exit 1; }
COPY_MAX_DAYS="${PAGINITA_COPY_MAX_DAYS:-30}"
[[ "$COPY_MAX_DAYS" =~ ^[0-9]+$ && "$COPY_MAX_DAYS" -ge 1 ]] || { echo "Invalid PAGINITA_COPY_MAX_DAYS" >&2; exit 1; }
SNAPSHOT_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/paginita/backups"

log() { echo "[$(date +'%F %T')] $*"; }

umask 077
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

exec 9>"$BACKUP_DIR/.lock"
flock -n 9 || { log "Another backup is running. Exiting."; exit 0; }

# Resolve the database path the same way backend/config/database.ts does.
DB_CLIENT="$(grep -E '^DATABASE_CLIENT=' "$BACKEND_DIR/.env" 2>/dev/null | tail -1 | cut -d= -f2- | tr -d '"' || true)"
DB_FILENAME="$(grep -E '^DATABASE_FILENAME=' "$BACKEND_DIR/.env" 2>/dev/null | tail -1 | cut -d= -f2- | tr -d '"' || true)"
[[ -z "$DB_CLIENT" || "$DB_CLIENT" == "sqlite" ]] || { log "DATABASE_CLIENT=$DB_CLIENT is not supported by this script."; exit 1; }
DB_FILENAME="${DB_FILENAME:-.tmp/data.db}"
# database.ts joins it to __dirname/../.. (backend/dist/config -> backend).
[[ "$DB_FILENAME" = /* ]] && DB_PATH="$DB_FILENAME" || DB_PATH="$BACKEND_DIR/$DB_FILENAME"
[[ -f "$DB_PATH" ]] || { log "Database not found: $DB_PATH"; exit 1; }

STAMP="$(date +%Y%m%d-%H%M%S)"
DB_OUT="$BACKUP_DIR/paginita-$STAMP-$LABEL.db"
UPLOADS_OUT="$BACKUP_DIR/paginita-$STAMP-$LABEL-uploads.tar.gz"
trap 'rm -f "$DB_OUT" "$DB_OUT.gz.tmp" "$UPLOADS_OUT.tmp"' ERR

# Online backup via SQLite's backup API: consistent while Strapi is writing.
python3 -I - "$DB_PATH" "$DB_OUT" <<'PY'
import sqlite3, sys
src = sqlite3.connect(f"file:{sys.argv[1]}?mode=ro", uri=True, timeout=30)
dst = sqlite3.connect(sys.argv[2])
with dst:
    src.backup(dst)
src.close()
result = dst.execute("PRAGMA integrity_check").fetchone()[0]
dst.close()
if result != "ok":
    sys.exit(f"Integrity check failed: {result}")
PY
gzip -c "$DB_OUT" > "$DB_OUT.gz.tmp"
mv "$DB_OUT.gz.tmp" "$DB_OUT.gz"
rm -f "$DB_OUT"

if [[ -d "$BACKEND_DIR/public/uploads" ]]; then
  tar -czf "$UPLOADS_OUT.tmp" -C "$BACKEND_DIR/public" uploads
  mv "$UPLOADS_OUT.tmp" "$UPLOADS_OUT"
fi
trap - ERR

find "$BACKUP_DIR" -maxdepth 1 -name 'paginita-*' -type f -mtime +"$KEEP_DAYS" -delete

# Expire other database copies. Live DB journals use "-" suffixes (data.db-wal),
# so they never match these patterns; the live file itself is excluded by path.
purge_old_db_copies() {
  local dir="$1" depth="$2"
  [[ -d "$dir" ]] || return 0
  find "$dir" -maxdepth "$depth" -type f \
    \( -name '*.db' -o -name '*.db.*' -o -name '*.sqlite' -o -name '*.sqlite.*' -o -name '*.sql.gz' \) \
    ! -path "$DB_PATH" -mmin +"$((COPY_MAX_DAYS * 1440))" -print0 |
  while IFS= read -r -d '' f; do
    rm -f -- "$f" && log "Expired database copy: $f"
  done
}
purge_old_db_copies "$SNAPSHOT_DIR" 5
purge_old_db_copies "$(dirname "$DB_PATH")" 1
purge_old_db_copies "$APP_DIR" 1
[[ -d "$SNAPSHOT_DIR" ]] && find "$SNAPSHOT_DIR" -mindepth 1 -type d -empty -delete

log "Backup written:$DB_OUT.gz ($(du -h "$DB_OUT.gz" | cut -f1))${UPLOADS_OUT:+, uploads $(du -h "$UPLOADS_OUT" 2>/dev/null | cut -f1)}"
