import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// Load environment variables
const host = process.env.VITE_HOST || "localhost"
const port = process.env.VITE_PORT || 5173

export default defineConfig({
	plugins: [
		vue(),
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
		extensions: [
			".vue",
			".js",
		],
	},
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
			},
		},
		modules: true,
	},
	build: {
		target: "modules",
		outDir: "dist",
		assetsDir: "assets",
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
			},
		},
	},
	server: {
		cors: true,
		open: true,
		host,
		port: parseInt(port, 10),
		proxy: {
			"/api": {
				target: "http://localhost:9091",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
})
