should = require("should")
CommandBuilder = require("../../support/commandbuilder")

describe "when loading the heater configuration", ->

  mockVControldData = new CommandBuilder()
    .withCommand("getTimerMo", "An:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerDi", "An:01:00  Aus:23:00\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerMi", "An:02:00  Aus:23:10\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerDo", "An:03:00  Aus:23:20\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerFr", "An:04:00  Aus:23:30\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerSa", "An:05:00  Aus:23:40\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerSo", "An:06:00  Aus:23:50\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .build()

  before ->
    cy.mockVcontroldStart(mockVControldData)

  after ->
    cy.mockVcontroldStop()

  beforeEach ->
    cy.visit("/heater/heating/times")
    #cy.get("label[for='heatingTimes']").click()

  it "there are 7 days with 4 timers each", ->
    cy.get(".cycleTimes").should("have.length", 7)
    cy.get(".cycleTimes .cycleTime").should("have.length", 28)

  describe "when I enter an invalid time and try to submit it", ->
    it "shows errors", ->
      cy.get("input[name=\"times[monday][0][off]\"]").type("{selectall}25:00")
      cy.get("form[action=\"/heater/heating/times\"] button[type=\"submit\"]").click()
      cy.get("input[name=\"times[monday][0][off]\"].formField--error")
      cy.get("input[name=\"times[monday][0][off]\"] + .errorText")
      cy.get(".page__notificationError")
      cy.get(".cycleTimes").should("have.length", 7)
      cy.get(".cycleTimes .cycleTime").should("have.length", 28)

  describe "when I enter valid times and submit them", ->
    it "the new value should be sent", ->
      cy.get("input[name=\"times[monday][0][on]\"]").type("{selectall}00:01")
      cy.get("input[name=\"times[monday][0][off]\"]").type("{selectall}00:02")
      cy.get("input[name=\"times[monday][1][on]\"]").type("{selectall}00:03")
      cy.get("input[name=\"times[monday][1][off]\"]").type("{selectall}00:04")
      cy.get("input[name=\"times[monday][2][on]\"]").type("{selectall}00:05")
      cy.get("input[name=\"times[monday][2][off]\"]").type("{selectall}00:06")
      cy.get("input[name=\"times[monday][3][on]\"]").type("{selectall}00:07")
      cy.get("input[name=\"times[monday][3][off]\"]").type("{selectall}00:08")
      cy.get("form[action=\"/heater/heating/times\"] button[type=\"submit\"]").click()
      cy.get("input[name=\"times[monday][0][on]\"]").should("value", "00:01")
      cy.get("input[name=\"times[monday][0][off]\"]").should("value", "00:02")
      cy.get("input[name=\"times[monday][1][on]\"]").should("value", "00:03")
      cy.get("input[name=\"times[monday][1][off]\"]").should("value", "00:04")
      cy.get("input[name=\"times[monday][2][on]\"]").should("value", "00:05")
      cy.get("input[name=\"times[monday][2][off]\"]").should("value", "00:06")
      cy.get("input[name=\"times[monday][3][on]\"]").should("value", "00:07")
      cy.get("input[name=\"times[monday][3][off]\"]").should("value", "00:08")
