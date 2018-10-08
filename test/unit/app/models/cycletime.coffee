should = require("should")
CycleTime = require("../../../../app/models/cycletime")
Time = require("../../../../app/models/time")
ValidationError = require("../../../../app/models/validationerror")

describe "A CycleTime model", =>

  describe "with invalid times", =>
    it "should return validation errors", =>
      cycleTime = new CycleTime(new Time("abc"), new Time("123"))

      cycleTime.validate().should.false()

      cycleTime.on.errors.items[0].should.eql(new ValidationError("Time format invalid"))
      cycleTime.off.errors.items[0].should.eql(new ValidationError("Time format invalid"))
