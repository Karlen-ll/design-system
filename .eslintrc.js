module.exports = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaFeatures: { jsx: true },
    sourceType: 'module',
  },
  env: { node: true, browser: true, es2024: true },
  globals: { process: true },
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier'],
  rules: {
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'no-useless-constructor': 'off',
    'linebreak-style': ['error', 'unix'],
    'object-curly-spacing': ['error', 'always', { objectsInObjects: true }],

    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    'prettier/prettier': 'error',
  },
}
