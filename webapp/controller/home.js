module.exports = function(app) {

  app.get('/', async (req, res) => {
    res.render('home', {model: null})
  })

}
