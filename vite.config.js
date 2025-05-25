import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// Load environment variables
const host = process.env.VITE_HOST || "localhost"
const port = process.env.VITE_PORT || 5173

export default defineConfig({
	plugins: [
		vue(),
		// AntD introduces configuration on demand
	],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			components: resolve(__dirname, "src/components"),
			constants: resolve(__dirname, "src/constants"),
			img: resolve(__dirname, "assets/img"),
			services: resolve(__dirname, "src/services"),
			src: resolve(__dirname, "src"),
			store: resolve(__dirname, "src/store"),
			styles: resolve(__dirname, "assets/styles"),
			svgs: resolve(__dirname, "src/assets/svgs"),
		},
		mainFields: [
			"module",
		],
		poolOptions: {
      threads: {
        maxThreads: 32,
        minThreads: 16
      },
    },

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

