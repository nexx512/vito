should = require("should")
Time = require("../../../../../dist/app/domain/models/time").default
ValidationError = require("../../../../../dist/app/domain/models/validationerror").default

describe "A Time model", =>

  describe "without times", =>
    it "should return validation errors", =>
      time = new Time()

      time.validate().should.false()
      errors = time.errors.items

      errors.length.should.equal(1)
      errors[0].should.eql(new ValidationError("Time missing"))

  describe "with valid time", =>
    it "should not return validation errors", =>
      time = new Time("00:00")

      time.validate().should.true()
      errors = time.errors.items

      errors.length.should.equal(0)

  describe "with invalid time format", =>
    it "should return validation errors", =>
      time = new Time("abc")

      time.validate().should.false()
      errors = time.errors.items

      errors.length.should.equal(1)
      errors[0].should.eql(new ValidationError("Time format invalid"))

  describe "with out of range times", =>
    it "should return validation errors", =>
      time = new Time("01:60")

      time.validate().should.false()
      errors = time.errors.items

      errors.length.should.equal(1)
      errors[0].should.eql(new ValidationError("Time out of range"))

    it "should return validation errors", =>
      time = new Time("24:01")

      time.validate().should.false()
      errors = time.errors.items

      errors.length.should.equal(1)
      errors[0].should.eql(new ValidationError("Time out of range"))
