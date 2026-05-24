const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  toggleFullscreen: () => ipcRenderer.send("toggle-fullscreen"),
  closeApp: () => ipcRenderer.send("close-app"),
  getModelUrl: () => ipcRenderer.invoke("get-model-url"),
  pressKey: (key) => ipcRenderer.send("press-key", key),
  saveFile: (fileName, xmlContent) => ipcRenderer.invoke("save-file", fileName, xmlContent),
  loadFile: () => ipcRenderer.invoke("load-file"),
});
