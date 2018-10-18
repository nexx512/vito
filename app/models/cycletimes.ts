const ValidationErrors = require("./validationerrors")

module.exports = class CycleTimes {
  constructor() {
    this.times = []
    this.errors = new ValidationErrors()
  }

  add(time) {
    this.times.push(time)
  }

  validate() {
    return this.times.reduce((isValid, time) => time.validate() && isValid, true)
  }
}
