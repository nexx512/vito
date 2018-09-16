module.exports = class ViewModel {

  constructor(model, errors) {
    this.model = model
    if (errors) {
      if (errors instanceof Array) {
        this.errors = errors.map((e) => e.message)
      } else {
        this.errors = [errors.message]
      }
    }
  }
  
}
