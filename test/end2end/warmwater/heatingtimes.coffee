should = require("should")
global.Config = require("../../../config/config.json")

Zombie = require("zombie")
MockVControlD = require("../../support/mockvcontrold")

describe "when loading the warmwater heating configuration", =>
  before =>
    @browser = new Zombie()
    @mockVControlD = new MockVControlD()
    await @mockVControlD.start()
    await @browser.visit("http://localhost:" + Config.port + "/warmwater/heating")

  after =>
    await @mockVControlD.stop()

  it "should have 7 days with 4 timers each", =>
    @browser.assert.elements(".cycleTimes .cycleTime", 28)

  describe "when I enter an invalid time and try to submit it", =>
    before =>
      @browser.fill("input[name=\"times[monday][0][off]\"]", "25:00")
      @browser.pressButton("form[action=\"/warmwater/heating/times\"] button[type=\"submit\"]")

    it "an error by the input field is shown", =>
      @browser.assert.element("input[name=\"times[monday][0][off]\"].formField--error")
      @browser.assert.element("input[name=\"times[monday][0][off]\"] + .errorText")

    it "an error in the header is shown", =>
      @browser.assert.element(".warmwaterHeating__timesError")

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
      @browser.pressButton("form[action=\"/warmwater/heating/times\"] button[type=\"submit\"]")

    it "the new value should be sent", =>
      @mockVControlD.commandLog.should.eql([
        "setTimerWWMo 00:01 00:02 00:03 00:04 00:05 00:06 00:07 00:08",
        "setTimerWWDi 01:00 23:00 00:00 24:00 00:00 24:00",
        "setTimerWWMi 02:00 23:10 00:00 24:00 00:00 24:00",
        "setTimerWWDo 03:00 23:20 00:00 24:00 00:00 24:00",
        "setTimerWWFr 04:00 23:30 00:00 24:00 00:00 24:00",
        "setTimerWWSa 05:00 23:40 00:00 24:00 00:00 24:00",
        "setTimerWWSo 06:00 23:50 00:00 24:00 00:00 24:00",
        "quit",
        "getTimerWWMo",
        "getTimerWWDi",
        "getTimerWWMi",
        "getTimerWWDo",
        "getTimerWWFr",
        "getTimerWWSa",
        "getTimerWWSo",
        "quit"
      ])
      #@browser.assert.input("input[name=\"times[monday][0][off]\"]", "15:00")
