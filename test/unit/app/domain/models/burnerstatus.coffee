should = require("should")
BurnerStatus = require("../../../../../dist/app/domain/models/burnerstatus").default

describe "A BurnerStatus model", =>

  describe "with an inactive burner value", =>
    it "should set the power value", =>
      burnerStatus = new BurnerStatus("0.000000 %")

      burnerStatus.power.should.equal 0.0
      burnerStatus.isActive.should.false()

  describe "with an active burner value", =>
    it "should set the power value", =>
      burnerStatus = new BurnerStatus("12.000000 %")

      burnerStatus.power.should.equal 12.0
      burnerStatus.isActive.should.true()
