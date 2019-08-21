should = require("should")
rewire = require("rewire")
notificationsMiddleware = require("../../../../dist/webapp/middleware/notifications").default
Notifications = require("../../../../dist/webapp/models/notifications").default

describe "The notifications middleware", =>

  before =>
    @middleware = notificationsMiddleware()

  it "should create an empty notifications object if there are no notification in the flash", =>
    req =
      flash: () ->
    res =
      locals: {}
    @middleware(req, res, () => {})

    res.locals.notifications.should.eql new Notifications()

  it "should read messages from the flash and insert them into the notifications", =>
    flashContent =
      "error": ["error1", "error2"]
      "success": ["success1", "success2"]
    req =
      flash: (flash) =>
        flashContent[flash]
    res =
      locals: {}

    @middleware(req, res, () => {})

    notifications = new Notifications()
    notifications.errors = ["error1", "error2"]
    notifications.successes = ["success1", "success2"]
    res.locals.notifications.should.eql notifications
