#!/bin/bash


HASURA=$1 
: ${HASURA:="hasura-sandbox"}

DB_ENV=`cf services | grep $HASURA | cut -d' ' -f1`

INTERFACE=$2
: ${INTERFACE:=$HASURA}
echo "Starting tunnel to $DB_ENV "
echo "cf connect-to-service -no-client $INTERFACE $DB_ENV"
cf connect-to-service -no-client $INTERFACE $DB_ENV > .creds &
PID=$!


cat .creds
while ! grep "Leave" .creds > /dev/null;
do
    echo "waiting for tunnel....."
    sleep 2

done
cat .creds

PGID=$()


Port=`cat ./.creds | grep Port: | cut -d ' ' -f2 |  tr -d '\n'`
Host=`cat ./.creds | grep Host: | cut -d ' ' -f2 |  tr -d '\n'`
Username=`cat ./.creds | grep Username: | cut -d ' ' -f2 |  tr -d '\n'`
Password=`cat ./.creds | grep Password: | cut -d ' ' -f2 |  tr -d '\n'`
Name=`cat ./.creds | grep Name: | cut -d ' ' -f2 |  tr -d '\n'`

cat <<EOF > ./.tunnelrc
export Host=$Host
export Port=$Port
export Username=$Username
export Password=$Password
export Name=$Name
export TUNNEL_PID=$PGID
EOF

echo $Host:$Port:$Name:$Username:$Password >> ~/.pgpass

cat ./.tunnelrc
echo "Tunnel and variables established to use on command line type"
echo
echo "to use variables:"
echo "source ./.tunnelrc"
echo "To use:"
echo
echo "psql postgres://\$Username:\$Password@\$Host:\$Port/\$Name -c '<command>'"
echo "pg_restore --user=\$Username --host=\$Host --port=\$Port --clean  --no-owner --no-acl --dbname=\$Name --no-password <restor file>"
echo
echo
echo "To end tunnel issue:"
echo "kill \$TUNNEL_PID"
echo "kill $TUNNEL_PID"
