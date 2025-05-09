import {Settings} from "@/shared/settings";
import fs from "fs/promises"
import {getSettingsFileUrl} from "@/shared/helpers/urls";
import {ipcMain} from "electron";

type ErrorHandlerFunctionType = (error: any) => {details?: string, success: boolean, error: string};
export class SettingsHandler {
    private settingsPath = "";
    private handleError:ErrorHandlerFunctionType;
    constructor(private defaultSettings:Settings,handleError:ErrorHandlerFunctionType){
        this.settingsPath = getSettingsFileUrl();
        this.handleError = handleError;
    }
    private merge({defaultSettings, newSettings}:{defaultSettings:Settings, newSettings:Partial<Settings>} ){
        return {...defaultSettings,...newSettings}
    }
    private async getSettings() {
        try {
            const rawSettings = await fs.readFile(this.settingsPath, { encoding: "utf-8" });
            const settings: Settings = JSON.parse(rawSettings);
            return { success: true, data: settings };
        } catch (e: any) {
            // If the file doesn't exist or is not a valid file, fallback to default
            if (e.code === 'ENOENT' || e.code === 'EISDIR') {
                try {
                    const result = await this.updateSettings(this.defaultSettings);
                    return { success: true, data: result.data ?? this.defaultSettings };
                } catch (updateErr) {
                    return this.handleError(updateErr);
                }
            }

            console.error("Failed to read settings:", e);
            return this.handleError(e);
        }
    }
    private async updateSettings (settings:Partial<Settings>){
        try {
            const merged = this.merge({defaultSettings:this.defaultSettings, newSettings:settings});
            await fs.writeFile(this.settingsPath,JSON.stringify(merged));
            return {success:true,data:merged};
        }catch (e) {
            console.log(e);
            this.handleError(e);
        }
    }
    async registerHandlers(){
        ipcMain.handle("getSettings",async ()=>this.getSettings())
        ipcMain.handle("updateSettings",async (_,args:Settings)=>this.updateSettings(args))
    }
}