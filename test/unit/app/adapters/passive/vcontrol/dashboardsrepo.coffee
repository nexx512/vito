should = require("should")
sinon = require("sinon")
VControlClient = require("vcontrol")
DashboardsRepo = require("../../../../../../dist/app/adapters/passive/vcontrol/dashboardsrepo").default
FailureStatus = require("../../../../../../dist/app/domain/models/failurestatus").default
Temperature = require("../../../../../../dist/app/domain/models/temperature").default
HeatingMode = require("../../../../../../dist/app/domain/models/heatingmode").default

describe "A DashboardsRepo object", =>

  getDataStub = null

  beforeEach =>
    @vControlClient = new VControlClient({})
    @vControlClientMock = sinon.mock(@vControlClient)
    @vControlClientMock.expects("connect").once()
    @vControlClientMock.expects("close").once()
    @dashboardsRepo = new DashboardsRepo(@vControlClient)
    getDataStub = sinon.stub(@vControlClient, "getData")
    getDataStub.withArgs("getSystemTime").returns("2019-02-12T23:20:52+0000\n")
    getDataStub.withArgs("getBetriebArt").returns("H+WW\n")


  describe "requesting the data for the dashboards with normal operation", =>
    dashboardInfos = null

    beforeEach =>
      getDataStub.withArgs("getTempA").returns("6.100000 Grad Celsius\n")
      getDataStub.withArgs("getTempRaumNorSollM1").returns("21.00000 Grad Celsius\n")
      getDataStub.withArgs("getTempRaumRedSollM1").returns("18.00000 Grad Celsius\n")
      getDataStub.withArgs("getTempKist").returns("65.2999 Grad Celsius\n")
      getDataStub.withArgs("getTempWWist").returns("55.2999 Grad Celsius\n")
      getDataStub.withArgs("getTempWWsoll").returns("57.00000 Grad Celsius\n")
      getDataStub.withArgs("getStatusStoerung").returns("0")

      dashboardInfos = await @dashboardsRepo.getDashboardInfos()

      @vControlClientMock.verify()

    describe "", =>
      it "should deliver the heating system time in ISO format", =>
        dashboardInfos.systemTime.should.eql new Date("2019-02-12T23:20:52+0000")
      it "should deliver the outside temperature in the Temperature type", =>
        dashboardInfos.outsideTemp.should.eql new Temperature("6.1")
      it "should deliver the room temperature in the Temperature type", =>
        dashboardInfos.roomTemp.should.eql new Temperature("21")
      it "should deliver the reduced room temperature in the Temperature type", =>
        dashboardInfos.reducedRoomTemp.should.eql new Temperature("18")
      it "should deliver the burner temperature in the Temperature type", =>
        dashboardInfos.burnerTemp.should.eql new Temperature("65.2999")
      it "should deliver the water temperature in the Temperature type", =>
        dashboardInfos.waterTemp.should.eql new Temperature("55.2999")
      it "should deliver the water target temperature in the Temperature type", =>
        dashboardInfos.waterTargetTemp.should.eql new Temperature("57")
      it "should deliver the heating mode", =>
        dashboardInfos.heatingMode.should.eql new HeatingMode("H+WW")
      it "should deliver the 'OK' failure status in FailusrStatus type", =>
        dashboardInfos.failureStatus.should.eql new FailureStatus("0")

  describe "requesting the failure status if a failure happened", =>
    it "should deliver the failure status in FailusrStatus type", =>
      getDataStub.withArgs("getStatusStoerung").returns("1")

      dashboardInfos = await @dashboardsRepo.getDashboardInfos()

      dashboardInfos.failureStatus.should.eql new FailureStatus("1")
      @vControlClientMock.verify()

  describe "setting the room temperature", =>
    describe "without errors", =>
      it "should set the room temperature times", =>
        @vControlClientMock.expects("setData").once().withArgs("setTempRaumNorSollM1", "22")

        times = await @dashboardsRepo.setRoomTemperature(new Temperature(22))

        @vControlClientMock.verify()

    describe "with errors", =>
      it "should open and close the connection properly and throw an error", =>
        sinon.stub(@vControlClient, "setData").throws()

        await @dashboardsRepo.setRoomTemperature(new Temperature()).should.rejected()

        @vControlClientMock.verify()

  describe "setting the reduced room temperature", =>
    describe "without errors", =>
      it "should set the room temperature times", =>
        @vControlClientMock.expects("setData").once().withArgs("setTempRaumRedSollM1", "16")

        times = await @dashboardsRepo.setReducedRoomTemperature(new Temperature(16))

        @vControlClientMock.verify()

    describe "with errors", =>
      it "should open and close the connection properly and throw an error", =>
        sinon.stub(@vControlClient, "setData").throws()

        await @dashboardsRepo.setReducedRoomTemperature(new Temperature()).should.rejected()

        @vControlClientMock.verify()

  describe.skip "requesting the failure", =>
    describe "with no failure", =>
      it "should deliver no failures", =>
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

        failures = await @dashboardsRepo.getFailures()

        failures.items.length.should.equal 0
        @vControlClientMock.verify()

    describe "with full failure history", =>
      it "should deliver all 10 failures", =>
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

        failures = await @dashboardsRepo.getFailures()

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
