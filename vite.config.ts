import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Content-Security-Policy":
        "script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline';",
    },
    hmr: {
      overlay: false,
    },
  },
  build: {
    // Исключаем тестовые файлы из production сборки
    rollupOptions: {
      external: ["**/__tests__/**", "**/*.test.*", "**/*.spec.*"],
    },
  },
});
