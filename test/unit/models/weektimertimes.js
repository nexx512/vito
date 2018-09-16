should = require("should")
const WeekTimerTimes = require("../../../models/weektimertimes")
const TimerTimes = require("../../../models/timertimes")
const TimerTime = require("../../../models/timertime")
const Time = require("../../../models/time")
const ValidationError = require("../../../models/validationerror")

describe("A WeekTimerTimes model", () => {

  describe("with invalid times", () => {
    it("should return error messages", () => {
      let timerTimes = new TimerTimes()
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("01:0a")))
      let weekTimerTimes = new WeekTimerTimes(timerTimes)

      weekTimerTimes.validate().should.false()

      weekTimerTimes.days.monday.times[0].off.errors.items[0].should.eql(new ValidationError("Time format invalid"))
    })
  })

  describe("set with a valid day", () => {
    it("should set the day", () => {
      let weekTimerTimes = new WeekTimerTimes()
      let timerTimes = new TimerTimes()
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("01:00")))

      weekTimerTimes.set("sunday", timerTimes)

      weekTimerTimes.days.sunday.should.eql(timerTimes)
    })
  })

  describe("set with an invalid day", () => {
    it("should throw an error", () => {
      let weekTimerTimes = new WeekTimerTimes()

      should.throws(() => weekTimerTimes.set("fraturday", new TimerTimes()))
    })
  })

})
