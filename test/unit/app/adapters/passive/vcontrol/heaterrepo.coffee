should = require("should")
sinon = require("sinon")
VControlClient = require("vcontrol")
HeaterRepo = require("../../../../../../dist/app/adapters/passive/vcontrol/heaterrepo").default
WeekCycleTimes = require("../../../../../../dist/app/domain/models/weekcycletimes").default
CycleTimes = require("../../../../../../dist/app/domain/models/cycletimes").default
CycleTime = require("../../../../../../dist/app/domain/models/cycletime").default
Time = require("../../../../../../dist/app/domain/models/time").default

describe "A HeaterRepo object", =>

  beforeEach =>
    @vControlClient = new VControlClient({})
    @vControlClientMock = sinon.mock(@vControlClient)
    @vControlClientMock.expects("connect").once()
    @vControlClientMock.expects("close").once()
    @heaterRepo = new HeaterRepo(@vControlClient)

  describe "requesting heater heating times", =>
    it "should return times for all weekdays", =>
      getDataStub = sinon.stub(@vControlClient, "getData")
      getDataStub.withArgs("getTimerMo").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerDi").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerMi").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerDo").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerFr").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerSa").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerSo").returns("An:00:00  Aus:24:00\n")

      times = await @heaterRepo.getHeatingTimes()

      Object.keys(times.days).should.eql(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])
      @vControlClientMock.verify()

  describe "setting heater heating times", =>
    describe "without errors", =>
      it "should set the heating times", =>
        cycleTimesMonday = new CycleTimes()
        cycleTimesMonday.add(new CycleTime(new Time("12:23"), new Time("13:24")))
        cycleTimesMonday.add(new CycleTime(new Time("23:12"), new Time("24:00")))
        cycleTimesWednesday = new CycleTimes()
        cycleTimesWednesday.add(new CycleTime(new Time("02:23"), new Time("03:24")))
        cycleTimesWednesday.add(new CycleTime(new Time("03:12"), new Time("04:00")))
        weekCycleTimes = new WeekCycleTimes(cycleTimesMonday, null, cycleTimesWednesday)
        @vControlClientMock.expects("setData").once().withArgs("setTimerMo", ["12:23", "13:24", "23:12", "24:00"])
        @vControlClientMock.expects("setData").once().withArgs("setTimerMi", ["02:23", "03:24", "03:12", "04:00"])

        times = await @heaterRepo.setHeatingTimes(weekCycleTimes)

        @vControlClientMock.verify()

    describe "with getData error", =>
      it "should open and close the connection properly and throw an error", =>
        sinon.stub(@vControlClient, "getData").throws()

        await @heaterRepo.getHeatingTimes().should.rejected()

        @vControlClientMock.verify()
