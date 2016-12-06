#!/bin/bash

base_build_str=toozick/qcide

version=v1

build_types=(php-apache ember)


for item in "${build_types[@]}"
do
   :
   docker build -t ${base_build_str}-${item}-base:${version} -f docker/${item}/Dockerfile-base .
    docker tag ${base_build_str}-${item}-base:${version} ${base_build_str}-${item}-base:${version}
    docker push ${base_build_str}-${item}-base:${version}
done

build_types=(mysql)

for item in "${build_types[@]}"
do
   :
    docker build -t ${base_build_str}-${item}-prod:${version} -f docker/${item}/Dockerfile-prod .
    docker tag ${base_build_str}-${item}-prod:${version} ${base_build_str}-${item}-prod:${version}
    docker push ${base_build_str}-${item}-prod:${version}
done
