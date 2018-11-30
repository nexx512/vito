import {Express} from "express"
import WarmWaterService from "../../app/services/warmwaterservice"
import VControlRepo from "../../app/repo/vcontrol/vcontrolrepo"
import VControlClient from "vcontrol"
import WeekCycleTimesConverter from "../converter/weekcycletimesconverter"

export default (app: Express) => {

  app.get("/warmwater/heating", async (_req, res, next) => {
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })))

    try {
      let heatingTimes = await warmWaterService.getHeatingTimes()
      let times = WeekCycleTimesConverter.toWeekCycleTimesResponseDto(heatingTimes)
      res.render("warmwater/heating", {model: times})
    } catch (e) {
      next(e)
    }
  })

  app.put("/warmwater/heating/times", async (req, res) => {
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })))

    let circulationTimes = WeekCycleTimesConverter.toWeekCycleTimesModel(req.body.times)
    try {
      await warmWaterService.setHeatingTimes(circulationTimes)
      res.redirect("/warmwater/heating")
    } catch (e) {
      res.render("warmwater/heating", {model: WeekCycleTimesConverter.toWeekCycleTimesResponseDto(circulationTimes), errors: [e.message]})
    }

  })

  app.get("/warmwater/circulation", async (_req, res, next) => {
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })))

    try {
      let circulationTimes = await warmWaterService.getCirculationTimes()
      let times = WeekCycleTimesConverter.toWeekCycleTimesResponseDto(circulationTimes)
      res.render("warmwater/circulation", {model: times})
    } catch (e) {
      next(e)
    }
  })

  app.put("/warmwater/circulation/times", async (req, res) => {
    const warmWaterService = new WarmWaterService(new VControlRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })))

    let circulationTimes = WeekCycleTimesConverter.toWeekCycleTimesModel(req.body.times)
    try {
      await warmWaterService.setCirculationTimes(circulationTimes)
      res.redirect("/warmwater/circulation")
    } catch (e) {
      res.render("warmwater/circulation", {model: WeekCycleTimesConverter.toWeekCycleTimesResponseDto(circulationTimes), errors: [e.message]})
    }

  })

}
