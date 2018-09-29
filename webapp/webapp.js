const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const locale = require("./middleware/locale")
const assets = require("./middleware/assets")
const staticAssets = require("./staticassets")

const app = express()

app.set("views", path.join(__dirname, "views/pages"))
app.set("view engine", "pug")
app.locals.basedir = path.join(__dirname, "views/components")

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

const server = app.listen(process.env.NODE_ENV == "production" ? 80 : 3001, () => {
  console.log("Server started on port " + server.address().port)
})
