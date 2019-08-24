import Validatable from "./validatable"
import ValidationErrors from "./validationerrors"

export default class HeatingMode implements Validatable {

  heating: boolean;
  warmWater: boolean;
  errors: ValidationErrors

  constructor(mode: string) {
    this.heating = mode.includes("H")
    this.warmWater = mode.includes("WW")

    this.errors = new ValidationErrors()
  }

  validate() {
    return true;
  }
}
