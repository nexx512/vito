mockVControldData = require("./mockvcontrolddata.json")
net = require("net")

class MockVControlD

  constructor: (logger) ->
    @logger = if logger then logger else =>
    @server = new net.Server((c) =>
      c.on("end", => @logger("client disconnected."))
      @logger("client connected.")
      c.write("vctrld>")
      c.on("data", (data) =>
        rawCommand = data.toString().replace(/\r?\n$/, "")
        @commandLog.push(rawCommand)
        args = rawCommand.split(" ")
        command = args.shift()
        if (command == "quit")
          c.end()
        else
          @logger("Command:", command)
          if (args.length == 0)
            response = mockVControldData[command]
            if (response)
              @logger("Response:", response)
              c.write(response + "\n")
            else
              @logger("Unknown command.")
              c.write("ERR: unknown command\n")
          else
            commandArgsRegexp = new RegExp(mockVControldData[command])
            @logger("Arguments:", args)
            if (args.every((a) => commandArgsRegexp.test(a)))
              c.write("OK\n")
            else
              @logger("Arguments don't match " + commandArgsRegexp.toString())
              c.write("ERR: invalid arguments. Arguments don't match " + commandArgsRegexp.toString+ "\n")
          c.write("vctrld>")
      )
    )
    @server.on("error", (e) => throw e)
    @resetCommandLog()

  resetCommandLog: ->
    @commandLog = []

  start: ->
    new Promise (resolve, reject) =>
      @server.listen 3002, "localhost", (e) =>
        if e then reject(e) else resolve()

  stop: ->
    new Promise (resolve, reject) =>
      @server.close (e) =>
        if e then reject(e) else resolve()

module.exports = MockVControlD
