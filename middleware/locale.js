Locales = require('../utils/locales')
const locales = new Locales()

module.exports = function(app) {

  app.use(function(req, res, next){
    res.locals.t = function(key) {
      return locales.translate('de', key);
    }
    next();
  })

}
