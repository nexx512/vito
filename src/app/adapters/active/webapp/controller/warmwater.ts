import {Express} from "express";
import WarmWaterService from "../../../../domain/services/warmwaterservice";
import WarmWaterRepo from "../../../../adapters/passive/vcontrol/warmwaterrepo";
import VControlClient from "vcontrol";
import WeekCycleTimesConverter from "../converter/weekcycletimesconverter";

export default (app: Express) => {

  app.get("/warmwater/heating/times", async (_req, res, next) => {
    const warmWaterService = new WarmWaterService(new WarmWaterRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })));

    try {
      let heatingTimes = await warmWaterService.getHeatingTimes();
      let circulationTimes = await warmWaterService.getCirculationTimes();

      let model = {
        heatingTimes: WeekCycleTimesConverter.toWeekCycleTimesResponseDto(heatingTimes),
        circulationTimes: WeekCycleTimesConverter.toWeekCycleTimesResponseDto(circulationTimes),
        activeSection: "heatingTimes"
      }

      res.render("warmwater/warmwater", {model});
    } catch (e) {
      next(e);
    }
  })

  app.put("/warmwater/heating/times", async (req, res) => {
    const warmWaterService = new WarmWaterService(new WarmWaterRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })));

    let heatingTimes = WeekCycleTimesConverter.toWeekCycleTimesModel(req.body.times);
    try {
      await warmWaterService.setHeatingTimes(heatingTimes);
      res.redirect("/warmwater/heating/times");
    } catch (e) {
      res.locals.notifications.addError(e.message);
      let circulationTimes = await warmWaterService.getCirculationTimes();

      let model = {
        heatingTimes: WeekCycleTimesConverter.toWeekCycleTimesResponseDto(heatingTimes),
        circulationTimes: WeekCycleTimesConverter.toWeekCycleTimesResponseDto(circulationTimes),
        activeSction: "heatingTimes"
      }

      res.render("warmwater/warmwater", {model});
    }
  })

  app.get("/warmwater/circulation/times", async (_req, res, next) => {
    const warmWaterService = new WarmWaterService(new WarmWaterRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })));

    try {
      let heatingTimes = await warmWaterService.getHeatingTimes();
      let circulationTimes = await warmWaterService.getCirculationTimes();

      let model = {
        heatingTimes: WeekCycleTimesConverter.toWeekCycleTimesResponseDto(heatingTimes),
        circulationTimes: WeekCycleTimesConverter.toWeekCycleTimesResponseDto(circulationTimes),
        activeSection: "circulationTimes"
      }

      res.render("warmwater/warmwater", {model});
    } catch (e) {
      next(e);
    }
  })

  app.put("/warmwater/circulation/times", async (req, res) => {
    const warmWaterService = new WarmWaterService(new WarmWaterRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })));

    let circulationTimes = WeekCycleTimesConverter.toWeekCycleTimesModel(req.body.times);
    try {
      await warmWaterService.setCirculationTimes(circulationTimes);
      res.redirect("/warmwater/circulation/times");
    } catch (e) {
      res.locals.notifications.addError(e.message);
      let heatingTimes = await warmWaterService.getHeatingTimes();

      let model = {
        heatingTimes: WeekCycleTimesConverter.toWeekCycleTimesResponseDto(heatingTimes),
        circulationTimes: WeekCycleTimesConverter.toWeekCycleTimesResponseDto(circulationTimes),
        activeSection: "circulationTimes"
      }

      res.render("warmwater/warmwater", {model});
    }
  })

}
