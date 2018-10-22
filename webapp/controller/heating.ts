import {Express} from "express"

export default (app: Express) => {

  app.get('/heating/times', (_req, res) => {
    res.render('heating/times', {model: null})
  })

}
