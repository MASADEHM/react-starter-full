import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

/** One rule per layer: what it may not import. Enforces ARCHITECTURE.md "Feature Dependencies". */
const noImports = (patterns, message) => ({
  'no-restricted-imports': ['error', { patterns: [{ group: patterns, message }] }],
});

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'eslint.config.js'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: { project: './tsconfig.json', tsconfigRootDir: import.meta.dirname },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  // Layering. Inside a feature use relative imports; anything another feature needs moves down.
  {
    files: ['src/features/**'],
    rules: noImports(
      ['@/features/*', '@/features/*/**', '@/routes/**', '@/pages/**'],
      'A feature does not import another feature. Move what is shared into @/shared or @/core.',
    ),
  },
  {
    files: ['src/shared/**'],
    rules: noImports(
      ['@/features/**', '@/routes/**', '@/pages/**'],
      'shared sits below features and the application layer.',
    ),
  },
  {
    files: ['src/core/**', 'src/utils/**', 'src/config/**', 'src/constants/**', 'src/types/**'],
    rules: noImports(
      ['@/features/**', '@/shared/**', '@/routes/**', '@/pages/**'],
      'core, utils, config, constants and types import nothing above themselves.',
    ),
  },
);
