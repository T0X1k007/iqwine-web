/**
 * LA RÈGLE D'ESSAI — source unique de la copie du site.
 *
 * ── L'écart que ce fichier ferme (décision D5, Eric 2026-08-02) ───────────
 * Le produit applique un essai à **double barrière** : 14 jours **ou** 12
 * recommandations d'Octave, au premier des deux atteint. Le site écrivait
 * « 14 jours » **trente-cinq fois** et ne mentionnait **jamais** les douze.
 *
 * Un utilisateur actif peut donc voir son essai s'arrêter au bout de trois
 * jours après avoir lu quatre fois « 14 jours ». C'est le seul écart du dossier
 * qui puisse se retourner en litige : la promesse écrite ne correspond pas au
 * produit livré.
 *
 * Décision d'Eric : **garder la règle, corriger la copie.** La double barrière
 * protège une économie unitaire réelle — la retirer exposerait le budget IA.
 * L'écrire, en revanche, est obligatoire.
 *
 * ── Pourquoi une source unique, et pas trente-cinq corrections ────────────
 * Trente-cinq occurrences dispersées dans douze fichiers, c'est la CAUSE, pas
 * le symptôme. Les corriger une à une laisserait la trente-sixième naître au
 * prochain texte écrit. La règle vit donc ici, en un seul endroit, et une règle
 * ESLint refuse désormais toute mention littérale de « 14 jours » ailleurs.
 *
 * ── Ce qui doit rester synchronisé ────────────────────────────────────────
 * `TRIAL_DAYS` et `TRIAL_RECOS` doublent `lib/billing/plan-catalog.ts` du dépôt
 * applicatif (`TRIAL_DAYS = 14`, `TRIAL_AI_RECOMMENDATIONS = 12`). Deux dépôts,
 * deux déploiements : la duplication est inévitable, l'oubli ne doit pas
 * l'être. **Changer l'un OBLIGE à changer l'autre** — c'est exactement la
 * classe d'écart que ce fichier existe pour empêcher.
 */

/** Durée maximale de l'essai, en jours. Doit égaler `TRIAL_DAYS` de l'app. */
export const TRIAL_DAYS = 14;

/**
 * Recommandations d'Octave incluses dans l'essai. Doit égaler
 * `TRIAL_AI_RECOMMENDATIONS` de l'app.
 */
export const TRIAL_RECOS = 12;

export type SiteLocale = 'fr' | 'en';

/**
 * La phrase COMPLÈTE — celle qui dit la vérité entière.
 *
 * À utiliser partout où l'essai est DÉCRIT : réassurance, FAQ, tarifs,
 * conditions. Un texte qui présente l'essai sans elle est un texte faux.
 */
export const TRIAL_FULL: Record<SiteLocale, string> = {
  fr: `${TRIAL_DAYS} jours ou ${TRIAL_RECOS} recommandations d'Octave — au premier des deux`,
  en: `${TRIAL_DAYS} days or ${TRIAL_RECOS} of Octave's recommendations — whichever comes first`,
};

/**
 * La forme COURTE, pour un libellé de bouton.
 *
 * Elle ne dit pas tout, et c'est assumé : un bouton n'est pas un contrat. Mais
 * elle ne doit JAMAIS paraître seule — la ligne de réassurance adjacente, ou la
 * section qui l'entoure, porte `TRIAL_FULL`. C'est la règle que le site violait.
 */
export const TRIAL_CTA: Record<SiteLocale, string> = {
  fr: `Essai gratuit ${TRIAL_DAYS} jours`,
  en: `Free ${TRIAL_DAYS}-day trial`,
};

/** Forme brève mais HONNÊTE — tient sur une ligne de réassurance. */
export const TRIAL_SHORT: Record<SiteLocale, string> = {
  fr: `${TRIAL_DAYS} jours ou ${TRIAL_RECOS} recommandations`,
  en: `${TRIAL_DAYS} days or ${TRIAL_RECOS} recommendations`,
};
