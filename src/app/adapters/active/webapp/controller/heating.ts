import {Express} from "express"

export default (app: Express) => {

  app.get('/heating/times', (_req, res) => {
    res.locals.notifications.addError("Not yet implemented");
    res.render('heating/times', {model: null})
  })

}
