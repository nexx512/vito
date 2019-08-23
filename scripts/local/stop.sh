#!/bin/bash

PID_FILE=/var/run/vito.pid
LOG_FILE=/var/log/vito.log

if [ ! -f "$PID_FILE" ]; then
  echo "Can't find pid file $PID_FILE for vito process. Is the server running?"
  exit 0
fi

pid=$(cat "$PID_FILE")
echo -n "Stopping vito on process id $pid... " | tee -a $LOG_FILE

true
while [ $? -eq 0 ]; do
  kill $pid
  sleep 1
  [ -e /proc/$pid ]
done

echo "OK" | tee -a $LOG_FILE
