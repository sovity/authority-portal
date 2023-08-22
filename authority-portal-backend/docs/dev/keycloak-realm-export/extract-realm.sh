#!/bin/bash

# -e: errexit, i.e., terminate on error if no || to "catch" it
# -u: error on unset variables
# -x: print commands before executing (optional)
# -o pipefail: fail pipelines if any command fails, not just the final one
set -euo pipefail

TOTAL_STEPS=7

echo "(1/${TOTAL_STEPS}) Get ID of container with label \"quarkus-dev-service-keycloak\""
container=$(docker ps --quiet --filter "label=quarkus-dev-service-keycloak")

echo "(2/${TOTAL_STEPS}) Stop container with id $container"
docker stop "$container"

echo "(3/${TOTAL_STEPS}) Create image from stopped container"
image=$(docker commit "$container")
echo "Image: $image"

echo "(4/${TOTAL_STEPS}) Restart container with id $container"
docker start "$container"

echo "(5/${TOTAL_STEPS}) Run container from newly created image and export realm config"
docker run --rm -v "$PWD/authority-portal-quarkus/src/main/resources:/tmp/src" "$image" export --optimized --file='/tmp/src/realm.json' --realm authority-portal

echo "(6/${TOTAL_STEPS}) Delete image $image"
docker image rm "$image"

echo "(7/${TOTAL_STEPS}) Format realm.json"
REALM_JSON="$PWD/authority-portal-quarkus/src/main/resources/realm.json"
REALM_JSON_FORMATTED="$REALM_JSON.formatted"
docker run --rm -i alpine:3.18.3 sh -c 'apk add --no-cache jq >/dev/null 2>&1 </dev/null && jq' <"$REALM_JSON" >"$REALM_JSON_FORMATTED"
mv "$REALM_JSON_FORMATTED" "$REALM_JSON"

echo "Done."
