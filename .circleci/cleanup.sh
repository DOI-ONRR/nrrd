#!/bin/bash

MERGED=`git branch -a --merged  | grep remotes | grep -vw HEAD | grep -vw dev | grep -vw master | cut -d '/' -f 3 `
PREVIEWS=`cf apps | grep started  | cut -d " " -f 1`
for PREVIEW in $PREVIEWS
do
    
    if [[ $MERGED == *$PREVIEW* ]]; then
        echo "cf delete -f $PREVIEW"
        echo "cf delete-route -f app.cloud.gov --hostname $PREVIEW"
        cf delete -f $PREVIEW
        cf delete-route -f app.cloud.gov --hostname $PREVIEW
    else
                echo "No previews to delete"
    fi
done
exit 0

