should = require("should")
HeatingMode = require("../../../../dist/app/models/heatingmode").default
HeatingModes = require("../../../../dist/app/models/heatingmode").HeatingModes
ValidationError = require("../../../../dist/app/models/validationerror").default

describe "A HeatingMode model", =>

  describe "without a valid mode", =>
    it "should return validation errors", =>
      heatingMode = new HeatingMode("")

      heatingMode.validate().should.false()
      errors = heatingMode.errors.items
      errors.length.should.equal(1)
      errors[0].should.eql(new ValidationError("Heating mode is unknown"))

  describe "with heating turned on", =>
    it "should not return validation errors", =>
      heatingMode = new HeatingMode("H")

      heatingMode.mode.should.eql HeatingModes.HEATING
      heatingMode.validate().should.true()
      errors = heatingMode.errors.items
      errors.length.should.equal(0)

  describe "with warm water turned on", =>
    it "should not return validation errors", =>
      heatingMode = new HeatingMode("WW")

      heatingMode.mode.should.eql HeatingModes.WARMWATER
      heatingMode.validate().should.true()
      errors = heatingMode.errors.items
      errors.length.should.equal(0)

  describe "with heating and warm water turned on", =>
    it "should not return validation errors", =>
      heatingMode = new HeatingMode("H+WW")

      (!!(heatingMode.mode & HeatingModes.HEATING)).should.true()
      (!!(heatingMode.mode & HeatingModes.WARMWATER)).should.true()
      heatingMode.validate().should.true()
      errors = heatingMode.errors.items
      errors.length.should.equal(0)
