import express from "express"
import path from "path"
import bodyParser from "body-parser"
import methodOverride from "method-override"
import locale from "./middleware/locale"
import assets from "./middleware/assets"
import staticAssets from "./staticassets"

const app = express()

if (process.env.NODE_ENV == "production") {
  // Use precompiled pug files in production mode to speed up first start
  let pug = require("pug-runtime")
  app.engine("js", (filePath: string, options: any, callback: Function) => {
    let template = require(filePath)
    let html = template(options, pug)
    callback(null, html)
  })
  app.set("view engine", "js");
  app.set("views", path.join(__dirname, "views"));
} else {
  // Use pug files in development mode for views
  app.set("view engine", "pug")
  app.set("views", "src/webapp/views/pages")
  app.locals.basedir = "src/webapp/views/components"
}

app.use("/assets", staticAssets())

app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride((req) => {
  if (req.body && typeof req.body === "object" && "_method" in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use(locale())
app.use(assets())

import home from "./controller/home"
import heating from "./controller/heating"
import warmwater from "./controller/warmwater"

home(app)
heating(app)
warmwater(app)

const server = app.listen(global.Config.port, () => {
  console.log("Server started on port " + global.Config.port + " in " + (process.env.NODE_ENV == "production" ? "production" : "development") + " mode")
})
