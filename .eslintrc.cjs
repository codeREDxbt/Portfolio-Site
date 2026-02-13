module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script',
  },
  overrides: [
    {
      files: ['api/**/*.js'],
      parserOptions: {
        sourceType: 'module',
      },
    },
  ],
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-irregular-whitespace': 'off',
    'no-console': 'off',
  },
};
