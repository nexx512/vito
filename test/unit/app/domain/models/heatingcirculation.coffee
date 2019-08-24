should = require("should")
HeatingCirculation = require("../../../../../dist/app/domain/models/heatingcirculation").default

describe "A HeatingCirculation model", =>

  describe "with no running pump and valve set to water", =>
    it "should not set the active flag", =>
      heatingCirculation = new HeatingCirculation("0", "Warmwasser")

      heatingCirculation.isActive.should.false()

  describe "with no running pump and valve set to heating", =>
    it "should not set the active flag", =>
      heatingCirculation = new HeatingCirculation("0", "Heizen")

      heatingCirculation.isActive.should.false()

  describe "with a running pump and valve set to water", =>
    it "should not set the active flag", =>
      heatingCirculation = new HeatingCirculation("1", "Warmwasser")

      heatingCirculation.isActive.should.false()

  describe "with a running pump and valve set to heating", =>
    it "should set the active flag", =>
      heatingCirculation = new HeatingCirculation("1", "Heizen")

      heatingCirculation.isActive.should.true()
