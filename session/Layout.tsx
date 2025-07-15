import React from "react";
import { Outlet , useParams } from "react-router";
import SessionSettingsContextProvider from "./components/hooks/use_settings";
import { SessionStateProvider } from "./components/SessionStateContext";

export default function SessionLayout() {
  const { sessionId } = useParams();
  if(!sessionId) return null;
  return <>
    <SessionSettingsContextProvider>
        <SessionStateProvider sessionId={sessionId}>
          {<Outlet />}
        </SessionStateProvider>
    </SessionSettingsContextProvider>
  </>;
}
