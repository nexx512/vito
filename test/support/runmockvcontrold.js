const MockVControlD = require("./mockvcontrold")

const mockData = require("./mockvcontrolddata.json")

let mockVControlD = new MockVControlD(mockData, console.log)
mockVControlD.start()

process.once("SIGTERM", async () => {
  console.log("SIGTERM received...")
  await mockVControlD.stop()
  process.exit(2)
})
