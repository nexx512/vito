should = require('should')
VControlRepo = require('../../repo/vcontrolrepo')

describe('A VControlRepo object', () => {

  describe('requesting warmwater times', () => {
    it('should return times for all weekdays', async () => {
      class VControlClientMock {
        connect() {}
        close() {}

        getData(command) {
          return "An:00:00  Aus:24:00\n"
        }
      }

      let vControlRepo = new VControlRepo(new VControlClientMock())
      warmWaterTimes = await vControlRepo.getWarmWaterTimes()
      Object.keys(warmWaterTimes).should.eql(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    })
  })

})
