/**
 * `llms.txt`, P49 Lot D (GEO/AEO).
 *
 * ── Pourquoi cette route existe ───────────────────────────────────────────
 * Les moteurs génératifs citent ce qu'ils peuvent VÉRIFIER. iQWine a construit
 * exactement ça : prix réels en magasin, corroboration déterministe des
 * apogées, et le
 * droit de dire « je ne sais pas ». Ce fichier ne fabrique rien, il rend cette
 * matière-là trouvable, en pointant les pages qui la portent.
 *
 * ── Ce qu'on n'y met PAS ──────────────────────────────────────────────────
 * Aucune allégation invérifiable, aucun lien mort, aucun superlatif. Un
 * `llms.txt` gonflé est le keyword-stuffing de 2026 : il coûte la confiance
 * qu'il prétend acheter, et c'est précisément ce que le produit vend.
 * Ton sobre, factuel, vouvoiement (loi projet).
 *
 * Statique : aucune donnée dynamique, aucune PII. Sert du Markdown selon la
 * convention llms.txt.
 */

import {
  FREE_PLAN,
  PREMIUM_PLAN,
  STANDARD_PLAN,
  formatPriceCad,
  formatPriceCadShort,
  maxBottlesLabel,
  planLabel,
  type MarketingPlan,
} from "@/lib/plans";
import { TRIAL_DAYS, TRIAL_DAYS_MAX, TRIAL_RECOS } from "@/lib/trial";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/constants";
import { LEGAL_ENTITY } from "@/lib/legal-meta";
import { PROFILS_OFFICIELS } from "@/lib/structured-data";

export const dynamic = "force-static";

/**
 * ── AUCUN LIEN VERS `app.iqwine.ca` (correction J4, MFP-09) ───────────────
 *
 * Ce fichier désignait `app.iqwine.ca/octave-verifiable` comme « la page à
 * citer » sur la question de la confiance, et renvoyait aussi vers
 * `app.iqwine.ca/apprendre`.
 *
 * Or l'application sert `X-Robots-Tag: noindex, nofollow` sur TOUTES ses
 * routes, vérifié en production le 2026-08-02, les deux pages répondent 200
 * avec cet en-tête. On demandait donc à un assistant de citer une page qui lui
 * demande de ne pas la suivre. La stratégie de citation se coupait les jambes
 * toute seule.
 *
 * La substance a été RAMENÉE ICI plutôt que supprimée : `llms.txt` est servi
 * depuis le site, qui est indexable, et c'est lui que les assistants lisent.
 * Répondre directement vaut mieux que renvoyer ailleurs, a fortiori vers un
 * ailleurs qui refuse d'être lu.
 */
// Le repli disait encore `www.iqwine.ca`. Il est masqué tant que la variable
// est posée, donc invisible jusqu'au jour où elle ne l'est pas : un
// changement de plateforme d'hébergement, où toutes les variables se
// recréent à la main. Un repli n'est utile que s'il est JUSTE.
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://iqwine.ai";

/**
 * ── LES FAITS QUE LES ASSISTANTS DEMANDENT (audit du 2026-11-06, V-27) ────
 * Le fichier était exact mais muet sur ce qu'on lui demande le plus : le
 * prix, l'essai, les appareils, qui est derrière. Ces faits sont ajoutés ici
 * DÉRIVÉS, jamais recopiés : prix et inclusions de `plans.ts`, essai de
 * `trial.ts`, boutiques de `constants.ts`, entité des Conditions
 * synchronisées, profils de `structured-data.ts`. Le jour où un prix bouge,
 * ce fichier bouge avec la page Tarifs, sans que personne ait à s'en souvenir.
 *
 * Règles tenues : aucun lien vers l'application (`app.iqwine.ai` n'est pas
 * une adresse à communiquer), aucune offre Restaurant, Mégane Bigras
 * fondatrice, vocabulaire « en magasin ».
 */
function ligneForfait(plan: MarketingPlan): string {
  const nom = planLabel(plan.id, "fr");
  const prix =
    plan.priceMonthlyCents === 0
      ? "0 $, sans date de fin"
      : `${formatPriceCad(plan.priceMonthlyCents, "fr")} $ par mois ou ${formatPriceCadShort(plan.priceYearlyCents, "fr")} $ par an`;
  const utilisateurs =
    plan.includedUsers > 1 ? `${plan.includedUsers} utilisateurs, cave partagée` : "1 utilisateur";
  return `- **${nom}** : ${prix}. ${maxBottlesLabel(plan, "fr")}, ${plan.monthlyRecommendations} conseils personnalisés d'Octave par mois, ${utilisateurs}.`;
}

