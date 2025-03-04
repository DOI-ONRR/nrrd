module.exports = {
  extends: ["standard", "plugin:mdx/recommended"],
  plugins: ["standard", "react", "react-hooks"],
  rules: {
    "mdx/code-blocks": true,
    "mdx/language-mapper": {},
    "no-var": "error", // optional, recommended when using es6+
    "no-unused-vars": 1, // recommended
    "no-tabs": ["error", { allowIndentationTabs: true }],
    "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
    "arrow-spacing": ["error", { before: true, after: true }], // recommended
    "brace-style": ["error", "stroustrup"],
    "indent": ["error", "tab", { "SwitchCase": 1 }],

    indent: ["error", 2],
    "comma-dangle": [
      "error",
      {
        objects: "only-multiline",
        arrays: "only-multiline",
        imports: "never",
        exports: "never",
        functions: "never",
      },
    ],

    // options to emulate prettier setup
    semi: ["error", "never"],
    "max-len": ["warn", { code: 170 }],
    "template-curly-spacing": ["error", "always"],
    "arrow-parens": ["error", "as-needed"],

    // standard.js
    "space-before-function-paren": [
      "error",
      {
        named: "always",
        anonymous: "always",
        asyncArrow: "always",
      },
    ],

    // standard plugin - options
    "standard/object-curly-even-spacing": ["error", "either"],
    "standard/array-bracket-even-spacing": ["error", "either"],
    "standard/computed-property-even-spacing": ["error", "even"],
    "standard/no-callback-literal": ["error", ["cb", "callback"]],
    // react plugin - options
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",

    "import/no-webpack-loader-syntax": "off",

    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "off",

    // "css-modules/no-unused-class": 1, currently using jss solution
    // "at-rule-no-unknown": [true, {
    //   "ignoreAtRules": [
    //     "value"
    //   ]
    // }],
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 8, // optional, recommended 6+
  },
}
