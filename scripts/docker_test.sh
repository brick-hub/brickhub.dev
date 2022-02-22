#!/bin/bash

set -e

image="$(docker build -q .)"
echo Image created: "$image"

container=$(docker run -d -p 3000:3000 --rm "$image")
echo Container started: "$container"

sleep 1

if [ $(curl -sL -w "%{http_code}\\n" "localhost:3000" -o /dev/null --connect-timeout 3 --max-time 5) == "200" ] ; then EXIT_CODE=0 ; else EXIT_CODE=1 ; fi

echo Container killed "$(docker kill "$container")"
echo Image deleted "$(docker rmi "$image")"

if [ $EXIT_CODE -eq 0 ] ; then echo "OK"; else echo "KO"; fi

exit ${EXIT_CODE}