#!/bin/bash

# Function to display spinner
show_spinner() {
  local pid=$1
  local delay=0.1
  local spin='|/-\'

  while kill -0 $pid 2>/dev/null; do
    for ((i=0; i<${#spin}; i++)); do
      echo -ne "\r${spin:$i:1} " > /dev/tty  # Ensure spinner only appears in terminal
      sleep $delay
    done
  done
  echo -ne "\r✔   \n" > /dev/tty  # Ensure completion message only appears in terminal
}

# Redirect all output to a log file (silent in terminal)
exec > deploy-nrrd.log 2>&1

echo -n "Enter the cloud.gov space you are targeting: " > /dev/tty
read space < /dev/tty

# Check if cf is logged in
echo "Checking to see if you're logged in to cf..." > /dev/tty
cf apps > /dev/null 2>&1 &
pid=$!
show_spinner $pid
wait $pid
if [ $? -ne 0 ]; then
  echo -n "Enter a temporary authentication code: " > /dev/tty
  read -s sso_passcode < /dev/tty
  echo > /dev/tty
  echo "Logging in to cf..." > /dev/tty
  cf login -a api.fr.cloud.gov -o doi-onrr -s $space --sso-passcode $sso_passcode &
  pid=$!
  show_spinner $pid
  wait $pid || { echo "cf login failed. Check the log file. Exiting..." > /dev/tty; exit 1; }
fi

# Validate space and set branch
if [ "$space" = "prod" ]; then
  circle_branch="master"
  app="nrrd"
elif [ "$space" = "dev" ]; then
  circle_branch="dev"
  app="dev-nrrd"
else
  echo "Unknown space: $space"
  exit 1
fi

echo "Targeting cf space..." > /dev/tty
cf target -s $space &
pid=$!
show_spinner $pid
wait $pid || { echo "cf target failed. Check the log file. Exiting..." > /dev/tty; exit 1; }

export CIRCLE_BRANCH="${circle_branch}"
export CIRCLE_STAGE="${space}"
export GATSBY_HASURA_URI="https://hasura-${space}.app.cloud.gov/v1/graphql"

# Install npm deps if they aren't installed
if [ ! -d "node_modules" ]; then
  echo "npm deps not installed. Installing now..." > /dev/tty
  npm install --legacy-peer-deps &
  pid=$!
  show_spinner $pid
  wait $pid || { echo "npm install failed. Exiting..."; exit 1; }
fi

# Sync downloads from AWS
echo "Syncing downloads..." > /dev/tty
aws s3 sync public "s3://${AWS_BUCKET_NAME}/sites/${CIRCLE_BRANCH}/" &
pid=$!
show_spinner $pid
wait $pid || { echo "AWS sync failed. Check the log file. Exiting..." > /dev/tty; exit 1; }

# Cleaning
echo "Cleaning..." > /dev/tty
npm run clean &
pid=$!
show_spinner $pid
wait $pid || { echo "clean failed. Check the log file. Exiting..." > /dev/tty; exit 1; }

# Building
echo "Building..." > /dev/tty
npm run build &
pid=$!
show_spinner $pid
wait $pid || { echo "build failed. Check the log file. Exiting..." > /dev/tty; exit 1; }

cp Staticfile ./public
mv ./public/~partytown ./public/_partytown

# Deploying
echo "Deploying..." > /dev/tty
cf push $app -f manifest.yml &
pid=$!
show_spinner $pid
wait $pid || { echo "Deployment failed. Check the log file. Exiting..." > /dev/tty; exit 1; }

echo "NRRD build and deploy to ${space} completed successfully." > /dev/tty
exit 0