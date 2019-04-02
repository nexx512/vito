module.exports = async (callback) => {
  return new Promise((resolve, reject) => {
    callback((error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}
