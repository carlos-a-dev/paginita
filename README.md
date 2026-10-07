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

The `deploy.sh` script automates the deployment process for the production environment.

### Prerequisites

*   Install the Node version from `.nvmrc` before deploying the Nuxt upgrade.
    Select it for both builds and PM2 application processes; production's
    previously used Node 24.12.0 does not meet Nuxt 4.6's minimum requirement.
*   Use the workspace root lockfile and pnpm version pinned in the root
    `package.json`.
*   `git` installed and configured.
*   The current local branch must be tracking a remote upstream branch (e.g., `origin/main`).
*   `pnpm` installed.
*   `pm2` installed and configured to manage your applications (see `ecosystem.config.cjs`).

### How it Works

1.  **Checks for Remote Changes**: Fetches updates from the remote repository and checks if there are new commits on the upstream branch.
2.  **Exits if No Changes**: If the local branch is up-to-date, the script exits without performing a deployment.
3.  **Pulls Changes**: If new commits are found, it pulls the latest code.
4.  **Builds Backend**: Navigates to the `backend` directory, installs dependencies (`pnpm install`), and builds the backend (`pnpm build`).
5.  **Builds Frontend**: Navigates to the `frontend` directory, installs dependencies (`pnpm install`), and builds the frontend (`pnpm build`).
6.  **Restarts Services**: Restarts the applications managed by PM2 using the `ecosystem.config.cjs` file in the production environment.

### Usage

Run the script from the project root directory:

```bash
./deploy.sh
```

This script is suitable for automation, such as being run by a cron job to periodically check for updates and deploy them.

### PM2 Configuration

The `ecosystem.config.cjs` file defines how PM2 should run the frontend and backend applications, including environment variables, logging, and instance management for production.
