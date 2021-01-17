module.exports = {
	root: true,
	env: {
		"jest": true,
		node: true,
	},
	"extends": [
		"plugin:vue/essential",
		// TODO: Run below after importing and other runs
		// "plugin:jsdoc/recommended"
		"eslint:recommended"
	],
	"overrides": [
		// Apply custom .vue files extension rules
		// NOTE: Temporarily disabled in `ignorePatterns` until indenting error resolved
		{
			"files": [
				"*.vue"
			],
			// TODO: Attempt at fixing indent error within script-indent...
			"rules": {
				// TODO: Figure out why these are throwing errors
				//"vue/component-definition-name-casing": [
				//	"error",
				//	"PascalCase"
				//],
				//"vue/component-name-in-template-casing": [
				//	"error",
				//	"PascalCase",
				//	// All options currently default
				//	//{
				//	//	"registeredComponentsOnly": true,
				//	//	"ignores": [],
				//	//}
				//],
				"vue/html-indent": [
					"error",
					"tab",
					// All options currently default
					//{
					//	"alignAttributesVertically": true,
					//	"attribute": 1,
					//	"baseIndent": 1,
					//	"closeBracket": 0,
					//	"ignores": [],
					//}
				],
				"vue/html-quotes": [
					"error",
					"double"
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
					}
				],
				"vue/no-multi-spaces": [
					"error",
					// All options currently default
					//{
					//	"ignoreProperties": false,
					//}
				],
				// TODO: Figure out why these are throwing errors
				//"vue/no-template-shadow": 2,
				"vue/prop-name-casing": [
					"error",
					"camelCase"
				],
				// TODO: Read the rule and see if we need this
				"vue/script-indent": [
					"error",
					"tab",
					{
						"baseIndent": 0,
						"ignores": [],
						"switchCase": 1,
					}
				],
				// TODO: Figure out why these are throwing errors
				//"vue/singleline-html-element-content-newline": [
				//	"error",
				//	{
				//		"ignores": [
				//			"pre",
				//			"span",
				//			"textarea"
				//		],
				//		"ignoreWhenEmpty": true,
				//		"ignoreWhenNoAttributes": true,
				//	}
				//],
				"vue/this-in-template": [
					"error",
					"never"
				],
				"indent": "off",
			},
		},
		// Isolate some .js specific indents
		{
			"files": [
				"*.js"
			],
			"rules": {
				"brace-style": [
					"error",
					"allman"
				],
				"indent": [
					"error", 
					"tab",
					{
						"ArrayExpression": 1,
						"MemberExpression": 1,
						"ObjectExpression": 1,
						"SwitchCase": 1,
						"VariableDeclarator": 1,
					}
				],

			},
		},

		// Ignored calls for testing and jest
		{
			"files": [
				"**/__mocks__/*.js"
			],
			"rules": {
				// TODO: Find out if we can remove errors or not
				"no-redeclare": "warn",
			},
		},
		// Ignore serviceWorker.js as we are just setting up config
		// TODO: Fix serviceWorker.js errors
		{
			"files": [
				"**/src/serviceWorker.js"
			],
			"rules": {
				"no-undef": "warn",
			},
		}
	],
	"parserOptions": {
		"parser": 'babel-eslint'
  },
	"rules": {
		"array-bracket-newline": [
			"error",
			{
				"minItems": 1,
			}
		],
		"array-element-newline": [
			"error",
			"always"
		],
		"arrow-parens": [
			"error", 
			"always"
		],
		"arrow-spacing": "error",
		"comma-dangle": [
			"error",
			{
				"arrays": "always",
				"exports": "never",
				"functions": "never",
				"imports": "never",
				"objects": "always",
			}
		],
		"computed-property-spacing": [
			"error",
			"never",
		],
		"curly": "error",
		"keyword-spacing": [
			"error",
			{
				"before": true, 
			}
		],
		"max-len": [
			"error",
			{
				"code": 100,
				"ignoreComments": true,
				"ignoreUrls": true,
				"ignoreRegExpLiterals": true,
				"tabWidth": 3,
			}
		],
		"no-console": "error",
		"no-debugger": process.env.VUE_APP_NODE_ENV === "production" ? "error" : "off",
		"no-multiple-empty-lines": [
			"error",
			{
				"max": 1,
				"maxBOF": 1,
				"maxEOF": 1, 
			}
		],
		"no-multi-spaces": [
			"error", 
			{
				ignoreEOLComments: false,
			}
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
			}
		],
		"object-property-newline": "error",
		"quotes": [
			"error",
			"double"
		],
		"require-await": "error",
		"semi": [
			"error",
			"never",
		],
		"sort-vars": [
			"error", 
			{
				"ignoreCase": true
			}
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
						"/"
					],
					"exceptions": [
						"-",
						"+"
					],
				},
				"block": {
					"markers": [
						"!"
					],
					"exceptions": [
						"*"
					],
					"balanced": true,
				},
			}
		],

	},
}
