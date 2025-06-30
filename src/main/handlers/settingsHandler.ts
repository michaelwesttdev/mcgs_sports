import { SessionSettings, Settings } from "@/shared/settings";
import fs from "fs/promises"
import { getSessionSettingsFileUrl, getSettingsFileUrl } from "@/shared/helpers/urls";
import { ipcMain } from "electron";

type ErrorHandlerFunctionType = (error: any) => { details?: string, success: boolean, error: string };
export class SettingsHandler {
    private settingsPath = "";
    private handleError: ErrorHandlerFunctionType;
    private p_sessionsSettingsContexts: Map<
        string,
        {
            path: string;
            defaults: any;
        }
    > = new Map();
    constructor(private defaultSettings: Settings, handleError: ErrorHandlerFunctionType) {
        this.settingsPath = getSettingsFileUrl();
        this.handleError = handleError;
    }
    private merge({ defaultSettings, newSettings }: { defaultSettings: Settings, newSettings: Partial<Settings> }) {
        return { ...defaultSettings, ...newSettings }
    }
    private async getSettings(args: {
        type: "main" | "session",
        sessionId?: string
    }) {
        const url = args.type === "main" ? this.settingsPath : this.p_sessionsSettingsContexts.get(args.sessionId).path;
        const defaults = args.type === "main" ? this.defaultSettings : this.p_sessionsSettingsContexts.get(args.sessionId).defaults;
        try {
            const rawSettings = await fs.readFile(url, { encoding: "utf-8" });
            const settings: Settings = JSON.parse(rawSettings);
            return { success: true, data: settings };
        } catch (e: any) {
            // If the file doesn't exist or is not a valid file, fallback to default
            if (e.code === 'ENOENT' || e.code === 'EISDIR') {
                try {
                    const result = await this.updateSettings({
                        type: args.type,
                        sessionId: args.sessionId,
                        settings: defaults
                    });
                    return { success: true, data: result.data ?? this.defaultSettings };
                } catch (updateErr) {
                    return this.handleError(updateErr);
                }
            }

            console.error("Failed to read settings:", e);
            return this.handleError(e);
        }
    }
    private async updateSettings(args: {
        settings: Settings;
        type: "main" | "session";
        sessionId?: string
    }) {
        const url = args.type === "main" ? this.settingsPath : this.p_sessionsSettingsContexts.get(args.sessionId).path;
        const defaults = args.type === "main" ? this.defaultSettings : this.p_sessionsSettingsContexts.get(args.sessionId).defaults;
        try {
            const merged = this.merge({ defaultSettings: defaults, newSettings: args.settings });
            await fs.writeFile(url, JSON.stringify(merged));
            return { success: true, data: merged };
        } catch (e) {
            console.log(e);
            this.handleError(e);
        }
    }
    async registerHandlers() {
        ipcMain.handle("getSettings", async (_, args: {type:"main"|"session",sessionId?:string}) => this.getSettings(args))
        ipcMain.handle("updateSettings", async (_, args: {
            settings: Settings,
            type: "main" | "session",
            sessionId?: string
        }) => this.updateSettings(args))
        ipcMain.handle("settings:createSettingsContext", async (_, args: { defaults: SessionSettings, sessionId: string }) => {
            console.log("creating settings context for session:", args);
            try {
                const context = this.p_sessionsSettingsContexts.get(args.sessionId);
                if (context) {
                    return { success: true };
                }
                const settingsPath = getSessionSettingsFileUrl(args.sessionId);
                this.p_sessionsSettingsContexts.set(args.sessionId, {
                    path: settingsPath,
                    defaults: args.defaults
                });
                return { success: true };
            } catch (error) {
                this.handleError(error);
            }
        });
        ipcMain.handle("settings:closeSettingsContext", async (_, args: string) => {
            try {
                const context = this.p_sessionsSettingsContexts.get(args);
                if (!context) {
                    return { success: true };
                }
                this.p_sessionsSettingsContexts.delete(args);
                return { success: true };
            } catch (error) {
                this.handleError(error);
            }
        });
    }
}