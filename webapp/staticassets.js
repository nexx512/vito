const express = require("express")
const path = require("path")

module.exports = () => {
  let distAssetPath = path.join(__dirname, "dist/assets")
  if (process.env.NODE_ENV == "production") {
    return express.static(distAssetPath, {
      fallthrough: false,
      index: false,
      immutable: true,
      maxAge: "1y"
    })
  } else {
    return express.static(path.join(__dirname, "assets"), {
      fallthrough: false,
      index: false
    })
  }
}
