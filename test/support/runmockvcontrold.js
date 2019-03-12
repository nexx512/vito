const MockVControlD = require("./mockvcontrold");

let mockVControlD = new MockVControlD(console.log);

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
