#!/bin/bash

echo -n "Stopping node... "

while [ $? -eq 0 ]; do
  kill $(pgrep node)
  sleep 1
  $(pgrep node)
done

echo "OK"
