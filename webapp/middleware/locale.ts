import {RequestHandler} from "express"
import Locales from "../utils/locales"
const locales = new Locales()

export default (): RequestHandler => {
  return (_req, res, next) => {
    res.locals.t = (key: string, fallback: string) => {
      return locales.translate('de', key, fallback)
    }
    next()
  }
}
