const net = require('net')

//const VCONTROL_HOST = '192.168.10.201'
const VCONTROL_HOST = 'localhost'
const VCONTROL_PORT = 3002

module.exports = class VControl {

  constructor() {
    this.client = new net.Socket()

    this.client.on('data', (data) => this.dataHandler(data.toString()))
    this.client.on('error', (error) => this.errorHandler(error))
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.errorHandler = reject
      this.dataHandler = (data) => {
        if (data === "vctrld>") {
          console.log('Connection to vControl established')
          resolve()
        } else {
          reject(new Error(data))
        }
      }
      console.log('Connecting to vControl...')
      this.client.connect(VCONTROL_PORT, VCONTROL_HOST)
    }).then(() => {
      this.errorHandler = () => {}
      this.dataHandler = () => {}
    })
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.errorHandler = reject
      this.client.on('close', () => {
        console.log('Connection to vControl closed')
        resolve();
      })
      this.client.write("quit\n")
    }).then(() => {
      this.errorHandler = () => {}
      this.dataHandler = () => {}
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
            return reject(new Error("Unable to perform command '" + command + "': " + response.subString(4)))
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
