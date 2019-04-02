should = require("should")
global.Config = require("../../../config/config.json")

MockVControlD = require("../../support/mockvcontrold")

VControlClient = require("vcontrol")
VControlRepo = require("../../../dist/app/repo/vcontrol/vcontrolrepo").default
WarmWaterService = require("../../../dist/app/services/warmwaterservice").default
WeekCycleTimes = require("../../../dist/app/models/weekcycletimes").default
CycleTimes = require("../../../dist/app/models/cycletimes").default
CycleTime = require("../../../dist/app/models/cycletime").default
Time = require("../../../dist/app/models/time").default
ValidationError = require("../../../dist/app/models/validationerror").default

describe "The WarmWaterService", =>

  mockVControldData = {
    "getTimerWWMo": "An:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerWWDi": "An:01:00  Aus:23:00\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerWWMi": "An:02:00  Aus:23:10\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerWWDo": "An:03:00  Aus:23:20\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerWWFr": "An:04:00  Aus:23:30\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerWWSa": "An:05:00  Aus:23:40\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerWWSo": "An:06:00  Aus:23:50\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerZirkuMo": "An:00:01  Aus:23:01\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerZirkuDi": "An:00:02  Aus:23:02\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerZirkuMi": "An:00:03  Aus:23:03\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerZirkuDo": "An:00:04  Aus:23:04\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerZirkuFr": "An:00:05  Aus:23:05\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerZirkuSa": "An:00:06  Aus:23:06\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerZirkuSo": "An:00:06  Aus:23:07\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "setTimerZirkuMo": "^\\d+:\\d+$",
    "setTimerZirkuDi": "^\\d+:\\d+$",
    "setTimerZirkuMi": "^\\d+:\\d+$",
    "setTimerZirkuDo": "^\\d+:\\d+$",
    "setTimerZirkuFr": "^\\d+:\\d+$",
    "setTimerZirkuSa": "^\\d+:\\d+$",
    "setTimerZirkuSo": "^\\d+:\\d+$",
  }

  before =>
    @warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient({
      host: "localhost"
      port: 3002
    })))
    @mockVControlD = new MockVControlD(mockVControldData)
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
