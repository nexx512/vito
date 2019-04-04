should = require("should")

describe "when loading the home page", ->

  mockVControldData = {
    "getSystemTime": "2019-02-12T23:20:52+0000",
    "getTempA": "-5.10000  Grad Celsius",
    "getStatusStoerung": "Fehler"
  }

  before ->
    cy.mockVcontroldStart(mockVControldData)

  after ->
    cy.mockVcontroldStop()

  beforeEach ->
    cy.visit("/")

  it "should ask all the data required for the home page and show it", =>
    cy.mockVcontroldGetCommandLog().should("deep.eq", [
      "getSystemTime"
      "getTempA"
      "getStatusStoerung"
#      "getTempRaumNorSollM1"
#      "getBetriebArt"
#      "getStatusFrostM1"
    ])
    cy.get(".home__systemTime").should("text", "13.2.201900:20:52")
    cy.get(".home__outsideTemperature").should("text", "-5.10 °C")
    cy.get(".failureStatus__hasFailure")
#    cy.get(".heatingMode .heatingMode__heating")
#    cy.get(".heatingMode .heatingMode__warmwater")
