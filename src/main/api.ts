import { ipcRenderer } from "electron";
import { api as apiExtention } from "./handlers/rendererHandler";

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
async function handleSessionDbCreate(id: string) {
  return await ipcRenderer.invoke("session:createDbContext", id);
}
async function handleSessionDbClose(id: string) {
  return await ipcRenderer.invoke("session:closeDbContext", id);
}
const api = {
  getVersion,
  getSettings,
  writeSettings,
  handleClose,
  handleMinimize,
  handleMaximise,
  handleRestore,
  handleSessionDbCreate,
  handleSessionDbClose,
  ...apiExtention,
};
export default api;
