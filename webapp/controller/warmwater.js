const WarmWaterService = require("../../services/warmwaterservice")
const VControlRepo = require("../../repo/vcontrol/vcontrolrepo")
const VControlClient = require("../../repo/vcontrol/vcontrolclient")
const WeekTimerTimes = require("../../models/weektimertimes")
const TimerTimes = require("../../models/timertimes")
const TimerTime = require("../../models/timertime")
const Time = require("../../models/time")

module.exports = function(app) {

  app.get("/warmwater/heating", async (req, res) => {
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient()))
    let heatingTimes = await warmWaterService.getHeatingTimes()
    res.render("warmwater/heating", {model: {times: heatingTimes}})
  })

  app.get("/warmwater/circulation", async (req, res) => {
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient()))
    let circulationTimes = await warmWaterService.getCirculationTimes()
    res.render("warmwater/circulation", {model: {times: circulationTimes}})
  })

  app.put("/warmwater/circulation", async (req, res) => {
    let times = req.body.times
    let circulationTimes = new WeekTimerTimes()
    for (var day in times) {
      let dayTimes = new TimerTimes()
      times[day].forEach((time) => {
        dayTimes.add(new TimerTime(new Time(time.on), new Time(time.off)))
      })
      circulationTimes.set(day, dayTimes)
    }

    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient()))
    try {
      await warmWaterService.setCirculationTimes(circulationTimes)
    } catch (e) {
      return res.render("warmwater/circulation", {model: {times: circulationTimes}})
    }
    res.redirect("/warmwater/circulation")
  })

}
