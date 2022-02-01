module.exports = {
  overrides: [
    {
      files: [
        '**/*.{ts.vue,ts}',
      ],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        '@vue/typescript/recommended',
      ],
      plugins: [
        '@typescript-eslint',
      ],
      rules: {
        // ts reset
        'no-useless-constructor': 'off',

        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],

        '@typescript-eslint/explicit-module-boundary-types': ['off', {
          allowArgumentsExplicitlyTypedAsAny: true,
        }],
        '@typescript-eslint/ban-types': ['error', {
          types: {
            Object: 'Use {} instead',
            String: {
              message: 'Use string instead',
              fixWith: 'string',
            },
          },
        }],
        '@typescript-eslint/no-empty-interface': ['error', {
          allowSingleExtends: true,
        }],
        '@typescript-eslint/ban-ts-comment': ['error', {
          'ts-expect-error': true,
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': true,
          'ts-check': false,
          minimumDescriptionLength: 3,
        }],
        '@typescript-eslint/explicit-member-accessibility': ['error', {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
          },
        }],
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        '@typescript-eslint/member-delimiter-style': ['error', {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
        }],
      },
    },
  ],
}
