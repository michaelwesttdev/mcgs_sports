import { MainDBContext } from "@/db/contexts/main.db.context";
import { PerformanceSportsDBContext } from "@/db/contexts/perfomance_sports.db.context";
import { BaseRepository } from "@/db/repositories/base.repository";
import { IpcChannels } from "@/shared/constants/constants";
import { ipcRenderer } from "electron";

const apiExtension: Record<string, (payload: any) => Promise<any>> = {};
IpcChannels.forEach((channel) => {
  const [kind, repo, operation] = channel.split(":") as [
    string,
    keyof MainDBContext | keyof PerformanceSportsDBContext,
    keyof BaseRepository<any>
  ];
  const funcName = `${kind}${operation
    .split("")[0]
    .toUpperCase()}${operation.slice(1)}${repo
    .split("")[0]
    .toUpperCase()}${repo.slice(1)}`;
  apiExtension[funcName] = async (payload) => {
    return ipcRenderer.invoke(channel, payload);
  };
});
export const api = apiExtension;
