#!/bin/bash

docker build --no-cache -t 527173208340.dkr.ecr.eu-central-1.amazonaws.com/seatti-app-production:latest .
$(aws ecr get-login --registry-ids 527173208340 --region eu-central-1 --no-include-email) && docker push 527173208340.dkr.ecr.eu-central-1.amazonaws.com/seatti-app-production:latest

sed -i -e "s/SECRET_PLACEHOLDER/$1/g" docker-compose-production.yml

sed -i -e "s/TRACKING_DB_SECRET_PLACEHOLDER/$2/g" docker-compose-production.yml

cp docker-compose-production.yml docker-compose.yml

sed -i -e "s/$1/SECRET_PLACEHOLDER/g" docker-compose-production.yml

sed -i -e "s/$2/TRACKING_DB_SECRET_PLACEHOLDER/g" docker-compose-production.yml

if test -f "docker-compose-production.yml-e"; then
  rm docker-compose-production.yml-e
fi

git add docker-compose.yml

eb deploy Nest-production-api-env --timeout 3 --staged

git reset docker-compose.yml
rm docker-compose.yml
