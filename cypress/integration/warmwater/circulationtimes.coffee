should = require("should")

describe "when loading the warmwater circulation configuration", ->

  mockVControldData = {
    "getTimerZirkuMo": "An:00:01  Aus:23:01\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerZirkuDi": "An:00:02  Aus:23:02\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerZirkuMi": "An:00:03  Aus:23:03\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerZirkuDo": "An:00:04  Aus:23:04\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerZirkuFr": "An:00:05  Aus:23:05\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerZirkuSa": "An:00:06  Aus:23:06\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "getTimerZirkuSo": "An:00:06  Aus:23:07\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--",
    "setTimerZirkuMo": "^\\d+:\\d+$",
    "setTimerZirkuDi": "^\\d+:\\d+$",
    "setTimerZirkuMi": "^\\d+:\\d+$",
    "setTimerZirkuDo": "^\\d+:\\d+$",
    "setTimerZirkuFr": "^\\d+:\\d+$",
    "setTimerZirkuSa": "^\\d+:\\d+$",
    "setTimerZirkuSo": "^\\d+:\\d+$",
  }

  before ->
    cy.mockVcontroldStart(mockVControldData)

  after ->
    cy.mockVcontroldStop()

  beforeEach ->
    cy.visit("/warmwater/circulation")

  it "there are 7 days with 4 timers each", ->
    cy.get(".cycleTimes").should("have.length", 7)
    cy.get(".cycleTimes .cycleTime").should("have.length", 28)

  describe "when I enter an invalid time and try to submit it", ->
    it "shows error", ->
      cy.get("input[name=\"times[monday][0][off]\"]").type("{selectall}25:00")
      cy.get("form[action=\"/warmwater/circulation/times\"] button[type=\"submit\"]").click()
      cy.get("input[name=\"times[monday][0][off]\"].formField--error")
      cy.get("input[name=\"times[monday][0][off]\"] + .errorText")
      cy.get(".warmwaterCirculation__timesError")
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
      cy.get("form[action=\"/warmwater/circulation/times\"] button[type=\"submit\"]").click()
      cy.mockVcontroldGetCommandLog().should("deep.eq", [
        "setTimerZirkuMo 00:01 00:02 00:03 00:04 00:05 00:06 00:07 00:08",
        "setTimerZirkuDi 00:02 23:02 00:00 24:00 00:00 24:00",
        "setTimerZirkuMi 00:03 23:03 00:00 24:00 00:00 24:00",
        "setTimerZirkuDo 00:04 23:04 00:00 24:00 00:00 24:00",
        "setTimerZirkuFr 00:05 23:05 00:00 24:00 00:00 24:00",
        "setTimerZirkuSa 00:06 23:06 00:00 24:00 00:00 24:00",
        "setTimerZirkuSo 00:06 23:07 00:00 24:00 00:00 24:00",
        "getTimerZirkuMo",
        "getTimerZirkuDi",
        "getTimerZirkuMi",
        "getTimerZirkuDo",
        "getTimerZirkuFr",
        "getTimerZirkuSa",
        "getTimerZirkuSo"
      ])
      #@browser.assert.input("input[name=\"times[monday][0][off]\"]", "15:00")
