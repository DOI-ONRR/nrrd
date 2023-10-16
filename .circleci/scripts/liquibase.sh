#!/usr/bin/env bash

set -o nounset
set -o errexit
set -eox pipefail

cd ~/project/database/changelog
liquibase update > liquibase.out &
runfound=1
errorfound=1
while [ $runfound = 1 ] && [ $errorfound = 1 ];
do 
    grep Run: liquibase.out > /dev/null
    runfound=$?
    grep "Unexpected error" liquibase.out > /dev/null
    errorfound=$?
    sleep 1
done
updatecount=$(grep Run: liquibase.out | tr -s " " | cut -d ' ' -f2 | tr -d '\n')
if [ $errorfound = 0 ] || [ "$updatecount" = 0 ]; then
    echo "No changesets applied. Exiting job. errorfound ${errorfound}, updatecount ${updatecount}"
    circleci-agent step halt
fi