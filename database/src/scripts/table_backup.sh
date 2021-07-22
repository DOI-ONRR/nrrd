#!/bin/bash

# Config:
DB=dbName
U=userName
# tablename searchpattern, if you want all tables enter "":
P=""
# directory to dump files without trailing slash:
DIR=./ddl

mkdir -p $DIR
rm $DIR/*.sql
AUTH="-d $DB -U $U"
TABLES="$(psql --host=localhost --user=postgres -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' AND table_name LIKE '%%' ORDER BY table_name")"

for table in $TABLES; do
  echo backup $table ...
  pg_dump postgres://postgres:postgrespassword@localhost:5432/postgres --schema-only -t $table > $DIR/$table.sql;
done;
echo done

VIEWS="$(psql --host=localhost --user=postgres -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='VIEW' AND table_name LIKE '%%' ORDER BY table_name")"

for table in $VIEWS; do
  echo backup $table ...
  pg_dump postgres://postgres:postgrespassword@localhost:5432/postgres --schema-only -t $table > $DIR/$table.view.sql;
done;
echo done
