const net = require("net")

module.exports = class MockVControlD {

  constructor(mockData = {}, logger) {
    this.logger = logger ? logger : () => {}
    this.server = new net.Server((c) => {
      c.on("end", () => this.logger("Client disconnected."))
      this.logger("Client connected.")
      c.write("vctrld>")
      c.on("data", (data) => {
        const rawCommand = data.toString().replace(/\r?\n$/, "")
        this.commandLog.push(rawCommand)
        const [command, args] = this._extractCommandAndArgs(rawCommand);
        if (command === "quit") {
          c.end()
        } else {
          this.logger("Command:", command)
          if (args) {
            let argsPatternToMatch = mockData[command];
            if (argsPatternToMatch !== undefined) {
              const [commandArgsRegexp, commandToUpdate, argsUpdate] = this._resolveArgsPatternsAndCommandUpdates(argsPatternToMatch);
              this.logger("Arguments: ", args)
              if (commandArgsRegexp.test(args)) {
                if (commandToUpdate) {
                  mockData[commandToUpdate] = args.replace(commandArgsRegexp, argsUpdate);
                  this.logger("Updated command '" + commandToUpdate + "' with value '" + mockData[commandToUpdate] + "'");
                }
                c.write("OK\n")
              } else {
                this.logger("Arguments don't match " + commandArgsRegexp.toString())
                c.write("ERR: invalid arguments. Arguments don't match " + commandArgsRegexp.toString() + "\n")
              }
            } else {
              this.logger("Unknown command.")
              c.write("ERR: unknown command\n")
            }
          } else {
            let response = mockData[command]
            if (response !== undefined) {
              this.logger("Response:", response)
              c.write(response + "\n")
            } else {
              this.logger("Unknown command.")
              c.write("ERR: unknown command\n")
            }
          }
          c.write("vctrld>")
        }
      })
    })
    this.server.on("error", (e) => {throw e})
    this.resetCommandLog()
  }

  _extractCommandAndArgs(rawCommand) {
    const commandSeparator = rawCommand.indexOf(" ");
    if (commandSeparator > 0) {
      return [rawCommand.substring(0, commandSeparator), rawCommand.substring(commandSeparator + 1)];
    } else {
      return [rawCommand];
    }
  }

  _resolveArgsPatternsAndCommandUpdates(argsPatternToMatch) {
    if (typeof argsPatternToMatch === "string") {
      return [new RegExp(argsPatternToMatch, "g")];
    } else {
      for (let argsPattern in argsPatternToMatch) {
        for (let updatedCommand in argsPatternToMatch[argsPattern]) {
          return [new RegExp(argsPattern, "g"), updatedCommand, argsPatternToMatch[argsPattern][updatedCommand]];
        }
      }
    }
  }

  resetCommandLog() {
    this.commandLog = []
  }

  async start({host, port}) {
    return new Promise((resolve, reject) => {
      this.server.listen(port, host, (e) => {
        if (e) {
          reject(e);
        } else {
          this.logger("VControlD mock started on port " + port + ".");
          resolve();
        }
      })
    })
  }

  async stop() {
    return new Promise((resolve, reject) => {
      this.server.close((e) => {
        if (e) {
          reject(e);
        } else {
          this.logger("VControlD mock stopped.");
          resolve();
        }
      })
    })
  }

}
