should = require("should")
sinon = require("sinon")
VControlClient = require("vcontrol")
VControlRepo = require("../../../../../dist/app/repo/vcontrol/vcontrolrepo").default
WeekCycleTimes = require("../../../../../dist/app/models/weekcycletimes").default
CycleTimes = require("../../../../../dist/app/models/cycletimes").default
CycleTime = require("../../../../../dist/app/models/cycletime").default
Time = require("../../../../../dist/app/models/time").default
FailurStatus = require("../../../../../dist/app/models/failurestatus").default

describe "A VControlRepo object", =>

  beforeEach =>
    @vControlClient = new VControlClient({})
    @vControlClientMock = sinon.mock(@vControlClient)
    @vControlClientMock.expects("connect").once()
    @vControlClientMock.expects("close").once()
    @vControlRepo = new VControlRepo(@vControlClient)

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
      getDataStub = sinon.stub(@vControlClient, "getData")
      getDataStub.withArgs("getTimerZirkuMo").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerZirkuDi").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerZirkuMi").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerZirkuDo").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerZirkuFr").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerZirkuSa").returns("An:00:00  Aus:24:00\n")
      getDataStub.withArgs("getTimerZirkuSo").returns("An:00:00  Aus:24:00\n")

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

  describe "getting the system time", =>
    it "should deliver the heating time in ISO format", =>
      sinon.stub(@vControlClient, "getData").withArgs("getSystemTime").returns("2019-02-12T23:20:52+0000\n")

      systemTime = await @vControlRepo.getSystemTime()

      systemTime.should.eql new Date("2019-02-12T23:20:52+0000")
      @vControlClientMock.verify()

  describe "getting the outside temperature", =>
    it "should deliver the temperature in the Temperature type", =>
      sinon.stub(@vControlClient, "getData").withArgs("getTempA").returns("6.100000 Grad Celsius\n")

      outsideTemp = await @vControlRepo.getOutsideTemp()

      outsideTemp.temperature.should.eql 6.1
      @vControlClientMock.verify()

  describe "getting the room temperature", =>
    it "should deliver the temperature in the Temperature type", =>
      sinon.stub(@vControlClient, "getData").withArgs("getTempRaumNorSollM1").returns("21.00000 Grad Celsius\n")

      roomTemp = await @vControlRepo.getRoomTemp()

      roomTemp.temperature.should.eql 21
      @vControlClientMock.verify()

  describe "getting the reduced room temperature", =>
    it "should deliver the temperature in the Temperature type", =>
      sinon.stub(@vControlClient, "getData").withArgs("getTempRaumRedSollM1").returns("18.00000 Grad Celsius\n")

      reducedRoomTemp = await @vControlRepo.getReducedRoomTemp()

      reducedRoomTemp.temperature.should.eql 18
      @vControlClientMock.verify()

  describe "getting the burner temperature", =>
    it "should deliver the temperature in the Temperature type", =>
      sinon.stub(@vControlClient, "getData").withArgs("getTempKist").returns("65.2999 Grad Celsius\n")

      burnerTemp = await @vControlRepo.getBurnerTemp()

      burnerTemp.temperature.should.eql 65.2999
      @vControlClientMock.verify()

  describe "getting the water temperature", =>
    it "should deliver the water temperature in the Temperature type", =>
      sinon.stub(@vControlClient, "getData").withArgs("getTempWWist").returns("55.2999 Grad Celsius\n")

      waterTemp = await @vControlRepo.getWaterTemp()

      waterTemp.temperature.should.eql 55.2999
      @vControlClientMock.verify()

  describe "getting the water target temperature", =>
    it "should deliver the water target temperature in the Temperature type", =>
      sinon.stub(@vControlClient, "getData").withArgs("getTempWWsoll").returns("57.00000 Grad Celsius\n")

      waterTargetTemp = await @vControlRepo.getWaterTargetTemp()

      waterTargetTemp.temperature.should.eql 57
      @vControlClientMock.verify()

  describe "getting the failure status", =>
    describe "if eveything is OK", =>
      it "should deliver the 'OK' failure status in FailusrStatus type", =>
        sinon.stub(@vControlClient, "getData").withArgs("getStatusStoerung").returns("OK")

        failureStatus = await @vControlRepo.getFailureStatus()

        failureStatus.hasFailure.should.false()
        @vControlClientMock.verify()

    describe "if a failure happened", =>
      it "should deliver the failure status in FailusrStatus type", =>
        sinon.stub(@vControlClient, "getData").withArgs("getStatusStoerung").returns("Failure")

        failureStatus = await @vControlRepo.getFailureStatus()

        failureStatus.hasFailure.should.true()
        @vControlClientMock.verify()

  describe "getting the failure", =>
    describe "with no failure", =>
      it "should deliver no failures", =>
        getDataStub = sinon.stub(@vControlClient, "getData")
        getDataStub.withArgs("getError0").returns("1970-01-01T00:00:00+0000 Regelbetrieb (kein Fehler) (00)")
        getDataStub.withArgs("getError1").returns("1970-01-01T00:00:00+0000 Regelbetrieb (kein Fehler) (00)")
        getDataStub.withArgs("getError2").returns("1970-01-01T00:00:00+0000 Regelbetrieb (kein Fehler) (00)")
        getDataStub.withArgs("getError3").returns("1970-01-01T00:00:00+0000 Regelbetrieb (kein Fehler) (00)")
        getDataStub.withArgs("getError4").returns("1970-01-01T00:00:00+0000 Regelbetrieb (kein Fehler) (00)")
        getDataStub.withArgs("getError5").returns("1970-01-01T00:00:00+0000 Regelbetrieb (kein Fehler) (00)")
        getDataStub.withArgs("getError6").returns("1970-01-01T00:00:00+0000 Regelbetrieb (kein Fehler) (00)")
        getDataStub.withArgs("getError7").returns("1970-01-01T00:00:00+0000 Regelbetrieb (kein Fehler) (00)")
        getDataStub.withArgs("getError8").returns("1970-01-01T00:00:00+0000 Regelbetrieb (kein Fehler) (00)")
        getDataStub.withArgs("getError9").returns("1970-01-01T00:00:00+0000 Regelbetrieb (kein Fehler) (00)")

        failures = await @vControlRepo.getFailures()

        failures.items.length.should.equal 0
        @vControlClientMock.verify()

    describe "with full failure history", =>
      it "should deliver all 10 failures", =>
        getDataStub = sinon.stub(@vControlClient, "getData")
        getDataStub.withArgs("getError0").returns("2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (10)")
        getDataStub.withArgs("getError1").returns("2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (11)")
        getDataStub.withArgs("getError2").returns("2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (12)")
        getDataStub.withArgs("getError3").returns("2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (13)")
        getDataStub.withArgs("getError4").returns("2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (14)")
        getDataStub.withArgs("getError5").returns("2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (15)")
        getDataStub.withArgs("getError6").returns("2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (16)")
        getDataStub.withArgs("getError7").returns("2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (17)")
        getDataStub.withArgs("getError8").returns("2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (18)")
        getDataStub.withArgs("getError9").returns("2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (19)")

        failures = await @vControlRepo.getFailures()

        failures.items.length.should.equal 10
        failures.items[0].code.should.equal 0x10
        failures.items[1].code.should.equal 0x11
        failures.items[2].code.should.equal 0x12
        failures.items[3].code.should.equal 0x13
        failures.items[4].code.should.equal 0x14
        failures.items[5].code.should.equal 0x15
        failures.items[6].code.should.equal 0x16
        failures.items[7].code.should.equal 0x17
        failures.items[8].code.should.equal 0x18
        failures.items[9].code.should.equal 0x19
        @vControlClientMock.verify()
