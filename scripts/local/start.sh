#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null && pwd)"
cd $DIR/../..

PID_FILE=/var/run/vito.pid
LOG_FILE=/var/log/vito.log

set -e

echo "$(date): Starting vito..." | tee -a $LOG_FILE
export NODE_ENV=production

NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use

node --icu-data-dir=node_modules/full-icu dist/app.js >> $LOG_FILE &
# npm start >> $LOG_FILE &
echo $! > $PID_FILE

echo "OK"
