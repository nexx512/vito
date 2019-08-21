require("should")
Notifications = require("../../../../dist/webapp/models/notifications").default

describe "A Notifications model", =>

  it "should have no errors and successes initially", =>
    notifications = new Notifications()

    notifications.errors.length.should.equal 0
    notifications.successes.length.should.equal 0

  it "should have errors and successes if set on creation", =>
    notifications = new Notifications(["error"], ["success"])

    notifications.errors.length.should.equal 1
    notifications.errors[0].should.equal "error"
    notifications.successes.length.should.equal 1
    notifications.successes[0].should.equal "success"

  it "should have errors and successes if set separately", =>
    notifications = new Notifications()

    notifications.addError("error")
    notifications.addSuccess("success")

    notifications.errors.length.should.equal 1
    notifications.errors[0].should.equal "error"
    notifications.successes.length.should.equal 1
    notifications.successes[0].should.equal "success"
