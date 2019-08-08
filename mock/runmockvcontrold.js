const fs = require("fs")
const path = require ("path")

const MockVControlD = require("../test/support/mockvcontrold");

const mockDataFile = path.join(__dirname, "mockvcontrolddata.json");

let lockServerRestart = false;
let mockVControlD;

const watcher = fs.watch(mockDataFile)
watcher.on("change", async (a, b) => {
  await restartServer();
});
watcher.on("close", async () => {
  await stopServer();
});

function resetWatcherListeners() {
  watcher.on("change", () => {});
  watcher.on("close", () => {});
}

async function restartServer() {
  if (lockServerRestart) return;
  lockServerRestart = true;

  if (mockVControlD) {
    try {
      await mockVControlD.stop()
    } catch (e) {}
  }

  delete require.cache[mockDataFile];
  const mockData = require(mockDataFile);
  mockVControlD = new MockVControlD(mockData, console.log);
  try {
    await mockVControlD.start();
  } catch (e) {
    console.error(e);
  }

  lockServerRestart = false;
}

async function stopServer() {
  try {
    await mockVControlD.stop();
  } catch (e) {
    console.error(e);
  }
}

restartServer();

process.once("SIGTERM", async () => {
  console.log("SIGTERM received...");
  await watcher.close();
  process.exit(2);
})
