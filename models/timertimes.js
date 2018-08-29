const Errors = require('./errors')

module.exports = class TimerTimes {
  constructor() {
    this.times = []
  }

  add(time) {
    this.times.push(time)
  }

  validate() {
    let errors = new Errors()
    this.times.forEach((time, index) => {
      errors.wrap("Time " + (index + 1), time.validate())
    })
    return errors
  }
}
