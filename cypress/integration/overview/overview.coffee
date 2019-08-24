CommandBuilder = require("../../support/commandbuilder")

describe "when loading the home page", =>

  describe "with all states negative", =>
    mockVControldData = new CommandBuilder()
      .withCommand("getSystemTime", "2019-02-12T23:20:52+0000")
      .withCommand("getTempA", "-5.10000  Grad Celsius")
      .withCommand("getTempRaumNorSollM1", "20.00000 Grad Celsius")
      .withCommand("getTempRaumRedSollM1", "16.0000 Grad Celsius")
      .withCommand("getTempWWist", "55.29999 Grad Celsius")
      .withCommand("getTempWWsoll", "57.00000 Grad Celsius")
      .withCommand("getTempKist", "65.29999 Grad Celsius")
      .withCommand("getStatusStoerung", "0")
      .build()

    before ->
      cy.mockVcontroldStart(mockVControldData)

    after ->
      cy.mockVcontroldStop()

    beforeEach ->
      cy.visit("/")

    it "should show all the measurement data and all status indicators turned off", =>
      cy.get(".homeTemperatures__iconFrost--active").should("not.exist")
      cy.get(".homeTemperatures__outsideTemperature").should("text", "-5.1 °C")
      cy.get(".homeTemperatures input[name='roomTemperature']").should("value", "20")
      cy.get(".homeTemperatures input[name='reducedRoomTemperature']").should("value", "16")
      cy.get(".heaterInfos__systemTime").should("text", "13.2.201900:20:52")
      cy.get(".heaterInfos__burnerTemperature").should("text", "65.3 °C")
      cy.get(".heaterInfos__waterTemperature").should("text", "55.3 °C")
      cy.get(".heaterInfos input[name='waterTargetTemperature']").should("value", "57")
      cy.get(".heaterInfos__failureStatus--hasFailure").should("not.exist")
      cy.get(".heaterInfos input[name='heatingOn']").should("not.checked")
      cy.get(".heaterInfos input[name='warmwaterOn']").should("not.checked")
      cy.get(".heaterInfos__burnerStatus--active").should("not.exist")
      cy.get(".heaterInfos__heatingCirculation--active").should("not.exist")
      cy.get(".heaterInfos__waterStatus--active").should("not.exist")
      cy.get(".heaterInfos__waterCirculation--active").should("not.exist")
      #cy.get(".failureMessage").should("text", "Kurzschluss Aussentemperatursensor")

    describe "when I enter invalid room temperatures", =>
      it "should show an error message for each temperature", =>
        cy.get("input[name=\"roomTemperature\"]").type("{selectall}aa{enter}")
        cy.get(".page__notificationError").should("contain", "Raum Solltemperatur ungültig")
        cy.get("input[name=\"reducedRoomTemperature\"]").type("{selectall}bb{enter}")
        cy.get(".page__notificationError").should("contain", "Raum Absenktemperatur ungültig")

    describe "when I enter valid room temperatures", =>
      it "should set the temperatures", =>
        cy.get("input[name=\"roomTemperature\"]").type("{selectall}25{enter}")
        cy.get(".page__notificationError").should("not.have.descendants")
        cy.get(".homeTemperatures input[name='roomTemperature']").should("value", "25")
        cy.get("input[name=\"reducedRoomTemperature\"]").type("{selectall}18{enter}")
        cy.get(".page__notificationError").should("not.have.descendants")
        cy.get(".homeTemperatures input[name='reducedRoomTemperature']").should("value", "18")

  describe "with all states positive", =>
    mockVControldData = new CommandBuilder()
      .withCommand("getStatusFrostM1", "1.000000")
      .withCommand("getBrennerStatus", "25.00000 %")
      .withCommand("getPumpeStatusZirku", "1")
      .withCommand("getPumpeStatusSp", "1")
      .withCommand("getUmschaltventil", "Heizen")
      .withCommand("getPumpeStatusIntern", "1")
      .withCommand("getBetriebArt", "H+WW")
      .withCommand("getStatusStoerung", "1")
      .withCommand("getError0", "2019-08-16T23:03:10+0000 Fehler mit Code 16 (10)")
      .build()

    before ->
      cy.mockVcontroldStart(mockVControldData)

    after ->
      cy.mockVcontroldStop()

    beforeEach ->
      cy.visit("/")

    it "should show all status indicators turned on", =>
      cy.get(".homeTemperatures__iconFrost--active").should("exist")
      cy.get(".heaterInfos__failureStatus--hasFailure").should("exist")
      cy.get(".heaterInfos input[name='heatingOn']").should("checked")
      cy.get(".heaterInfos input[name='warmWaterOn']").should("checked")
      cy.get(".heaterInfos__burnerStatus--active").should("exist")
      cy.get(".heaterInfos__heatingCirculation--active").should("exist")
      cy.get(".heaterInfos__waterStatus--active").should("exist")
      cy.get(".heaterInfos__waterCirculation--active").should("exist")
      #cy.get(".failureMessage").should("text", "Kurzschluss Aussentemperatursensor")
