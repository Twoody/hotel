// eslint.config.js
import globals from "globals"
import js from "@eslint/js"
import pluginVue from "eslint-plugin-vue"
// Optional: If you want more advanced Jest linting, consider eslint-plugin-jest
// import eslintPluginJest from "eslint-plugin-jest";

export default [
	// 1. Global ignores (replaces root-level ignorePatterns and .eslintignore/.gitignore for ESLint)
	{
		ignores: [
			"node_modules/", // It's good practice to explicitly ignore node_modules
			"dist/", // And other build output directories
			"src/views/ThermometerPage.vue",
			"src/migrations/template.js",
			"src/migrations/template.batch.js",
		],
	},

	// 2. ESLint recommended base rules
	js.configs.recommended,

	// 3. General configuration (applies to .js, .vue <script>, etc. unless overridden)
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.node, // Enables Node.js global variables and Node.js scoping.
				// 'process': 'readonly', // Covered by globals.node, ensure VUE_APP_NODE_ENV is available
			},
		},
		settings: {},
		plugins: {},
		rules: {
			// Common rules from your original global "rules" section
			"array-bracket-newline": [
				"error",
				{
					"minItems": 1, 
				},
			],
			"array-element-newline": [
				"error",
				"always",
			],
			"arrow-parens": [
				"error",
				"always",
			],
			"arrow-spacing": "error",
			"brace-style": [
				"error",
				"allman",
			], // Moved from overrides as it was common
			"comma-dangle": [
				"error",
				{
					"arrays": "always",
					"exports": "never",
					"functions": "never",
					"imports": "never",
					"objects": "always", 
				},
			],
			"computed-property-spacing": [
				"error",
				"never",
			],
			"curly": "error",
			"indent": [
				"error",
				"tab",
				{ // Moved from overrides as it was common for JS parts
					"ArrayExpression": 1,
					"MemberExpression": 1,
					"ObjectExpression": 1,
					"SwitchCase": 1,
					"VariableDeclarator": 1,
				},
			],
			"keyword-spacing": [
				"error",
				{
					"before": true, 
				},
			],
			"max-len": [
				"error",
				{
					"code": 100,
					"ignoreComments": true,
					"ignoreUrls": true,
					"ignoreRegExpLiterals": true,
					"tabWidth": 3, 
				},
			],
			"no-debugger": process.env.VUE_APP_NODE_ENV === "production" ? "error" : "off",
			"no-multiple-empty-lines": [
				"error",
				{
					"max": 1,
					"maxBOF": 1,
					"maxEOF": 1, 
				},
			],
			"no-multi-spaces": [
				"error",
				{
					ignoreEOLComments: false, 
				},
			],
			"no-prototype-builtins": "warn",
			"no-undef-init": "error",
			"no-undefined": "error",
			"object-curly-newline": [
				"error",
				{
					"ExportDeclaration": "always",
					"ImportDeclaration": "never",
					"ObjectExpression": {
						"minProperties": 1, 
					},
					"ObjectPattern": {
						"multiline": true, 
					}, 
				},
			],
			"object-property-newline": "error",
			"quotes": [
				"error",
				"double",
			],
			"require-await": "error",
			"semi": [
				"error",
				"never",
			],
			"sort-vars": [
				"error",
				{
					"ignoreCase": true, 
				},
			],
			"space-before-function-paren": [
				"error",
				{
					"anonymous": "never",
					"asyncArrow": "always",
					"named": "always", 
				},
			],
			"spaced-comment": [
				"error",
				"always",
				{
					"line": {
						"markers": [
							"/",
						],
						"exceptions": [
							"-",
							"+",
						], 
					},
					"block": {
						"markers": [
							"!",
						],
						"exceptions": [
							"*",
						],
						"balanced": true, 
					}, 
				},
			],
		},
	},

	// 4. Vue files configuration
	// This applies Vue essential rules and your custom Vue rules.
	// Assuming Vue 3. If using Vue 2, use pluginVue.configs['flat/vue2-essential']
	...pluginVue.configs["flat/essential"],
	{
		files: [
			"**/*.vue",
		], // Ensures these rules specifically target .vue files
		// `pluginVue.configs['flat/essential']` already registers the 'vue' plugin and parser.
		rules: {
			// Your custom Vue-specific rules from the original "overrides" for "*.vue"
			"vue/component-definition-name-casing": [
				"error",
				"PascalCase",
			],
			"vue/component-name-in-template-casing": [
				"error",
				"PascalCase",
				{
					"registeredComponentsOnly": true,
					"ignores": [], 
				},
			],
			"vue/html-indent": [
				"error",
				"tab",
				{
					"alignAttributesVertically": true,
					"attribute": 1,
					"baseIndent": 1,
					"closeBracket": 0,
					"ignores": [], 
				},
			],
			"vue/html-quotes": [
				"error",
				"double",
			],
			"vue/html-self-closing": [
				"error",
				{
					"html": {
						"component": "always",
						"normal": "always",
						"void": "never", 
					},
					"math": "always",
					"svg": "always", 
				},
			],
			"vue/multi-word-component-names": [
				"error",
				{
					"ignores": [
						"About",
						"Accordion",
						"Amenities",
						"Checkbox",
						"Filters",
						"Foobar",
						"Home",
						"Guide",
						"Guides",
						"Login",
						"Maps",
						"Signup",
						"Spinner",
						"Thermometer",
						"Toggle",
						"Validatable",
					], 
				},
			],
			"vue/no-multi-spaces": [
				"error",
				{
					"ignoreProperties": false, 
				},
			], // Rule for Vue templates
			"vue/no-template-shadow": "error", // Original was 2
			"vue/prop-name-casing": [
				"error",
				"camelCase",
			],
			"vue/singleline-html-element-content-newline": [
				"error",
				{
					"ignores": [
						"pre",
						"span",
						"textarea",
					],
					"ignoreWhenEmpty": true,
					"ignoreWhenNoAttributes": true, 
				},
			],
			"vue/this-in-template": [
				"error",
				"never",
			],
			"vue/sort-keys": [
				"error",
				"asc",
				{
					"caseSensitive": true,
					"ignoreChildrenOf": [
						"model",
					],
					"ignoreGrandchildrenOf": [
						"directives",
						"inject",
					],
					"minKeys": 2,
					"natural": false, 
				},
			],

			// The 'indent' and 'brace-style' rules from the general config above will apply to the <script> part.
			// If you had vue/script-indent, it would go here.
		},
	},

	// 5. Specific rules for plain JavaScript files (if different from general or Vue <script>)
	// The original `overrides` for `*.js` had `brace-style` and `indent` rules identical
	// to the global ones. If there are no other specific rules *only* for .js files (and not
	// for .vue <script> tags), this block might be redundant if the global config covers them.
	{
		files: [
			"**/*.js",
		], // This targets only .js files, not .vue files
		rules: {},
	},

	// 6. Path-specific overrides
	{
		files: [
			"**/constants/*.js",
		],
		rules: {
			"max-len": "off",
		},
	},
	{
		files: [
			"**/migrations/**/*.js",
		],
		rules: {
			"max-len": "off",
		},
	},
	{
		files: [
			"**/__mocks__/*.js",
		],
		rules: {
			"no-redeclare": "warn",
		},
	},

	// 7. Test files specific configurations
	{
		files: [
			"tests/**", // Original pattern
			"**/*.test.js", // Common pattern for JS tests
			"**/*.spec.js", // Common pattern for JS tests
			"**/*.test.vue", // If you have Vue component tests
			"**/*.spec.vue", // If you have Vue component tests
		],
		languageOptions: {
			globals: {
				...globals.jest, // Apply Jest global variables only to test files
			},
		},
	},
]
