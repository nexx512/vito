import {Express} from "express"
import OverviewService from "../../app/services/overviewservice"
import VControlRepo from "../../app/repo/vcontrol/vcontrolrepo"
import VControlClient from "vcontrol"
import Temperature from "../../app/models/temperature"
import ValidationError from "../../app/models/validationerror"

export default (app: Express) => {

  app.get("/", async (_req, res, next) => {
    const overviewService = new OverviewService(new VControlRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })));

    try {
      const generalHeatingStatus = await overviewService.getGeneralHeatingStatus();
      res.render('home/home', {model: generalHeatingStatus});
    } catch (e) {
      next(e);
    }

  });

  app.put("/roomtemperatures", async (req, res, next) => {
    const overviewService = new OverviewService(new VControlRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })));

    const roomTemperature = new Temperature(req.body.roomTemperature);
    const reducedRoomTemperature = new Temperature(req.body.reducedRoomTemperature);

    try {
      await overviewService.setRoomTemperatures(roomTemperature, reducedRoomTemperature);
    } catch (e) {
      if (e.inner && e.inner.items.length > 0) {
        req.flash("error", e.inner.items.map((ve: ValidationError) => ve.message));
      } else {
        req.flash("error", e.message);
      }
    }
    res.redirect("/");
  });

  app.put("/heaterstats", async (req, res, next) => {
    req.flash("error", "Function not yet implemented");
    res.redirect("/");
  });

}
