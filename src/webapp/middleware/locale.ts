import {RequestHandler} from "express"
import Locales from "../utils/locales"

const localeData: any = {
  de: require("../i18n/de.json")
}

export default (): RequestHandler => {
  const locales = new Locales(localeData)

  return (req, res, next) => {
    const acceptedLocales = (req.headers["accept-language"] || "de").toString()
      .split(",")
      .map((weightedLocale) => weightedLocale.split(";")[0].trim());

    for (let acceptedLocale of acceptedLocales) {
      if (locales.hasLocale(acceptedLocale)) {
        res.locals.locale = acceptedLocale;
        break;
      }
    }
    res.locals.locale = res.locals.locale || "de";

    res.locals.t = (key: string, fallback: string) => {
      return locales.translate(res.locals.locale, key, fallback)
    }
    next()
  }
}
