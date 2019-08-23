import {Express} from "express"
import OverviewService from "../../../../domain/services/overviewservice"
import DashboardsRepo from "../../../../adapters/passive/vcontrol/dashboardsrepo"
import VControlClient from "vcontrol"
import Temperature from "../../../../domain/models/temperature"
import ValidationError from "../../../../domain/models/validationerror"

export default (app: Express) => {

  app.get("/overview", async (_req, res, next) => {
    const overviewService = new OverviewService(new DashboardsRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })));

    try {
      const dashboardInfos = await overviewService.getDashboardInfos();
      res.render('overview/overview', {model: dashboardInfos});
    } catch (e) {
      next(e);
    }

  });

  app.put("/overview/roomtemperatures", async (req, res) => {
    const overviewService = new OverviewService(new DashboardsRepo(new VControlClient({
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
    res.redirect("/overview");
  });

  app.put("/overview/heaterinfos", async (req, res) => {
    req.flash("error", "Function not yet implemented");
    res.redirect("/");
  });

}
