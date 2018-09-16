const mockVControldData = require("./mockvcontrolddata.json")
const net = require("net")

module.exports = class MockVControlD {

  constructor(logger) {
    this.logger = logger ? logger : () => {}
    this.server = new net.Server((c) => {
      c.on("end", () => this.logger("client disconnected."))
      this.logger("client connected.")
      c.write("vctrld>")
      c.on("data", (data) => {
        let rawCommand = data.toString().replace(/\r?\n$/, "")
        this.commandLog.push(rawCommand)
        let args = rawCommand.split(" ")
        let command = args.shift()
        if (command === "quit") {
          c.end()
        } else {
          this.logger("Command:", command)
          if (args.length == 0) {
            let response = mockVControldData[command]
            if (response) {
              this.logger("Response:", response)
              c.write(response + "\n")
            } else {
              this.logger("Unknown command.")
              c.write("ERR: unknown command\n")
            }
          } else {
            let commandArgsRegexp = new RegExp(mockVControldData[command])
            this.logger("Arguments:", args)
            if (args.every((a) => commandArgsRegexp.test(a))) {
              c.write("OK\n")
            } else {
              this.logger("Arguments don't match " + commandArgsRegexp.toString())
              c.write("ERR: invalid arguments. Arguments don't match " + commandArgsRegexp.toString() + "\n")
            }
          }
          c.write("vctrld>")
        }
      })
    })
    this.server.on("error", (e) => {throw e})
    this.resetCommandLog()
  }

  resetCommandLog() {
    this.commandLog = []
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
