should = require('should')
VControlTimesConverter = require('../../repo/vcontroltimesconverter')
TimerTimes = require('../../models/timertimes')

describe('Convert VControl get comman times to TimerTimes', () => {
  describe('with times at the boundaries', () => {
    it('should return valid times', () => {
      let timerTimes = VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes("1:An:00:00  Aus:24:00\n")
      timerTimes.times[0].on.should.eql("00:00")
      timerTimes.times[0].off.should.eql("24:00")
    })
  })

  describe('with normal times', () => {
    it('should return valid times', () => {
      let timerTimes = VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes("2:An:01:02  Aus:14:15")
      timerTimes.times[0].on.should.eql("01:02")
      timerTimes.times[0].off.should.eql("14:15")
    })
  })

  describe('without times', () => {
    it('should return null values', () => {
      let timerTimes = VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes("3:An:--     Aus:--\n")
      should(timerTimes.times[0].on).equal(null)
      should(timerTimes.times[0].off).equal(null)
    })
  })

  describe('with a time block string', () => {
    it('should return valid times', () => {
      let timerTimes = VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes("1:An:00:00  Aus:24:00\n2:An:01:02  Aus:14:15\n3:An:--     Aus:--\n\n")
      timerTimes.times.length.should.equal(3)
    })
  })
})

describe('Convert TimerTimes to VControl set command times', () => {
  it('should return a string with times', () => {
    let timerTimes = new TimerTimes()
    timerTimes.add(new TimerTime("00:00", "12:23"))
    timerTimes.add(new TimerTime("23:12", "23:45"))
    let vControlTimes = VControlTimesConverter.fromTimerTimesToVControlSetCommandTimes(timerTimes)
    vControlTimes.should.eql(["00:00", "12:23", "23:12", "23:45"])
  })
})
