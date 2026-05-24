const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const http = require("http");
const fs = require("fs");
const robot = require("robotjs");

let modelServer = null;
let modelPort = 0;

function startModelServer() {
  return new Promise((resolve) => {
    modelServer = http.createServer((req, res) => {
      if (req.url === "/model.tar.gz") {
        const filePath = path.join(__dirname, "model.tar.gz");
        const stat = fs.statSync(filePath);
        res.writeHead(200, {
          "Content-Type": "application/gzip",
          "Content-Length": stat.size,
          "Access-Control-Allow-Origin": "*",
        });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404);
        res.end();
      }
    });
    modelServer.listen(0, "127.0.0.1", () => {
      modelPort = modelServer.address().port;
      console.log(`Model server running on port ${modelPort}`);
      resolve(modelPort);
    });
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    frame: false,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      backgroundThrottling: false,
    },
  });

  win.loadFile("index.html");
}

ipcMain.on("toggle-fullscreen", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.setFullScreen(!win.isFullScreen());
});

ipcMain.handle("get-model-url", () => {
  return `http://127.0.0.1:${modelPort}/model.tar.gz`;
});

ipcMain.on("press-key", (event, key) => {
  try {
    robot.keyTap(key);
    console.log("Key pressed:", key);
  } catch (e) {
    console.error("Key press failed:", key, e.message);
  }
});

ipcMain.handle("save-file", (event, fileName, xmlContent) => {
  const savesDir = path.join(__dirname, "saves");
  if (!fs.existsSync(savesDir)) fs.mkdirSync(savesDir);
  const filePath = path.join(savesDir, fileName + ".xml");
  fs.writeFileSync(filePath, xmlContent, "utf-8");
  return filePath;
});

ipcMain.handle("load-file", async () => {
  const { dialog } = require("electron");
  const savesDir = path.join(__dirname, "saves");
  if (!fs.existsSync(savesDir)) fs.mkdirSync(savesDir);
  const result = await dialog.showOpenDialog({
    defaultPath: savesDir,
    filters: [{ name: "XML Files", extensions: ["xml"] }],
    properties: ["openFile"],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return fs.readFileSync(result.filePaths[0], "utf-8");
});

ipcMain.on("close-app", () => {
  if (modelServer) modelServer.close();
  app.quit();
});

app.whenReady().then(async () => {
  await startModelServer();
  createWindow();
});

app.on("window-all-closed", () => {
  if (modelServer) modelServer.close();
  app.quit();
});
