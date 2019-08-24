should = require("should")
FrostIndicator = require("../../../../../dist/app/domain/models/frostindicator").default

describe "A FrostIndicator model", =>

  describe "with no failure", =>
    it "should not set the failure flag", =>
      frostIndicator = new FrostIndicator("2.000000")

      frostIndicator.hasWarning.should.false()

    it "should not set the failure flag", =>
      frostIndicator = new FrostIndicator("0.000000")

      frostIndicator.hasWarning.should.false()

  describe "with failure", =>
    it "should set the failure flag", =>
      frostIndicator = new FrostIndicator("1.000000")

      frostIndicator.hasWarning.should.true()
