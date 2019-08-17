CommandBuilder = require("../../support/commandbuilder")

describe "when loading the home page", ->

  mockVControldData = new CommandBuilder()
    .withCommand("getSystemTime", "2019-02-12T23:20:52+0000")
    .withCommand("getTempA", "-5.10000  Grad Celsius")
    .withCommand("getTempRaumNorSollM1", "20.00000 Grad Celsius")
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
    cy.get(".home__outsideTemperature").should("text", "-5.10 °C")
    cy.get(".home__roomTemperature").should("text", "20.00 °C")
    cy.get(".failureStatus--hasFailure")
    cy.get(".heatingMode .heatingMode__heating")
    cy.get(".heatingMode .heatingMode__warmwater")
    cy.get(".failureMessage").should("text", "Kurzschluss Aussentemperatursensor")
