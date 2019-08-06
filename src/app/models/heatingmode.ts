import Validatable from "./validatable"
import ValidationErrors from "./validationerrors"
import ValidationError from "./validationerror"

export default class HeatingMode implements Validatable {

  mode: HeatingModes|undefined;
  errors: ValidationErrors

  constructor(mode: string) {
    this.mode = 0;
    if (mode.includes("H")) {
      this.mode |= HeatingModes.HEATING
    }
    if (mode.includes("WW")) {
      this.mode |= HeatingModes.WARMWATER
    }

    this.errors = new ValidationErrors()
  }

  validate() {
    this.errors = new ValidationErrors()
    if (!this.mode) {
      this.errors.add(new ValidationError("Heating mode is unknown"))
      return false;
    }
    return true;
  }
}

export enum HeatingModes {
  HEATING = 1,
  WARMWATER = 2
}
