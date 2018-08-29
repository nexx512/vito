should = require('should')
const TimerTimes = require('../../models/timertimes')
const TimerTime = require('../../models/timertime')

describe('A TimerTimes model', () => {

  describe('with invalid times', () => {
    it('should return error messages', () => {
      let timerTimes = new TimerTimes()
      timerTimes.add(new TimerTime("00:00", "01:0a"))
      timerTimes.add(new TimerTime("00:0a", "01:00"))
      timerTimes.add(new TimerTime("00:00", "01:00"))
      errors = timerTimes.validate().errors

      timerTimes.times.length.should.equal(3)
      timerTimes.times[2].should.eql(new TimerTime("00:00", "01:00"))

      errors.length.should.equal(2)
      errors[0].should.eql(new Error("Time 1: End time invalid"))
      errors[1].should.eql(new Error("Time 2: Start time invalid"))
    })
  })

})
