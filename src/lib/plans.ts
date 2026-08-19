/**
 * SOURCE DE VÉRITÉ UNIQUE, forfaits commerciaux iQWine (site marketing).
 * Aucune duplication de valeurs ailleurs dans le repo marketing : la grille,
 * les CTA et les comparatifs lisent ce module.
 *
 * ⚠️ Jamais afficher tokens / crédits / appels API. Toujours : « recommandations
 * IA » + « utilisateurs inclus ».
 *
 * Côté APPLICATION (cellier-vin), la SOT est la table Plan (DB seed), ces
 * valeurs DOIVENT y être répliquées (cf. runbook). Ce fichier-ci couvre le site.
 */
export type PlanId =
  /** La porte d'entrée, PAS un produit vendable (aucun prix, aucun paiement). */
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
  /**
   * Plafond de bouteilles. **`-1` = illimité**, exactement la sentinelle de
   * `PLAN_CATALOG` dans le dépôt applicatif : la copie est LITTÉRALE pour
   * qu'une divergence saute aux yeux plutôt que de se cacher dans une
   * traduction de conventions.
   *
   * ── Pourquoi il apparaît enfin (MFP-09) ─────────────────────────────────
   * Ces plafonds sont appliqués par l'application et étaient ABSENTS du site,
   * dont le comparatif ne comportait que trois lignes chiffrées. Un
   * collectionneur de 400 bouteilles pouvait souscrire Standard et heurter un
   * mur à 200, après avoir importé sa cave.
   *
   * Les afficher est doublement gagnant : c'est honnête, et c'est le seul
   * argument Standard → Pro qui existe déjà et que personne n'utilisait.
   */
  maxBottles: number;
  /** Forfait mis en avant visuellement. */
  highlight?: boolean;
}

/**
 * P22 « Gratuit repositionné », la PORTE D'ENTRÉE, pas un produit vendable.
 *
 * Délibérément SÉPARÉE de `PLANS` : ce tableau pilote les cartes de prix et le
 * parcours d'achat ; le Gratuit n'a ni prix, ni paiement, ni price ID Stripe.
 * Même séparation que dans l'app (`FREE_DISPLAY` hors de `PLAN_CATALOG`), les
 * deux repos racontent la même architecture.
 *
 * ⚠️ SOT DOUBLE, LIRE AVANT DE TOUCHER À UN CHIFFRE.
 * Ces valeurs DOIVENT refléter la grille FREE réellement posée en base par la
 * migration `20260716_0121_free_reposition` (repo cellier-vin), dont le miroir TS
 * est `FREE_LIMITS` dans `lib/billing/plan-catalog.ts`.
 *
 * AUCUNE garde automatique ne peut vérifier cela : les deux repos ont des CI
 * séparés, une garde intra-repo ne détecte pas une divergence inter-repos. C'est
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
  maxBottles: 75,
} as const satisfies MarketingPlan;

/**
 * Plafond de la cave-mémoire du Gratuit.
 *
 * Il vit désormais AUSSI dans `FREE_PLAN.maxBottles` : depuis que les paliers
 * payants affichent le leur (MFP-09), le plafond est devenu une colonne du
 * modèle de vente, et non plus une spécificité de la porte d'entrée. Cette
 * constante reste pour les appelants existants, les deux valeurs sont
 * dérivées l'une de l'autre pour qu'elles ne puissent pas diverger.
 */
export const FREE_MAX_BOTTLES = FREE_PLAN.maxBottles;

/**
 * CE QU'EST UNE INTERACTION, en une phrase, sous les chiffres.
 *
 * ── Pourquoi cette note existe ────────────────────────────────────────────
 * Depuis la refonte du compteur côté application (2026-08-19), « 50 / 110 /
 * 200 » est LITTÉRAL : une demande de conseil vaut une interaction, quel que
 * soit le travail qu'Octave fournit derrière. Avant, le nombre traduisait un
 * budget interne et ne décrivait rien que le client pouvait vérifier.
 *
 * Les chiffres n'ont pas bougé, mais ils ne se suffisent pas : « 50 » ne dit
 * pas si remplir sa cave les entame. C'est pourtant LA question qui bloque un
 * achat, et la réponse est le meilleur argument de vente que ce forfait
 * possède. Elle se dit donc sous les chiffres, partout où ils paraissent.
 *
 * ── Pourquoi ici, et pas recopiée dans les deux composants ────────────────
 * Elle paraît sur les cartes de prix ET sous le comparatif. Deux rédactions de
 * la même promesse divergent au premier ajustement, et la divergence est
 * invisible tant que personne ne compare les deux écrans. C'est exactement la
 * faute que `trial.ts` et `faq.ts` existent pour empêcher dans ce dépôt.
 *
 * ── La règle d'écriture ───────────────────────────────────────────────────
 * Jamais « requêtes », « crédits », « jetons », « appels IA », ni un montant.
 * Jamais « jusqu'à » ni « environ » : 50 veut dire 50. Le client achète des
 * conseils, pas de la mécanique.
 *
 * LE TERME EST CANONIQUE, dans les deux langues : « interaction » en français,
 * « interaction » en anglais. Pas « conversation ». La première rédaction
 * anglaise disait « conversation », et le lecteur voyait « 50 interactions with
 * Octave / month » surmontant une phrase qui nommait la chose autrement : deux
 * mots pour un seul compteur, donc un doute sur le nombre de compteurs. Les
 * cartes et le comparatif fixent le mot, cette note s'y range.
 */
