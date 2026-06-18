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
  includedUsers: number;
  monthlyRecommendations: number;
  /** Forfait mis en avant visuellement. */
  highlight?: boolean;
}

export const PLANS: MarketingPlan[] = [
  {
    id: "standard",
    priceMonthlyCents: 1495,
    includedUsers: 1,
    monthlyRecommendations: 50,
  },
  {
    id: "pro",
    priceMonthlyCents: 2995,
    includedUsers: 2,
    monthlyRecommendations: 110,
    highlight: true,
  },
  {
    id: "famille",
    priceMonthlyCents: 5995,
    includedUsers: 4,
    monthlyRecommendations: 200,
  },
];

/** « 14,95 » (fr) / « 14.95 » (en) depuis des cents. */
export function formatPriceCad(cents: number, locale: "fr" | "en"): string {
  const v = (cents / 100).toFixed(2);
  return locale === "fr" ? v.replace(".", ",") : v;
}
