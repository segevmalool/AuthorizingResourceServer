#!/bin/bash

npm run start &
PID=$!

echo "started server at process: ${PID}"

sleep 5

authz_header="Authorization: Basic $(echo -n user:pass | base64)"

[[ $(curl -H "${authz_header}" -s localhost:8080/red) = "here's your RED: STOP" ]] || {
  echo "nope red";
}
[[ $(curl -s -H "${authz_header}" localhost:8080/white) = "here's your white: go with purity" ]] || {
  echo "nope white";
}
[[ $(curl -s -H "${authz_header}" localhost:8080/blue) = "here's your blue: BLUEEEEE" ]] || {
  echo "nope blue";
}

[[ $(curl -s -H "${authz_header}" localhost:8080/authorizations) = '["/red","/blue","/white"]' ]] || {
  echo "nope authnz1";
}

[[ $(curl -s -H "${authz_header}" localhost:8080/authorizations) = '["/red","/blue","/white"]' ]] || {
  echo "nope authnz2";
}

[[ $(curl -s -H "${authz_header}" localhost:8080/q) = "Bad Request" ]] || {
  echo "nope q";
}

# [TODO] find a way to control the accesses for testing since they are defined internally now.
#[[ $(curl -s -H "${authz_header}" localhost:8080/white) = "Access Denied" ]] || {
#  echo "nope deny1";
#}

kill -9 ${PID}
