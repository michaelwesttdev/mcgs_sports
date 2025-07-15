import { SessionSettings, Settings } from "../settings"

export type FetchSessionSettingsArgs = { type: "main" | "session", sessionId?: string }
export type UpdateSessionSettingsArgs = {
    settings: Partial<Settings>|Partial<SessionSettings>,
    type: "main" | "session",
    sessionId?: string
}