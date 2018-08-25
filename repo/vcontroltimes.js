module.exports = class VControlTimes {
  constructor(timeBlock) {
    this.times = timeBlock
      .split('\n')
      .filter((line) => line)
      .map((line) => {
        let times = line.match(/An:(\d+:\d+|--)\s*Aus:(\d+:\d+|--)/)
          .map((time) => time === '--' ? null : time)
        return {on: times[1], off: times[2]}
      })
  }

}
