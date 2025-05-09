import {Settings, settings as DefaultSettings} from "@/shared/settings"
export class SettingsService{
    constructor(){}
    async updateSettings(data: Partial<Settings>){
        const res = await window.api.updateSettings(data);
        const settings:Settings = res.data;
        return settings;
    }
    async getSettings(){
        const res = await window.api.getSettings();
        const settings:Settings = res.data;
        return settings;
    }
}