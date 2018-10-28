should = require("should")
CycleTimes = require("../../../../dist/app/models/cycletimes").default
CycleTime = require("../../../../dist/app/models/cycletime").default
Time = require("../../../../dist/app/models/time").default
ValidationError = require("../../../../dist/app/models/validationerror").default

describe "A CycleTimes model", =>

  describe "with invalid times", =>
    it "should return error messages", =>
      cycleTimes = new CycleTimes()
      cycleTimes.add(new CycleTime(new Time("00:00"), new Time("01:0a")))
      cycleTimes.add(new CycleTime(new Time("00:0a"), new Time("01:00")))
      cycleTimes.add(new CycleTime(new Time("00:00"), new Time("01:00")))

      cycleTimes.validate().should.false()

      cycleTimes.times.length.should.equal(3)
      cycleTimes.times[2].should.eql(new CycleTime(new Time("00:00"), new Time("01:00")))

      cycleTimes.times[0].off.errors.items[0].should.eql(new ValidationError("Time format invalid"))
      cycleTimes.times[0].off.errors.items[0].should.eql(new ValidationError("Time format invalid"))
