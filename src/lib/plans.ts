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
export type PlanId = "standard" | "pro" | "famille";

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
