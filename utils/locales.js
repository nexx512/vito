const locales = {
  de: require("../i18n/de.json")
}

module.exports = class Translations {
  translate(locale, key) {
    return locales[locale][key]
  }
}
