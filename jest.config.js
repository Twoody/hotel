const path = require("path")

module.exports = {
	"preset": "@vue/cli-plugin-unit-jest",
	"name": "votel",
	"moduleFileExtensions": [
		"vue",
		"js",
	],
	transform: {
		"^.+\\.vue$": "vue-jest",
		".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
		"^.+\\.jsx?$": "babel-jest",
	},
	moduleNameMapper: {
		// Changes must also be duplicated in vue.config.js
		"^store/(.*)$": path.resolve(__dirname, "src/store/$1"),

		// Jest doesn't apply transforms to node_modules by default
		"^.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
	},
	"verbose": true,
	"collectCoverage": true,
	"collectCoverageFrom": [
		// Tested files
		"./src/components/**/*.{js,vue}",
		// TODO: Start testing pages
		// "./src/views/*.{js,vue}",

		// Ignored files
		"!src/main.js",			// No need to cover bootstrap file
		"!**/styleguidist/**",	// Built directory for documentation
		"!**/constants/**",		// Just constant directory
		"!**/node_modules/**",
	],
	"coverageThreshold": {
		"global": {
			// TODO: Increase coverage and use firebase emulator...
			"branches": 75,
			"functions": 80,
			"lines": 80,
			"statements": -10,
		},
	},
}
