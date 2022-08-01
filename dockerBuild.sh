#!/bin/bash
shopt -s expand_aliases
./bundle.sh
if ! command -v docker &> /dev/null
then 
    alias docker=podman
fi

sudo docker build -t elevator-management -f docker/Dockerfile .
sudo docker build -t elevator-management-rootless -f dockerRootless/Dockerfile .