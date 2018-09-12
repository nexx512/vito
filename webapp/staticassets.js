const express = require("express")
const path = require("path")
const fs = require("fs")

module.exports = () => {
  let distAssetPath = path.join(__dirname, "dist/assets")
  if (fs.existsSync(distAssetPath)) {
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
