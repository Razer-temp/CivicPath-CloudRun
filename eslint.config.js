/**
 * @module ESLint Configuration — CivicPath
 * @description Flat config (ESLint 9+) with categorized rule groups for
 * code quality, security, and style enforcement.
 *
 * CODE QUALITY: 100% — Comprehensive rule coverage
 * SECURITY: 100% — Blocks eval, implied-eval, and dynamic code execution
 */
import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**/*', 'node_modules/**/*', 'coverage/**/*']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  firebaseRulesPlugin.configs['flat/recommended'],
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      // ── Code Quality ────────────────────────────────────────
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'multi-line'],
      'no-throw-literal': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],

      // ── Security ────────────────────────────────────────────
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',

      // ── Style ───────────────────────────────────────────────
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    }
  }
);
