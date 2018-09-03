module.exports = class ValidationErrors {

  constructor(errors) {
    if (errors) {
      this.items = errors
    } else {
      this.items = []
    }
  }

  hasErrors() {
    return this.items.length > 0
  }

  add(error) {
    this.items.push(error)
    return this
  }

}
