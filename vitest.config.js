import {resolve} from "path"
import { defineConfig } from "vitest/config"
import Vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [
    Vue(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, ".", "src"),
      components: resolve(__dirname, "src/components/"),
      constants: resolve(__dirname, "src/constants/"),
      find: /^~/,
      img: resolve(__dirname, "assets/img"),
      mocks: resolve(__dirname, ".", "tests/__mocks__/"),
      services: resolve(__dirname, "src/services/"),
      src: resolve(__dirname, "src"),
      store: resolve(__dirname, "src/store/"),
      styles: resolve(__dirname, "src/assets/styles/"),
      svgs: resolve(__dirname, "src/assets/svgs/"),
    },
  },

  root: ".", // Define the root
  test: {
    globals: true,
    environment: "jsdom",
    // The file extension of your test files
    include: [
      "tests/**/*.{test,spec}.{js,jsx,ts,tsx}",
    ],
  },
})
