interface LocaleData {
  [index: string]: {
    [index: string]: string
  }
}

export default class Locales {
  constructor(private locales: LocaleData) {
  }

  hasLocale(locale: string): boolean {
    return locale in this.locales
  }

  translate(locale: string, key: string, fallback: string) {
    if (this.locales[locale] && this.locales[locale][key]) {
      return this.locales[locale][key]
    } else {
      if ((fallback !== null) && (fallback !== undefined)) {
        return fallback
      } else {
        return "[" + key + "]"
      }
    }
  }
}
