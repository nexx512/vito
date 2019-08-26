should = require("should")
WarmWaterCirculation = require("../../../../../dist/app/domain/models/warmwatercirculation").default

describe "A WarmWaterCirculation model", =>

  describe "with an inactive water circulation", =>
    it "should reset the circulation indicator", =>
      warmWaterCirculation = new WarmWaterCirculation("0")

      warmWaterCirculation.isActive.should.false()

  describe "with an active water circulation", =>
    it "should set the circulation indicator", =>
      warmWaterCirculation = new WarmWaterCirculation("1")

      warmWaterCirculation.isActive.should.true()
