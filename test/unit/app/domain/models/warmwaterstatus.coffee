should = require("should")
WarmWaterStatus = require("../../../../../dist/app/domain/models/warmwaterstatus").default

describe "A WarmWaterStatus model", =>

  describe "with an inactive water heater", =>
    it "should reset the heating indicator", =>
      warmWaterStatus = new WarmWaterStatus("0")

      warmWaterStatus.isHeating.should.false()

  describe "with an active water heater", =>
    it "should set the heating indicator", =>
      warmWaterStatus = new WarmWaterStatus("1")

      warmWaterStatus.isHeating.should.true()
