should = require('should')
const VControlTimesConverter = require('../../repo/vcontroltimesconverter')
const TimerTimes = require('../../models/timertimes')
const TimerTime = require('../../models/timertime')
const Time = require('../../models/time')

describe('Convert VControl get command times to TimerTimes', () => {
  describe('with times at the boundaries', () => {
    it('should return valid times', () => {
      let timerTimes = VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes("1:An:00:00  Aus:24:00\n")

      let expectedTimerTimes = new TimerTimes()
      expectedTimerTimes.add(new TimerTime(new Time("00:00"), new Time("24:00")))
      timerTimes.should.eql(expectedTimerTimes)
    })
  })

  describe('without times', () => {
    it('should return null values', () => {
      let timerTimes = VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes("3:An:--     Aus:--\n")

      let expectedTimerTimes = new TimerTimes()
      expectedTimerTimes.add(new TimerTime(new Time(null), new Time(null)))
      timerTimes.should.eql(expectedTimerTimes)
    })
  })

  describe('with a time block string', () => {
    it('should return valid times', () => {
      let timerTimes = VControlTimesConverter.fromVControlGetCommandTimesToTimerTimes("1:An:00:00  Aus:24:00\n2:An:01:02  Aus:14:15\n3:An:--     Aus:--\n\n")

      let expectedTimerTimes = new TimerTimes()
      expectedTimerTimes.add(new TimerTime(new Time("00:00"), new Time("24:00")))
      expectedTimerTimes.add(new TimerTime(new Time("01:02"), new Time("14:15")))
      expectedTimerTimes.add(new TimerTime(new Time(null), new Time(null)))
      timerTimes.should.eql(expectedTimerTimes)
    })
  })
})

describe('Convert TimerTimes to VControl set command times', () => {
  it('should return a string with times', () => {
    let timerTimes = new TimerTimes()
    timerTimes.add(new TimerTime(new Time("00:00"), new Time("12:23")))
    timerTimes.add(new TimerTime(new Time("23:12"), new Time("23:45")))

    let vControlTimes = VControlTimesConverter.fromTimerTimesToVControlSetCommandTimes(timerTimes)

    vControlTimes.should.eql(["00:00", "12:23", "23:12", "23:45"])
  })
})
