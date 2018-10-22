import {Express} from "express"

export default (app: Express) => {

  app.get('/', async (_req, res) => {
    res.render('home', {model: null})
  })

}
