import { ipcRenderer } from "electron";

function getVersion() {
  ipcRenderer.invoke("app:version");
}
function getSettings() {
  ipcRenderer.invoke("settings:list");
}
function writeSettings(data: any) {
  ipcRenderer.invoke("settings:write", data);
}
function handleClose() {
  ipcRenderer.send("close");
}
function handleMinimize() {
  ipcRenderer.send("win:minimize");
}
function handleMaximise() {
  ipcRenderer.send("win:maximize");
}
function handleRestore() {
  ipcRenderer.send("win:restore");
}
const api = {
  getVersion,
  getSettings,
  writeSettings,
  handleClose,
  handleMinimize,
  handleMaximise,
  handleRestore,
};
export default api;
