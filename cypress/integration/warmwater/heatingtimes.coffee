should = require("should")

describe "when loading the warmwater heating configuration", ->

  mockVControldData = {
    "getTimerWWMo": "An:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerWWDi": "An:01:00  Aus:23:00\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerWWMi": "An:02:00  Aus:23:10\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerWWDo": "An:03:00  Aus:23:20\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerWWFr": "An:04:00  Aus:23:30\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerWWSa": "An:05:00  Aus:23:40\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerWWSo": "An:06:00  Aus:23:50\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "setTimerWWMo": "^\\d+:\\d+$",
    "setTimerWWDi": "^\\d+:\\d+$",
    "setTimerWWMi": "^\\d+:\\d+$",
    "setTimerWWDo": "^\\d+:\\d+$",
    "setTimerWWFr": "^\\d+:\\d+$",
    "setTimerWWSa": "^\\d+:\\d+$",
    "setTimerWWSo": "^\\d+:\\d+$",
  }

  before ->
    cy.mockVcontroldStart(mockVControldData)

  after ->
    cy.mockVcontroldStop()

  beforeEach ->
    cy.visit("/warmwater/heating")
    cy.get("label[for='heatingTimes']").click()

  it "there are 7 days with 4 timers each", ->
    cy.get(".cycleTimes").should("have.length", 7)
    cy.get(".cycleTimes .cycleTime").should("have.length", 28)

  describe "when I enter an invalid time and try to submit it", ->
    it "shows errors", ->
      cy.get("input[name=\"times[monday][0][off]\"]").type("{selectall}25:00")
      cy.get("form[action=\"/warmwater/heating/times\"] button[type=\"submit\"]").click()
      cy.get("input[name=\"times[monday][0][off]\"].formField--error")
      cy.get("input[name=\"times[monday][0][off]\"] + .errorText")
      cy.get(".warmwaterHeating__timesError")
      cy.get(".cycleTimes").should("have.length", 7)
      cy.get(".cycleTimes .cycleTime").should("have.length", 28)

  describe "when I enter valid times and submit them", ->
    it "the new value should be sent", ->
      cy.mockVcontroldResetCommandLog()
      cy.get("input[name=\"times[monday][0][on]\"]").type("{selectall}00:01")
      cy.get("input[name=\"times[monday][0][off]\"]").type("{selectall}00:02")
      cy.get("input[name=\"times[monday][1][on]\"]").type("{selectall}00:03")
      cy.get("input[name=\"times[monday][1][off]\"]").type("{selectall}00:04")
      cy.get("input[name=\"times[monday][2][on]\"]").type("{selectall}00:05")
      cy.get("input[name=\"times[monday][2][off]\"]").type("{selectall}00:06")
      cy.get("input[name=\"times[monday][3][on]\"]").type("{selectall}00:07")
      cy.get("input[name=\"times[monday][3][off]\"]").type("{selectall}00:08")
      cy.get("form[action=\"/warmwater/heating/times\"] button[type=\"submit\"]").click()
      cy.mockVcontroldGetCommandLog().should("deep.eq", [
        "setTimerWWMo 00:01 00:02 00:03 00:04 00:05 00:06 00:07 00:08",
        "setTimerWWDi 01:00 23:00 00:00 24:00 00:00 24:00",
        "setTimerWWMi 02:00 23:10 00:00 24:00 00:00 24:00",
        "setTimerWWDo 03:00 23:20 00:00 24:00 00:00 24:00",
        "setTimerWWFr 04:00 23:30 00:00 24:00 00:00 24:00",
        "setTimerWWSa 05:00 23:40 00:00 24:00 00:00 24:00",
        "setTimerWWSo 06:00 23:50 00:00 24:00 00:00 24:00",
        "getTimerWWMo",
        "getTimerWWDi",
        "getTimerWWMi",
        "getTimerWWDo",
        "getTimerWWFr",
        "getTimerWWSa",
        "getTimerWWSo"
      ])
      #@browser.assert.input("input[name=\"times[monday][0][off]\"]", "15:00")
