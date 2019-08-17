should = require("should")
Failure = require("../../../../dist/app/models/failure").default

describe "A Failure model", =>
  describe "With an invalid failure string", =>
    it "should not deliver a time or failure message and code", =>
      failure = new Failure("")

      failure.isFailure.should.false()
      should(failure.time).equal undefined
      should(failure.code).equal undefined
      should(failure.message).equal undefined

  describe "with a non failure string", =>
    it "should deliver code 0 but no time", =>
      failure = new Failure("1970-01-01T00:00:00+0000 Regelbetrieb (kein Fehler) (00)")

      failure.isFailure.should.false()
      should(failure.time).equal null
      should(failure.code).equal 0
      should(failure.message).equal "Regelbetrieb (kein Fehler)"

  describe "with a valid failure string", =>
    it "should deliver a time or failure message and code", =>
      failure = new Failure("2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (10)")

      failure.isFailure.should.true()
      failure.time.should.eql new Date("2019-08-16T23:03:10")
      failure.code.should.equal 0x10
      failure.message.should.equal "Kurzschluss Aussentemperatursensor"
