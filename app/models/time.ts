import Validatable from "./validatable"
import ValidationErrors from "./validationerrors"
import ValidationError from "./validationerror"

export default class Time implements Validatable {

  errors: ValidationErrors

  constructor(public time: string|null) {
    this.errors = new ValidationErrors()
  }

  validate() {
    this.errors = new ValidationErrors()
    if (!this.time) {
      this.errors.add(new ValidationError("Time missing"))
    } else {
      let timeMatches = this.time.match(/^(\d\d):(\d\d)$/)
      if (!timeMatches) {
        this.errors.add(new ValidationError("Time format invalid"))
      } else {
          if ((parseInt(timeMatches[2]) >= 60) || (parseInt(timeMatches[1]) * 60 + parseInt(timeMatches[2]) > 1440)) {
            this.errors.add(new ValidationError("Time out of range"))
          }
      }
    }
    return !this.errors.hasErrors()
  }

}
