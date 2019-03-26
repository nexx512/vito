should = require("should")
global.Config = require("../../../config/config.json")

MockVControlD = require("../../support/mockvcontrold")

VControlClient = require("vcontrol")
VControlRepo = require("../../../dist/app/repo/vcontrol/vcontrolrepo").default
OverviewService = require("../../../dist/app/services/overviewservice").default

Temperature = require("../../../dist/app/models/temperature").default

describe "The OverviewService", =>

  before =>
    @overviewService = new OverviewService(new VControlRepo(new VControlClient({
      host: "localhost"
      port: 3002
    })))
    @mockVControlD = new MockVControlD()
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
