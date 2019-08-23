should = require("should")
Temperature = require("../../../../../dist/app/domain/models/temperature").default
ValidationError = require("../../../../../dist/app/domain/models/validationerror").default

describe "A Temperature model", =>

  describe "without number times", =>
    it "should return validation errors", =>
      temperature = new Temperature("abc")

      temperature.validate().should.false()
      errors = temperature.errors.items
      errors.length.should.equal(1)
      errors[0].should.eql(new ValidationError("Temperature is not a number"))

  describe "with valid temperature", =>
    it "should not return validation errors", =>
      temperature = new Temperature("-4.7000 Grad Celsius")

      temperature.temperature.should.eql -4.7
      temperature.validate().should.true()
      errors = temperature.errors.items
      errors.length.should.equal(0)
