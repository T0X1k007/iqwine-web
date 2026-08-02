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

      /**
       * ── LA DURÉE DE L'ESSAI NE S'ÉCRIT PLUS À LA MAIN (décision D5) ──────
       *
       * Le produit applique un essai à DOUBLE barrière : 14 jours OU 12
       * recommandations d'Octave, au premier des deux. Le site écrivait
       * « 14 jours » trente-cinq fois et ne mentionnait jamais les douze.
       *
       * Un utilisateur actif pouvait donc voir son essai s'arrêter au bout de
       * trois jours après avoir lu quatre fois « 14 jours ». C'est le seul
       * écart du dossier qui puisse se retourner en litige — une promesse
       * écrite qui ne correspond pas au produit livré.
       *
       * Corriger les trente-cinq ne suffisait pas : la trente-sixième serait
       * née au prochain texte. La règle vit désormais dans `src/lib/trial.ts`,
       * et cette règle-ci refuse toute mention littérale ailleurs.
       *
       * `error` et non `warn` : `npm run lint` est dans la porte de
       * déploiement, un avertissement s'y noierait.
       */
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Literal[value=/\\b14\\s*(jours?|days?)\\b|\\b14-day\\b|\\b14 free\\b/i]",
          message:
            "La durée de l'essai ne s'écrit pas en dur : importer TRIAL_CTA / TRIAL_SHORT / TRIAL_FULL depuis '@/lib/trial'. L'essai a DEUX bornes (jours ET recommandations) ; n'en écrire qu'une est l'écart D5, le seul qui puisse se retourner en litige.",
        },
        {
          selector:
            "TemplateElement[value.raw=/\\b14\\s*(jours?|days?)\\b|\\b14-day\\b|\\b14 free\\b/i]",
          message:
            "La durée de l'essai ne s'écrit pas en dur, même dans un gabarit : importer depuis '@/lib/trial'.",
        },
      ],
    },
  },
  {
    // La source de la règle a le DROIT de nommer les nombres — c'est son travail.
    files: ['src/lib/trial.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },
);
