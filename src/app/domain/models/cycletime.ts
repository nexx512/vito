import Validatable from "./validatable"
import ValidationErrors from "./validationerrors"
import Time from "./time"

export default class CycleTime implements Validatable {

  on: Time
  off: Time
  errors: ValidationErrors

  constructor(timeOn: Time, timeOff: Time) {
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
