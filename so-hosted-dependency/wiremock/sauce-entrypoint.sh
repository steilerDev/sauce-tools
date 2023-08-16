#!/bin/bash
SC_BIN='/sc'
DOMAIN='wiremock.orchestrate'
KILL_PORT=9999

LOG_DIR='/opt/logs'
WIREMOCK_LOG=${LOG_DIR}/wiremock.log
SC_LOG=${LOG_DIR}/sc.log
mkdir -p $LOG_DIR

STATUS_DIR=$(mktemp -d)
SC_PID_FILE=${STATUS_DIR}/sc.pid
WIREMOCK_PID_FILE=${STATUS_DIR}/wiremock.pid
SC_READY_FILE=${STATUS_DIR}/sc.ready

shutdown() {
    echo "Shutdown called, stopping executions"
    trap - SIGTERM # Remove existing handlers

    # Gathering PIDs of subprocesses
    PID_LIST=''
    if [ -f $SC_PID_FILE ]; then
        PID_LIST="$PID_LIST $(cat $SC_PID_FILE)"
    fi

    if [ -f $WIREMOCK_PID_FILE ]; then
        PID_LIST="$PID_LIST $(cat $WIREMOCK_PID_FILE)"
    fi

    kill -s SIGTERM -- -$$ # Call sigterm on all processes that were launched by this
    echo "Waiting for PIDs to exit: $PID_LIST"
    wait $PID_LIST
    exit 0
}
trap shutdown SIGTERM

echo "Starting Sauce Connect"
$SC_BIN --pidfile $SC_PID_FILE --readyfile $SC_READY_FILE --logfile $SC_LOG &

echo "Waiting for Sauce Connect to get ready..."
inotifywait -e create,moved_to --exclude 'pid$' ${STATUS_DIR} > /dev/null 2>&1

echo "SC up and running, adding localhost domain $DOMAIN"
echo "127.0.0.1 $DOMAIN" >> /etc/hosts

echo "Starting Wiremock..."
/docker-entrypoint.sh --global-response-templating --disable-gzip --verbose > $WIREMOCK_LOG 2>&1 &
echo $! > $WIREMOCK_PID_FILE
echo "Wiremock is starting!"

echo

echo "Waiting for any request to port $KILL_PORT before ending session"

RESPONSE_CMD="echo 'HTTP/1.1 200 OK';"
RESPONSE_CMD+="echo 'Content-Type: text/plain';"
RESPONSE_CMD+="echo;"
RESPONSE_CMD+="echo 'Stopping SC and WireMock. Please close all Sauce Labs sessions using this backend.'"

KILL_CMD="kill -15 1"

ncat -l -p $KILL_PORT -c "$RESPONSE_CMD;$KILL_CMD" & wait