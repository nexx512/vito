#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR/../..

LOG=/tmp/vito.log

set -e

echo -n "Starting node..."

echo "$(DATE): Starting node..." >> $LOG
NODE_ENV=production node dist/app.js >> $LOG &

echo "OK"
