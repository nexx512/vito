MockVControlD = require("./mockvcontrold")

mockVControlD = new MockVControlD(console.log)
mockVControlD.start()

process.once 'SIGTERM', =>
  console.log('SIGTERM received...')
  await mockVControlD.close()
  process.exit(2)
