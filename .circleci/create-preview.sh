#!/bin/bash
cf api https://api.fr.cloud.gov
cf auth "$STAGING_CF_USERNAME" "$STAGING_CF_PASSWORD"
cf target -o "$STAGING_CF_ORG" -s "$STAGING_CF_SPACE"
BRANCH=`git rev-parse --abbrev-ref HEAD`

## Connect to preview app
cf ssh preview-nrrd