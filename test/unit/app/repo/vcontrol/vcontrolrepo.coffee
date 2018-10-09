should = require("should")
sinon = require("sinon")
VControlClient = require("../../../../../app/repo/vcontrol/vcontrolclient")
VControlRepo = require("../../../../../app/repo/vcontrol/vcontrolrepo")
WeekCycleTimes = require("../../../../../app/models/weekcycletimes")
CycleTimes = require("../../../../../app/models/cycletimes")
CycleTime = require("../../../../../app/models/cycletime")
Time = require("../../../../../app/models/time")

describe "A VControlRepo object", =>

  beforeEach =>
    @vControlClient = new VControlClient()
    @vControlClientMock = sinon.mock(@vControlClient)
    @vControlClientMock.expects("connect").once()
    @vControlClientMock.expects("close").once()
    @vControlRepo = new VControlRepo(@vControlClient)

  describe "requesting warmwater heating times", =>
    it "should return times for all weekdays", =>
      sinon.stub(@vControlClient, "getData").returns("An:00:00  Aus:24:00\n")

      times = await @vControlRepo.getWarmWaterHeatingTimes()

      Object.keys(times.days).should.eql(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])
      @vControlClientMock.verify()

  describe "setting warmwater heating times", =>
    it "should set the heatind times", =>
      cycleTimesMonday = new CycleTimes()
      cycleTimesMonday.add(new CycleTime(new Time("12:23"), new Time("13:24")))
      cycleTimesMonday.add(new CycleTime(new Time("23:12"), new Time("24:00")))
      cycleTimesWednesday = new CycleTimes()
      cycleTimesWednesday.add(new CycleTime(new Time("02:23"), new Time("03:24")))
      cycleTimesWednesday.add(new CycleTime(new Time("03:12"), new Time("04:00")))
      weekCycleTimes = new WeekCycleTimes(cycleTimesMonday, null, cycleTimesWednesday)
      @vControlClientMock.expects("setData").once().withArgs("setTimerWWMo", ["12:23", "13:24", "23:12", "24:00"])
      @vControlClientMock.expects("setData").once().withArgs("setTimerWWMi", ["02:23", "03:24", "03:12", "04:00"])

      times = await @vControlRepo.setWarmWaterHeatingTimes(weekCycleTimes)

      @vControlClientMock.verify()

  describe "requesting warmwater heating times with getData error", =>
    it "should open and close the connection properly and throw an error", =>
      sinon.stub(@vControlClient, "getData").throws()

      await @vControlRepo.getWarmWaterHeatingTimes().should.rejected()

      @vControlClientMock.verify()

  describe "requesting warmwater circulation times", =>
    it "should return times for all weekdays", =>
      sinon.stub(@vControlClient, "getData").returns("An:00:00  Aus:24:00\n")

      times = await @vControlRepo.getWarmWaterCirculationTimes()

      Object.keys(times.days).should.eql(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])
      @vControlClientMock.verify()

  describe "setting warmwater circulation times", =>
    it "should set the heatind times", =>
      cycleTimesMonday = new CycleTimes()
      cycleTimesMonday.add(new CycleTime(new Time("12:23"), new Time("13:24")))
      cycleTimesMonday.add(new CycleTime(new Time("23:12"), new Time("24:00")))
      cycleTimesWednesday = new CycleTimes()
      cycleTimesWednesday.add(new CycleTime(new Time("02:23"), new Time("03:24")))
      cycleTimesWednesday.add(new CycleTime(new Time("03:12"), new Time("04:00")))
      weekCycleTimes = new WeekCycleTimes(cycleTimesMonday, null, cycleTimesWednesday)
      @vControlClientMock.expects("setData").once().withArgs("setTimerZirkuMo", ["12:23", "13:24", "23:12", "24:00"])
      @vControlClientMock.expects("setData").once().withArgs("setTimerZirkuMi", ["02:23", "03:24", "03:12", "04:00"])

      times = await @vControlRepo.setWarmWaterCirculationTimes(weekCycleTimes)

      @vControlClientMock.verify()

  describe "setting warmwater circulation times with errors", =>
    it "should open and close the connection properly and throw an error", =>
      sinon.stub(@vControlClient, "setData").throws()

      await @vControlRepo.setWarmWaterCirculationTimes(new WeekCycleTimes(new CycleTimes())).should.rejected()

      @vControlClientMock.verify()