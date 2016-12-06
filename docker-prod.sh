#!/bin/bash

# Frontend
if [[ $1 = "true" ]] ; then
#    ./docker-dev.sh
    docker exec -i ember ember deploy production --activate=true --verbose=true
fi

# Build
if [[ $2 = "true" ]] ; then
    ./docker/production/build.sh
fi

echo "Check if there is already a stack..."
if [[ $(docker-cloud stack inspect qcide) ]] ; then
    echo "Updating stack..."
    docker-cloud stack update -f docker-prod.yml qcide
    echo "Re-deploying stack..."
    docker-cloud stack redeploy qcide
else
    echo "Creating cloud stack..."
    docker-cloud stack create -f docker-prod.yml -n qcide
    echo "Starting stack..."
    docker-cloud stack start qcide
fi
echo "----------------------------------------------------------------"
echo "----------------------------------------------------------------"
echo "------Production built, just wait for the stack to update.------"
echo "----------------------------------------------------------------"
echo "----------------------------------------------------------------"