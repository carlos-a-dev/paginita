// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    ignores: [
      'build/**',
      'dist/**',
      '.cache/**',
      'node_modules/**',
      'tmp/**',
      '.strapi/**',
      'scripts/**',
      'types/generated/**',
      'src/admin/vite.config.example.ts'
    ],
  },

  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json'
      },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // Turn off ESLint formatting rules that Prettier handles
  prettier,
];
