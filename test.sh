#!/bin/bash

[[ $(curl -H 'resourcesecrets: BLOOOOOD' -s localhost:8080/red) = "here's your RED: STOP" ]] || {
  echo "nope red";
}
[[ $(curl -s -H 'resourcesecrets: PURIFication' localhost:8080/white) = "here's your white: go with purity" ]] || {
  echo "nope white";
}
[[ $(curl -s -H 'resourcesecrets: calmwaters' localhost:8080/blue) = "here's your blue: BLUEEEEE" ]] || {
  echo "nope blue";
}

[[ $(curl -s -H 'resourcesecrets: calmwaters' localhost:8080/authorizations) = '["/blue"]' ]] || {
  echo "nope authnz1";
}

[[ $(curl -s -H 'resourcesecrets: calmwaters,PURIFication' localhost:8080/authorizations) = '["/blue","/white"]' ]] || {
  echo "nope authnz2";
}

[[ $(curl -s -H 'resourcesecrets: calmwaters' localhost:8080/q) = "Bad Request" ]] || {
  echo "nope q";
}

[[ $(curl -s -H 'resourcesecrets: calmwaters' localhost:8080/white) = "Access Denied" ]] || {
  echo "nope deny1";
}
