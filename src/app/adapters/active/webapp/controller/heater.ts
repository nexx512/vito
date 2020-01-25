import {Express} from "express"
import HeaterService from "../../../../domain/services/heaterservice";
import HeaterRepo from "../../../../adapters/passive/vcontrol/heaterrepo";
import VControlClient from "vcontrol";
import WeekCycleTimesConverter from "../converter/weekcycletimesconverter";

export default (app: Express) => {

  app.get('/heater/heating/times', async (_req, res, next) => {
    const heaterService = new HeaterService(new HeaterRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })));

    try {
      let heatingTimes = await heaterService.getHeatingTimes();

      let model = {
        heatingTimes: WeekCycleTimesConverter.toWeekCycleTimesResponseDto(heatingTimes),
        activeSection: "heatingTimes"
      }

      res.render('heater/heater', {model})
    } catch (e) {
      next(e);
    }
  })

  app.put("/heater/heating/times", async (req, res) => {
    const heaterService = new HeaterService(new HeaterRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })));

    let heatingTimes = WeekCycleTimesConverter.toWeekCycleTimesModel(req.body.times);
    try {
      await heaterService.setHeatingTimes(heatingTimes);
      res.redirect("/heater/heating/times");
    } catch (e) {
      res.locals.notifications.addError(e.message);

      let model = {
        heatingTimes: WeekCycleTimesConverter.toWeekCycleTimesResponseDto(heatingTimes),
        activeSction: "heatingTimes"
      }

      res.render("heater/heater", {model});
    }
  })

}
