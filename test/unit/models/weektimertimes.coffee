should = require("should")
WeekTimerTimes = require("../../../models/weektimertimes")
TimerTimes = require("../../../models/timertimes")
TimerTime = require("../../../models/timertime")
Time = require("../../../models/time")
ValidationError = require("../../../models/validationerror")

describe "A WeekTimerTimes model", =>

  describe "with invalid times", =>
    it "should return error messages", =>
      timerTimes = new TimerTimes()
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("01:0a")))
      weekTimerTimes = new WeekTimerTimes(timerTimes)

      weekTimerTimes.validate().should.false()

      weekTimerTimes.days.monday.times[0].off.errors.items[0].should.eql(new ValidationError("Time format invalid"))

  describe "set with a valid day", =>
    it "should set the day", =>
      weekTimerTimes = new WeekTimerTimes()
      timerTimes = new TimerTimes()
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("01:00")))

      weekTimerTimes.set("sunday", timerTimes)

      weekTimerTimes.days.sunday.should.eql(timerTimes)

  describe "set with an invalid day", =>
    it "should throw an error", =>
      weekTimerTimes = new WeekTimerTimes()

      should.throws => weekTimerTimes.set("fraturday", new TimerTimes())
