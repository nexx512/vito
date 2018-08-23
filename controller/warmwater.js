module.exports = function(app) {

  app.get('/warmwater/circulation', (req, res) => {
    res.render('warmwater/circulation', {model: null})
  })

}
