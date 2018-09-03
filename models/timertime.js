const ValidationErrors = require("./validationerrors")

module.exports = class TimerTime {
  constructor(timeOn, timeOff) {
    this.on = timeOn,
    this.off = timeOff
    this.errors = new ValidationErrors()
  }

  validate() {
    let isValid = true
    isValid = this.on.validate() && isValid
    isValid = this.off.validate() && isValid
    return isValid
  }

}

function validateTime(errors, name, time) {
  let innerErrors = time.validate()
}
