import {
  PerfomanceSportsChannels,
  MainChannels,
  IpcChannels,
} from "../constants/constants";

export interface MainConfig {
  preloadUrl: string;
  webpackEntry: string;
}

export type MainChannel = (typeof MainChannels)[number];

export type PerfomanceSportsChannel = (typeof PerfomanceSportsChannels)[number];

export type IpcChannel = (typeof IpcChannels)[number];
export type DialogProperties = (
    | "openFile"
    | "openDirectory"
    | "multiSelections"
    | "showHiddenFiles"
    | "createDirectory"
    | "promptToCreate"
    | "noResolveAliases"
    | "treatPackageAsDirectory"
    | "dontAddToRecent"
    )[];
