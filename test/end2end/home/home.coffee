should = require("should")
global.Config = require("../../../config/config.json")

Zombie = require("zombie")
MockVControlD = require("../../support/mockvcontrold")

describe "when loading the home page", =>

  mockVControldData = {
    "getSystemTime": "2019-02-12T23:20:52+0000",
    "getTempA": "-5.10000  Grad Celsius",
    "getStatusStoerung": "Fehler"
  }

  before =>
    @browser = new Zombie()
    @mockVControlD = new MockVControlD(mockVControldData)
    await @mockVControlD.start()
    await @browser.visit("http://localhost:" + Config.port)

  after =>
    await @mockVControlD.stop()

  it "should ask all the data required for the home page", =>
    @mockVControlD.commandLog.should.containDeep([
      "getSystemTime"
      "getTempA"
      "getStatusStoerung"
#      "getTempRaumNorSollM1"
#      "getBetriebArt"
#      "getStatusFrostM1"
    ])

  it "should have the date and time", =>
    @browser.assert.text(".home__systemTime", "13.2.201900:20:52")

  it "should have the outside temperature", =>
    @browser.assert.text(".home__outsideTemperature", "-5.10 °C")

  it "should have the failure status", =>
    @browser.assert.element(".failureStatus__hasFailure")

  it.skip "should have the heating mode", =>
    @browser.assert.element(".heatingMode .heatingMode__heating")
    @browser.assert.element(".heatingMode .heatingMode__warmwater")
