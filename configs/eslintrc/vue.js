const config = {
  extends: [
    'plugin:vue/recommended',
    'plugin:vue/vue3-recommended',
  ],
  plugins: [
    'vue',
  ],
  rules: {
    'vuejs-accessibility/alt-text': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'vuejs-accessibility/mouse-events-have-key-events': 'off',
    'vuejs-accessibility/no-autofocus': 'off',

    'vue/no-v-for-template-key': 'off', // for vue3 needs off
    'vue/require-default-prop': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: 5,
      multiline: 1,
    }],
    'vue/name-property-casing': ['error', 'PascalCase'],
    'vue/prop-name-casing': 'off',
    'vue/no-v-html': 'off',
    'vue/this-in-template': ['error', 'never'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/order-in-components': 'error',
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'always',
    }],
    'vue/html-closing-bracket-spacing': ['error', {
      selfClosingTag: 'always',
    }],
    'vue/custom-event-name-casing': ['error', {
      ignores: [
        '/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u',
      ],
    }],
  },
}

module.exports = config
