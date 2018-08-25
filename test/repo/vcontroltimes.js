should = require('should')
VControlTimes = require('../../repo/vcontroltimes')

describe('A VControlTimes object', () => {
  describe('with times at the boundaries', () => {
    it('should return valid times', () => {
      let vControlTimes = new VControlTimes("1:An:00:00  Aus:24:00\n")
      vControlTimes.times[0].on.should.eql("00:00")
      vControlTimes.times[0].off.should.eql("24:00")
    })
  })

  describe('with normal times', () => {
    it('should return valid times', () => {
      let vControlTimes = new VControlTimes("2:An:01:02  Aus:14:15")
      vControlTimes.times[0].on.should.eql("01:02")
      vControlTimes.times[0].off.should.eql("14:15")
    })
  })

  describe('without times', () => {
    it('should return null values', () => {
      let vControlTimes = new VControlTimes("3:An:--     Aus:--\n")
      should(vControlTimes.times[0].on).equal(null)
      should(vControlTimes.times[0].off).equal(null)
    })
  })

  describe('with a time block string', () => {
    it('should return valid times', () => {
      let vControlTimes = new VControlTimes("1:An:00:00  Aus:24:00\n2:An:01:02  Aus:14:15\n3:An:--     Aus:--\n")
      vControlTimes.times.length.should.equal(3)
    })
  })
})
