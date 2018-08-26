const net = require('net')

const VCONTROL_HOST = '192.168.10.201'
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
      this.dataHandler = function(data) {
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
      this.errorHandler = function() {}
      this.dataHandler = function() {}
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
      this.errorHandler = function() {}
      this.dataHandler = function() {}
    })
  }

  async getData(command) {
    return new Promise((resolve, reject) => {
      let response
      this.errorHandler = reject
      this.dataHandler = function(data) {
        if (data === "vctrld>") {
          console.log("Command finished.")
          return resolve(response)
        }
        if (data.startsWith("ERR:")) return reject(new Error(data))
        console.log("Received response: " + data)
        response = data
        const dataLines = data.split("\n")
        if (dataLines[dataLines.length - 1] === "vtrld>") {
          console.log("Command finished.")
          return resolve(response)
        }
      }
      console.log("Sending command: '" + command + "'...")
      this.client.write(command + "\n")
    }).then((data) => {
      this.errorHandler = function() {}
      this.dataHandler = function() {}
      return data
    })
  }

}
