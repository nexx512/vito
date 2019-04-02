import Validatable from "./validatable"
import ValidationErrors from "./validationerrors"
import ValidationError from "./validationerror"

export default class Temperature implements Validatable {

  temperature: number;
  errors: ValidationErrors

  constructor(temp: string) {
    this.temperature = parseFloat(temp)
    this.errors = new ValidationErrors()
  }

  validate() {
    this.errors = new ValidationErrors()
    if (isNaN(this.temperature)) {
      this.errors.add(new ValidationError("Temperature is not a number"))
      return false;
    }
    return true;
  }
}
