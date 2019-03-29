should = require("should")
Locales = require("../../../../dist/webapp/utils/locales").default

describe "A Locales object", =>
  before =>
    localeData =
      de:
        "overview": "Übersicht"

    @locales = new Locales(localeData)

  it "can be queried to have translations for a locale", =>
    @locales.hasLocale("de").should.true()
    @locales.hasLocale("en").should.false()

  it "should return the key language is not defined", =>
    @locales.translate("", "unavailablekey").should.equal("[unavailablekey]")

  it "should return the key if not found in language", =>
    @locales.translate("de", "unavailablekey").should.equal("[unavailablekey]")

  it "should return the fallback if not found in language", =>
    @locales.translate("de", "unavailablekey", "fallback").should.equal("fallback")

  it "should translate to german", =>
    @locales.translate("de", "overview").should.equal("Übersicht")
