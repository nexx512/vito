should = require("should")
FailureStatus = require("../../../../../dist/app/domain/models/failurestatus").default

describe "A FailureStatus model", =>

  describe "with no failure", =>
    it "should not set the failure flag", =>
      heatingMode = new FailureStatus("0")

      heatingMode.hasFailure.should.false()

  describe "with failure", =>
    it "should set the failure flag", =>
      heatingMode = new FailureStatus("1")

      heatingMode.hasFailure.should.true()
