const { app, BrowserWindow } = require("electron");
const path = require("path");

// Enable live reload for Electron too
require("electron-reload")(__dirname, {
  // Note that the path to electron may vary according to the main file
  electron: require(path.resolve(__dirname, "..", "node_modules", "electron")),
});
function createWindow() {
  // Cria uma janela de navegação.
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    backgroundColor: "#222831",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  win.loadFile(path.resolve(__dirname, "views", "main", "index.html"));
  //win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
