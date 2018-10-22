import ValidationError from "./validationerror"

export default class ValidationErrors {

  items: ValidationError[]

  constructor(errors?: ValidationError[]) {
    if (errors) {
      this.items = errors
    } else {
      this.items = []
    }
  }

  hasErrors() {
    return this.items.length > 0
  }

  add(error: ValidationError) {
    this.items.push(error)
    return this
  }

}
