import {resolve} from "path"
import { defineConfig } from "vitest/config"
import Vue from "@vitejs/plugin-vue"

export default defineConfig({
	plugins: [
		Vue(),
	],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			components: resolve(__dirname, "src/components"),
			constants: resolve(__dirname, "src/constants"),
			store: resolve(__dirname, "src/store"),
		},
		mainFields: [
			"module",
		],
		// File suffix name that needs to be omitted
		// Note: If an ignored suffix name is configured here, an error will be reported if it is imported with a suffix name
		extensions: [
			".vue",
			".js",
		],
	},

	root: ".", // Define the root
	test: {
		globals: true,
		environment: "jsdom",
		include: [
			"tests/**/*.{test,spec}.{js,jsx,ts,tsx}",
		],
		setupFiles: "./tests/setup/vitest.setup.js",
		alias: {},
		coverage: {
			include: [
				"src/**",
			],
			reporter: [
				"text",
				"html",
			],
			exclude:
			[
				"src/firebase.js",
				"src/firebaseAdmin.js",
				"src/App.vue",
				"src/main.js",
				"src/components/entities/Thermometer.vue",
				"src/constants/**",
				"src/migrations/**",
				"src/views/ThermometerPage.vue",
			],
		},
	},
})
