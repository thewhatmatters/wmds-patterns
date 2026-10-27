import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// `--mode pages` builds for GitHub Pages under /wmds-patterns/; everything else (npm run gallery) serves at /.
export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? "/wmds-patterns/" : "/",
  plugins: [react(), tailwindcss()],
  // Reachable from other machines on the network by Bonjour name (e.g. http://bos-mac-mini.local:5190).
  server: { allowedHosts: [".local"] },
  // A local viewer: one bundle is fine. No source maps, so nothing points at local paths.
  build: { chunkSizeWarningLimit: 1500, sourcemap: false },
}));
