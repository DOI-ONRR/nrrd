#!/bin/bash
ALL_BRANCHES=`git branch -r | sed 's/ *origin\///' | egrep -v "(^\*|master|dev)"`
# echo $ALL_BRANCHES
PREVIEWS=`aws s3 ls s3://cg-e3cdbb3a-86e7-468d-9fc9-177177e50bc9/sites/`
# echo $PREVIEWS

for PREVIEW in $PREVIEWS
do
  if [[ $PREVIEW != "PRE" ]]; then
    if [[ $ALL_BRANCHES != *${PREVIEW%?}* ]]; then
      echo "Deleting: $PREVIEW"
      aws s3 rm --recursive "s3://cg-e3cdbb3a-86e7-468d-9fc9-177177e50bc9/sites/$PREVIEW"
    fi
  fi
done
exit 0

