module.exports = () => {
  let rev = {}
  if (process.env.NODE_ENV == "production") {
    rev = require("../dist/assets/rev-manifest.json")
  }

  function resolveRevision(path) {
    if (rev[path]) {
      return "/assets/" + rev[path]
    } else {
      return "/assets/" + path
    }
  }

  return (req, res, next) => {
    res.locals.assets = resolveRevision
    next()
  }
}
