should = require("should")
global.Config = require("../../../config/config.json")

MockVControlD = require("../../support/mockvcontrold")
VControlRepo = require("../../../repo/vcontrol/vcontrolrepo")
VControlClient = require("../../../repo/vcontrol/vcontrolclient")
WarmWaterService = require("../../../services/warmwaterservice")
WeekTimerTimes = require("../../../models/weektimertimes")
TimerTimes = require("../../../models/timertimes")
TimerTime = require("../../../models/timertime")
Time = require("../../../models/time")
ValidationError = require("../../../models/validationerror")

describe "The WarmWaterService", =>

  before =>
    @warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient()))
    @mockVControlD = new MockVControlD()
    await @mockVControlD.start()

  after =>
    await @mockVControlD.stop()

  describe "getting the heating times", =>
    it "should deliver heating times for all days", =>
      heatingTimes = await @warmWaterService.getHeatingTimes()

      timerTimes = new TimerTimes()
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("24:00")))
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("24:00")))
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("24:00")))
      timerTimes.add(new TimerTime(new Time(null), new Time(null)))
      heatingTimes.days.monday.should.eql(timerTimes)

  describe "getting the circulation times", =>
    it "should deliver heating times for all days", =>
      circulationTimes = await @warmWaterService.getCirculationTimes()

      timerTimes = new TimerTimes()
      timerTimes.add(new TimerTime(new Time("00:01"), new Time("23:01")))
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("24:00")))
      timerTimes.add(new TimerTime(new Time("00:00"), new Time("24:00")))
      timerTimes.add(new TimerTime(new Time(null), new Time(null)))
      circulationTimes.days.monday.should.eql(timerTimes)

  describe "setting the circulation times", =>

    beforeEach =>
      @mockVControlD.resetCommandLog()

    describe "with invalid times", =>
      it "should return errors", =>
        times = new TimerTimes()
        times.add(new TimerTime(new Time("00:a0"), new Time("01:00")))
        weekTimes = new WeekTimerTimes(times)

        await @warmWaterService.setCirculationTimes(weekTimes).should.rejectedWith(new ValidationError("Circulation times invalid"))

        @mockVControlD.commandLog.length.should.equal(0)

    describe "with valid times", =>
      it "should return no errors", =>
        times = new TimerTimes()
        times.add(new TimerTime(new Time("00:00"), new Time("01:00")))
        weekTimes = new WeekTimerTimes(times)

        await @warmWaterService.setCirculationTimes(weekTimes)

        @mockVControlD.commandLog.should.eql(["setTimerZirkuMo 00:00 01:00", "quit"])
