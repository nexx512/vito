const VControlClient = require('../repo/vcontrolclient')
const VControlRepo = require('../repo/vcontrolrepo')
const WarmWaterTimes = require('../domain/warmwatertimes')

module.exports = function(app) {

  app.get('/warmwater/times', async (req, res) => {
    const vcontrolRepo = new VControlRepo(new VControlClient())
    let warmWaterTimes = new WarmWaterTimes()
    warmWaterTimes.setTimes(await vcontrolRepo.getWarmWaterTimes())
    res.render('warmwater/times', {model: warmWaterTimes})
  })

  app.get('/warmwater/circulation', (req, res) => {
    res.render('warmwater/circulation', {model: null})
  })

}
