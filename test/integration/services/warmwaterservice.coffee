should = require("should")
global.Config = require("../../../config/config.json")

MockVControlD = require("../../support/mockvcontrold")

VControlRepo = require("../../../app/repo/vcontrol/vcontrolrepo")
VControlClient = require("../../../app/repo/vcontrol/vcontrolclient")
WarmWaterService = require("../../../app/services/warmwaterservice")
WeekCycleTimes = require("../../../app/models/weekcycletimes")
CycleTimes = require("../../../app/models/cycletimes")
CycleTime = require("../../../app/models/cycletime")
Time = require("../../../app/models/time")
ValidationError = require("../../../app/models/validationerror")

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

      cycleTimes = new CycleTimes()
      cycleTimes.add(new CycleTime(new Time("00:00"), new Time("24:00")))
      cycleTimes.add(new CycleTime(new Time("00:00"), new Time("24:00")))
      cycleTimes.add(new CycleTime(new Time("00:00"), new Time("24:00")))
      cycleTimes.add(new CycleTime(new Time(null), new Time(null)))
      heatingTimes.days.monday.should.eql(cycleTimes)

  describe "setting the heating times", =>

    beforeEach =>
      @mockVControlD.resetCommandLog()

    describe "with invalid times", =>
      it "should return errors", =>
        times = new CycleTimes()
        times.add(new CycleTime(new Time("00:a0"), new Time("01:00")))
        weekTimes = new WeekCycleTimes(times)

        await @warmWaterService.setHeatingTimes(weekTimes).should.rejectedWith(new ValidationError("Heating times invalid"))

        @mockVControlD.commandLog.length.should.equal(0)

    describe "with valid times", =>
      it "should return no errors", =>
        times = new CycleTimes()
        times.add(new CycleTime(new Time("00:00"), new Time("01:00")))
        weekTimes = new WeekCycleTimes(times)

        await @warmWaterService.setHeatingTimes(weekTimes)

        @mockVControlD.commandLog.should.eql(["setTimerWWMo 00:00 01:00", "quit"])

  describe "getting the circulation times", =>
    it "should deliver heating times for all days", =>
      circulationTimes = await @warmWaterService.getCirculationTimes()

      cycleTimes = new CycleTimes()
      cycleTimes.add(new CycleTime(new Time("00:01"), new Time("23:01")))
      cycleTimes.add(new CycleTime(new Time("00:00"), new Time("24:00")))
      cycleTimes.add(new CycleTime(new Time("00:00"), new Time("24:00")))
      cycleTimes.add(new CycleTime(new Time(null), new Time(null)))
      circulationTimes.days.monday.should.eql(cycleTimes)

  describe "setting the circulation times", =>

    beforeEach =>
      @mockVControlD.resetCommandLog()

    describe "with invalid times", =>
      it "should return errors", =>
        times = new CycleTimes()
        times.add(new CycleTime(new Time("00:a0"), new Time("01:00")))
        weekTimes = new WeekCycleTimes(times)

        await @warmWaterService.setCirculationTimes(weekTimes).should.rejectedWith(new ValidationError("Circulation times invalid"))

        @mockVControlD.commandLog.length.should.equal(0)

    describe "with valid times", =>
      it "should return no errors", =>
        times = new CycleTimes()
        times.add(new CycleTime(new Time("00:00"), new Time("01:00")))
        weekTimes = new WeekCycleTimes(times)

        await @warmWaterService.setCirculationTimes(weekTimes)

        @mockVControlD.commandLog.should.eql(["setTimerZirkuMo 00:00 01:00", "quit"])
