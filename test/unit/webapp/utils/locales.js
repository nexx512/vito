should = require("should")
const Locales = require("../../../../webapp/utils/locales")

describe("A Locales object", () => {

  it("should return the key if not found in language", () => {
    locales = new Locales()
    locales.translate("de", "unavailablekey").should.equal("[unavailablekey]")
  })

  it("should return the fallback if not found in language", () => {
    locales = new Locales()
    locales.translate("de", "unavailablekey", "fallback").should.equal("fallback")
  })

  it("should translate to german", () => {
    locales = new Locales()
    locales.translate("de", "overview").should.equal("Übersicht")
  })

})
