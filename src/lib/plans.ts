/**
 * SOURCE DE VÉRITÉ UNIQUE — forfaits commerciaux iQWine (site marketing).
 * Aucune duplication de valeurs ailleurs dans le repo marketing : la grille,
 * les CTA et les comparatifs lisent ce module.
 *
 * ⚠️ Jamais afficher tokens / crédits / appels API. Toujours : « recommandations
 * IA » + « utilisateurs inclus ».
 *
 * Côté APPLICATION (cellier-vin), la SOT est la table Plan (DB seed) — ces
 * valeurs DOIVENT y être répliquées (cf. runbook). Ce fichier-ci couvre le site.
 */
export type PlanId =
  /** La porte d'entrée — PAS un produit vendable (aucun prix, aucun paiement). */
  | "gratuit"
  | "standard"
  | "pro"
  | "famille";

export interface MarketingPlan {
  id: PlanId;
  /** Prix mensuel en cents CAD (évite les flottants). */
  priceMonthlyCents: number;
  /** Prix ANNUEL en cents CAD = 10× mensuel (2 mois offerts). Famille arrondi à 599,00. */
  priceYearlyCents: number;
  includedUsers: number;
  monthlyRecommendations: number;
  /** Forfait mis en avant visuellement. */
  highlight?: boolean;
}

/**
 * P22 « Gratuit repositionné » — la PORTE D'ENTRÉE, pas un produit vendable.
 *
 * Délibérément SÉPARÉE de `PLANS` : ce tableau pilote les cartes de prix et le
 * parcours d'achat ; le Gratuit n'a ni prix, ni paiement, ni price ID Stripe.
 * Même séparation que dans l'app (`FREE_DISPLAY` hors de `PLAN_CATALOG`) — les
 * deux repos racontent la même architecture.
 *
 * ⚠️ SOT DOUBLE — LIRE AVANT DE TOUCHER À UN CHIFFRE.
 * Ces valeurs DOIVENT refléter la grille FREE réellement posée en base par la
 * migration `20260716_0121_free_reposition` (repo cellier-vin), dont le miroir TS
 * est `FREE_LIMITS` dans `lib/billing/plan-catalog.ts`.
 *
 * AUCUNE garde automatique ne peut vérifier cela : les deux repos ont des CI
 * séparés — une garde intra-repo ne détecte pas une divergence inter-repos. C'est
 * exactement pourquoi l'AUDIT modélise cette sync comme la décision humaine
 * récurrente **D6**, à rejouer à CHAQUE changement de grille.
 *
 * Historique de ce qu'un décalage coûte : le site a affiché « Priorité à Octave »
 * et « Profil de goût avancé » pendant un mois APRÈS que l'app les eut retirées
 * comme non câblées (P21A Lot D) ; et « Cave partagée » y était affichée AVANT
 * d'exister (P26 l'a rendue vraie le 2026-07-16).
 */
export const FREE_PLAN = {
  id: 'gratuit',
  priceMonthlyCents: 0,
  priceYearlyCents: 0,
  includedUsers: 1,
  monthlyRecommendations: 2,
} as const satisfies MarketingPlan;

/** Plafond de la cave-mémoire du Gratuit (aucun palier payant n'en a besoin :
 *  ils l'expriment autrement). Hors de `MarketingPlan` — c'est une spécificité
 *  de la porte d'entrée, pas une colonne du modèle de vente. */
export const FREE_MAX_BOTTLES = 75;

export const PLANS: MarketingPlan[] = [
  {
    id: "standard",
    priceMonthlyCents: 1495,
    priceYearlyCents: 14900,
    includedUsers: 1,
    monthlyRecommendations: 50,
  },
  {
    id: "pro",
    priceMonthlyCents: 2995,
    priceYearlyCents: 29900,
    includedUsers: 2,
    monthlyRecommendations: 110,
    highlight: true,
  },
  {
    id: "famille",
    priceMonthlyCents: 5995,
    priceYearlyCents: 59900,
    includedUsers: 4,
    monthlyRecommendations: 200,
  },
];

/** « 14,95 » (fr) / « 14.95 » (en) depuis des cents. */
export function formatPriceCad(cents: number, locale: "fr" | "en"): string {
  const v = (cents / 100).toFixed(2);
  return locale === "fr" ? v.replace(".", ",") : v;
}

/**
 * Économie annuelle en cents = 12× mensuel − annuel. JAMAIS hardcodée :
 * dérive toujours des prix SOT ci-dessus. Sur l'annuel = 10× mensuel, ça
 * donne exactement 2 mois (sauf arrondi Famille à 599,00).
 */
export function annualSavingsCents(plan: MarketingPlan): number {
  return plan.priceMonthlyCents * 12 - plan.priceYearlyCents;
}

/**
 * Équivalent mensuel de l'abonnement annuel, en cents (arrondi au cent).
 * C'est le GRAND nombre affiché en mode annuel — pas la facture annuelle.
 */
export function monthlyEquivalentCents(plan: MarketingPlan): number {
  return Math.round(plan.priceYearlyCents / 12);
}
