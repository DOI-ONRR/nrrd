#!/bin/bash
cf api https://api.fr.cloud.gov
cf auth "$STAGING_CF_USERNAME" "$STAGING_CF_PASSWORD"
cf target -o "$STAGING_CF_ORG" -s "$STAGING_CF_SPACE"
BRANCH=`git rev-parse --abbrev-ref HEAD`
#curl -v -L -o cf-cli_amd64.deb 'https://cli.run.pivotal.io/stable?release=debian64&source=github'
#sudo dpkg -i cf-cli_amd64.deb
PREVIEWS=`cf apps | grep started  | cut -d " " -f 1`
count=0
CANDIDATE="";

##  Loop through staged previews
FOUND_FLAG=0;
for ii in $PREVIEWS
do
    echo $ii;
    count=$((count+1))
    if [ $ii != "nrrd" ] && [ $ii != "dev-nrrd" ]
    then 
        # Each preview is a candidate
	CANDIDATE=$ii
        #echo "$ii vs $BRANCH"
	if [ $ii == $BRANCH ]
	then
            # If candidate is the branch then candidate is the branch.
            FOUND_FLAG=1
	    echo "echo exit loop"
	    break
	fi
    else
	echo "->> $ii"
    fi

    
     
done
echo $count

if [ "$FOUND_FLAG" -eq 0 ]
then
    BRANCH_HISTORY=`for branch in \`git branch -r | grep -v HEAD\`;do echo -e \`git show --format="%ci %cr" $branch | head -n 1\` \\\t$branch; done | sort  | cut -f2 | grep -v origin/dev | sed 's/origin\///'`
    FOUND_FLAG=0
    ## Loop through history  until first match in preview history.(ie oldest committed branch)
    for preview in $PREVIEWS
    do
        HAS_BRANCH=0
        for branch in $BRANCH_HISTORY
        do
            ## echo "Compare $branch with $preview"
            if [ $branch == $preview ]
            then 
                echo "$preview has branch"
                HAS_BRANCH=1
                break
                
            fi
            
        done
        # if preview doesn't have branch remove preview
        if [ "$HAS_BRANCH" -eq 0 ]
        then
            echo "preview $preview no longer has branch remove preview"
            echo "cf delete -f $preview"
                echo "cf delete-route -f app.cloud.gov --hostname $preview"
                cf delete -f $preview
                cf delete-route -f app.cloud.gov --hostname $preview
        fi
        
        
        if [ "$FOUND_FLAG" -eq 0 ]
        then 
            for branch in $BRANCH_HISTORY
            do
                ## echo "Compare $branch with $preview"
                if [ $branch == $preview ]
                then 
                    echo "The oldest preview is $preview"
                    CANDIDATE=$preview
                    FOUND_FLAG=1
                    break
                    
                fi
                
            done
            if [ "$FOUND_FLAG" -eq 0 ]
            then
                echo "preview $preview no longer has branch remove preview"
                echo "cf delete -f $preview"
                echo "cf delete-route -f app.cloud.gov --hostname $preview"
                cf delete -f $preview
                cf delete-route -f app.cloud.gov --hostname $preview
            fi
        fi
    done
fi

echo "The candidate to remove from stage is $CANDIDATE"


if [ "$count" -gt 7 ]
then
    echo "cf delete -f $CANDIDATE"
    echo "cf delete-route -f app.cloud.gov --hostname $CANDIDATE"
    cf delete -f $CANDIDATE
    cf delete-route -f app.cloud.gov --hostname $CANDIDATE
fi    
## Set $CF_USERNAME and $CF_PASSWORD in CircleCI settings.
## $CF_ORG, $CF_SPACE, and $APP_NAME can also be set in CircleCI settings or hardcoded here.



echo "cf push $BRANCH -f ./manifest.staging.yml "
cf push $BRANCH -f ./manifest.staging.yml   


