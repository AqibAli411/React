import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint"; // Import the ESLint plugin

export default defineConfig({
  plugins: [react(), eslint()],
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["sockjs-client", "@stomp/stompjs"],
  },
  server: {
    proxy: {
      "/ws": {
        target: "http://localhost:8080",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
