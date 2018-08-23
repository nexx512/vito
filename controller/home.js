const VitoDB = require('../repo/vitodb')

module.exports = function(app) {

  app.get('/', async (req, res) => {
    /*vitoDB = new VitoDB()
    data = await vitoDB.getData()*/
    res.render('home', {model: null})
  })

}