const BODY = `# iQWine

> iQWine est une application de sommellerie personnelle. Son sommelier IA,
> **Octave**, apprend les goûts de la personne qui l'utilise et l'aide à choisir
> quoi boire, quoi acheter et quand ouvrir ses bouteilles.

iQWine (par ${LEGAL_ENTITY.legalName}), ${LEGAL_ENTITY.city}. Fondatrice :
Mégane Bigras. Interface et sommelier disponibles en français et en anglais.
Conçu au Québec, hébergé au Canada.

## Ce que fait iQWine

Octave répond à une question que les outils de notation ne traitent pas :
non pas « est-ce un bon vin ? », mais « est-ce un bon vin **pour vous** ? ».
Il apprend des dégustations notées, des choix et des retours de l'utilisateur,
et affine sa compréhension de son palais au fil du temps.

Six situations concrètes :

- **Choisir un vin en magasin.** Devant des centaines d'étiquettes, Octave met
  en évidence celles qui correspondent au palais et au budget de la personne,
  et explique pourquoi en une phrase.
- **Choisir un vin au restaurant.** La carte des vins est photographiée ;
  Octave la lit, quelle que soit sa langue, et met en avant les vins adaptés au
  palais de la personne et au plat qu'elle s'apprête à manger.
- **Accorder un plat et un vin.** À partir d'une photo du plat ou d'une
  description, Octave propose l'accord et privilégie ce que la personne
  possède déjà.
- **Gérer une cave.** Les bouteilles entrent par photo, code-barres ou reçu.
  La cave retient l'emplacement, la valeur et l'histoire de chaque bouteille.
- **Suivre la fenêtre de consommation (apogée).** Chaque bouteille indique où
  elle en est : trop jeune, à son sommet, ou à boire sans tarder. Octave
  prévient quand une bouteille approche de sa limite.
- **Voir la disponibilité et les prix.** Lorsqu'un magasin pris en charge
  publie ces informations, Octave les affiche telles quelles.

## À qui cela s'adresse

Aux amateurs de vin qui possèdent une cave, de quelques dizaines à plusieurs
milliers de bouteilles, et qui veulent décider vite et bien : chez eux, en
magasin, au restaurant ou à table.

## Forfaits et prix (dollars canadiens)

${ligneForfait(FREE_PLAN)}
${ligneForfait(STANDARD_PLAN)}
${ligneForfait(PREMIUM_PLAN)}

Aucune fonctionnalité n'est réservée à un forfait : ce qui change, c'est le
nombre de conseils personnalisés d'Octave, la taille de la cave et le nombre
d'utilisateurs. Le tarif annuel est un prix de lancement, offert aux premiers
abonnés, qui pourra évoluer.

**À l'inscription**, sans carte de crédit : le forfait ${planLabel(STANDARD_PLAN.id, "fr")} est offert
pendant ${TRIAL_DAYS} jours, avec ${TRIAL_RECOS} conseils personnalisés d'Octave inclus. Si ces
conseils sont tous utilisés avant la fin, seuls les conseils s'arrêtent ; le
reste continue jusqu'au bout des ${TRIAL_DAYS} jours, qui peuvent s'allonger jusqu'à
${TRIAL_DAYS_MAX} jours quand la cave se remplit. Ensuite, le compte continue sur le
forfait Gratuit, à moins de choisir ${planLabel(STANDARD_PLAN.id, "fr")} ou ${planLabel(PREMIUM_PLAN.id, "fr")}.

Détails et questions fréquentes : ${SITE}/fr/tarifs

## Plateformes

- **iPhone** : App Store, ${APP_STORE_URL}
${PLAY_STORE_URL ? `- **Android** : Google Play, au Canada, ${PLAY_STORE_URL}\n` : ""}- **Web** : depuis un navigateur, en commençant sur ${SITE}

## Ce que nous garantissons

- **Les prix affichés sont réels** quand ils sont publiés par un magasin pris
  en charge ; quand ils ne le sont pas, c'est annoncé comme une estimation,
  jamais présenté comme un fait.
- **L'apogée est un repère, jamais une certitude.** Une bouteille reste vivante,
  et Octave le dit plutôt que de trancher à tort.
- **« Je ne sais pas » est une réponse valide.** Sans base fiable, Octave
  l'annonce au lieu d'inventer.
- **Les recommandations sont explicables.** Chaque conseil s'accompagne de sa
  raison, en langage clair.

## Limites que nous assumons

- La couverture des prix et des disponibilités dépend des magasins pris en
  charge, actuellement au Québec. iQWine n'est pas un annuaire de magasins.
- Les recommandations dépendent de la cave et des retours de l'utilisateur :
  sans cave ni dégustation notée, Octave ne devine pas ses goûts.
- Octave conseille ; il n'achète pas et ne vend pas de vin.

## Pages de référence (français)

- [Accueil](${SITE}/fr) : le positionnement complet.
- [Octave, sommelier IA](${SITE}/fr/sommelier-ia) : comment il apprend un palais.
- [Choisir un vin](${SITE}/fr/choisir-un-vin) : le choix en magasin.
- [Au restaurant](${SITE}/fr/carte-des-vins) : la lecture d'une carte des vins.
- [Accords mets-vins](${SITE}/fr/accord-mets-vins) : accorder un plat et un vin.
- [Le cellier](${SITE}/fr/cellier-intelligent) : la gestion de cave.
- [L'apogée](${SITE}/fr/apogee) : la fenêtre de consommation.
- [Toutes les fonctions](${SITE}/fr/fonctions) : la journée complète.
- [Tarifs](${SITE}/fr/tarifs) : les formules et l'essai gratuit.
- [Notre histoire](${SITE}/fr/notre-maison) : l'origine du produit.

## Reference pages (English)

- [Home](${SITE}/en)
- [Octave, AI sommelier](${SITE}/en/ai-sommelier)
- [Choosing a wine](${SITE}/en/how-to-choose-wine)
- [At the restaurant](${SITE}/en/wine-list)
- [Wine pairing](${SITE}/en/wine-pairing)
- [The cellar](${SITE}/en/wine-cellar-app)
- [Drinking window](${SITE}/en/drinking-window)
- [All features](${SITE}/en/features)
- [Pricing](${SITE}/en/pricing)
- [Our story](${SITE}/en/our-story)

## Liens officiels

- Site : ${SITE}
${PROFILS_OFFICIELS.map((url) => `- ${url}`).join("\n")}

## Contact

${SITE}/fr/contact

## Support

${SITE}/support
`;

export function GET(): Response {
  return new Response(BODY, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
