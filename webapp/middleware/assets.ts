import {RequestHandler} from "express"
import path from "path"

export default (): RequestHandler => {
  let rev: any = {}
  if (process.env.NODE_ENV == "production") {
    rev = require(path.join(__dirname, "../assets/rev-manifest.json"))
  }

  function resolveRevision(assetPath: string) {
    if (process.env.NODE_ENV == "production") {
      return "/assets/" + rev[assetPath]
    } else {
      return "/assets/" + assetPath
    }
  }

  return (_req, res, next) => {
    res.locals.assets = resolveRevision
    next()
  }
}
