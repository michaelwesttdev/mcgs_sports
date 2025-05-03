import DefaultSettings from "@/shared/settings.json"
export class SettingsService{
    constructor(){}
    updateSettings(){}
    getSettings(){
        const settings = DefaultSettings;
        return settings;
    }
    mergeSettings(){}
}