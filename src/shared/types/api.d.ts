import { SessionSettings, Settings } from "../settings"

export type FetchSessionSettingsArgs = { type: "main" | "session", sessionId?: string }
export type UpdateSessionSettingsArgs = {
    settings: Settings|SessionSettings,
    type: "main" | "session",
    sessionId?: string
}