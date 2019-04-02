import {RequestHandler} from "express"
import path from "path"

interface RevisionManifest {
  [index: string]: string;
}

let rev: RevisionManifest|null = null;
if (process.env.NODE_ENV == "production") {
  rev = require(path.join(__dirname, "../assets/rev-manifest.json"))
}

export default (): RequestHandler => {
  function resolveRevision(assetPath: string) {
    if (rev) {
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
