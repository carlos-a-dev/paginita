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

The script fetches the upstream branch and updates with a fast-forward merge,
installs the root lockfile, builds each workspace in sequence, and restarts
PM2 in production mode. It checks the backend on port 1337 and frontend on
port 5000 before saving PM2 state and recording the successfully deployed commit.
A failed deployment is retried on the next run, even if Git already pulled that
commit. An unhealthy current release also triggers recovery.

State and an atomic deployment lock live in
`${XDG_STATE_HOME:-$HOME/.local/state}/paginita`. Set `DEPLOY_NODE_OPTIONS` to
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
