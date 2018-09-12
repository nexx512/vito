module.exports = () => {
  let rev = {}
  try {
    rev = require("../dist/rev-manifest.json")
  } catch (e) {}

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
