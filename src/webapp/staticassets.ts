import express from "express"
import path from "path"

export default () => {
  let assetPath = path.join(__dirname, "assets")
  if (process.env.NODE_ENV == "production") {
    return express.static(assetPath, {
      fallthrough: false,
      index: false,
      immutable: true,
      maxAge: "1y"
    })
  } else {
    return express.static(assetPath, {
      fallthrough: false,
      index: false
    })
  }
}
