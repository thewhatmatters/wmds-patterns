import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// `--mode pages` builds for GitHub Pages under /wmds-patterns/; everything else (npm run gallery) serves at /.
export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? "/wmds-patterns/" : "/",
  plugins: [react(), tailwindcss()],
  // A local viewer: one bundle is fine. No source maps, so nothing points at local paths.
  build: { chunkSizeWarningLimit: 1500, sourcemap: false },
}));
