import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

/**
 * ESLint flat config — iQWine_Web (Next 16 + React 19 + TypeScript).
 *
 * Remplace `next lint` (déprécié/cassé en Next 16). Filet qualité avant la
 * refonte du site : règles Next (core-web-vitals), TypeScript, et
 * accessibilité jsx-a11y (cible WCAG AA). Pas de type-checking ESLint (tsc
 * s'en charge via `npm run typecheck`) pour garder le lint rapide.
 */
export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      'eslint.config.mjs',
      'postcss.config.mjs',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      '@next/next': nextPlugin,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // Hygiène pragmatique : variables/args inutilisés tolérés s'ils sont
      // préfixés « _ » (échappatoire intentionnelle), sinon avertissement.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
);
