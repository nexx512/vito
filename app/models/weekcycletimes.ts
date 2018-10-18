const ValidationErrors = require("./validationerrors")

module.exports = class WeekCycleTimes {
  constructor(monday, tuesday, wednesday, thursday, friday, saturday, sunday) {
    this.days = {
      monday: monday,
      tuesday: tuesday,
      wednesday: wednesday,
      thursday: thursday,
      friday: friday,
      saturday: saturday,
      sunday: sunday
    }
    this.errors = new ValidationErrors()
  }

  set(day, times) {
    if (!(day in this.days)) throw new Error(day + " is not a valid day")
    this.days[day] = times
  }

  validate() {
    return Object.keys(this.days).reduce((isValid, day) => this.days[day] ? this.days[day].validate() && isValid : isValid, true)
  }

}
