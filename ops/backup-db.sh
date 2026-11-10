#!/usr/bin/env bash
# Backs up the Strapi SQLite database and uploaded media.
# Usage: ops/backup-db.sh [label]   (cron runs it nightly)
#
# Environment overrides:
#   PAGINITA_BACKUP_DIR        destination (default ~/backups/paginita)
#   PAGINITA_BACKUP_KEEP_DAYS  days to keep (default 14; keep it well under the
#                              contact retention period so deleted records expire)
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$APP_DIR/backend"
BACKUP_DIR="${PAGINITA_BACKUP_DIR:-$HOME/backups/paginita}"
KEEP_DAYS="${PAGINITA_BACKUP_KEEP_DAYS:-14}"
LABEL="${1:-nightly}"

[[ "$LABEL" =~ ^[A-Za-z0-9_-]+$ ]] || { echo "Invalid label: $LABEL" >&2; exit 1; }
[[ "$KEEP_DAYS" =~ ^[0-9]+$ ]] || { echo "Invalid PAGINITA_BACKUP_KEEP_DAYS" >&2; exit 1; }

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
log "Backup written: $DB_OUT.gz ($(du -h "$DB_OUT.gz" | cut -f1))${UPLOADS_OUT:+, uploads $(du -h "$UPLOADS_OUT" 2>/dev/null | cut -f1)}"
