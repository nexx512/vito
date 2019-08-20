#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null && pwd)"
cd $DIR/../..

PID_FILE=/var/run/vito.pid
LOG_FILE=/var/log/vito.log

set -e

echo "$(DATE): Starting vito..." | tee -a $LOG_FILE
NODE_ENV=production
nvm use
npm start >> $LOG_FILE &
echo $! > $PID_FILE

echo "OK"
