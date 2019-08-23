#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR/..

TARGET=${1:-pi@vitodens}
TARGET_DIR=${2:-/srv/vito}
LOG=log/deploy.log

set -e

mkdir -p log
echo > $LOG

echo -n "Building production code... "
echo "##### Building production code... " >> $LOG
npm run build >> $LOG 2>&1
echo "OK"

echo -n "Stopping service on target... "
echo "##### Stopping service on target... " >> $LOG
ssh $TARGET "if [ -s $TARGET_DIR/scripts/local/stop.sh ]; then sudo $TARGET_DIR/scripts/local/stop.sh; fi" >> $LOG 2>&1
echo "OK"

echo -n "Copying files to target... "
echo "##### Copying files to target... " >> $LOG
rsync -av --del dist scripts config package*.json .nvmrc --exclude config/config.json $TARGET:$TARGET_DIR >> $LOG 2>&1
echo "OK"

echo -n "Installing modules... "
echo "##### Installing modules... " >> $LOG
ssh $TARGET "export NVM_DIR=\"\$HOME/.nvm\"; [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"; cd $TARGET_DIR; nvm use; npm ci --only=prod" >> $LOG 2>&1
echo "OK"

echo -n "Starting service on target... "
echo "##### Starting service on target... " >> $LOG
ssh $TARGET "sudo $TARGET_DIR/scripts/local/start.sh app.js" >> $LOG 2>&1
echo "OK"
