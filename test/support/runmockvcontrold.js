const MockVControlD = require("./mockvcontrold")

var mockVControlD = new MockVControlD(console.log)
mockVControlD.start()

process.once('SIGTERM', async () => {
  console.log('SIGTERM received...')
  await mockVControlD.close()
  process.exit(2)
});
