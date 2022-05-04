#!/bin/bash

docker build --no-cache -t 527173208340.dkr.ecr.eu-central-1.amazonaws.com/seatti-app-preview:latest .
$(aws ecr get-login --registry-ids 527173208340 --region eu-central-1 --no-include-email) && docker push 527173208340.dkr.ecr.eu-central-1.amazonaws.com/seatti-app-preview:latest

cp docker-compose-preview.yml docker-compose.yml
git add docker-compose.yml

eb deploy Seattiapipreview-env --timeout 3 --staged

git reset docker-compose.yml
rm docker-compose.yml