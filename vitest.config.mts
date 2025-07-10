import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    // required for jest-dom to be extended for use in test files
    // also allows you to not have to explicitly import expect, describe, etc.
    globals: true,
    setupFiles: "./vitest.setup.ts", // or an array of files
    coverage: {
      provider: "v8",
      reporter: ["lcov", "json", "text"],
    },
  },
});
