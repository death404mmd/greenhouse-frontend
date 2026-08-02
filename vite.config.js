import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow access from other devices on the local network (phone, etc.)
    port: 5173,
  },
});
