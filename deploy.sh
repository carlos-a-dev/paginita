#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Determine the script's directory and navigate to it.
# This assumes the script is in the project root.
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$SCRIPT_DIR"

PM2_ECOSYSTEM_FILE="ecosystem.config.cjs" # Define your PM2 ecosystem file name here
echo "Starting deployment process..."

# 1. Git Pull
echo "Pulling latest changes from git..."
git pull
echo "Git pull complete."

# 2. Backend operations
echo "Navigating to backend directory..."
pushd backend > /dev/null

echo "Installing backend dependencies..."
pnpm install
echo "Backend dependencies installed."

echo "Building backend..."
NODE_OPTIONS="--max-old-space-size=2048" pnpm build
echo "Backend build complete."

popd > /dev/null # Return to SCRIPT_DIR (project root)

# 3. Frontend operations
echo "Navigating to frontend directory..."
pushd frontend > /dev/null

echo "Installing frontend dependencies..."
pnpm install
echo "Frontend dependencies installed."

echo "Building frontend..."
NODE_OPTIONS="--max-old-space-size=2048" pnpm build
echo "Frontend build complete."

popd > /dev/null # Return to SCRIPT_DIR (project root)

# 4. Return to root and restart PM2
echo "Restarting PM2 ecosystem..."
pm2 restart "$PM2_ECOSYSTEM_FILE" --env production

echo "Deployment process finished successfully!"
