import React from "react";
import { Route, Routes } from "react-router";
import RootLayout from "./components/layouts/RootLayout";
import DashboardPage from "./pages/dashboard";
import SessionsPage from "./pages/sessions";
import DisciplinesPage from "./pages/disciplines";
import EventsPage from "./pages/events";
import SessionsLayout from "./pages/sessions/Layout";
import SettingsPage from "~/pages/settings";
import { ErrorBoundary } from "~/rootErrorBoundary";
import UnderConstructionPage from "~/components/UnderConstructionPage";
import HelpPage from "./pages/help";
import PerfomanceSessionLayout from "./pages/sessions/performance_session/Layout";
import PerformaceSessionPage from "./pages/sessions/performance_session";
import PerfomanceParticipantPage from "./pages/sessions/performance_session/participant";
import TeamSessionLayout from "./pages/sessions/team_session/Layout";
import TeamSessionViewPage from "./pages/sessions/team_session";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />} errorElement={<ErrorBoundary />}>
        <Route index element={<DashboardPage />} />
        <Route path='sessions' element={<SessionsLayout />}>
          <Route index element={<SessionsPage />} />
          <Route path='performance/:sessionId' element={<PerfomanceSessionLayout />}>
            <Route index element={<PerformaceSessionPage />} />
            <Route path="participant/:pId" element={<PerfomanceParticipantPage />} />
          </Route>
          <Route path='team' element={<TeamSessionLayout />}>
            <Route path=":sessionId" element={<TeamSessionViewPage />} />
          </Route>
        </Route>
        <Route path='disciplines' element={<DisciplinesPage />} />
        <Route path='events' element={<EventsPage />} />
        <Route path='settings' element={<SettingsPage />} />
        <Route path='help' element={<HelpPage />} />
      </Route>
    </Routes>
  );
}
