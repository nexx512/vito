Locales = require("../utils/locales")
const locales = new Locales()

module.exports = () => {
  return (req, res, next) => {
    res.locals.t = (key) => {
      return locales.translate('de', key)
    }
    next()
  }
}
