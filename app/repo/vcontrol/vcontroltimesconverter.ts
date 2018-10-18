const CycleTimes = require("../../models/cycletimes")
const CycleTime = require("../../models/cycletime")
const Time = require("../../models/time")

module.exports.fromVControlGetCommandTimesToCycleTimes = (timeBlock) => {
  let cycleTimes = new CycleTimes()
  timeBlock
    .split('\n')
    .filter((line) => line)
    .forEach((line) => {
      let times = line.match(/An:(\d+:\d+|--)\s*Aus:(\d+:\d+|--)/)
        .map((time) => time === '--' ? new Time(null) : new Time(time))
      cycleTimes.add(new CycleTime(times[1], times[2]))
    })
  return cycleTimes
}

module.exports.fromCycleTimesToVControlSetCommandTimes = (cycleTimes) => {
  let times = []
  cycleTimes.times.forEach((cycleTime) => {
    times.push(cycleTime.on.time)
    times.push(cycleTime.off.time)
  })
  return times
}
