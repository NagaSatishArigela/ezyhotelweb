import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Use node environment — avoids JSDOM + Next.js/rolldown native binding issues
    environment: "node",
    globals: true,
    include: ["__tests__/**/*.test.ts"],
    // Exclude files that import Next.js server modules or react-qr-code
    exclude: ["__tests__/lib/api.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  // Tell Vite to not try to process Next.js or rolldown internals
  optimizeDeps: {
    exclude: ["next", "rolldown"],
  },
});
