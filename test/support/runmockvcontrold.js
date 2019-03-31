const MockVControlD = require("./mockvcontrold")

let mockVControlD = new MockVControlD(null, console.log)
mockVControlD.start()

process.once("SIGTERM", async () => {
  console.log("SIGTERM received...")
  await mockVControlD.stop()
  process.exit(2)
})
