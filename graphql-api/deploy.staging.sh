#!/bin/bash

docker build --no-cache -t 527173208340.dkr.ecr.eu-central-1.amazonaws.com/seatti-app-staging:latest .

$(aws ecr get-login-password --region eu-central-1 --no-include-email) && docker push 527173208340.dkr.ecr.eu-central-1.amazonaws.com/seatti-app-staging:latest

sed -i -e "s/SECRET_PLACEHOLDER/$1/g" docker-compose-staging.yml

cp docker-compose-staging.yml docker-compose.yml

sed -i -e "s/$1/SECRET_PLACEHOLDER/g" docker-compose-staging.yml

if test -f "docker-compose-staging.yml-e"; then
  rm docker-compose-staging.yml-e
fi

git add docker-compose.yml

eb deploy seatti-api-staging --timeout 3 --staged

git reset docker-compose.yml

rm docker-compose.yml