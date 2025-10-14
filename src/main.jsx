import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// ✅ Optional guard to prevent SSR or weird environments
if (typeof window !== "undefined" && !window.crypto) {
  console.error("window.crypto not available — must run in a secure HTTPS browser context");
}

createRoot(document.getElementById("root")).render(<App />);
