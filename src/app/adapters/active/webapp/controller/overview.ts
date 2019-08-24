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
      let model = {
        homeTemperatures: {
          frostIndicator: dashboardInfos.frostIndicator,
          outsideTemp: dashboardInfos.outsideTemp,
          roomTemp: dashboardInfos.roomTemp,
          reducedRoomTemp: dashboardInfos.reducedRoomTemp
        },
        heaterInfos: {
          systemTime: dashboardInfos.systemTime,
          heatingMode: dashboardInfos.heatingMode,
          burnerTemp: dashboardInfos.burnerTemp,
          waterTemp: dashboardInfos.waterTemp,
          waterTargetTemp: dashboardInfos.waterTargetTemp,
          failureStatus: dashboardInfos.failureStatus,
          burnerStatus: dashboardInfos.burnerStatus,
          warmWaterStatus: dashboardInfos.warmWaterStatus,
          heatingCirculation: dashboardInfos.heatingCirculation
        }
      }
      res.render('overview/overview', {model: model});
    } catch (e) {
      next(e);
    }

  });

  app.put("/overview/roomtemperature", async (req, res) => {
    const overviewService = new OverviewService(new DashboardsRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })));

    try {
      await overviewService.setRoomTemperature(new Temperature(req.body.roomTemperature));
    } catch (e) {
      if (e.inner && e.inner.items.length > 0) {
        req.flash("error", e.inner.items.map((ve: ValidationError) => ve.message));
      } else {
        req.flash("error", e.message);
      }
    }
    res.redirect("/overview");
  });

  app.put("/overview/reducedroomtemperature", async (req, res) => {
    const overviewService = new OverviewService(new DashboardsRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })));

    try {
      await overviewService.setReducedRoomTemperature(new Temperature(req.body.reducedRoomTemperature));
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
