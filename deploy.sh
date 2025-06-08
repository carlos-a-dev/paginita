#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Logging function with timestamp
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Attempt to set up Node.js environment, particularly for pnpm.
# This is often needed when running scripts via cron, which has a minimal environment.

# If using NVM (Node Version Manager)
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  \. "$NVM_DIR/nvm.sh"  # Source NVM
  # You might want to uncomment and use a specific Node version if needed:
  # nvm use default # or nvm use <your-project-node-version>
fi

# If pnpm is installed via another method (e.g., standalone installer like ~/.local/share/pnpm)
# and not found after sourcing NVM, you might need to add its path explicitly here:
# export PATH="$HOME/.local/share/pnpm:$PATH"

# Determine the script's directory and navigate to it.
# This assumes the script is in the project root.
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$SCRIPT_DIR"

PM2_ECOSYSTEM_FILE="ecosystem.config.cjs" # Define your PM2 ecosystem file name here

# Verify pnpm is available before proceeding
if ! command -v pnpm > /dev/null; then
  log "Error: pnpm command not found. Please ensure pnpm is installed and in your PATH."
  log "The script attempted to source NVM. If pnpm is installed via a different method (e.g., standalone installer or global npm package not managed by NVM for the current user/shell), you may need to adjust the PATH explicitly in this script or ensure your cron environment has the correct PATH."
  exit 1
fi

# Check for remote changes before proceeding
log "Checking for remote changes..."
git fetch # Update local refs with remote changes

# Ensure the current branch is tracking an upstream branch
if ! git rev-parse --abbrev-ref '@{u}' > /dev/null 2>&1; then
    CURRENT_BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
    log "Error: Current branch '$CURRENT_BRANCH_NAME' is not tracking an upstream branch."
    log "Please set an upstream branch, e.g., git branch --set-upstream-to=origin/main $CURRENT_BRANCH_NAME"
    exit 1
fi

# Count commits on the remote that are not yet in the local branch HEAD
CHANGES_TO_PULL=$(git rev-list HEAD..@{u} --count)

if [ "$CHANGES_TO_PULL" -eq 0 ]; then
    log "No new commits to pull from remote. Local branch is up-to-date or ahead."
    log "Deployment not required. Exiting."
    exit 0
fi

log "$CHANGES_TO_PULL new commit(s) found on remote. Proceeding with deployment."
log "Starting deployment process..."

# 1. Git Pull
log "Pulling latest changes from git..."
git pull
log "Git pull complete."
# 2. Backend operations
log "Navigating to backend directory..."
pushd backend > /dev/null

log "Installing backend dependencies..."
pnpm install
log "Backend dependencies installed."

log "Building backend..."
NODE_OPTIONS="--max-old-space-size=2048" pnpm build
log "Backend build complete."

popd > /dev/null # Return to SCRIPT_DIR (project root)

# 3. Frontend operations
log "Navigating to frontend directory..."
pushd frontend > /dev/null

log "Installing frontend dependencies..."
pnpm install
log "Frontend dependencies installed."

log "Building frontend..."
NODE_OPTIONS="--max-old-space-size=2048" pnpm build
log "Frontend build complete."

popd > /dev/null # Return to SCRIPT_DIR (project root)

# 4. Return to root and restart PM2
log "Restarting PM2 ecosystem..."
pm2 restart "$PM2_ECOSYSTEM_FILE" --env production

log "Deployment process finished successfully!"
