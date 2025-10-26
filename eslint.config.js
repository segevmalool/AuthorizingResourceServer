import stylistic from '@stylistic/eslint-plugin'
import tseslint from "typescript-eslint";
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    plugins: {
      '@stylistic': stylistic
    },
    files: ['**/*.ts'],
    rules: {
      // 'semi': ['always'],
      'quotes': ['error', 'single'],
    },
  },
  tseslint.configs.recommended,
]);
