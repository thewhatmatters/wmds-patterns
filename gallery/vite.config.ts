import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// A local viewer: one bundle is fine, so no chunk-size warning.
export default defineConfig({ plugins: [react(), tailwindcss()], build: { chunkSizeWarningLimit: 1500 } });
