#!/bin/bash

[[ $(curl -s localhost:8080/red) = "here's your RED: STOP" ]] || { echo "nope\n" }
[[ $(curl -s localhost:8080/white) = "here's your white: go with purity" ]] || { echo "nope\n" }
[[ $(curl -s localhost:8080/blue) = "here's your blue: BLUEEEEE" ]] || { echo "nope\n" }
