should = require("should")
WeekCycleTimes = require("../../../../app/models/weekcycletimes")
CycleTimes = require("../../../../app/models/cycletimes")
CycleTime = require("../../../../app/models/cycletime")
Time = require("../../../../app/models/time")
ValidationError = require("../../../../app/models/validationerror")

describe "A WeekCycleTimes model", =>

  describe "with invalid times", =>
    it "should return error messages", =>
      cycleTimes = new CycleTimes()
      cycleTimes.add(new CycleTime(new Time("00:00"), new Time("01:0a")))
      weekCycleTimes = new WeekCycleTimes(cycleTimes)

      weekCycleTimes.validate().should.false()

      weekCycleTimes.days.monday.times[0].off.errors.items[0].should.eql(new ValidationError("Time format invalid"))

  describe "set with a valid day", =>
    it "should set the day", =>
      weekCycleTimes = new WeekCycleTimes()
      cycleTimes = new CycleTimes()
      cycleTimes.add(new CycleTime(new Time("00:00"), new Time("01:00")))

      weekCycleTimes.set("sunday", cycleTimes)

      weekCycleTimes.days.sunday.should.eql(cycleTimes)

  describe "set with an invalid day", =>
    it "should throw an error", =>
      weekCycleTimes = new WeekCycleTimes()

      should.throws => weekCycleTimes.set("fraturday", new CycleTimes())
