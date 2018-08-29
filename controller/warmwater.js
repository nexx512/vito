const VControlClient = require('../repo/vcontrolclient')
const VControlRepo = require('../repo/vcontrolrepo')
const WarmWaterService = require('../services/warmwaterservice')
const WeekTimerTimes = require('../models/weektimertimes')

module.exports = function(app) {

  app.get('/warmwater/heating', async (req, res) => {
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient()))
    let heatingTimes = await warmWaterService.getHeatingTimes()
    res.render('warmwater/heating', {model: heatingTimes})
  })

  app.get('/warmwater/circulation', async (req, res) => {
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient()))
    let circulationTimes = await warmWaterService.getCirculationTimes()
    res.render('warmwater/circulation', {model: circulationTimes})
  })

  app.put('/warmwater/circulation', async (req, res) => {
    let circulationTimes = new WeekTimerTimes(
      new TimerTimes(req.body.friday),
      new TimerTimes()
    )
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient()))
    await warmWaterService.setCirculationTimes(circulationTimes)
    res.redirect('/warmwater/circulation')
  })

}
