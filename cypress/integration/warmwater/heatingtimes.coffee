should = require("should")
CommandBuilder = require("../../support/commandbuilder")

describe "when loading the warmwater heating configuration", ->

  mockVControldData = new CommandBuilder()
    .withCommand("getTimerWWMo", "An:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerWWDi", "An:01:00  Aus:23:00\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerWWMi", "An:02:00  Aus:23:10\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerWWDo", "An:03:00  Aus:23:20\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerWWFr", "An:04:00  Aus:23:30\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerWWSa", "An:05:00  Aus:23:40\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerWWSo", "An:06:00  Aus:23:50\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .build()

  before ->
    cy.mockVcontroldStart(mockVControldData)

  after ->
    cy.mockVcontroldStop()

  beforeEach ->
    cy.visit("/warmwater/heating/times")
    cy.get("label[for='heatingTimes']").click()

  it "there are 7 days with 4 timers each", ->
    cy.get(".warmwater__heatingTimesForm .cycleTimes").should("have.length", 7)
    cy.get(".warmwater__heatingTimesForm .cycleTimes .cycleTime").should("have.length", 28)

  describe "when I enter an invalid time and try to submit it", ->
    it "shows error", ->
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][0][off]\"]").type("{selectall}25:00")
      cy.get("form[action=\"/warmwater/heating/times\"].warmwater__heatingTimesForm  button[type=\"submit\"]").click()
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][0][off]\"].formField--error")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][0][off]\"] + .errorText")
      cy.get(".page__notificationError")
      cy.get(".warmwater__heatingTimesForm .cycleTimes").should("have.length", 7)
      cy.get(".warmwater__heatingTimesForm .cycleTimes .cycleTime").should("have.length", 28)

  describe "when I enter valid times and submit them", ->
    it "the new value should be sent", ->
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][0][on]\"]").type("{selectall}00:01")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][0][off]\"]").type("{selectall}00:02")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][1][on]\"]").type("{selectall}00:03")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][1][off]\"]").type("{selectall}00:04")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][2][on]\"]").type("{selectall}00:05")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][2][off]\"]").type("{selectall}00:06")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][3][on]\"]").type("{selectall}00:07")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][3][off]\"]").type("{selectall}00:08")
      cy.get("form[action=\"/warmwater/heating/times\"].warmwater__heatingTimesForm button[type=\"submit\"]").click()
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][0][on]\"]").should("value", "00:01")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][0][off]\"]").should("value", "00:02")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][1][on]\"]").should("value", "00:03")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][1][off]\"]").should("value", "00:04")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][2][on]\"]").should("value", "00:05")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][2][off]\"]").should("value", "00:06")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][3][on]\"]").should("value", "00:07")
      cy.get(".warmwater__heatingTimesForm input[name=\"times[monday][3][off]\"]").should("value", "00:08")
