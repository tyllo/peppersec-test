module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    extraFileExtensions: [
      '.vue',
    ],
  },
  extends: [
    require.resolve('./base'),
    require.resolve('./vue'),
    require.resolve('./import'),
    require.resolve('./typescript'),
  ],
}
