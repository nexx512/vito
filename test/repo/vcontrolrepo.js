should = require('should')
VControlRepo = require('../../repo/vcontrolrepo')

describe('A VControlRepo object', () => {

  class VControlClientMock {
    connect() {}
    close() {}

    getData(command) {
      return "An:00:00  Aus:24:00\n"
    }
  }

  describe('requesting warmwater heating times', () => {
    it('should return times for all weekdays', async () => {
      let vControlRepo = new VControlRepo(new VControlClientMock())
      let times = await vControlRepo.getWarmWaterHeatingTimes()
      Object.keys(times).should.eql(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    })
  })

  describe('requesting warmwater circulation times', () => {
    it('should return times for all weekdays', async () => {
      let vControlRepo = new VControlRepo(new VControlClientMock())
      let times = await vControlRepo.getWarmWaterCirculationTimes()
      Object.keys(times).should.eql(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    })
  })

})
