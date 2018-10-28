import Validatable from "./validatable"
import ValidationErrors from "./validationerrors"
import CycleTime from "./cycletime"

export default class CycleTimes implements Validatable {

  times: CycleTime[]
  errors: ValidationErrors

  constructor() {
    this.times = []
    this.errors = new ValidationErrors()
  }

  add(time: CycleTime) {
    this.times.push(time)
  }

  validate() {
    return this.times.reduce((isValid, time) => time.validate() && isValid, true)
  }
}
