const Errors = require('./errors')

module.exports = class WeekTimerTimes {
  constructor(monday, tuesday, wednesday, thursday, friday, saturday, sunday) {
    this.monday = monday
    this.tuesday = tuesday
    this.wednesday = wednesday
    this.thursday = thursday
    this.friday = friday
    this.saturday = saturday
    this.sunday = sunday
  }

  validate() {
    let errors = new Errors()
    validateDay(errors, "Monday", this.monday)
    validateDay(errors, "Tuesday", this.tuesday)
    validateDay(errors, "Wednesday", this.wednesday)
    validateDay(errors, "Thursday", this.thursday)
    validateDay(errors, "Friday", this.friday)
    validateDay(errors, "Saturday", this.saturday)
    validateDay(errors, "Sunday", this.sunday)
    return errors
  }
}

function validateDay(errors, name, day) {
    if (day) {
      errors.wrap(name, day.validate())
    }
}
