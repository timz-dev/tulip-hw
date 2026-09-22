import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import eslintPluginPlaywright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules', 'dist', 'reports', 'test-results', 'playwright-report', '**/*.json'],
  },
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      import: eslintPluginImport,
      'unused-imports': eslintPluginUnusedImports,
      playwright: eslintPluginPlaywright,
    },
    rules: {
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'playwright/no-page-pause': 'warn',
      'playwright/no-force-option': 'warn',
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/prefer-locator': 'warn',
      'playwright/prefer-strict-equal': 'warn',
      'playwright/expect-expect': 'warn',
      'playwright/missing-playwright-await': 'warn',
      'playwright/no-conditional-expect': 'warn',
      'playwright/no-focused-test': 'warn',
      'playwright/no-skipped-test': 'warn',
      'playwright/valid-expect': 'warn',

      'no-console': 'warn',
      'no-unused-vars': 'off',
    },
  },
  ...tseslint.configs.recommended,
  prettier,
];
