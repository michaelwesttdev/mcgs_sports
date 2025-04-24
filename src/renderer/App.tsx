import React from "react";
import { Route, Routes } from "react-router";
import RootLayout from "./components/layouts/RootLayout";
import SessionsPage from "./pages/sessionsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<div>Home</div>} />
        <Route path="sessions" element={<SessionsPage/>} />
      </Route>
    </Routes>
  );
}
