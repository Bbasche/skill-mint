import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Use bundled rc.1.2 SDK built from main branch source
      "@idos-network/client": path.resolve(
        __dirname,
        "src/lib/idos-client-bundled.js"
      ),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
