import CycleTimes from "../../../domain/models/cycletimes"
import CycleTime from "../../../domain/models/cycletime"
import Time from "../../../domain/models/time"

export default class VControlTimesConverter {

  static fromVControlGetCommandTimesToCycleTimes(timeBlock: string) {
    let cycleTimes = new CycleTimes()
    timeBlock
      .split('\n')
      .filter((line) => line)
      .forEach((line) => {
        let timeMatches = line.match(/An:(\d+:\d+|--)\s*Aus:(\d+:\d+|--)/)
        if (timeMatches) {
          let times = timeMatches.map((time) => time === '--' ? new Time(null) : new Time(time))
          cycleTimes.add(new CycleTime(times[1], times[2]))
        }
      })
    return cycleTimes
  }

  static fromCycleTimesToVControlSetCommandTimes(cycleTimes: CycleTimes) {
    let times: string[] = []
    cycleTimes.times.forEach((cycleTime) => {
      if (cycleTime.on.time && cycleTime.off.time) {
        times.push(cycleTime.on.time)
        times.push(cycleTime.off.time)
      }
    })
    return times
  }

}
