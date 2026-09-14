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
  /**
   * La porte d'entrée. Elle n'est toujours PAS un produit vendable (aucun
   * paiement, aucun price ID), mais elle est désormais une COLONNE de la grille
   * à part entière : première carte, à 0 $ (Eric, 2026-09-13). Elle vivait
   * jusque-là dans une bande horizontale sous les cartes payantes, d'un rang
   * visuel inférieur — invisible pour qui ne défilait pas, alors que c'est le
   * meilleur argument d'acquisition du site.
   */
  | "gratuit"
  | "standard"
  /**
   * ⚠️ L'IDENTIFIANT EST `pro`, LE LIBELLÉ AFFICHÉ EST « Premium ».
   *
   * Refonte des forfaits (Eric, 2026-09-13) : la grille passe de quatre paliers
   * à trois — Gratuit · Standard · Premium — et « Pro » comme « Passionné »
   * disparaissent de la page. Le palier vendu 29,95 $ / mois garde en revanche
   * son identifiant : c'est lui qui voyage dans `?plan=` vers l'inscription,
   * dans `PLAN_SELECTED` côté analytique, et c'est la clé de facturation.
   *
   * C'est exactement le partage id/libellé que `docs/libelle-forfait-localise.md`
   * a établi pour « Passionné » : le mot affiché change, la clé ne bouge pas.
   *
   * ⚠️ POINT DE SYNCHRONISATION INTER-DÉPÔTS (décision humaine D6) : si le
   * dépôt applicatif nomme son nouveau palier autrement (`premium`), c'est
   * CETTE ligne — et elle seule — qu'il faut changer.
   */
  | "pro";

