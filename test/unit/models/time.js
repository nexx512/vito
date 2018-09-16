should = require("should")
const Time = require("../../../models/time")
const ValidationError = require("../../../models/validationerror")

describe("A Time model", () => {

  describe("without times", () => {
    it("should return validation errors", () => {
      let time = new Time()

      time.validate().should.false()
      let errors = time.errors.items

      errors.length.should.equal(1)
      errors[0].should.eql(new ValidationError("Time missing"))
    })
  })

  describe("with valid time", () => {
    it("should not return validation errors", () => {
      let time = new Time("00:00")

      time.validate().should.true()
      let errors = time.errors.items

      errors.length.should.equal(0)
    })
  })

  describe("with invalid time format", () => {
    it("should return validation errors", () => {
      let time = new Time("abc")

      time.validate().should.false()
      let errors = time.errors.items

      errors.length.should.equal(1)
      errors[0].should.eql(new ValidationError("Time format invalid"))
    })
  })

  describe("with out of range times", () => {
    it("should return validation errors", () => {
      let time = new Time("01:60")

      time.validate().should.false()
      let errors = time.errors.items

      errors.length.should.equal(1)
      errors[0].should.eql(new ValidationError("Time out of range"))
    })

    it("should return validation errors", () => {
      let time = new Time("24:01")

      time.validate().should.false()
      let errors = time.errors.items

      errors.length.should.equal(1)
      errors[0].should.eql(new ValidationError("Time out of range"))
    })
  })

})
