should = require("should")
global.Config = require("../../../../config/config.json")

MockVControlD = require("../../../support/mockvcontrold")
CommandBuilder = require("../../../support/commandbuilder")

VControlClient = require("vcontrol")
DashboardsRepo = require("../../../../dist/app/adapters/passive/vcontrol/dashboardsrepo").default
OverviewService = require("../../../../dist/app/domain/services/overviewservice").default

Temperature = require("../../../../dist/app/domain/models/temperature").default
HeatingMode = require("../../../../dist/app/domain/models/heatingmode").default
FailureStatus = require("../../../../dist/app/domain/models/failurestatus").default
Failures = require("../../../../dist/app/domain/models/failures").default
Failure = require("../../../../dist/app/domain/models/failure").default
FrostIndicator = require("../../../../dist/app/domain/models/frostindicator").default
BurnerStatus = require("../../../../dist/app/domain/models/burnerstatus").default
WarmWaterStatus = require("../../../../dist/app/domain/models/warmwaterstatus").default

ValidationError = require("../../../../dist/app/domain/models/validationerror").default
ValidationErrors = require("../../../../dist/app/domain/models/validationerrors").default

describe "The OverviewService", =>

  mockVControldData = new CommandBuilder()
    .withCommand("getStatusFrostM1", "1.000000")
    .withCommand("getSystemTime", "2019-02-12T23:20:52+0000")
    .withCommand("getTempA", "-5.10000  Grad Celsius")
    .withCommand("getTempRaumNorSollM1", "20.00000 Grad Celsius")
    .withCommand("getTempRaumRedSollM1", "16.00000 Grad Celsius")
    .withCommand("getTempWWist", "55.29999 Grad Celsius")
    .withCommand("getTempWWsoll", "57.00000 Grad Celsius")
    .withCommand("getTempKist", "65.29999 Grad Celsius")
    .withCommand("getBetriebArt", "H+WW")
    .withCommand("getStatusStoerung", "1")
    .withCommand("getBrennerStatus", "0.00000 %")
    .withCommand("getPumpeStatusSp", "1")
    #.withCommand("getError0", "2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (10)")
    .build()

  before =>
    @overviewService = new OverviewService(new DashboardsRepo(new VControlClient({
      host: "localhost"
      port: 3002
    })))
    @mockVControlD = new MockVControlD(mockVControldData)
    await @mockVControlD.start()

  after =>
    await @mockVControlD.stop()

  describe "getting the overview information", =>
    before =>
      @dashboardInfos = await @overviewService.getDashboardInfos()

    it "should deliver the system time", =>
      @dashboardInfos.systemTime.should.eql new Date("2019-02-12T23:20:52+0000")
    it "should deliver the frost warning", =>
      @dashboardInfos.frostIndicator.should.eql new FrostIndicator("1")
    it "should get the outside temperature", =>
      @dashboardInfos.outsideTemp.should.eql new Temperature("-5.1")
    it "should get the room temperature", =>
      @dashboardInfos.roomTemp.should.eql new Temperature("20")
    it "should get the reduced room temperature", =>
      @dashboardInfos.reducedRoomTemp.should.eql new Temperature("16")
    it "should get the heating mode", =>
      @dashboardInfos.heatingMode.should.eql new HeatingMode("H+WW")
    it "should get the burner temperature", =>
      @dashboardInfos.burnerTemp.should.eql new Temperature("65.29999")
    it "should get the water temperature", =>
      @dashboardInfos.waterTemp.should.eql new Temperature("55.29999")
    it "should get the failure status", =>
      @dashboardInfos.failureStatus.should.eql new FailureStatus("1")
    it "should get the burner status", =>
      @dashboardInfos.burnerStatus.should.eql new BurnerStatus("0.000000 %")
    it "should get the warm water heating status", =>
      @dashboardInfos.warmWaterStatus.should.eql new WarmWaterStatus("1")
    it.skip "should get the error message", =>
      failures = new Failures()
      failures.add(new Failure("2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (10)"))
      @dashboardInfos.failures.should.eql failures

  describe "setting the room temperatures", =>
    beforeEach =>
      @mockVControlD.resetCommandLog()

    describe "with invalid room temperature", =>
      it "should return error messages", =>
        await @overviewService.setRoomTemperatures(
          new Temperature("aa"), new Temperature("13")
        ).should.rejectedWith(new ValidationError("Room temperatures invalid",
          new ValidationErrors([new ValidationError("Room temperature invalid")])));

        @mockVControlD.commandLog.should.eql ["setTempRaumRedSollM1 13"]

    describe "with invalid reduced room temperature", =>
      it "should return error messages", =>
        await @overviewService.setRoomTemperatures(
          new Temperature("25"), new Temperature("bb")
        ).should.rejectedWith(new ValidationError("Room temperatures invalid",
          new ValidationErrors([new ValidationError("Reduced room temperature invalid")])));

        @mockVControlD.commandLog.should.eql ["setTempRaumNorSollM1 25"]
