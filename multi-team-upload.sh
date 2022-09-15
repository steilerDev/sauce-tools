#!/bin/bash

# Uploads the file specified by the first argument to all teams in the Sauce Labs Org

# Expecting $SAUCE_USERNAME and $SAUCE_ACCESS_KEY to be set (with org-admin privileges)

# Known issues: 
#  - Teams will be returned as a paginated object, this script does not follow any sub-sequent pages
#  - The executing user id needs to be found, if multiple usernames in the org match this user's name, the wrong ID might be chosen

ENDPOINT="https://api.eu-central-1.saucelabs.com"

if [ ! -f "$1" ]; then
    echo "Unable to find file $1"
    exit
fi

if [ -z "$SAUCE_USERNAME" ]; then
    echo "Env Variable SAUCE_USERNAME missing!"
fi

if [ -z "$SAUCE_ACCESS_KEY" ]; then
    echo "Env Variable SAUCE_ACCESS_KEY missing!"
fi

echo "Getting current user id"
USER_ID=$(curl -s -u "$SAUCE_USERNAME:$SAUCE_ACCESS_KEY" --location \
    --request GET "${ENDPOINT}/team-management/v1/users?username=$SAUCE_USERNAME" \
    --header 'Content-Type: application/json' | jq -r '.results[0].id')
echo "Obtained user id ${USER_ID}"

echo "Loading teams"
for row in $(curl -s -u "$SAUCE_USERNAME:$SAUCE_ACCESS_KEY" --location \
                --request GET "${ENDPOINT}/team-management/v1/teams" \
                --header 'Content-Type: application/json' | jq -r '.results[] | @base64'); do
    TEAM=$(echo ${row} | base64 --decode | jq -r '.id')
    echo "Found team id $TEAM"

    echo "Switching user to team ${TEAM}"
    NEW_TEAM_NAME=$(curl -s -u "$SAUCE_USERNAME:$SAUCE_ACCESS_KEY" --location \
        --request POST "${ENDPOINT}/team-management/v1/membership/" \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "user": "'${USER_ID}'",
            "team": "'${TEAM}'"
        }' | jq .user.teams[0].name)

    echo "User now part of team ${NEW_TEAM_NAME}, uploading file..."
    FILE_ID=$(curl -u "$SAUCE_USERNAME:$SAUCE_ACCESS_KEY" --location \
        --request POST "${ENDPOINT}/v1/storage/upload" \
            --form 'payload=@"'$1'"' \
        --form 'name="'$(basename $1)'"' | jq .item.id)

    echo
    echo "#####"
    echo "Uploaded $1 (with File-ID ${FILE_ID}) for team ${NEW_TEAM_NAME} (Team-ID: ${TEAM})"
    echo "#####"
    echo
done