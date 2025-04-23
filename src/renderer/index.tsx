import "~/styles/globals.css";
import { createRoot } from "react-dom/client";
import React from "react";
import { HashRouter } from "react-router";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
