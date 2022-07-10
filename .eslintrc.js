module.exports = {
	root: true,
	env: {
		"jest": true,
		node: true,
	},
	"extends": [
		"plugin:vue/essential",
		"plugin:jsdoc/recommended",
		"eslint:recommended"
	],
	"overrides": [
		// Apply custom .vue files extension rules
		{
			"files": [
				"*.vue"
			],
			"rules": {
				"vue/component-definition-name-casing": [
					"error",
					"PascalCase"
				],
				"vue/component-name-in-template-casing": [
					"error",
					"PascalCase",
					// All options currently default
					{
						"registeredComponentsOnly": true,
						"ignores": [],
					}
				],
				"vue/html-indent": [
					"error",
					"tab",
					// All options currently default
					{
						"alignAttributesVertically": true,
						"attribute": 1,
						"baseIndent": 1,
						"closeBracket": 0,
						"ignores": [],
					}
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
				"vue/multi-word-component-names": ["error", {
					"ignores": [
						'Accordion',
						'Filters',
						'Spinner',
						'Validatable',
					]
				}],
				"vue/no-multi-spaces": [
					"error",
					// All options currently default
					{
						"ignoreProperties": false,
					}
				],
				"vue/no-template-shadow": 2,
				"vue/prop-name-casing": [
					"error",
					"camelCase"
				],
				// Does not currently support Allman style
				//"vue/script-indent": [
				//	"error",
				//	"tab",
				//	{
				//		"baseIndent": 0,
				//		"ignores": [],
				//		"switchCase": 1,
				//	}
				//],
				"vue/singleline-html-element-content-newline": [
					"error",
					{
						"ignores": [
							"pre",
							"span",
							"textarea"
						],
						"ignoreWhenEmpty": true,
						"ignoreWhenNoAttributes": true,
					}
				],
				"vue/this-in-template": [
					"error",
					"never"
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
				"brace-style": [
					"error",
					"allman"
				],
				"vue/sort-keys": [
					"error", 
					"asc", 
				 	{
						"caseSensitive": true,
						"ignoreChildrenOf": ["model"],
						"ignoreGrandchildrenOf": ["directives", "inject"],
						"minKeys": 2,
						"natural": false
					},
				 ],

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
		{
			"files": [
				"**/constants/*.js"
			],
			"rules": {
				"max-len": ["off"],
			},
		},

		// Ignored calls for testing and jest
		{
			"files": [
				"**/__mocks__/*.js"
			],
			"rules": {
				"no-redeclare": "warn",
			},
		},
	],
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
		//"no-console": "error",
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
