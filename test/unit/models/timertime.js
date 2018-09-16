should = require("should")
const TimerTime = require("../../../models/timertime")
const Time = require("../../../models/time")
const ValidationError = require("../../../models/validationerror")

describe("A TimerTime model", () => {

  describe("with invalid times", () => {
    it("should return validation errors", () => {
      let timerTime = new TimerTime(new Time("abc"), new Time("123"))

      timerTime.validate().should.false()

      timerTime.on.errors.items[0].should.eql(new ValidationError("Time format invalid"))
      timerTime.off.errors.items[0].should.eql(new ValidationError("Time format invalid"))
    })
  })

})
