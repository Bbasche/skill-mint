import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Use locally-patched SDK to bypass build-time patching issues on Vercel.
      // The patched version translates old message format to the new enclave protocol.
      "@idos-network/client": path.resolve(
        __dirname,
        "src/lib/idos-client-patched.js"
      ),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
