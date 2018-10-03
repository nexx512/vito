should = require("should")
TimerTime = require("../../../../app/models/timertime")
Time = require("../../../../app/models/time")
ValidationError = require("../../../../app/models/validationerror")

describe "A TimerTime model", =>

  describe "with invalid times", =>
    it "should return validation errors", =>
      timerTime = new TimerTime(new Time("abc"), new Time("123"))

      timerTime.validate().should.false()

      timerTime.on.errors.items[0].should.eql(new ValidationError("Time format invalid"))
      timerTime.off.errors.items[0].should.eql(new ValidationError("Time format invalid"))
