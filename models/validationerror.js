module.exports = class ValidationError {

  constructor(message, innerErrors) {
    this.message = message
    this.inner = innerErrors
  }

}
