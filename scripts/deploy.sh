#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR/..

TARGET=${1:-pi@vitodens}
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
ssh $TARGET "sudo /srv/vito/scripts/local/stop.sh" >> $LOG 2>&1
echo "OK"

echo -n "Copying files to target... "
echo "##### Copying files to target... " >> $LOG
rsync -av --del dist node_modules --exclude dist/config $TARGET:/srv/vito >> $LOG 2>&1
echo "OK"

echo -n "Rebuilding native modules... "
echo "##### Rebuilding native modules... " >> $LOG
ssh $TARGET "cd /srv/vito; npm rebuild" >> $LOG 2>&1
echo "OK"

echo -n "Starting service on target... "
echo "##### Starting service on target... " >> $LOG
ssh $TARGET "sudo /srv/vito/scripts/local/start.sh app.js" >> $LOG 2>&1
echo "OK"
