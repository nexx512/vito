import {RequestHandler} from "express"

export default (): RequestHandler => {
  let rev: any = {}
  if (process.env.NODE_ENV == "production") {
    rev = require("../dist/assets/rev-manifest.json")
  }

  function resolveRevision(path: string) {
    if (rev[path]) {
      return "/assets/" + rev[path]
    } else {
      return "/assets/" + path
    }
  }

  return (_req, res, next) => {
    res.locals.assets = resolveRevision
    next()
  }
}
