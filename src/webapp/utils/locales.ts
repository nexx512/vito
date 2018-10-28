const locales: any = {
  de: require("../i18n/de.json")
}

export default class Locales {
  translate(locale: string, key: string, fallback: string) {
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
