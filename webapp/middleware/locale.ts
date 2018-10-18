Locales = require("../utils/locales")
const locales = new Locales()

module.exports = () => {
  return (req, res, next) => {
    res.locals.t = (key, fallback) => {
      return locales.translate('de', key, fallback)
    }
    next()
  }
}
