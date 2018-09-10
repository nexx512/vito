should = require("should")
sinon = require("sinon")
const VControlRepo = require("../../repo/vcontrol/vcontrolrepo")
const WarmWaterService = require("../../services/warmwaterservice")
const WeekTimerTimes = require('../../models/weektimertimes')
const TimerTimes = require('../../models/timertimes')
const TimerTime = require('../../models/timertime')
const Time = require('../../models/time')

describe("The WarmWaterService", () => {

  let vControlRepo
  let warmWaterService

  before(() => {
    vControlRepo = new VControlRepo()
    warmWaterService = new WarmWaterService(vControlRepo)
  })

  describe("getting the heating times", () => {
    it("should deliver hearing times for all days", async () => {
      times = new WeekTimerTimes()
      sinon.stub(vControlRepo, "getWarmWaterHeatingTimes").returns(times)
      let heatingTimes = await warmWaterService.getHeatingTimes()
      heatingTimes.should.equal(times)
    })
  })

  describe("getting the circulation times", () => {
    it("should deliver hearing times for all days", async () => {
      times = new WeekTimerTimes()
      sinon.stub(vControlRepo, "getWarmWaterCirculationTimes").returns(times)
      let heatingTimes = await warmWaterService.getCirculationTimes()
      heatingTimes.should.equal(times)
    })
  })

  describe("setting the circulations times", () => {
    let vControlRepoMock
    beforeEach(() => {
      vControlRepoMock = sinon.mock(vControlRepo)
    })

    describe("with invalid times", () => {
      it("should return errors", async () => {
        let times = new TimerTimes()
        times.add(new TimerTime(new Time("00:a0"), new Time("01:00")))
        let weekTimes = new WeekTimerTimes(times)
        vControlRepoMock.expects("setWarmWaterCirculationTimes").never()

        let errors
        try {
          await warmWaterService.setCirculationTimes(weekTimes)
        } catch (e) {
          error = e
        }

        error.should.eql(new Error("circulation times invalid"))
        vControlRepoMock.verify()
      })
    })

    describe("with valid times", () => {
      it("should return no errors", async () => {
        let times = new TimerTimes()
        times.add(new TimerTime(new Time("00:00"), new Time("01:00")))
        let weekTimes = new WeekTimerTimes(times)
        vControlRepoMock.expects("setWarmWaterCirculationTimes").once()//.withArgs(weekTimes)

        await warmWaterService.setCirculationTimes(weekTimes)
        vControlRepoMock.verify()
      })
    })
  })

})
