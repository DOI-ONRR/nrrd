#!/bin/bash

# Config:


# directory to dump files without trailing slash:

COMMANDS="$(psql --host=localhost --user=postgres -t -c "select  relname  from mat_view_refresh_order")"

for CMD in $COMMANDS; do
  echo " refresh materialized view $CMD;"
  psql --host=localhost --user=postgres -t -c "refresh materialized view $CMD ;" 
done;

