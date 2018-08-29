module.exports = class Errors {

  constructor() {
    this.errors = []
  }

  hasErrors() {
    return this.errors.length > 0
  }

  wrap(innerName, innerErrors) {
    innerErrors.errors.forEach((error) => {
      error.message = innerName + ": " + error.message
      this.errors.push(error)
    })
  }

  add(error) {
    this.errors.push(error)
    return this
  }

}
