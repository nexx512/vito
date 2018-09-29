module.exports = () => {
  let rev = {}
  if (process.env.NODE_ENV == "production") {
    rev = require("../dist/rev-manifest.json")
  }

  function resolveRevision(path) {
    if (rev[path]) {
      return "/" + rev[path]
    } else {
      return "/" + path
    }
  }

  return (req, res, next) => {
    res.locals.revision = resolveRevision
    next()
  }
}
