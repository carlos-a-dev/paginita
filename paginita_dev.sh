#!/bin/bash

# Start backend and frontend in development mode using pnpm, showing both outputs

BACKEND_CMD="cd backend && pnpm run dev"

# Start backend first and wait until it's ready before starting frontend
stdbuf -oL bash -c "$BACKEND_CMD" 2>&1 | sed -u 's/^/[BACKEND] /' &
BACKEND_PID=$!

# Wait for backend to be ready (replace with your actual readiness check)
until nc -z localhost 1337; do
    sleep 1
done


FRONTEND_CMD="cd frontend && pnpm run dev"
stdbuf -oL bash -c "$FRONTEND_CMD" 2>&1 | sed -u 's/^/[FRONTEND] /' &
FRONTEND_PID=$!

wait $BACKEND_PID
wait $FRONTEND_PID
