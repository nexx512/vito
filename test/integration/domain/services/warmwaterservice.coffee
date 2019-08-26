should = require("should")
global.Config = require("../../config.json")

MockVControlD = require("../../../support/mockvcontrold")
CommandBuilder = require("../../../support/commandbuilder")

VControlClient = require("vcontrol")
WarmWaterRepo = require("../../../../dist/app/adapters/passive/vcontrol/warmwaterrepo").default
WarmWaterService = require("../../../../dist/app/domain/services/warmwaterservice").default

WeekCycleTimes = require("../../../../dist/app/domain/models/weekcycletimes").default
CycleTimes = require("../../../../dist/app/domain/models/cycletimes").default
CycleTime = require("../../../../dist/app/domain/models/cycletime").default
Time = require("../../../../dist/app/domain/models/time").default

ValidationError = require("../../../../dist/app/domain/models/validationerror").default

describe "The WarmWaterService", =>

  mockVControldData = new CommandBuilder()
    .withCommand("getTimerWWMo", "An:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerWWDi", "An:01:00  Aus:23:00\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerWWMi", "An:02:00  Aus:23:10\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerWWDo", "An:03:00  Aus:23:20\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerWWFr", "An:04:00  Aus:23:30\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerWWSa", "An:05:00  Aus:23:40\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerWWSo", "An:06:00  Aus:23:50\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerZirkuMo", "An:00:01  Aus:23:01\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerZirkuDi", "An:00:02  Aus:23:02\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerZirkuMi", "An:00:03  Aus:23:03\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerZirkuDo", "An:00:04  Aus:23:04\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerZirkuFr", "An:00:05  Aus:23:05\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerZirkuSa", "An:00:06  Aus:23:06\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerZirkuSo", "An:00:06  Aus:23:07\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .build()

  before =>
    @warmWaterService = new WarmWaterService(new WarmWaterRepo(new VControlClient(Config.vcontrold)))
    @mockVControlD = new MockVControlD(mockVControldData)
    await @mockVControlD.start(Config.vcontrold)

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

        @mockVControlD.commandLog.should.eql(["setTimerWWMo 00:00 01:00"])

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

        @mockVControlD.commandLog.should.eql(["setTimerZirkuMo 00:00 01:00"])
