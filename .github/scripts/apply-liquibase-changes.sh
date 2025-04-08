#!/usr/bin/env bash
set -euo pipefail

# Load tunnel and DB env vars
source .github/scripts/cf-tunnel-to-db.sh

# Run Liquibase
docker run --rm --network=host \
  -v "${PWD}/database:/liquibase/changelog" \
  -w /liquibase/changelog/changelog \
  liquibase/liquibase:4.31.1 \
  --changelog-file=changelog-root.yaml \
  --url=jdbc:postgresql://localhost:${PORT}/${DBNAME} \
  --username=${USERNAME} \
  --password=${PASSWORD} \
  update

# Cleanup
kill $TUNNEL_PID