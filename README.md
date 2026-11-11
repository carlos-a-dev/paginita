# Paginita Project

This project consists of a frontend and a backend application.

## Development

Use the Node version pinned in `.nvmrc` (24.21.0) and pnpm 10.12.1. Nuxt 4.6
requires Node 22.22.3+, 24.15.0+, or 26+; Node 20 and older Node 24 releases
cannot run the frontend.

From the repository root:

```bash
nvm install
nvm use
pnpm install --frozen-lockfile
```

To start both the frontend and backend services for development, use the `paginita_dev.sh` script:

```bash
./paginita_dev.sh
```

This script will:
1. Start the backend service in development mode.
2. Wait for the backend to be ready (checks if port 1337 is open).
3. Start the frontend service in development mode.

Both services will output their logs prefixed with `[BACKEND]` and `[FRONTEND]` respectively.

## Deployment (`deploy.sh`)

Install the Node version in `.nvmrc` before deploying. The script selects that
version through NVM and requires pnpm 10.12.1 and PM2 in its environment. Both
PM2 applications use paths relative to the repository and the selected Node
interpreter. Keep production `.env` files and database backups on the server.

Run from the repository root:

```bash
./deploy.sh
# Rebuild the current commit even if it was already deployed:
./deploy.sh --force
```

### On-demand deployment (`ops/deploy-now.sh`)

From a machine with SSH access to production, trigger a deployment without
waiting for cron and follow it to completion:

```bash
PAGINITA_DEPLOY_REMOTE=user@host ops/deploy-now.sh          # deploy if there is a new commit
PAGINITA_DEPLOY_REMOTE=user@host ops/deploy-now.sh --force  # rebuild and restart anyway
```

It starts `deploy.sh --wait` detached on the server, so closing the terminal or
losing the connection does not stop the build, and it waits for a running cron
deployment rather than starting a second one. Output also goes to `deploy.log`;
the exit status is `deploy.sh`'s. Per-run logs are kept for 14 days in
`~/.local/state/paginita/runs`.

The script fetches the upstream branch and updates with a fast-forward merge,
installs the root lockfile, builds each workspace in sequence, and restarts
PM2 in production mode. It checks the backend on port 1337 and frontend on
port 5000 before saving PM2 state and recording the successfully deployed commit.
A failed deployment is retried on the next run, even if Git already pulled that
commit. An unhealthy current release also triggers recovery.

State and an atomic deployment lock live in
`${XDG_STATE_HOME:-$HOME/.local/state}/paginita`. Only one deployment runs at a
time: a run that finds the lock held exits (cron), or with `--wait` queues behind
the running deployment for up to `DEPLOY_LOCK_WAIT_SECONDS` (default 1800).
Set `DEPLOY_NODE_OPTIONS` to
adjust the default 3072 MB build heap limit. PM2 restarts an application if it
exceeds 512 MB.

For the current production checkout, create the durable log directory and use:

```bash
mkdir -p /home/carlos/.local/state/paginita
```

```cron
*/5 * * * * /var/www/alvasori.net/deploy.sh >> /home/carlos/.local/state/paginita/deploy.log 2>&1
```

The cron command must match the actual checkout path. Log redirection must
point to an existing directory; `/tmp` directories may disappear after reboot.

## Backups (`ops/backup-db.sh`)

The script copies the SQLite database with SQLite's online backup API, checks
the copy's integrity, gzips it, and archives `backend/public/uploads`. Output
goes to `~/backups/paginita` (`PAGINITA_BACKUP_DIR`), and files older than 14 days
(`PAGINITA_BACKUP_KEEP_DAYS`) are deleted. Each run also deletes any other database
copy older than 30 days (`PAGINITA_COPY_MAX_DAYS`): ad-hoc snapshots in
`~/.local/state/paginita/backups`, `data.db.*` copies next to the live database, and
stray `*.db` files in the repo root. Keep the 14-day window well under the contact
retention period so deleted records don't live on in backups.

```cron
30 3 * * * /var/www/alvasori.net/ops/backup-db.sh >> /home/carlos/.local/state/paginita/backup.log 2>&1
```

To restore, stop the backend, replace `backend/.tmp/data.db` with the
decompressed file (`gunzip -c paginita-…db.gz > data.db`), extract the uploads
archive into `backend/public`, and start the backend again.

### Off-server copies (`ops/pull-backups.sh`)

Run on a workstation with SSH access to production. It pulls new backups into
`~/backups/alvasori-prod/paginita` (never mirroring deletions, so a wiped server
can't erase local copies), checks the newest database copy, keeps 30 days
locally, and exits non-zero if the newest backup is over 48 hours old.

To run it daily as a systemd user timer (catches up after the machine was off):

```bash
mkdir -p ~/.config/systemd/user && cp ops/systemd/alvasori-backup-pull.* ~/.config/systemd/user/ && systemctl --user daemon-reload && systemctl --user enable --now alvasori-backup-pull.timer
```

The service path assumes the checkout is at `~/projects/paginita`.

Production setup: the home server pulls with its own key, which prod's
`authorized_keys` restricts to read-only rsync of the backup folder:

```text
command="/usr/bin/rrsync -ro /home/carlos/backups/paginita",restrict ssh-ed25519 AAAA… alvasori-backup-pull@alvasori
```

Its `~/alvasori-backups/pull.env` sets `PAGINITA_BACKUP_REMOTE`, `PAGINITA_BACKUP_SSH_KEY`,
`PAGINITA_BACKUP_REMOTE_DIR=.` and `PAGINITA_BACKUP_LOCAL_DIR`; the service adds
`EnvironmentFile=%h/alvasori-backups/pull.env`. Enable lingering
(`sudo loginctl enable-linger carlos`) so the timer runs without a login session.
