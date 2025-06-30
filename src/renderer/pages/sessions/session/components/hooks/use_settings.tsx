import { createContext, useContext, useEffect, useState } from "react";
import { SettingsService } from "@/services/settings.service";
import { SessionSettings as Settings,defaultSessionSettings as defaultSettings } from "@/shared/settings";
import { FetchSessionSettingsArgs, UpdateSessionSettingsArgs } from "@/shared/types/api";

interface SessionSettingsContextType {
    settings: Settings,
    fetchSettings: (args:FetchSessionSettingsArgs) => Promise<any>
    updateSettings: (args:Omit<UpdateSessionSettingsArgs,"sessionId"|"type">) => Promise<boolean>
    setSessionId:(id:string|null)=>void
}
export const SessionSettingsContext = createContext<SessionSettingsContextType>({
    settings: { ...defaultSettings },
    fetchSettings: () => Promise.resolve({}),
    updateSettings: () => Promise.resolve(false),
    setSessionId: ()=>{}
});

export default function SessionSettingsContextProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [sessionId,setSessionId] = useState<string>(null)
    const settingsService = new SettingsService()
    async function fetchSettings() {
        console.log("calling settings api")

        const res = await settingsService.getSessionSettings(sessionId);
        setSettings(res);
    }
    async function updateSettings(args:Omit<UpdateSessionSettingsArgs,"sessionId"|"type">) {
        if(!sessionId) return false;
        const res = await settingsService.updateSessionSettings({data:args.settings,sessionId});
        setSettings(res);
        return true;
    }
    function changeSessionId(id:string|null){
        setSessionId(id)
    }
    useEffect(() => {
        (async () => {
            if(sessionId){
            await fetchSettings();
            }
        })()
    }, [sessionId])
    return (
        <SessionSettingsContext.Provider value={{
            settings,
            fetchSettings,
            updateSettings,
            setSessionId:changeSessionId
        }}>
            {children}
        </SessionSettingsContext.Provider>
    )
}
export function useSessionSettings() {
    const context = useContext(SessionSettingsContext);
    if (!context) {
        throw new Error("useSessionSettings hook must be used within the session settings context provider.");
    }
    return context;
}