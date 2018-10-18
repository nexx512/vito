const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const locale = require("./middleware/locale")
const assets = require("./middleware/assets")
const staticAssets = require("./staticassets")

const app = express()

if (process.env.NODE_ENV == "production") {
  // Use precompiled pug files in production mode to speed up first start
  let pug = require("pug-runtime")
  app.engine("js", (filePath, options, callback) => {
    let template = require(filePath)
    let html = template(options, pug)
    callback(null, html)
  })
  app.set("view engine", "js");
  app.set("views", path.join(__dirname, "dist/views"));
} else {
  // Use pug files in development mode for views
  app.set("view engine", "pug")
  app.set("views", path.join(__dirname, "views/pages"))
  app.locals.basedir = path.join(__dirname, "views/components")
}

app.use("/assets", staticAssets())

app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === "object" && "_method" in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use(locale())
app.use(assets())

require("./controller/home")(app)
require("./controller/heating")(app)
require("./controller/warmwater")(app)

const server = app.listen(Config.port, () => {
  console.log("Server started on port " + server.address().port + " in " + (process.env.NODE_ENV == "production" ? "production" : "development") + " mode")
})
