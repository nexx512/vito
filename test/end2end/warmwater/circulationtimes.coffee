should = require("should")
global.Config = require("../../../config/config.json")

Zombie = require("zombie")
MockVControlD = require("../../support/mockvcontrold")

before =>
  @browser = new Zombie()
  @mockVControlD = new MockVControlD()
  await @mockVControlD.start()

after =>
  await @mockVControlD.stop()

describe "when loading the warmwater circulation configuration", =>
  before =>
    await @browser.visit("http://localhost:" + Config.port + "/warmwater/circulation")

  it "should have 7 days with 4 timers each", =>
    @browser.assert.elements(".timerTimes .timerTime", 28)

  describe "when I enter an invalid time and try to submit it", =>
    before =>
      @browser.fill("input[name=\"times[monday][0][off]\"]", "25:00")
      @browser.pressButton("form[action=\"/warmwater/circulation\"] button[type=\"submit\"]")

    it "an error by the input field is shown", =>
      @browser.assert.element("input[name=\"times[monday][0][off]\"].formField--error")
      @browser.assert.element("input[name=\"times[monday][0][off]\"] + .errorText")

    it "an error in the header is shown", =>
      @browser.assert.element(".warmwaterCirculation__timesError")

  describe "when I enter valid times and submit them", =>
    before =>
      @mockVControlD.resetCommandLog()
      @browser.fill("input[name=\"times[monday][0][on]\"]", "00:01")
      @browser.fill("input[name=\"times[monday][0][off]\"]", "00:02")
      @browser.fill("input[name=\"times[monday][1][on]\"]", "00:03")
      @browser.fill("input[name=\"times[monday][1][off]\"]", "00:04")
      @browser.fill("input[name=\"times[monday][2][on]\"]", "00:05")
      @browser.fill("input[name=\"times[monday][2][off]\"]", "00:06")
      @browser.fill("input[name=\"times[monday][3][on]\"]", "00:07")
      @browser.fill("input[name=\"times[monday][3][off]\"]", "00:08")
      @browser.pressButton("form[action=\"/warmwater/circulation\"] button[type=\"submit\"]")

    it "the new value should be sent", =>
      @mockVControlD.commandLog.should.eql([
        "setTimerZirkuMo 00:01 00:02 00:03 00:04 00:05 00:06 00:07 00:08",
        "setTimerZirkuDi 00:02 23:02 00:00 24:00 00:00 24:00",
        "setTimerZirkuMi 00:03 23:03 00:00 24:00 00:00 24:00",
        "setTimerZirkuDo 00:04 23:04 00:00 24:00 00:00 24:00",
        "setTimerZirkuFr 00:05 23:05 00:00 24:00 00:00 24:00",
        "setTimerZirkuSa 00:06 23:06 00:00 24:00 00:00 24:00",
        "setTimerZirkuSo 00:06 23:07 00:00 24:00 00:00 24:00",
        "quit",
        "getTimerZirkuMo",
        "getTimerZirkuDi",
        "getTimerZirkuMi",
        "getTimerZirkuDo",
        "getTimerZirkuFr",
        "getTimerZirkuSa",
        "getTimerZirkuSo",
        "quit"
      ])
      #@browser.assert.input("input[name=\"times[monday][0][off]\"]", "15:00")
