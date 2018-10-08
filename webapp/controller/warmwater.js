const WarmWaterService = require("../../app/services/warmwaterservice")
const VControlRepo = require("../../app/repo/vcontrol/vcontrolrepo")
const VControlClient = require("../../app/repo/vcontrol/vcontrolclient")
const WeekCycleTimesConverter = require("../converter/weekcycletimesconverter")

module.exports = function(app) {

  app.get("/warmwater/heating", async (req, res, next) => {
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient()))
    try {
      let heatingTimes = await warmWaterService.getHeatingTimes()
      res.render("warmwater/heating", {model: heatingTimes})
    } catch (e) {
      next(e)
    }
  })

  app.get("/warmwater/circulation", async (req, res, next) => {
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient()))
    try {
      let circulationTimes = await warmWaterService.getCirculationTimes()
      let times = WeekCycleTimesConverter.toWeekCycleTimesResponseDto(circulationTimes)
      res.render("warmwater/circulation", {model: times})
    } catch (e) {
      next(e)
    }
  })

  app.put("/warmwater/circulation", async (req, res) => {
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient()))

    let circulationTimes = WeekCycleTimesConverter.toWeekCycleTimesModel(req.body.times)
    try {
      await warmWaterService.setCirculationTimes(circulationTimes)
      res.redirect("/warmwater/circulation")
    } catch (e) {
      res.render("warmwater/circulation", {model: WeekCycleTimesConverter.toWeekCycleTimesResponseDto(circulationTimes), errors: [e.message]})
    }

  })

}
