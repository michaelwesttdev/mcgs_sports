import {Settings, SessionSettings} from "@/shared/settings"
export class SettingsService{
    constructor(){}
    async updateSettings(data: Partial<Settings>){
        const res = await window.api.updateSettings({
            type:"main",
            settings:data
        });
        const settings:Settings = res.data;
        return settings;
    }
    async getSettings(){
        const res = await window.api.getSettings({
            type:"main"
        });
        const settings:Settings = res.data;
        return settings;
    }
    async updateSessionSettings({data,sessionId}:{data: Partial<SessionSettings>,sessionId:string}){
        const res = await window.api.updateSettings({
            type:"session",
            settings:data,
            sessionId
        });
        const settings:SessionSettings = res.data;
        return settings;
    }
    async getSessionSettings(sessionId:string){
        const res = await window.api.getSettings({
            type:"session",
            sessionId
        });
        const settings:SessionSettings = res.data;
        return settings;
    }

}