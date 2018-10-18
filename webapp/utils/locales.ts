const locales = {
  de: require("../i18n/de.json")
}

module.exports = class Translations {
  translate(locale, key, fallback) {
    if (locales[locale][key]) {
      return locales[locale][key]
    } else {
      if ((fallback !== null) && (fallback !== undefined)) {
        return fallback
      } else {
        return "[" + key + "]"
      }
    }
  }
}
