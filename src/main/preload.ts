import { contextBridge } from "electron";
import api from "./api";

contextBridge.exposeInMainWorld("api", api);

export type IAppApi = typeof api;
