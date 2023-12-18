import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 9000,
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
