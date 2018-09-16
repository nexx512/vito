const WarmWaterService = require("../../services/warmwaterservice")
const VControlRepo = require("../../repo/vcontrol/vcontrolrepo")
const VControlClient = require("../../repo/vcontrol/vcontrolclient")
const WeekTimerTimes = require("../../models/weektimertimes")
const TimerTimes = require("../../models/timertimes")
const TimerTime = require("../../models/timertime")
const Time = require("../../models/time")
const ViewModel = require("../models/viewmodel.js")

module.exports = function(app) {

  app.get("/warmwater/heating", async (req, res, next) => {
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient()))
    try {
      let heatingTimes = await warmWaterService.getHeatingTimes()
      res.render("warmwater/heating", new ViewModel(heatingTimes))
    } catch (e) {
      next(e)
    }
  })

  app.get("/warmwater/circulation", async (req, res, next) => {
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient()))
    try {
      let circulationTimes = await warmWaterService.getCirculationTimes()
      let times = weekTimerTimesToWeekTimerTimesDto(circulationTimes)
      res.render("warmwater/circulation", new ViewModel(times))
    } catch (e) {
      next(e)
    }
  })

  app.put("/warmwater/circulation", async (req, res) => {
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient()))

    let circulationTimes = weekTimerTimesDtoToWeekTimerTimes(req.body.times)
    try {
      await warmWaterService.setCirculationTimes(circulationTimes)
      res.redirect("/warmwater/circulation")
    } catch (e) {
      res.render("warmwater/circulation", new ViewModel(weekTimerTimesToWeekTimerTimesDto(circulationTimes), e))
    }

  })

}

function weekTimerTimesDtoToWeekTimerTimes(weekTimerTimesDto) {
  let weekTimerTimes = new WeekTimerTimes()
  for (let day in weekTimerTimesDto) {
    let dayTimes = new TimerTimes()
    weekTimerTimesDto[day]
      .filter((time) => {
        return time.on && time.off
      })
      .forEach((time) => {
        dayTimes.add(new TimerTime(new Time(time.on), new Time(time.off)))
      })
    weekTimerTimes.set(day, dayTimes)
  }
  return weekTimerTimes
}

function weekTimerTimesToWeekTimerTimesDto(weekTimerTimes) {
  let weekTimerTimesDto = {}
  for (let day in weekTimerTimes.days) {
    weekTimerTimesDto[day] = new Array(4)
    weekTimerTimes.days[day].times.forEach((time, index) => {
      weekTimerTimesDto[day][index] = {
        on: {
          time: time.on.time,
          errors: time.on.errors.items.map((e) => e.message)
        },
        off: {
          time: time.off.time,
          errors: time.off.errors.items.map((e) => e.message)
        }
      }
    })
  }
  return weekTimerTimesDto
}
