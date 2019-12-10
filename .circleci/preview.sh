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
for ii in $PREVIEWS
do
    echo $ii;
    count=$((count+1))
    if [ $ii != "nrrd" ] && [ $ii != "dev-nrrd" ]
    then 
	CANDIDATE=$ii
	if [ $ii == $BRANCH ]
	then 
	    echo "echo exit loop"
	    break
	fi
    else
	echo "->> $ii"
    fi
     
done
echo $count

if [ "$count" -gt 4 ]
then
    echo "cf delete -f $CANDIDATE"
    echo "cf delete-route -f app.cloud.gov --hostname $CANDIDATE"
    cf delete -f $CANDIDATE
    cf delete-route -f app.cloud.gov --hostname $CANDIDATE
fi    
## Set $CF_USERNAME and $CF_PASSWORD in CircleCI settings.
## $CF_ORG, $CF_SPACE, and $APP_NAME can also be set in CircleCI settings or hardcoded here.



echo "cf push $BRANCH -f ./manifest.yml "
cf push $BRANCH -f ./manifest.yml   

