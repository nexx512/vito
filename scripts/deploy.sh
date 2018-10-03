#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR/..

USER=pi
TARGET=vitodens
LOG=log/deploy.log

set -e

mkdir -p log
echo > $LOG

echo -n "Building production assets... "
echo "##### Building production assets... " >> $LOG
./node_modules/.bin/gulp production >> $LOG 2>&1
echo "OK"

echo -n "Stopping service on target... "
echo "##### Stopping service on target... " >> $LOG
ssh $USER@$TARGET "sudo /srv/vito/scripts/local/stop.sh" >> $LOG 2>&1
echo "OK"

echo -n "Copying files to target... "
echo "##### Copying files to target... " >> $LOG
rsync -av --del models node_modules repo scripts services webapp app.js $USER@$TARGET:/srv/vito >> $LOG 2>&1
echo "OK"

echo -n "Rebuilding native modules... "
echo "##### Rebuilding native modules... " >> $LOG
ssh $USER@$TARGET "cd /srv/vito; npm rebuild" >> $LOG 2>&1
echo "OK"

echo -n "Starting service on target... "
echo "##### Starting service on target... " >> $LOG
ssh $USER@$TARGET "sudo /srv/vito/scripts/local/start.sh app.js" >> $LOG 2>&1
echo "OK"
