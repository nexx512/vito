const VControlClient = require('../repo/vcontrolclient')
const VControlRepo = require('../repo/vcontrolrepo')
const TimerTimes = require('../domain/timertimes')

module.exports = function(app) {

  app.get('/warmwater/heating', async (req, res) => {
    const vControlRepo = new VControlRepo(new VControlClient())
    let heatingTimes = new TimerTimes()
    warmWaterTimes.setTimes(await vControlRepo.getWarmWaterHeatingTimes())
    res.render('warmwater/heating', {model: heatingTimes})
  })

  app.get('/warmwater/circulation', async (req, res) => {
    const vControlRepo = new VControlRepo(new VControlClient())
    let circulationTimes = new TimerTimes()
    circulationTimes.setTimes(await vControlRepo.getWarmWaterCirculationTimes())
    res.render('warmwater/circulation', {model: circulationTimes})
  })

  app.put('/warmwater/circulation', async (req, res) => {
    console.log(req.body)
    res.redirect('/warmwater/circulation')
  })

}
