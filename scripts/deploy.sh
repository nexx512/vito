#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR/..

USER=pi
TARGET=vitodens
LOG=log/deploy.log

set -e

mkdir -p log
echo > $LOG

echo -n "Stopping service on target... "
echo "##### Stopping service on target... " >> $LOG
ssh $USER@$TARGET "sudo /srv/vito/scripts/local/stop.sh" >> $LOG
echo "OK"

echo -n "Fetching files on target... "
echo "##### Copy files to target... " >> $LOG
ssh $USER@$TARGET "cd /srv/vito; git fetch origin; git reset --hard origin/master; git clean -df" >> $LOG
echo "OK"

echo -n "Building production assets... "
echo "##### Building production assets... " >> $LOG
ssh $USER@$TARGET "cd /srv/vito; ./node_modules/.bin/gulp production" >> $LOG
echo "OK"

echo -n "Installing native modules... "
echo "##### Installing native modules... " >> $LOG
#ssh $USER@$TARGET "cd /srv/vito; NODE_ENV=production npm install" >> $LOG
ssh $USER@$TARGET "cd /srv/vito; npm rebuild" >> $LOG
echo "OK"

echo -n "Starting service on target... "
echo "##### Starting service on target... " >> $LOG
ssh $USER@$TARGET "sudo /srv/vito/scripts/local/start.sh app.js" >> $LOG
echo "OK"
