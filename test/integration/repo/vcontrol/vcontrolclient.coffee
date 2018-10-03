should = require("should")
global.Config = require("../../../../config/config.json")

MockVControlD = require("../../../support/mockvcontrold")
VControlClient = require("../../../../repo/vcontrol/vcontrolclient")

describe "The VControlClient", =>

  before =>
    @vControlClient = new VControlClient()

  describe "without a server", =>
    it "should throw an error when connecting", =>
      await @vControlClient.connect().should.rejectedWith("connect ECONNREFUSED 127.0.0.1:3002")

  describe "with a server", =>
    before =>
      @mockVControlD = new MockVControlD()
      await @mockVControlD.start()

    beforeEach =>
      @mockVControlD.resetCommandLog()

    after =>
      await @mockVControlD.stop()

    it "should throw an error if the connection is not opened before getting data", =>
      await @vControlClient.getData("getTempA").should.rejectedWith("This socket is closed")

    it "should send the quit command when closing the connection", =>
      await @vControlClient.connect()
      await @vControlClient.close()

      @mockVControlD.commandLog.should.eql(["quit"])

    describe "and proper opening an closing connection", =>
      beforeEach =>
        @mockVControlD.resetCommandLog()
        await @vControlClient.connect()

      afterEach =>
        await @vControlClient.close()

      it "should open a connection, get data and close the connection", =>
        data = await @vControlClient.getData("getTempA")

        data.should.equal("60.00000\n")

        @mockVControlD.commandLog.should.eql(["getTempA"])

      it "should open a connection, set data and close the connection", =>
        await @vControlClient.getData("setTimerZirkuSo")

        @mockVControlD.commandLog.should.eql(["setTimerZirkuSo"])

      it "should throw an error if an error occurs when executing the command", =>
        await @vControlClient.getData("unknownCommand").should.rejectedWith(new Error("Unable to perform command 'unknownCommand': ERR: unknown command\n"))

        @mockVControlD.commandLog.should.eql(["unknownCommand"])
