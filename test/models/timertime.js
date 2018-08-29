should = require('should')
const TimerTime = require('../../models/timertime')

describe('A TimerTime model', () => {

  describe('without times', () => {
    it('should return validation errors', () => {
      let times = new TimerTime()
      errors = times.validate().errors

      errors.length.should.equal(2)
      errors[0].should.eql(new Error("Start time missing"))
      errors[1].should.eql(new Error("End time missing"))
    })
  })

  describe('with valid times', () => {
    it('should not return validation errors', () => {
      let times = new TimerTime("00:00", "24:00")
      errors = times.validate().errors

      errors.length.should.equal(0)
    })
  })

  describe('with invalid times', () => {
    it('should return validation errors', () => {
      let times = new TimerTime("abc", "123")
      errors = times.validate().errors

      errors.length.should.equal(2)
      errors[0].should.eql(new Error("Start time invalid"))
      errors[1].should.eql(new Error("End time invalid"))
    })
  })

  describe('with out of range times', () => {
    it('should return validation errors', () => {
      let times = new TimerTime("01:60", "24:01")
      errors = times.validate().errors

      errors.length.should.equal(2)
      errors[0].should.eql(new Error("Start time out of range"))
      errors[1].should.eql(new Error("End time out of range"))
    })
  })

})
