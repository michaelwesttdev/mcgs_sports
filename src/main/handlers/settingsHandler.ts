import {Settings} from "@/shared/settings";
import fs from "fs/promises"
import {getSettingsFileUrl} from "@/shared/helpers/urls";
export class SettingsHandler {
    private settingsPath = "";
    constructor(private defaultSettings:Settings){
        this.settingsPath = getSettingsFileUrl();
    }
    private merge({defaultSettings, newSettings}:{defaultSettings:Settings, newSettings:Partial<Settings>} ){
        return {...defaultSettings,...newSettings}
    }
    async getSettings (){
        try {
            const rawSettings = await fs.readFile(this.settingsPath,{encoding:"utf-8"});
            let settings:Settings = JSON.parse(rawSettings);
            if(!settings){
                settings = await this.updateSettings(this.defaultSettings);
            }
        }catch (e){
            console.log(e);
            return this.defaultSettings;
        }
    }
    async updateSettings (settings:Partial<Settings>){
        try {

        }catch (e) {
            console.log(E);
        }
    }
}