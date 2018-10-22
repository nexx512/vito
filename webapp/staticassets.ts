import express from "express"
import path from "path"

export default () => {
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
