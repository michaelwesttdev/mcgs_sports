import React from "react";
import { Outlet } from "react-router";
import SessionSettingsContextProvider from "./components/hooks/use_settings";

type Props = {};

export default function SessionLayout({ }: Props) {
  return <>
    <SessionSettingsContextProvider>
        {<Outlet />}
    </SessionSettingsContextProvider>
  </>;
}
