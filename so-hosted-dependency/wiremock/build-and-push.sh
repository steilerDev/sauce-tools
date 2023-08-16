#!/bin/bash

DOCKER_USERNAME='steilerdev'
DOCKER_IMAGE_NAME='wiremock-so'

docker build -t $DOCKER_USERNAME/$DOCKER_IMAGE_NAME:latest .
docker push $DOCKER_USERNAME/$DOCKER_IMAGE_NAME:latest