#!/bin/bash

USERNAME=$SAUCE_USERNAME
ACCESS_KEY=$SAUCE_ACCESS_KEY
REGION='us-west-1'

[[ $REGION = 'eu-central-1' ]] && URL_REGION="eu-central-1." || URL_REGION=""

BUILD_NAME="$1"
if [ -z "$BUILD_NAME" ]
then
  echo "BUILD_NAME is empty"
  exit 1
fi

echo "Getting running builds with build name $BUILD_NAME"

RES=$(curl -u "$USERNAME:$ACCESS_KEY" --location -G \
    --data-urlencode "name=${BUILD_NAME}" \
    --data-urlencode "status=running" \
    --request GET "https://api.${REGION}.saucelabs.com/v2/builds/vdc/" 2> /dev/null)

NUM_OF_BUILDS=$(echo $RES | jq '.builds | length')
if [ $NUM_OF_BUILDS -eq 0 ]; then
    echo "  - No running builds found"
    exit 0
fi

echo "  - Found $NUM_OF_BUILDS running builds"

for build_row in $(echo "${RES}" | jq -r '.builds[] | @base64'); do
    _jq() {
        echo ${build_row} | base64 --decode | jq -r ${1}
    }

    BUILD_ID="$(_jq '.id')"
    echo "    - Killing running jobs for $BUILD_ID"

    killJobsByStatus() {
        JOBS_RES=$(curl -u "$USERNAME:$ACCESS_KEY" --location -G \
            --data-urlencode "$1=true" \
            --request GET "https://api.${REGION}.saucelabs.com/v2/builds/vdc/${2}/jobs/" 2> /dev/null)

        NUM_OF_JOBS=$(echo $JOBS_RES | jq '.jobs | length')

        if [ $NUM_OF_JOBS -eq 0 ]; then
            echo "      - No $1 jobs for build $2 found - nothing to do"
            return
        fi

        echo "      - Found $NUM_OF_JOBS $1 jobs for build $2"
        for jobs_row in $(echo "${JOBS_RES}" | jq -r '.jobs[] | @base64'); do
            _jq() {
                echo ${jobs_row} | base64 --decode | jq -r ${1}
            }

            JOB_ID="$(_jq '.id')"
            echo -n "        - Killing job $JOB_ID ..."
            KILL_RES=$(curl -u "$USERNAME:$ACCESS_KEY" --location -G \
                --request PUT "https://api.${REGION}.saucelabs.com/rest/v1/${USERNAME}/jobs/${JOB_ID}/stop" 2> /dev/null)
            
            echo " Done! (https://app.${URL_REGION}saucelabs.com/tests/$(echo $KILL_RES | jq -r '.id'))"
        done
    }

    killJobsByStatus "running" $BUILD_ID
    killJobsByStatus "queued" $BUILD_ID
    killJobsByStatus "new" $BUILD_ID
done

