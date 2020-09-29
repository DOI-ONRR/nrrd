#!/bin/bash
BRANCH=`git rev-parse --abbrev-ref HEAD`
unset EDITOR
git config --global user.name "You're friendly circleci bot"
git checkout staging
git fetch
git pull origin staging
git merge $BRANCH 
CONFLICT=$?
if [ $CONFLICT -gt 0 ]
then 
    echo "Conflict occurred aborting merge - Did you merge staging with your branch before pushing?"
    git merge --abort
    exit $CONFLICT
else
    git commit -m "Merging $BRANCH to staging"
    git push origin staging

fi

