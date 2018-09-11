const mockVControldData = require("./mockvcontrolddata.json")
const net = require("net")

module.exports = class MockVControlD {

  constructor() {
    this.server = new net.Server(connectionHandler)
    this.server.on('error', (e) => {throw e})
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.server.listen(3002, "localhost", (e) => {
        if (e) {
          reject(e)
        } else {
          resolve()
        }
      })
    })
  }

  async stop() {
    return new Promise((resolve, reject) => {
      this.server.close((e) => {
        if (e) {
          return reject(e)
        } else {
          resolve()
        }
      })
    })
  }

}

function connectionHandler(c) {
  c.on('end', () => console.log("client disconnected."))
  console.log("client connected.")
  c.write("vctrld>")
  c.on('data', (data) => {
    let args = data.toString().replace(/\r?\n$/, "").split(" ")
    let command = args.shift()
    if (command === "quit") {
      c.end()
    } else {
      console.log("Command:", command)
      let response = mockVControldData[command]
      if (response) {
        console.log("Response:", response)
        c.write(response + "\n")
      } else {
        console.log("Unknown command.")
        c.write("ERR: unknown command\n")
      }
      c.write("vctrld>")
    }
  })
}
