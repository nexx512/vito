should = require("should")
sinon = require("sinon")
VControlClient = require("vcontrol")
WarmWaterRepo = require("../../../../../../dist/app/adapters/passive/vcontrol/warmwaterrepo").default
WeekCycleTimes = require("../../../../../../dist/app/domain/models/weekcycletimes").default
CycleTimes = require("../../../../../../dist/app/domain/models/cycletimes").default
CycleTime = require("../../../../../../dist/app/domain/models/cycletime").default
Time = require("../../../../../../dist/app/domain/models/time").default

describe "A WarmWaterRepo object", =>

  beforeEach =>
    @vControlClient = new VControlClient({})
    @vControlClientMock = sinon.mock(@vControlClient)
    @vControlClientMock.expects("connect").once()
    @vControlClientMock.expects("close").once()
    @warmWaterRepo = new WarmWaterRepo(@vControlClient)

  describe "requesting warmwater heating times", =>
    it "should return times for all weekdays", =>
      getDataStub = sinon.stub(@vControlClient, "getData")
      getDataStub.withArgs("getTimerWWMo").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerWWDi").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerWWMi").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerWWDo").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerWWFr").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerWWSa").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerWWSo").returns("An:00:00  Aus:24:00\n")

      times = await @warmWaterRepo.getHeatingTimes()

      Object.keys(times.days).should.eql(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])
      @vControlClientMock.verify()

  describe "setting warmwater heating times", =>
    describe "without errors", =>
      it "should set the heating times", =>
        cycleTimesMonday = new CycleTimes()
        cycleTimesMonday.add(new CycleTime(new Time("12:23"), new Time("13:24")))
        cycleTimesMonday.add(new CycleTime(new Time("23:12"), new Time("24:00")))
        cycleTimesWednesday = new CycleTimes()
        cycleTimesWednesday.add(new CycleTime(new Time("02:23"), new Time("03:24")))
        cycleTimesWednesday.add(new CycleTime(new Time("03:12"), new Time("04:00")))
        weekCycleTimes = new WeekCycleTimes(cycleTimesMonday, null, cycleTimesWednesday)
        @vControlClientMock.expects("setData").once().withArgs("setTimerWWMo", ["12:23", "13:24", "23:12", "24:00"])
        @vControlClientMock.expects("setData").once().withArgs("setTimerWWMi", ["02:23", "03:24", "03:12", "04:00"])

        times = await @warmWaterRepo.setHeatingTimes(weekCycleTimes)

        @vControlClientMock.verify()

    describe "with getData error", =>
      it "should open and close the connection properly and throw an error", =>
        sinon.stub(@vControlClient, "getData").throws()

        await @warmWaterRepo.getHeatingTimes().should.rejected()

        @vControlClientMock.verify()

  describe "requesting warmwater circulation times", =>
    it "should return times for all weekdays", =>
      getDataStub = sinon.stub(@vControlClient, "getData")
      getDataStub.withArgs("getTimerZirkuMo").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerZirkuDi").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerZirkuMi").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerZirkuDo").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerZirkuFr").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerZirkuSa").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerZirkuSo").returns("An:00:00  Aus:24:00\n")

      times = await @warmWaterRepo.getCirculationTimes()

      Object.keys(times.days).should.eql(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])
      @vControlClientMock.verify()

  describe "setting warmwater circulation times", =>
    describe "without errors", =>
      it "should set the heating times", =>
        cycleTimesMonday = new CycleTimes()
        cycleTimesMonday.add(new CycleTime(new Time("12:23"), new Time("13:24")))
        cycleTimesMonday.add(new CycleTime(new Time("23:12"), new Time("24:00")))
        cycleTimesWednesday = new CycleTimes()
        cycleTimesWednesday.add(new CycleTime(new Time("02:23"), new Time("03:24")))
        cycleTimesWednesday.add(new CycleTime(new Time("03:12"), new Time("04:00")))
        weekCycleTimes = new WeekCycleTimes(cycleTimesMonday, null, cycleTimesWednesday)
        @vControlClientMock.expects("setData").once().withArgs("setTimerZirkuMo", ["12:23", "13:24", "23:12", "24:00"])
        @vControlClientMock.expects("setData").once().withArgs("setTimerZirkuMi", ["02:23", "03:24", "03:12", "04:00"])

        times = await @warmWaterRepo.setCirculationTimes(weekCycleTimes)

        @vControlClientMock.verify()

    describe "with errors", =>
      it "should open and close the connection properly and throw an error", =>
        sinon.stub(@vControlClient, "setData").throws()

        await @warmWaterRepo.setCirculationTimes(new WeekCycleTimes(new CycleTimes())).should.rejected()

        @vControlClientMock.verify()
