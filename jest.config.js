module.exports = {
	"preset": "@vue/cli-plugin-unit-jest",
	"name": "votel",
	"moduleFileExtensions": ["vue", "js"],
	"verbose": true,
	"collectCoverage": true,
	"collectCoverageFrom": [
		// Tested files
		"src/components/buttons/submissions/*.{js,vue}",
		'src/components/buttons/submissions/BookButton.vue',
		// Todo tests
		"./src/components/**/*.{js,vue}",
		// "./src/views/*.{js,vue}",
		// Ignored files
		"!src/main.js", // No need to cover bootstrap file
		"!**/node_modules/**",
	],
	"coverageThreshold": {
		"global": {
			"branches": 80,
			"functions": 80,
			"lines": 80,
			//"statements": -10,
		},
		// "./src/components/": {
		//	"branches": 80,
		//	"functions": 80,
		//	"lines": 80,
		//	//"statements": 80,
		//	"statements": -10,
		// },
	},
}
