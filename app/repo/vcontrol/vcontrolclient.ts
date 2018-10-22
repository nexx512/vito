import net from "net"

export default class VControlClient {

  client: net.Socket
  closeHandler: () => void
  dataHandler: (message: string) => void
  errorHandler: (error: Error) => void

  constructor() {
    this.client = new net.Socket()

    // this.resetHandlers()
    // Initialize explicitely here because typescript parser can not infere the initialization
    this.closeHandler = () => {}
    this.errorHandler = () => {}
    this.dataHandler = () => {}

    this.client.on("data", (data) => this.dataHandler(data.toString()))
    this.client.on("error", (error) => this.errorHandler(error))
    this.client.on("close", () => this.closeHandler())
  }

  private resetHandlers() {
    this.closeHandler = () => {}
    this.errorHandler = () => {}
    this.dataHandler = () => {}
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
      this.client.connect(global.Config.vcontrold.port, global.Config.vcontrold.host)
    }).then(() => {
      this.resetHandlers()
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
      this.resetHandlers()
    })
  }

  async getData(command: string) {
    return new Promise<string>((resolve, reject) => {
      let response: string
      this.errorHandler = reject
      this.dataHandler = (data) => {
        let dataMatches = data.match(/([\s\S]*?)(vctrld>)?$/)
        if (dataMatches && dataMatches[1]) {
          response = dataMatches[1]
        }
        if (dataMatches && dataMatches[2]) {
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

  async setData(command: string, args: string[]|string) {
    return new Promise((resolve, reject) => {
      let response: string
      let commandString: string
      this.errorHandler = reject
      this.dataHandler = (data) => {
        let dataMatches = data.match(/([\s\S]*?)(vctrld>)?$/)
        if (dataMatches && dataMatches[1]) {
          response = dataMatches[1]
        }
        if (dataMatches && dataMatches[2]) {
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
