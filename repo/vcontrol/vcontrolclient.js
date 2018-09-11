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
            return reject(new Error(response))
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

  async setData(command, data) {
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
          if (response !== "OK") {
            return reject(new Error(response))
          } else {
            return resolve(response)
          }
        }
      }
      console.log("Sending command: '" + command + "'...")

      let dataString = ""
      if (data instanceof Array) {
        dataString = data.filter((d) => d).join(" ")
      } else if (data) {
        dataString = data
      }
      this.client.write(command + " " + dataString + "\n")
    }).then((data) => {
      this.errorHandler = () => {}
      this.dataHandler = () => {}
      return data
    })
  }

}
