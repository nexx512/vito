should = require("should")
Failure = require("../../../../dist/app/models/failure").default
Failures = require("../../../../dist/app/models/failures").default

describe "A Failures model", =>
  describe "with invalid failures, failures and no failures", =>
    it "Should only list the failures", =>
      failures = new Failures()
      failures.add(new Failure(""))
      failures.add(new Failure("1970-01-01T00:00:00+0000 Regelbetrieb (kein Fehler) (00)"))
      failures.add(new Failure("2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (10)"))

      failures.items.length.should.equal 1
      failures.items[0].should.eql new Failure("2019-08-16T23:03:10+0000 Kurzschluss Aussentemperatursensor (10)")
