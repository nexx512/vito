import {Express} from "express"

export default (app: Express) => {

  app.get("/", (_req, res) => {
    res.redirect("/overview");
  });

}
