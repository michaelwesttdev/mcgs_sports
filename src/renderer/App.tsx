import React from "react";
import { Route, Routes } from "react-router";
import RootLayout from "./components/layouts/RootLayout";
import DashboardPage from "./pages/dashboard";
import SessionsPage from "./pages/sessions";
import DisciplinesPage from "./pages/disciplines";
import EventsPage from "./pages/events";
import SessionsLayout from "./pages/sessions/Layout";
import SessionViewPage from "./pages/sessions/session";
import SettingsPage from "~/pages/settings";
import {ErrorBoundary} from "~/rootErrorBoundary";
import UnderConstructionPage from "~/components/UnderConstructionPage";
import SessionLayout from "./pages/sessions/session/Layout";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />} errorElement={<ErrorBoundary/>}>
        <Route index element={<DashboardPage />} />
        <Route path='sessions' element={<SessionsLayout />}>
          <Route index element={<SessionsPage />} />
          <Route path=':id' element={<SessionLayout />}>
          <Route index element={<SessionViewPage/>}/>
          </Route>
        </Route>
        <Route path='disciplines' element={<DisciplinesPage />} />
        <Route path='events' element={<EventsPage />} />
        <Route path='settings' element={<SettingsPage />} />
        <Route path='help' element={<UnderConstructionPage />} />
      </Route>
    </Routes>
  );
}
