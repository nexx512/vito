should = require("should")
HeatingMode = require("../../../../../dist/app/domain/models/heatingmode").default
ValidationError = require("../../../../../dist/app/domain/models/validationerror").default

describe "A HeatingMode model", =>

  describe "with only heating turned on", =>
    it "should only set the radiator flag", =>
      heatingMode = new HeatingMode("H")

      heatingMode.heating.should.true()
      heatingMode.warmwater.should.false()
      heatingMode.validate().should.true()
      errors = heatingMode.errors.items
      errors.length.should.equal(0)

  describe "with only warm water turned on", =>
    it "should only set the warmwater flag", =>
      heatingMode = new HeatingMode("WW")

      heatingMode.heating.should.false()
      heatingMode.warmwater.should.true()
      heatingMode.validate().should.true()
      errors = heatingMode.errors.items
      errors.length.should.equal(0)

  describe "with heating and warm water turned on", =>
    it "should set heating and warmwater flag", =>
      heatingMode = new HeatingMode("H+WW")

      heatingMode.heating.should.true()
      heatingMode.warmwater.should.true()
      heatingMode.validate().should.true()
      errors = heatingMode.errors.items
      errors.length.should.equal(0)
