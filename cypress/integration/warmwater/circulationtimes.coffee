should = require("should")
CommandBuilder = require("../../support/commandbuilder")

describe "when loading the warmwater circulation configuration", ->

  mockVControldData = new CommandBuilder()
    .withCommand("getTimerZirkuMo", "An:00:01  Aus:23:01\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerZirkuDi", "An:00:02  Aus:23:02\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerZirkuMi", "An:00:03  Aus:23:03\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerZirkuDo", "An:00:04  Aus:23:04\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerZirkuFr", "An:00:05  Aus:23:05\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerZirkuSa", "An:00:06  Aus:23:06\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .withCommand("getTimerZirkuSo", "An:00:06  Aus:23:07\nAn:00:00  Aus:24:00\nAn:00:00  Aus:24:00\nAn:--     Aus:--")
    .build()

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
      cy.get("form[action=\"/warmwater/circulation/times\"] button[type=\"submit\"]").click()
      cy.get("input[name=\"times[monday][0][on]\"]").should("value", "00:01")
      cy.get("input[name=\"times[monday][0][off]\"]").should("value", "00:02")
      cy.get("input[name=\"times[monday][1][on]\"]").should("value", "00:03")
      cy.get("input[name=\"times[monday][1][off]\"]").should("value", "00:04")
      cy.get("input[name=\"times[monday][2][on]\"]").should("value", "00:05")
      cy.get("input[name=\"times[monday][2][off]\"]").should("value", "00:06")
      cy.get("input[name=\"times[monday][3][on]\"]").should("value", "00:07")
      cy.get("input[name=\"times[monday][3][off]\"]").should("value", "00:08")
