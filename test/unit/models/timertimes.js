should = require("should")
const TimerTimes = require("../../../models/timertimes")
const TimerTime = require("../../../models/timertime")
const Time = require("../../../models/time")
const ValidationError = require("../../../models/validationerror")

describe("A TimerTimes model", () => {

  describe("with invalid times", () => {
    it("should return error messages", () => {
      let timerTimes = new TimerTimes()
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("01:0a")))
      timerTimes.add(new TimerTime(new Time("00:0a"), new Time("01:00")))
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("01:00")))

      timerTimes.validate().should.false()

      timerTimes.times.length.should.equal(3)
      timerTimes.times[2].should.eql(new TimerTime(new Time("00:00"), new Time("01:00")))

      timerTimes.times[0].off.errors.items[0].should.eql(new ValidationError("Time format invalid"))
      timerTimes.times[0].off.errors.items[0].should.eql(new ValidationError("Time format invalid"))
    })
  })

})
