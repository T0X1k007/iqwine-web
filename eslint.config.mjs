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
/**
 * ── LE VOCABULAIRE DU MAGASIN (règle LOCKED d'Éric, 2026-09-16 et 09-27) ──
 *
 * Le vocabulaire officiel est « en magasin » / « in store ». Sont refusés
 * dans tout texte du site : « SAQ » employé comme nom commun, et les deux
 * périphrases qu'on invente pour le contourner, « point(s) de vente » et
 * « succursale(s) ». L'audit de visibilité du 2026-11-06 (constat V-02) en a
 * trouvé douze servies, dans les sections de l'accueil, la Politique et
 * llms.txt : l'application avait sa garde (`tests/i18n/zero-saq-generique`),
 * le site n'en avait aucune.
 *
 * Ce qui est lu : les chaînes (`Literal`, y compris les attributs `alt`), les
 * morceaux de gabarits (`TemplateElement`) et le texte JSX (`JSXText`). Les
 * COMMENTAIRES ne sont pas des nœuds de l'arbre : ils peuvent raconter
 * l'histoire du mot sans rougir. `SAQ` est lu en MAJUSCULES seulement :
 * l'identifiant technique `'saq'` (source de démo, clé d'analytique) n'est
 * pas du texte affiché, comme `standard` pour le Passionné.
 *
 * Exceptions, aucune dans `src/` aujourd'hui :
 *   · les textes légaux §7 qui nomment « la Société des alcools du Québec
 *     (SAQ) » comme source vivent dans `legal-terms.generated.json`, que le
 *     linter ne lit pas, et sont gardés côté application ;
 *   · le nom propre RÉEL d'un magasin (« SAQ Dépôt Blainville ») resterait
 *     permis : il s'écrirait avec un `eslint-disable-next-line` justifié, au
 *     cas par cas, jamais par une désactivation de fichier.
 *
 * `npm run vocabulaire:sonder` vérifie que ces sélecteurs rougissent bien sur
 * chaque terme interdit et laissent passer le vocabulaire officiel : une
 * garde qui ne se teste pas peut devenir décorative sans que personne le voie.
 */
const VOCABULAIRE_PERIPHRASES = '/\\bpoints?\\sde\\svente\\b|\\bsuccursales?\\b/i';
const VOCABULAIRE_SAQ = '/\\bSAQ\\b|saq\\.com/';
const MESSAGE_VOCABULAIRE =
  'Vocabulaire interdit (règle LOCKED) : écrire « en magasin » / « in store », jamais « point(s) de vente », « succursale(s) » ni « SAQ » comme nom commun.';
const VOCABULAIRE_INTERDIT = [
  ...['Literal[value=', 'JSXText[value=', 'TemplateElement[value.raw='].flatMap((noeud) => [
    { selector: `${noeud}${VOCABULAIRE_PERIPHRASES}]`, message: MESSAGE_VOCABULAIRE },
    { selector: `${noeud}${VOCABULAIRE_SAQ}]`, message: MESSAGE_VOCABULAIRE },
  ]),
];

export default tseslint.config(
  {
    ignores: [
      '.next/**',
      // Sortie de l'adaptateur Cloudflare : du code GÉNÉRÉ, régénéré à chaque
      // construction. Le linter y trouvait 19 811 « erreurs » qui noyaient les
      // vraies — et un rapport qu'on ne peut plus lire ne sert plus à rien.
      '.open-next/**',
      '.wrangler/**',
      // L'export statique pour Cloudflare (`npm run build:cloudflare`), généré.
      'out/**',
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

        /**
         * ── AUCUN LIEN INTERNE NON LOCALISÉ ────────────────────────────────
         *
         * Depuis que chaque langue a ses propres URL, un `href="/tarifs"`
         * écrit en dur renvoie un anglophone vers la version française. Il ne
         * CASSE rien — il affiche une page — et c'est ce qui le rend dangereux :
         * la personne sort de sa langue sans qu'aucune erreur ne le signale.
         *
         * Pour un robot, c'est pire : `/tarifs` est désormais une redirection
         * permanente. Chaque lien interne qui la vise fait passer le crawl par
         * un saut inutile — on redirigerait notre propre maillage.
         *
         * `<LocaleLink href="/tarifs">` préfixe la langue courante.
         */
        {
          // `JSXOpeningElement[name.name!='LocaleLink']` : c'est justement le
          // rôle de LocaleLink de recevoir un chemin NU — l'y interdire
          // rendrait la règle auto-contradictoire.
          selector:
            "JSXOpeningElement[name.name!='LocaleLink'] > JSXAttribute[name.name='href'] > Literal[value=/^\\/(apogee|beta|conditions|confidentialite|contact|le-film|notre-maison|recevoir|recherche|sommelier-ia|tarifs|octave)(\\/|$|#|\\?)/]",
          message:
            "Lien interne non localisé. Utiliser <LocaleLink href=\"/…\"> : chaque langue a ses propres URL, et un href en dur sort l'utilisateur de sa langue sans rien signaler.",
        },

        // Le vocabulaire du magasin : voir `VOCABULAIRE_INTERDIT`, plus haut.
        ...VOCABULAIRE_INTERDIT,
      ],
    },
  },
  {
    // La source de la règle a le DROIT de nommer les nombres — c'est son travail.
    // Elle n'a PAS le droit d'écrire « point de vente » : le vocabulaire reste
    // gardé ici aussi, seul l'interdit des nombres et des liens est levé.
    files: ['src/lib/trial.ts', 'src/components/ui/LocaleLink.tsx', 'src/lib/locale.ts'],
    rules: { 'no-restricted-syntax': ['error', ...VOCABULAIRE_INTERDIT] },
  },
  {
    /**
     * Les scripts d'outillage tournent sous Node, pas dans un navigateur.
     * Sans cette déclaration, ESLint leur reproche `process`, `console` et
     * `fetch` — c'est-à-dire tout ce qu'un script de vérification utilise.
     */
    files: ['scripts/**/*.mjs'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-restricted-syntax': 'off' },
  },
);
