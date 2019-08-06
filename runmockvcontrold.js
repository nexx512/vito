const MockVControlD = require("./test/support/mockvcontrold");

const mockData = require("./test/support/mockvcontrolddata.json");

let mockVControlD = new MockVControlD(mockData, console.log);

async function startServer() {
  try {
    await mockVControlD.start();
  } catch (e) {
    console.error(e);
  }
}

startServer();

process.once("SIGTERM", async () => {
  console.log("SIGTERM received...");
  await mockVControlD.stop();
  process.exit(2);
})
