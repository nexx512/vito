should = require('should')
const Errors = require('../../models/errors')

describe('A Errors model', () => {

  describe('inheriting errors times', () => {
    it("should prepend the inherited errors", () => {
      let innerErrors = new Errors()
      innerErrors.add(new Error("error1"))
      innerErrors.add(new Error("error2"))

      let outerErrors = new Errors()
      outerErrors.wrap("inner1", innerErrors)

      outerErrors.errors.length.should.equal(2)
      outerErrors.errors[0].should.eql(new Error("inner1: error1"))
      outerErrors.errors[1].should.eql(new Error("inner1: error2"))
    })
  })
})
