should = require('should')
const WeekTimerTimes = require('../../models/weektimertimes')
const TimerTimes = require('../../models/timertimes')
const TimerTime = require('../../models/timertime')

describe('A WeekTimerTimes model', () => {

  describe('with invalid times', () => {
    it('should return error messages', () => {
      let timerTimes = new TimerTimes()
      timerTimes.add(new TimerTime("00:00", "01:0a"))
      let weekTimerTimes = new WeekTimerTimes(timerTimes)

      errors = weekTimerTimes.validate().errors

      errors.length.should.equal(1)
      errors[0].should.eql(new Error("Monday: Time 1: End time invalid"))
    })
  })

})
