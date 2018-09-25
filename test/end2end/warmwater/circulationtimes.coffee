should = require("should")
Browser = require("../../support/browser")
Zombie = require("zombie")

before ->
  @browser = new Zombie()

  browser = new Browser()
  await browser.start()
  @page = await browser.createPage()

describe "when loading the warmwater circulation configuration", ->
  before ->
    await @page.goto("http://localhost:3001/warmwater/circulation")

  it "should have 7 days with 4 timers each", ->
    (await @page.elements(".timerTimes .timerTime")).should.equal(28)

  describe "when I enter an invalid time and try to submit it", ->
    before ->
      await @page.fill("input[name=\"times[monday][0][off]\"]", "25:00")
      await @page.clickNavigate("form[action=\"/warmwater/circulation\"] button[type=\"submit\"]")

    it "an error by the input field is shown", ->
      (await @page.elements("input[name=\"times[monday][0][off]\"].formField--error")).should.greaterThan(0)
      (await @page.elements("input[name=\"times[monday][0][off]\"] + .errorText")).should.greaterThan(0)

    it "an error in the header is shown", ->
      (await @page.elements(".warmwaterCirculation__timesError")).should.greaterThan(0)

  describe "when I enter a valid time and submit it", ->
    before ->
      await @page.fill("input[name=\"times[monday][0][off]\"]", "15:00")
      await @page.clickNavigate("form[action=\"/warmwater/circulation\"] button[type=\"submit\"]")

    it "the new value is shown", ->
      (await @page.inputValue("input[name=\"times[monday][0][off]\"]")).should.equal("15:00")

describe "when loading the warmwater circulation configuration", ->
  before ->
    await @browser.visit("http://localhost:3001/warmwater/circulation")

  it "should have 7 days with 4 timers each", ->
    @browser.assert.elements(".timerTimes .timerTime", 28)

  describe "when I enter an invalid time and try to submit it", ->
    before ->
      @browser.fill("input[name=\"times[monday][0][off]\"]", "25:00")
      @browser.pressButton("form[action=\"/warmwater/circulation\"] button[type=\"submit\"]")

    it "an error by the input field is shown", ->
      @browser.assert.element("input[name=\"times[monday][0][off]\"].formField--error")
      @browser.assert.element("input[name=\"times[monday][0][off]\"] + .errorText")

    it "an error in the header is shown", ->
      @browser.assert.element(".warmwaterCirculation__timesError")

  describe "when I enter a valid time and submit it", ->
    before ->
      @browser.fill("input[name=\"times[monday][0][off]\"]", "15:00")
      @browser.pressButton("form[action=\"/warmwater/circulation\"] button[type=\"submit\"]")

    it "the new value is shown", ->
      @browser.assert.input("input[name=\"times[monday][0][off]\"]", "15:00")
