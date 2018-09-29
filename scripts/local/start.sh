#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR/../..

set -e

echo -n "Starting node..."

NODE_ENV=production node app.js > /tmp/vito.log &

echo "OK"
