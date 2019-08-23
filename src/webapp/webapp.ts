import path from "path";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import flash from "connect-flash";
import locale from "./middleware/locale";
import assets from "./middleware/assets";
import notifications from "./middleware/notifications";
import staticAssets from "./staticassets";

const app = express();

if (process.env.NODE_ENV == "production") {
  // Use precompiled pug files in production mode to speed up first start
  let pug = require("pug-runtime");
  app.engine("js", (filePath: string, options: any, callback: Function) => {
    let template = require(filePath);
    let html = template(options, pug);
    callback(null, html);
  });
  app.set("view engine", "js");
  app.set("views", path.join(__dirname, "views"));
} else {
  // Use pug files in development mode for views
  app.set("view engine", "pug");
  app.set("views", "src/webapp/views/pages");
  app.locals.basedir = "src/webapp/views/components";
}

app.use("/assets", staticAssets());

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride((req) => {
  if (req.body && typeof req.body === "object" && "_method" in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(locale());
app.use(assets());

app.use(session({
  cookie: {
    maxAge: 60000
  },
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(notifications());

import home from "../app/adapters/active/webapp/controller/home";
import overview from "../app/adapters/active/webapp/controller/overview";
import heating from "../app/adapters/active/webapp/controller/heating";
import warmwater from "../app/adapters/active/webapp/controller/warmwater";

home(app);
overview(app);
heating(app);
warmwater(app);

app.listen(global.Config.port, () => {
  console.log("Server started on port " + global.Config.port + " in " + (process.env.NODE_ENV == "production" ? "production" : "development") + " mode")
});
