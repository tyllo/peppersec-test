module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:promise/recommended',
    'airbnb-base',
  ],
  plugins: [
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 1,

    'no-multiple-empty-lines': ['error', {
      max: 2,
    }],
    camelcase: 'off',
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'always-multiline'],
    'require-await': 'error',
    'no-void': 0,
    'max-len': ['error', {
      code: 120,
      ignoreComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state',
        'acc',
        'e',
      ],
    }],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],
    'promise/no-return-wrap': ['error', {
      allowReject: true,
    }],
  },
}
