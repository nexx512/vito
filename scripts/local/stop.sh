#!/bin/bash

set -e

echo -n "Stopping node... "

while [ $? -eq 0 ]; do
  kill $(pgrep node)
  sleep 1
  set +e
  $(pgrep node)
  set -e
done

echo "OK"
