const MockVControlD = require("./mockvcontrold")

var mockVControlD = new MockVControlD()
mockVControlD.start()

process.once('SIGTERM', async (code) => {
  console.log('SIGTERM received...')
  await mockVControlD.close()
  process.exit(2)
});
