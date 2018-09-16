should = require("should")
const MockVControlD = require("../../support/mockvcontrold")
const VControlRepo = require("../../../repo/vcontrol/vcontrolrepo")
const VControlClient = require("../../../repo/vcontrol/vcontrolclient")
const WarmWaterService = require("../../../services/warmwaterservice")
const WeekTimerTimes = require("../../../models/weektimertimes")
const TimerTimes = require("../../../models/timertimes")
const TimerTime = require("../../../models/timertime")
const Time = require("../../../models/time")
const ValidationError = require("../../../models/validationerror")

describe("The WarmWaterService", () => {

  let mockVControlD
  let warmWaterService

  before(async () => {
    warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient()))
    mockVControlD = new MockVControlD()
    await mockVControlD.start()
  })

  after(async () => {
    await mockVControlD.stop()
  })

  describe("getting the heating times", () => {
    it("should deliver heating times for all days", async () => {
      let heatingTimes = await warmWaterService.getHeatingTimes()

      let timerTimes = new TimerTimes()
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("24:00")))
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("24:00")))
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("24:00")))
      timerTimes.add(new TimerTime(new Time(null), new Time(null)))
      heatingTimes.days.monday.should.eql(timerTimes)
    })
  })

  describe("getting the circulation times", () => {
    it("should deliver heating times for all days", async () => {
      let circulationTimes = await warmWaterService.getCirculationTimes()

      let timerTimes = new TimerTimes()
      timerTimes.add(new TimerTime(new Time("00:01"), new Time("23:01")))
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("24:00")))
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("24:00")))
      timerTimes.add(new TimerTime(new Time(null), new Time(null)))
      circulationTimes.days.monday.should.eql(timerTimes)
    })
  })

  describe("setting the circulation times", () => {

    beforeEach(() => {
      mockVControlD.resetCommandLog()
    })

    describe("with invalid times", () => {
      it("should return errors", async () => {
        let times = new TimerTimes()
        times.add(new TimerTime(new Time("00:a0"), new Time("01:00")))
        let weekTimes = new WeekTimerTimes(times)

        await warmWaterService.setCirculationTimes(weekTimes).should.rejectedWith(new ValidationError("Circulation times invalid"))

        mockVControlD.commandLog.length.should.equal(0)
      })
    })

    describe("with valid times", () => {
      it("should return no errors", async () => {
        let times = new TimerTimes()
        times.add(new TimerTime(new Time("00:00"), new Time("01:00")))
        let weekTimes = new WeekTimerTimes(times)

        await warmWaterService.setCirculationTimes(weekTimes)

        mockVControlD.commandLog.should.eql(["setTimerZirkuMo 00:00 01:00", "quit"])
      })
    })
  })

})