export interface MarketingPlan {
  id: PlanId;
  /** Prix mensuel en cents CAD (évite les flottants). */
  priceMonthlyCents: number;
  /**
   * Prix ANNUEL en cents CAD.
   *
   * ⚠️ CE N'EST PLUS 10× LE MENSUEL, et « deux mois offerts » est devenu FAUX
   * (Eric, 2026-09-13). Le Standard annuel économise 50,40 $, soit 3,37 mois de
   * tarif mensuel ; le Premium en économise 60,40, soit 2,02 mois. Aucun texte
   * du site ne doit donc plus compter en « mois offerts » : la seule comparaison
   * honnête est l'économie EN DOLLARS face à douze mois au tarif mensuel, et
   * elle se dérive (`annualSavingsCents`), jamais elle ne s'écrit.
   */
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
   * Les afficher est doublement gagnant : c'est honnête, et c'est un argument
   * Standard → Premium qui existait déjà et que personne n'utilisait.
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
  /**
   * 100, et non 50 depuis le 2026-09-13 (Eric).
   *
   * ⚠️ D6, À RÉPLIQUER CÔTÉ APPLICATION : la migration
   * `20260716_0121_free_reposition` posait 50 en base, et `FREE_LIMITS` dans
   * `lib/billing/plan-catalog.ts` la reflète. Tant que l'app n'est pas montée à
   * 100, le site promet une cave que le produit refuse à la 51ᵉ bouteille.
   *
   * Conséquence de RÉCIT, à ne pas perdre : l'écart de cave entre Gratuit et
   * Standard n'est plus qu'un facteur deux (100 contre 200). Ce n'est donc plus
   * la taille de la cave qui vend le Standard, ce sont les conseils d'Octave —
   * 2 par mois contre 50. Toute copie qui s'appuie d'abord sur les bouteilles
   * est à rééquilibrer vers la fréquence et le palais.
   */
  maxBottles: 100,
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
 * Depuis la refonte du compteur côté application (2026-08-19), « 2 / 50 /
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

/**
 * LES DEUX FORFAITS PAYANTS, dans l'ordre d'affichage (le Gratuit les précède).
 *
 * Ils sont nommés avant d'être listés pour que les modules qui ont besoin d'UN
 * forfait précis — la FAQ annuelle, le comparatif — le désignent par son nom
 * plutôt que par un indice de tableau, qu'un ajout de palier décalerait en
 * silence.
 */
const STANDARD_PLAN: MarketingPlan = {
  id: "standard",
  priceMonthlyCents: 1495,
  // 129,00 $ et non 149,00 : le nouveau prix fondateur (Eric, 2026-09-13).
  priceYearlyCents: 12900,
  includedUsers: 1,
  monthlyRecommendations: 50,
  maxBottles: 200,
  /**
   * LE RECOMMANDÉ, c'est le Standard (Eric, 2026-09-13), plus le Pro.
   *
   * La mise en avant suit le forfait qu'on veut réellement vendre au plus grand
   * nombre : celui qui répond au quotidien d'une personne seule, à 14,95 $.
   * Mettre en avant le palier haut faisait de la grille un ancrage plutôt qu'une
   * recommandation.
   */
  highlight: true,
};

/**
 * « Premium » à l'écran, `pro` dans le code et dans la facturation.
 *
 * Sa grille est celle de l'ancien Passionné — cave sans plafond, 200
 * interactions, 4 utilisateurs — à l'ancien prix du Pro. C'est la fusion des
 * deux paliers hauts en un seul, décidée par Eric le 2026-09-13 : deux forfaits
 * séparés par un nombre d'utilisateurs ne se choisissaient pas, ils se
 * comparaient.
 */
const PREMIUM_PLAN: MarketingPlan = {
  id: "pro",
  priceMonthlyCents: 2995,
  priceYearlyCents: 29900,
  includedUsers: 4,
  monthlyRecommendations: 200,
  maxBottles: -1,
};

export { STANDARD_PLAN, PREMIUM_PLAN };

export const PLANS: MarketingPlan[] = [STANDARD_PLAN, PREMIUM_PLAN];

/**
 * LA GRILLE COMPLÈTE, dans l'ordre de lecture : Gratuit · Standard · Premium.
 *
 * `PLANS` reste le PARCOURS D'ACHAT (ce qui a un prix et un paiement) ; cette
 * liste-ci est la GRILLE AFFICHÉE. Les cartes de prix et le comparatif lisent
 * la seconde, la facturation et le balisage la première — c'est la même
 * séparation que côté application, où `FREE_DISPLAY` vit hors de
 * `PLAN_CATALOG`.
 */
export const GRILLE: MarketingPlan[] = [FREE_PLAN, ...PLANS];

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
 * Le même montant, SANS les centimes quand ils sont nuls : « 129 », pas
 * « 129,00 ».
 *
 * Les deux prix annuels sont ronds, et Eric les énonce ronds : « 129 $ / an »,
 * « 299 $ / an ». Deux décimales à zéro sur une facture annuelle ne disent rien
 * de plus et font lire un prix à quatre chiffres là où il y en a trois. Les
 * montants qui ont de vrais centimes (14,95 · 50,40 · 10,75) repassent par
 * `formatPriceCad` et les gardent tous.
 */
export function formatPriceCadShort(cents: number, locale: "fr" | "en"): string {
  if (cents % 100 === 0) return String(Math.round(cents / 100));
  return formatPriceCad(cents, locale);
}

/**
 * Économie annuelle en cents = 12× mensuel − annuel. JAMAIS hardcodée : elle
 * dérive toujours des prix SOT ci-dessus.
 *
 * ⚠️ NE PAS LA RETRADUIRE EN MOIS. Elle valait exactement deux mois tant que
 * l'annuel valait 10× le mensuel ; ce n'est plus le cas, et « deux mois
 * offerts » est devenu une phrase fausse qu'il a fallu retirer de six endroits.
 * On affiche des dollars, comparés à douze mois au tarif mensuel, point.
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
 * LE PRIX FONDATEUR — ce que ces deux mots ont le droit de promettre, et ce
 * qu'ils n'ont PAS le droit de promettre (Eric, 2026-09-13).
 *
 * C'est un PRIX DE LANCEMENT, destiné aux premiers abonnés, sur l'ANNUEL
 * uniquement. Il ne paraît jamais sur le mensuel.
 *
 * ⚠️ IL N'EST PAS UNE GARANTIE À VIE. Eric pourra le relever pour les nouveaux
 * clients. N'écrivez donc JAMAIS, ni ici ni dans un composant : « votre prix ne
 * changera jamais », « garanti à vie », « prix bloqué », « tarif permanent »,
 * ni aucune tournure qui créerait cette obligation. Une promesse de prix
 * perpétuel est une obligation contractuelle, pas une formule de vente : elle
 * survivrait à la page qui l'a écrite.
 *
 * La note dit l'offre sans la verrouiller : « offert aux premiers abonnés »
 * situe le prix dans le temps, sans jamais dire jusqu'à quand.
 */
export const FOUNDER_PRICE = {
  fr: 'Prix fondateur',
  en: 'Founder price',
} as const;

export const FOUNDER_PRICE_NOTE = {
  fr: 'Prix de lancement, offert aux premiers abonnés.',
  en: 'A launch price, offered to our first subscribers.',
} as const;

/**
 * LE SOCLE COMMUN, en une phrase, dans la formulation d'Eric (2026-09-13).
 *
 * ── Le fait qui l'impose, établi par audit du code applicatif ─────────────
 * AUCUNE fonctionnalité n'est réservée à un forfait. Restaurant, magasin,
 * dégustations, accords, scan, notes et souvenirs sont ouverts à TOUS, Gratuit
 * compris. Quatre éléments seulement différencient réellement les paliers : la
 * taille de la cave, le nombre d'interactions, le nombre d'utilisateurs, et les
 * palais distincts — qui découlent du nombre d'utilisateurs.
 *
 * Le comparatif a donc cessé de cocher douze cases identiques sur trois
 * colonnes : ce que tout le monde a se dit UNE fois, en toutes lettres, et le
 * tableau ne garde que ce qui varie. Une case cochée partout ne vend rien ;
 * elle entretient au contraire la peur qu'il faille payer plus pour avoir le
 * vrai produit.
 *
 * ⚠️ N'écrivez jamais « sans jamais compter » à propos du Premium : il reste
 * plafonné à 200 interactions par mois, la formule serait fausse.
 */
export const COMMON_BASE_NOTE = {
  fr: 'Inclus dans tous les forfaits : cave, scan, accords, Restaurant, exploration en magasin et expériences de dégustation.',
  en: 'Included in every plan: cellar, scan, pairings, Restaurant, in-store exploration and tasting experiences.',
} as const;

/**
 * L'ÉCONOMIE ANNUELLE, ÉNONCÉE HONNÊTEMENT, en une seule rédaction.
 *
 * ── Ce qu'elle remplace, et pourquoi ──────────────────────────────────────
 * 1. « Deux mois offerts » : faux depuis que l'annuel n'est plus 10× le
 *    mensuel (50,40 $ = 3,37 mois de Standard).
 * 2. Un « prix régulier annuel » barré à 179,40 $ / 359,40 $ : ces montants
 *    n'ont JAMAIS été des prix annuels commercialisés. Barrer un prix qui n'a
 *    pas existé est une fausse réduction, et Eric l'a retiré.
 *
 * Ce qui reste est vérifiable par le lecteur avec les deux chiffres que la page
 * affiche déjà : douze fois le tarif mensuel, moins la facture annuelle.
 */
export function annualSavingsSentence(plan: MarketingPlan, locale: 'fr' | 'en'): string {
  const montant = formatPriceCad(annualSavingsCents(plan), locale);
  return locale === 'fr'
    ? `Économisez ${montant} $ comparativement à 12 mois au tarif mensuel.`
    : `Save $${montant} compared with 12 months at the monthly rate.`;
}

/**
 * LE LIBELLÉ D'UN FORFAIT, localisé, pour UNE seule identité (Eric 2026-08-02).
 *
 * Le libellé affiché et l'identifiant de facturation sont DEUX choses. `pro`
 * s'affiche « Premium » depuis le 2026-09-13 ; l'identifiant, le `priceId`
 * Stripe et l'accès n'ont pas bougé. Il n'y a **pas** deux produits.
 *
 * La mécanique bilingue reste utile telle quelle : elle a servi à « Passionné »
 * / « Enthusiast » jusqu'à la sortie de ce palier, et elle resservira au
 * premier libellé qui devra différer d'une langue à l'autre.
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
  // « Premium » dans les deux langues, sous l'identifiant `pro` (voir `PlanId`).
  // Plus aucun libellé n'est localisé depuis la sortie de « Passionné » de la
  // grille : la mécanique reste en place, elle n'a simplement plus de client.
  pro: { fr: 'Premium', en: 'Premium' },
};

export function planLabel(id: PlanId, locale: 'fr' | 'en'): string {
  return PLAN_LABELS[id][locale];
}
