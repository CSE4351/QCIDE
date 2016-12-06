#!/usr/bin/env bash

local_ip=$(python docker/get_ip.py)

echo "Using IP address ${local_ip} for debugging..."
cat docker-dev.yml | sed -e "s/<do_not_touch>/$local_ip/g" >> docker-dev-temp.yml

rmi=$(docker ps -a -q)
if [ -n "$rmi" ]; then
    echo "Removing old containers..."
    docker rm ${rmi} -f
fi

echo "Re/building images and re/creating containers..."
docker-compose -f docker-dev-temp.yml up -d --build --force-recreate --remove-orphans;
rm docker-dev-temp.yml