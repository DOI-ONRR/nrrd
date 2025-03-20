module.exports = {
  extends: ['standard', 'plugin:mdx/recommended'],
  plugins: ['standard', 'react', 'react-hooks', 'mdx'],
  settings: {
    'mdx/code-blocks': true,
    'mdx/language-mapper': {
      js: 'espree',
    },
  },
  rules: {
    'no-var': 'error', // optional, recommended when using es6+
    'no-unused-vars': 1, // recommended
    'no-tabs': ['error', { allowIndentationTabs: true }],
    'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    'arrow-spacing': ['error', { before: true, after: true }], // recommended
    'brace-style': ['error', 'stroustrup'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'comma-dangle': [
      'error',
      {
        objects: 'only-multiline',
        arrays: 'only-multiline',
        imports: 'never',
        exports: 'never',
        functions: 'never',
      },
    ],

    // options to emulate prettier setup
    semi: ['error', 'never'],
    'max-len': ['warn', { code: 170 }],
    'template-curly-spacing': ['error', 'always'],
    'arrow-parens': ['error', 'as-needed'],

    // standard.js
    'space-before-function-paren': [
      'error',
      {
        named: 'always',
        anonymous: 'always',
        asyncArrow: 'always',
      },
    ],

    // standard plugin - options
    'standard/object-curly-even-spacing': ['error', 'either'],
    'standard/array-bracket-even-spacing': ['error', 'either'],
    'standard/computed-property-even-spacing': ['error', 'even'],
    'standard/no-callback-literal': ['error', ['cb', 'callback']],
    // react plugin - options
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',

    'import/no-webpack-loader-syntax': 'off',

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.mdx'],
      extends: ['plugin:mdx/recommended'],
      parser: 'eslint-mdx',
      rules: {
        'no-unused-expressions': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'spaced-comment': 0, // resolves error with headers in partials
      },
    },
    {
      files: ['*.mdx'],
      processor: 'mdx/remark',
    },
    {
      files: ['*.mdx'],
      parser: 'yaml-eslint-parser',
      rules: {
        'no-dupe-keys': 'error',
        'no-multiple-empty-lines': ['error', { max: 1 }],
        'mdx/no-unused-expressions': 'off',
      },
      settings: {
        'mdx/language-mapper': {
          yaml: 'yaml-eslint-parser',
        },
      },
    },
  ],
}
