import {RequestHandler} from "express"
import Locales from "../utils/locales"
const locales = new Locales()

export default (): RequestHandler => {
  return (req, res, next) => {
    res.locals.locale = (req.headers["accept-language"] || "de").toString().split(",")[0];
    if (res.locals.locale === "*") {
      res.locals.locale = "de";
    }

    res.locals.t = (key: string, fallback: string) => {
      return locales.translate(res.locals.locale.substring(0, 2), key, fallback)
    }
    next()
  }
}
