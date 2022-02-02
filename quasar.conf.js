/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint func-names: 0 */
/* eslint global-require: 0 */
const { configure } = require('quasar/wrappers')


const ENVs = require('dotenv').config().parsed

// eslint-disable-next-line no-console
console.log('ENVs =', ENVs)

// eslint-disable-next-line no-unused-vars
module.exports = configure((ctx) => ({
  // https://quasar.dev/quasar-cli/supporting-ts
  supportTS: {
    tsCheckerConfig: {
      eslint: {
        enabled: true,
        files: './src/**/*.{ts,tsx,js,jsx,vue}',
      },
    },
  },

  // https://quasar.dev/quasar-cli/prefetch-feature
  // preFetch: true,

  // app boot file (/src/boot)
  // --> boot files are part of "main.js"
  // https://quasar.dev/quasar-cli/boot-files
  boot: [
  ],

  // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
  css: [
    'app.scss',
  ],

  // https://github.com/quasarframework/quasar/tree/dev/extras
  extras: [
    // 'ionicons-v4',
    // 'mdi-v5',
    // 'fontawesome-v5',
    // 'eva-icons',
    // 'themify',
    // 'line-awesome',
    // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

    'roboto-font', // optional, you are not bound to it
    'material-icons', // optional, you are not bound to it
  ],

  // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
  build: {
    publicPath: 'tornado-test',
    vueRouterMode: 'hash', // available values: 'hash', 'history'
    env: ENVs,
  },

  // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
  devServer: {
    server: {
      type: 'http',
    },
    port: 8080,
    open: true, // opens browser window automatically
  },

  // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
  framework: {
    config: {},
    plugins: [
      'Notify',
    ],
  },

  // https://quasar.dev/options/animations
  animations: [],
}))
