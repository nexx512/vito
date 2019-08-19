import {Express} from "express"
import OverviewService from "../../app/services/overviewservice"
import VControlRepo from "../../app/repo/vcontrol/vcontrolrepo"
import VControlClient from "vcontrol"

export default (app: Express) => {

  app.get('/', async (_req, res, next) => {
    const overviewService = new OverviewService(new VControlRepo(new VControlClient({
      host: global.Config.vcontrold.host,
      port: global.Config.vcontrold.port
    })))

    try {
      const generalHeatingStatus = await overviewService.getGeneralHeatingStatus()
      res.render('home/home', {model: generalHeatingStatus})
    } catch (e) {
      next(e)
    }

  })

}
