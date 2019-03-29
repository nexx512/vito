should = require("should")
rewire = require("rewire")
asyncWrapper = require("../../../support/asyncwrapper")
middlewareFactory = rewire("../../../../dist/webapp/middleware/locale")

describe "The locale middleware", =>
  req =
    headers: {}
  res =
    locals: {}

  before =>
    localeData =
      de:
        overview: "Übersicht"
      en_US:
        overview: "Overview"

    middlewareFactory.__set__("localeData", localeData)
    @middleware = middlewareFactory.default()

  it "without accept header should use the default language", =>
    await asyncWrapper((next) => @middleware(req, res, next))

    res.locals.locale.should.equal("de")
    res.locals.t("overview").should.equal("Übersicht")

  it "with wildcard accept header should use the default language", =>
    req.headers["accept-language"] = "*"

    await asyncWrapper((next) => @middleware(req, res, next))

    res.locals.locale.should.equal("de")
    res.locals.t("overview").should.equal("Übersicht")

  it "with polish, english US and de accept header should use the first language if available", =>
    req.headers["accept-language"] = "pl, en_US;q=0.9, en;q=0.7, de;q=0.5"

    await asyncWrapper((next) => @middleware(req, res, next))

    res.locals.locale.should.equal("en_US")
    res.locals.t("overview").should.equal("Overview")
