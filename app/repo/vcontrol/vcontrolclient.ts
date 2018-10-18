const net = require("net")

module.exports = class VControlClient {

  constructor() {
    this.client = new net.Socket()

    this.closeHandler = () => {}

    this.client.on("data", (data) => this.dataHandler(data.toString()))
    this.client.on("error", (error) => this.errorHandler(error))
    this.client.on("close", () => this.closeHandler())
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.errorHandler = reject
      this.dataHandler = (data) => {
        if (data === "vctrld>") {
          console.log("Connection to vControl established")
          resolve()
        } else {
          reject(new Error(data))
        }
      }
      console.log("Connecting to vControl...")
      this.client.connect(Config.vcontrold.port, Config.vcontrold.host)
    }).then(() => {
      this.errorHandler = () => {}
      this.dataHandler = () => {}
      this.closeHandler = () => {}
    })
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.errorHandler = reject
      this.closeHandler = () => {
        console.log("Connection to vControl closed")
        resolve();
      }
      this.client.write("quit\n")
    }).then(() => {
      this.errorHandler = () => {}
      this.dataHandler = () => {}
      this.closeHandler = () => {}
    })
  }

  async getData(command) {
    return new Promise((resolve, reject) => {
      let response
      this.errorHandler = reject
      this.dataHandler = (data) => {
        let dataMatches = data.match(/([\s\S]*?)(vctrld>)?$/)
        if (dataMatches[1]) {
          response = dataMatches[1]
        }
        if (dataMatches[2]) {
          console.log("Command finished.")
          if (response.startsWith("ERR:")) {
            return reject(new Error("Unable to perform command '" + command + "': " + response))
          } else {
            console.log("Received response: " + response)
            return resolve(response)
          }
        }
      }
      console.log("Sending command: '" + command + "'...")
      this.client.write(command + "\n")
    }).then((data) => {
      this.errorHandler = () => {}
      this.dataHandler = () => {}
      return data
    })
  }

  async setData(command, args) {
    return new Promise((resolve, reject) => {
      let response
      let commandString
      this.errorHandler = reject
      this.dataHandler = (data) => {
        let dataMatches = data.match(/([\s\S]*?)(vctrld>)?$/)
        if (dataMatches[1]) {
          response = dataMatches[1]
        }
        if (dataMatches[2]) {
          console.log("Command finished.")
          if (response.startsWith("OK")) {
            return resolve(response)
          } else {
            return reject(new Error("Command for vcontrold failed: " + commandString + " (" + response + ")"))
          }
        }
      }
      console.log("Sending command: '" + command + "'...")

      let argsString = ""
      if (args instanceof Array) {
        argsString = args.filter((d) => d).join(" ")
      } else if (args) {
        argsString = args
      }
      commandString = command + " " + argsString
      this.client.write(commandString + "\n")
    }).then((data) => {
      this.errorHandler = () => {}
      this.dataHandler = () => {}
      return data
    })
  }

}
