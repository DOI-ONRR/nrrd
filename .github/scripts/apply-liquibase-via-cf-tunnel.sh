#!/usr/bin/env bash
set -euo pipefail

# Start the tunnel in the background
cf connect-to-service --no-client "${{ inputs.cf-app-name }}" "${{ inputs.cf-service-name }}" > tunnel.log 2>&1 &
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
host=$(echo "$output" | grep "^Host:" | awk '{print $2}' | xargs)
port=$(echo "$output" | grep "^Port:" | awk '{print $2}' | xargs)
username=$(echo "$output" | grep "^Username:" | awk '{print $2}' | xargs)
password=$(echo "$output" | grep "^Password:" | awk '{print $2}' | xargs)
dbname=$(echo "$output" | grep "^Name:" | awk '{print $2}' | xargs)

# Wait until DB is ready
timeout=30
until docker run --rm --network=host postgres:15 pg_isready -h localhost -p "$port" -d "$dbname" -U "$username" || [ $timeout -le 0 ]; do
  sleep 1
  timeout=$((timeout - 1))
done

if [ $timeout -le 0 ]; then
  echo "Tunnel opened, but DB never responded"
  kill $TUNNEL_PID
  exit 1
fi

# Run Liquibase
docker run --rm --network=host \
  -v "${PWD}/database:/liquibase/changelog" \
  -w /liquibase/changelog/changelog \
  liquibase/liquibase:4.31.1 \
  --changelog-file=changelog-root.yaml \
  --url=jdbc:postgresql://localhost:${port}/${dbname} \
  --username=${username} \
  --password=${password} \
  update

# Cleanup
kill $TUNNEL_PID