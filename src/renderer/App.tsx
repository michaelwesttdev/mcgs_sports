import React from "react";
import { Route, Routes } from "react-router";
import RootLayout from "./components/layouts/RootLayout";
import DashboardPage from "./pages/dashboard";
import SessionsPage from "./pages/sessions";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path='sessions' element={<SessionsPage />} />
      </Route>
    </Routes>
  );
}
