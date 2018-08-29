const Errors = require("./errors")

module.exports = class TimerTime {
  constructor(timeOn, timeOff) {
    this.on = timeOn,
    this.off = timeOff
  }

  validate() {
    let errors = new Errors()
    validateTime(errors, "Start", this.on)
    validateTime(errors, "End", this.off)
    return errors
  }
}

function validateTime(errors, name, time) {
  if (!time) {
    errors.add(new Error(name + " time missing"))
  } else {
    let timeMatches = time.match(/^(\d\d):(\d\d)$/)
    if (!timeMatches) {
      errors.add(new Error(name + " time invalid"))
    } else {
        if ((parseInt(timeMatches[2]) >= 60) || (parseInt(timeMatches[1]) * 60 + parseInt(timeMatches[2]) > 1440)) {
          errors.add(new Error(name + " time out of range"))
        }
    }
  }
}
