import { MainDBContext } from "@/db/contexts/main.db.context";
import { PerformanceSportsDBContext } from "@/db/contexts/perfomance_sports.db.context";
import { BaseRepository } from "@/db/repositories/base.repository";
import { IpcChannels } from "@/shared/constants/constants";
import { ipcRenderer } from "electron";

const apiExtension = {
  mainCreateSession: (payload: any) =>
    ipcRenderer.invoke("main:session:create", payload),
  mainReadSession: (payload: any) =>
    ipcRenderer.invoke("main:session:read", payload),
  mainUpdateSession: (payload: any) =>
    ipcRenderer.invoke("main:session:update", payload),
  mainDeleteSession: (payload: any) =>
    ipcRenderer.invoke("main:session:delete", payload),
  mainListSession: (payload: any) =>
    ipcRenderer.invoke("main:session:list", payload),
  mainCreateEvent: (payload: any) =>
    ipcRenderer.invoke("main:event:create", payload),
  mainReadEvent: (payload: any) =>
    ipcRenderer.invoke("main:event:read", payload),
  mainUpdateEvent: (payload: any) =>
    ipcRenderer.invoke("main:event:update", payload),
  mainDeleteEvent: (payload: any) =>
    ipcRenderer.invoke("main:event:delete", payload),
  mainListEvent: (payload: any) =>
    ipcRenderer.invoke("main:event:list", payload),
  mainCreateDiscipline: (payload: any) =>
    ipcRenderer.invoke("main:discipline:create", payload),
  mainReadDiscipline: (payload: any) =>
    ipcRenderer.invoke("main:discipline:read", payload),
  mainUpdateDiscipline: (payload: any) =>
    ipcRenderer.invoke("main:discipline:update", payload),
  mainDeleteDiscipline: (payload: any) =>
    ipcRenderer.invoke("main:discipline:delete", payload),
  mainListDiscipline: (payload: any) =>
    ipcRenderer.invoke("main:discipline:list", payload),

  psCreateEvent: (payload: any) =>
    ipcRenderer.invoke("ps:event:create", ...payload),
  psReadEvent: (payload: any) => ipcRenderer.invoke("ps:event:read", ...payload),
  psUpdateEvent: (payload: any) =>
    ipcRenderer.invoke("ps:event:update", ...payload),
  psDeleteEvent: (payload: any) =>
    ipcRenderer.invoke("ps:event:delete", ...payload),
  psListEvent: (payload: any) => ipcRenderer.invoke("ps:event:list", payload),
  psCreateHouse: (payload: any) =>
    ipcRenderer.invoke("ps:house:create", ...payload),
  psReadHouse: (payload: any) => ipcRenderer.invoke("ps:house:read", ...payload),
  psUpdateHouse: (payload: any) =>
    ipcRenderer.invoke("ps:house:update", ...payload),
  psDeleteHouse: (payload: any) =>
    ipcRenderer.invoke("ps:house:delete", ...payload),
  psListHouse: (payload: any) => ipcRenderer.invoke("ps:house:list", payload),
  psCreateParticipant: (payload: any) =>
    ipcRenderer.invoke("ps:participant:create", ...payload),
  psReadParticipant: (payload: any) =>
    ipcRenderer.invoke("ps:participant:read", ...payload),
  psUpdateParticipant: (payload: any) =>
    ipcRenderer.invoke("ps:participant:update", ...payload),
  psDeleteParticipant: (payload: any) =>
    ipcRenderer.invoke("ps:participant:delete", ...payload),
  psListParticipant: (payload: any) =>
    ipcRenderer.invoke("ps:participant:list", payload),
};
export const api = apiExtension;
