const TimerTimes = require("../models/timertimes")
const TimerTime = require("../models/timertime")
const Time = require("../models/time")

module.exports.fromVControlGetCommandTimesToTimerTimes = (timeBlock) => {
  let timerTimes = new TimerTimes()
  timeBlock
    .split('\n')
    .filter((line) => line)
    .forEach((line) => {
      let times = line.match(/An:(\d+:\d+|--)\s*Aus:(\d+:\d+|--)/)
        .map((time) => time === '--' ? null : time)
      timerTimes.add(new TimerTime(new Time(times[1]), new Time(times[2])))
    })
  return timerTimes
}

module.exports.fromTimerTimesToVControlSetCommandTimes = (timerTimes) => {
  let times = []
  timerTimes.times.forEach((timerTime) => {
    times.push(timerTime.on.time)
    times.push(timerTime.off.time)
  })
  return times
}