export const INTERACTION_NOTE = {
  fr: "Une question posée, une réponse reçue : une interaction. Ajouter vos bouteilles n’en consomme aucune.",
  en: "One question asked, one answer received: that’s one interaction. Adding your bottles never uses any.",
} as const;

export const PLANS: MarketingPlan[] = [
  {
    id: "standard",
    priceMonthlyCents: 1495,
    priceYearlyCents: 14900,
    includedUsers: 1,
    monthlyRecommendations: 50,
    maxBottles: 200,
  },
  {
    id: "pro",
    priceMonthlyCents: 2995,
    priceYearlyCents: 29900,
    includedUsers: 2,
    monthlyRecommendations: 110,
    maxBottles: 1000,
    highlight: true,
  },
  {
    id: "famille",
    priceMonthlyCents: 5995,
    priceYearlyCents: 59900,
    includedUsers: 4,
    monthlyRecommendations: 200,
    maxBottles: -1,
  },
];

/**
 * Le plafond de bouteilles, en toutes lettres. `-1` → « illimitées ».
 *
 * Rendre la sentinelle telle quelle afficherait « -1 bouteilles », c'est
 * exactement le genre de fuite d'une convention interne vers la page de vente
 * qu'un chiffre non traduit produit.
 */
export function maxBottlesLabel(plan: MarketingPlan, locale: "fr" | "en"): string {
  if (plan.maxBottles < 0) return locale === "en" ? "Unlimited bottles" : "Bouteilles illimitées";
  const n = plan.maxBottles.toLocaleString(locale === "en" ? "en-CA" : "fr-CA");
  return locale === "en" ? `Up to ${n} bottles` : `Jusqu'à ${n} bouteilles`;
}

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
 * C'est le GRAND nombre affiché en mode annuel, pas la facture annuelle.
 */
export function monthlyEquivalentCents(plan: MarketingPlan): number {
  return Math.round(plan.priceYearlyCents / 12);
}

/**
 * LE LIBELLÉ D'UN FORFAIT, localisé, pour UNE seule identité (Eric 2026-08-02).
 *
 * `famille` s'affiche « Passionné » en français et « Enthusiast » en anglais.
 * C'est un LIBELLÉ, rien d'autre : l'identifiant reste `famille`, le `priceId`
 * Stripe reste le même, l'accès est identique. Il n'y a **pas** deux produits.
 *
 * ── La limite Stripe, vérifiée dans le SDK et non supposée ────────────────
 * `Product.name` est un `string` unique : aucun champ de variante linguistique.
 * Le paramètre `locale` d'une session Checkout ou du portail client localise
 * l'interface DE STRIPE, « the locale the Customer Portal is displayed IN » ,
 * pas le contenu fourni par le marchand.
 *
 * Les surfaces Stripe afficheront donc UN seul nom. Dupliquer le produit pour
 * contourner cela coûterait deux historiques d'abonnement, deux rapports de
 * revenus et deux jeux de price IDs, pour un mot. Voir
 * `docs/libelle-forfait-localise.md`.
 */
const PLAN_LABELS: Record<PlanId, Record<'fr' | 'en', string>> = {
  gratuit: { fr: 'Gratuit', en: 'Free' },
  standard: { fr: 'Standard', en: 'Standard' },
  pro: { fr: 'Pro', en: 'Pro' },
  famille: { fr: 'Passionné', en: 'Enthusiast' },
};

export function planLabel(id: PlanId, locale: 'fr' | 'en'): string {
  return PLAN_LABELS[id][locale];
}
