import {createContext, useEffect, useState} from "react";
import {SettingsService} from "@/services/settings.service";
import {Settings,settings as defaultSettings} from "@/shared/settings";

interface SettingsContextType{
    settings:any,
    fetchSettings:() => Promise<any>
    updateSettings:() => Promise<any>
}
export const SettingsContext = createContext<SettingsContextType>({
    settings:{},
    fetchSettings:()=>Promise.resolve({}),
    updateSettings:()=>Promise.resolve({}),
});

export default function SettingsContextProvider({children}:{children:React.ReactNode}){
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const settingsService = new SettingsService()
    async function fetchSettings(): Promise<any>{
        const res = settingsService.getSettings();
        setSettings(res);
    }
    async function updateSettings(): Promise<any>{}
    useEffect(()=>{
        (async()=>{
            await fetchSettings();
        })()
    },[])
    return(
        <SettingsContext.Provider value={{
            settings,
            fetchSettings,
            updateSettings
        }}>
            {children}
            </SettingsContext.Provider>
    )
}