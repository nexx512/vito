should = require("should")
global.Config = require("../../../config/config.json")

MockVControlD = require("../../support/mockvcontrold")

VControlClient = require("vcontrol")
VControlRepo = require("../../../dist/app/repo/vcontrol/vcontrolrepo").default
OverviewService = require("../../../dist/app/services/overviewservice").default

Temperature = require("../../../dist/app/models/temperature").default
HeatingMode = require("../../../dist/app/models/heatingmode").default
FailureStatus = require("../../../dist/app/models/failurestatus").default

describe "The OverviewService", =>

  mockVControldData = {
    "getSystemTime": "2019-02-12T23:20:52+0000",
    "getTempA": "-5.10000  Grad Celsius",
    "getTempRaumNorSollM1": "20.00000 Grad Celsius",
    "getBetriebArt": "H+WW"
    "getStatusStoerung": "Stoerung"
  }

  before =>
    @overviewService = new OverviewService(new VControlRepo(new VControlClient({
      host: "localhost"
      port: 3002
    })))
    @mockVControlD = new MockVControlD(mockVControldData)
    await @mockVControlD.start()

  after =>
    await @mockVControlD.stop()

  describe "getting the general heating status", =>
    before =>
      @generalHeatingStatus = await @overviewService.getGeneralHeatingStatus()

    it "should deliver the system time", =>
      @generalHeatingStatus.systemTime.should.eql new Date("2019-02-12T23:20:52+0000")
    it "should get the outside temperature", =>
      @generalHeatingStatus.outsideTemp.should.eql new Temperature("-5.1")
    it "should get the room temperature", =>
      @generalHeatingStatus.roomTemp.should.eql new Temperature("20")
    it "should get the heating mode", =>
      @generalHeatingStatus.heatingMode.should.eql new HeatingMode("H+WW")
    it "should get the failure status", =>
      @generalHeatingStatus.failureStatus.should.eql new FailureStatus(true)
