import {settings as DefaultSettings} from "@/shared/settings"
export class SettingsService{
    constructor(){}
    updateSettings(){}
    getSettings(){
        const settings = DefaultSettings;
        return settings;
    }
    mergeSettings(){}
}