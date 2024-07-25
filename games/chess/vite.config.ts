import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"
import dusk from "vite-plugin-dusk"
import { qrcode } from "vite-plugin-qrcode"

// https://vitejs.dev/config/
export default defineConfig({
  base: "", // Makes paths relative
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
  plugins: [
    qrcode(), // only applies in dev mode
    react(),
    dusk({
      logicPath: path.resolve("./src/logic.ts"),
      minifyLogic: false, // This flag can be used if your logic reaches the allowed limit. However, it will make it significantly more difficult to detect validation issues
      ignoredDependencies: [],
    }),
  ],
})
