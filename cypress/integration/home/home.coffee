CommandBuilder = require("../../support/commandbuilder")

describe "when loading the home page", ->

  mockVControldData = new CommandBuilder()
    .withCommand("getSystemTime", "2019-02-12T23:20:52+0000")
    .withCommand("getTempA", "-5.10000  Grad Celsius")
    .withCommand("getTempRaumNorSollM1", "20.00000 Grad Celsius")
    .withCommand("getTempRaumRedSollM1", "16.0000 Grad Celsius")
    .withCommand("getTempWWist", "55.29999 Grad Celsius")
    .withCommand("getTempWWsoll", "57.00000 Grad Celsius")
    .withCommand("getTempKist", "65.29999 Grad Celsius")
    .withCommand("getBetriebArt", "H+WW")
    .withCommand("getStatusStoerung", "Stoerung")
    .withCommand("getError0", "2019-08-16T23:03:10+0000 Fehler mit Code 16 (10)")
    .build()


  before ->
    cy.mockVcontroldStart(mockVControldData)

  after ->
    cy.mockVcontroldStop()

  beforeEach ->
    cy.visit("/")

  it "should show all the data required for the home page", =>
    cy.get(".home__systemTime").should("text", "13.2.201900:20:52")
    cy.get(".homeTemperatures__outsideTemperature").should("text", "-5.1 °C")
    cy.get(".homeTemperatures input[name='roomTemperature']").should("value", "20")
    cy.get(".homeTemperatures input[name='reducedRoomTemperature']").should("value", "16")
    cy.get(".heaterStats__burnerTemperature").should("text", "65.3 °C")
    cy.get(".heaterStats__waterTemperature").should("text", "55.3 °C")
    cy.get(".heaterStats input[name='waterTargetTemperature']").should("value", "57")
    cy.get(".failureStatus--hasFailure")
    cy.get(".heatingMode .heatingMode__heating")
    cy.get(".heatingMode .heatingMode__warmwater")
    cy.get(".failureMessage").should("text", "Kurzschluss Aussentemperatursensor")
