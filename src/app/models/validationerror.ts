import ValidationErrors from "./validationerrors"

export default class ValidationError {

  constructor(public message: string, public inner?: ValidationErrors) {
  }

}
