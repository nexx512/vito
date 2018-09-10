module.exports = function(app) {

  app.get('/heating/times', (req, res) => {
    res.render('heating/times', {model: null})
  })

}
