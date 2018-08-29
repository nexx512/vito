const TimerTime = require('../models/timertime')
const TimerTimes = require('../models/timertimes')

module.exports.fromVControlGetCommandTimesToTimerTimes = (timeBlock) => {
  let timerTimes = new TimerTimes()
  timeBlock
    .split('\n')
    .filter((line) => line)
    .forEach((line) => {
      let times = line.match(/An:(\d+:\d+|--)\s*Aus:(\d+:\d+|--)/)
        .map((time) => time === '--' ? null : time)
      timerTimes.add(new TimerTime(times[1], times[2]))
    })
  return timerTimes
}

module.exports.fromTimerTimesToVControlSetCommandTimes = (timerTimes) => {
  let times = []
  timerTimes.times.forEach((time) => {
    times.push(time.on)
    times.push(time.off)
  })
  return times
}
