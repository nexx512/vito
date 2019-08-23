should = require("should")
sinon = require("sinon")
VControlClient = require("vcontrol")
VControlRepo = require("../../../../../../dist/app/adapters/passive/vcontrol/vcontrolrepo").default

class TestRepo extends VControlRepo
  test: ()  =>
    this.wrapConnection (client) =>


describe "A VControlRepo object", =>

  it "should open and close the connection when quering data", =>
    @vControlClient = new VControlClient({})
    @vControlClientMock = sinon.mock(@vControlClient)
    @vControlClientMock.expects("connect").once()
    @vControlClientMock.expects("close").once()
    @vControlRepo = new TestRepo(@vControlClient)

    await @vControlRepo.test()

    @vControlClientMock.verify()
