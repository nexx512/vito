should = require("should")
CommandMapper = require("../../../../../../dist/app/adapters/passive/vcontrol/commandmapper").default

describe "A CommandMapper object", =>

  beforeEach =>
    @commandMapper = new CommandMapper()


  describe "asking for a mapped key", =>
    mappedCommand = null

    beforeEach =>
      mappedCommand = @commandMapper.commandFor("getTimerM1Mo")

    it "should delived the mapped command", =>
      mappedCommand.should.equal "getTimerMo"

  describe "asking for a nonexistent key", =>
    mappedCommand = null

    beforeEach =>
      mappedCommand = @commandMapper.commandFor("UnknownKey")

    it "should delived the original value command", =>
      mappedCommand.should.equal "UnknownKey"
