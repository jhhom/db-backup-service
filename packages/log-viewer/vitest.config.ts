import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // ...
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src/"),
      "@backend": path.resolve(__dirname, "../backend/src"),
      "@api-contract": path.resolve(__dirname, "../shared/api-contract"),
      "@config": path.resolve(__dirname, "../shared/config"),
    },
  },
});
