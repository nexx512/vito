should = require("should")
const MockVControlD = require("../../../support/mockvcontrold")
const VControlClient = require("../../../../repo/vcontrol/vcontrolclient")

describe("The VControlClient", () => {

  let vControlClient

  before(() => {
    vControlClient = new VControlClient()
  })

  describe("without a server", () => {
    it("should throw an error when connecting", async () => {
      await vControlClient.connect().should.rejectedWith("connect ECONNREFUSED 127.0.0.1:3002")
    })
  })

  describe("with a server", () => {
    let mockVControlD

    before(async () => {
      mockVControlD = new MockVControlD()
      await mockVControlD.start()
    })

    beforeEach(() => {
      mockVControlD.resetCommandLog()
    })

    after(async () => {
      await mockVControlD.stop()
    })

    it("should throw an error if the connection is not opened before getting data", async () => {
      await vControlClient.getData("getTempA").should.rejectedWith("This socket is closed")
    })

    it("should send the quit command when closing the connection", async () => {
      await vControlClient.connect()
      await vControlClient.close()

      mockVControlD.commandLog.should.eql(["quit"])
    })

    describe("and proper opening an closing connection", () => {
      beforeEach(async () => {
        mockVControlD.resetCommandLog()
        await vControlClient.connect()
      })

      afterEach(async () => {
        await vControlClient.close()
      })

      it("should open a connection, get data and close the connection", async () => {
        data = await vControlClient.getData("getTempA")

        data.should.equal("60.00000\n")
        mockVControlD.commandLog.should.eql(["getTempA"])
      })

      it("should open a connection, set data and close the connection", async () => {
        await vControlClient.getData("setTimerZirkuSo")

        mockVControlD.commandLog.should.eql(["setTimerZirkuSo"])
      })

      it("should throw an error if an error occurs when executing the command", async () => {
        await vControlClient.getData("unknownCommand").should.rejectedWith(new Error("Unable to perform command 'unknownCommand': ERR: unknown command\n"))

        mockVControlD.commandLog.should.eql(["unknownCommand"])
      })
    })
  })
})
