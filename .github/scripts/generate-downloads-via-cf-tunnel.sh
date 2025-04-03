#!/usr/bin/env bash
set -euo pipefail

# Start the tunnel in the background
cf connect-to-service --no-client "$CF_APP_NAME" "$CF_SERVICE_NAME" > tunnel.log 2>&1 &
TUNNEL_PID=$!

# Wait for tunnel to open
timeout=30
while [ $timeout -gt 0 ]; do
  if grep -q "^Port:" tunnel.log; then
    break
  fi
  sleep 1
  timeout=$((timeout - 1))
done

if [ $timeout -le 0 ]; then
  echo "Tunnel did not open in time."
  kill $TUNNEL_PID
  exit 1
fi

# Extract connection details
output=$(cat tunnel.log)
export HOST=$(echo "$output" | grep "^Host:" | awk '{print $2}' | xargs)
export PORT=$(echo "$output" | grep "^Port:" | awk '{print $2}' | xargs)
export USERNAME=$(echo "$output" | grep "^Username:" | awk '{print $2}' | xargs)
export PASSWORD=$(echo "$output" | grep "^Password:" | awk '{print $2}' | xargs)
export DBNAME=$(echo "$output" | grep "^Name:" | awk '{print $2}' | xargs)

# Wait until DB is ready
timeout=30
until docker run --rm --network=host postgres:15 pg_isready -h localhost -p "$PORT" -d "$DBNAME" -U "$USERNAME" || [ $timeout -le 0 ]; do
  sleep 1
  timeout=$((timeout - 1))
done

if [ $timeout -le 0 ]; then
  echo "Tunnel opened, but DB never responded"
  kill $TUNNEL_PID
  exit 1
fi

# generate downloads
bash .github/scripts/generate-downloads.sh

# generate downloads.json
node .github/scripts/generate-downloads-json.js

# Cleanup
kill $TUNNEL_PID