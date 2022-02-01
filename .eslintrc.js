const { resolve } = require('path');

module.exports = {
  root: true,

  parserOptions: {
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    // project: resolve(__dirname, './tsconfig.json'),
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020,
    sourceType: 'module'
  },

  env: {
    browser: true
  },

  ignorePatterns: [
    '.eslintrc.js',
  ],

  extends: [
    './configs/eslintrc/recommended',
  ],

  plugins: [
  ],

  globals: {
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly'
  },

  settings: {
    'import/resolver': {
      alias: {
        map: [
          // https://www.npmjs.com/package/eslint-import-resolver-alias#usage
          // https://quasar.dev/quasar-cli/handling-webpack#webpack-aliases
          ['src', resolve(__dirname, './src')],
          ['app', resolve(__dirname)],
          ['components', resolve(__dirname, './src/components')],
          ['layouts', resolve(__dirname, './src/layouts')],
          ['pages', resolve(__dirname, './src/pages')],
          ['assets', resolve(__dirname, './src/assets')],
          ['boot', resolve(__dirname, './src/boot')],
        ],
        extensions: [
          '.js',
          '.vue',
          '.json',
          '.ts',
          '.d.ts',
        ],
      },
    },
  },

  rules: {
  },
};
