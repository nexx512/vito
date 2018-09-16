should = require('should')
const ViewModel = require('../../../webapp/models/viewmodel')

describe('A ViewModel object', () => {

  describe("with error as array", () => {
    it("should transform the errors", () => {
      let viewModel = new ViewModel("model", [new Error("error1"), new Error("error2")])

      viewModel.model.should.eql("model")
      viewModel.errors.should.eql(["error1", "error2"])
    })
  })

  describe("with a single error", () => {
    it("should transform the error to an error array", () => {
      let viewModel = new ViewModel("model", new Error("error"))

      viewModel.model.should.eql("model")
      viewModel.errors.should.eql(["error"])
    })
  })

})
