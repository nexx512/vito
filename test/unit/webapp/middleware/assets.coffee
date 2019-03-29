should = require("should")
rewire = require("rewire")
asyncWrapper = require("../../../support/asyncwrapper")
middlewareFactory = rewire("../../../../dist/webapp/middleware/assets")

describe "The assets middleware", =>
  res =
    locals: {}

  it "not in production mode should give the development asset path", =>
    middlewareFactory.__set__("process", {
      env:
        NODE_ENV: "development"
    })
    middleware = middlewareFactory.default()

    await asyncWrapper((next) => middleware(null, res, next))

    res.locals.assets("styles/styles.css").should.equal("/assets/styles/styles.css")

  it "in production mode should give the revisioned asset path", =>
    middlewareFactory.__set__("process", {
      env:
        NODE_ENV: "production"
    })
    revManifest = {
      "styles/styles.css": "styles/styles.a8d4cb14.css"
    }
    middlewareFactory.__set__("rev", revManifest)
    middleware = middlewareFactory.default()

    await asyncWrapper((next) => middleware(null, res, next))

    res.locals.assets("styles/styles.css").should.equal("/assets/styles/styles.a8d4cb14.css")
