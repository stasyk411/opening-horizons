import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx"; // Убедитесь, что путь к файлу App указан верно
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
