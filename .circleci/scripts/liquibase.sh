#!/usr/bin/env bash

set -o nounset
set -o errexit
set -ox pipefail

cd ~/project/database/changelog
liquibase update > liquibase.out
cat liquibase.out
runfound=0
errorfound=0
while [ $runfound = 0 ] && [ $errorfound = 0 ];
do 
    runfound=$(grep "Run:" liquibase.out || echo 0)
    errorfound=$(grep "Unexpected error" liquibase.out || echo 0)
    sleep 1
done
updatecount=$(grep "Run:" liquibase.out | tr -s " " | cut -d ' ' -f2 | tr -d '\n')
if [ $errorfound = 0 ] || [ "$updatecount" = 0 ]; then
    echo "No changesets applied. Exiting job. errorfound ${errorfound}, updatecount ${updatecount}"
    circleci-agent step halt
fi