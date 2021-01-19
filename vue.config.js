// vue.config.js

const path = require("path")
module.exports = {
	// options...
	configureWebpack: {
		performance: {
			hints: false,
		},
		resolve: {
			alias: {
				components: path.resolve(__dirname, "src/components/"),
				constants: path.resolve(__dirname, "src/constants"),
				img: path.resolve(__dirname, "assets/img"),
				services: path.resolve(__dirname, "src/services/"),
				store: path.resolve(__dirname, "src/store/"),
				styles: path.resolve(__dirname, "assets/styles/"),
				svgs: path.resolve(__dirname, "src/assets/svgs/"),
			},
		},
	},
	lintOnSave: true,

}
