import { GRILLE, formatPriceCad, maxBottlesLabel, planLabel } from '@/lib/plans';
import { FAQ } from '@/lib/faq';
import { TRIAL_DAYS, TRIAL_FULL } from '@/lib/trial';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/constants';
import { BCP47, SITE_ORIGIN, absoluteUrl, type Locale } from '@/lib/locale';

/**
 * DONNÉES STRUCTURÉES — dérivées des sources typées, jamais écrites à la main.
 *
 * ── Le principe qui gouverne ce fichier ───────────────────────────────────
 * Rien ici n'est saisi en dur : les prix viennent de `GRILLE`, les questions de
 * `FAQ`, la règle d'essai de `TRIAL_*`. Écrire une seconde fois ce que la page
 * affiche déjà produirait deux vérités — celle que l'humain lit et celle que
 * Google lit — et elles divergeraient au premier ajustement.
 *
 * Ce n'est pas une préférence esthétique. Google exige que le balisage
 * corresponde au contenu visible : un prix structuré qui ne correspond plus au
 * prix affiché n'est pas seulement inexact, il rend la page inéligible aux
 * résultats enrichis. La dérivation est donc la condition, pas le confort.
 *
 * ── Une langue par URL, et le balisage suit ───────────────────────────────
 * Depuis que chaque langue a ses propres URL, ce module PRODUIT le graphe dans
 * la langue demandée : les descriptions, la langue déclarée et les liens
 * pointent tous vers la version servie.
 *
 * Servir un balisage français sous une URL anglaise ferait décrire la page par
 * autre chose que ce qu'elle est — et Google exige que le balisage corresponde
 * au contenu VISIBLE. Ce n'est donc pas un raffinement : c'est la condition
 * d'éligibilité.
 */

const SITE = SITE_ORIGIN;

/**
 * LES PROFILS OFFICIELS d'iQWine, déclarés en `sameAs` (audit du 2026-11-06,
 * constat V-23).
 *
 * `sameAs` dit aux moteurs et aux assistants « ces comptes et ce site sont la
 * même entité ». Sans lui, un nom aussi court qu'« iQWine » se confond avec
 * ses homonymes. Chaque adresse a été vérifiée publiquement le 2026-11-06,
 * et seule une adresse VÉRIFIÉE entre ici :
 *
 *   · Instagram @iqwineapp : 200, titre « iQWine (@iqwineapp) » ;
 *   · TikTok @iqwine : 200, oEmbed public « iQWine », @iqwine ;
 *   · YouTube @iQWineApp : 200, titre « iQWine », description « Octave,
 *     votre sommelier virtuel, vous suit partout. ».
 *
 * ⚠️ LA PAGE FACEBOOK N'Y EST PAS, ET C'EST VOULU : son adresse
 * (`facebook.com/1297038106827804`) répond 400 à toute lecture anonyme, on
 * ne peut donc pas prouver d'ici qu'elle répond ni qu'elle est à iQWine.
 * L'ajouter sur la foi d'un identifiant, c'est risquer de lier l'entité à la
 * mauvaise page. À ajouter quand son adresse publique (`facebook.com/<nom>`)
 * aura été confirmée par Éric.
 */
export const PROFILS_OFFICIELS = [
  'https://www.instagram.com/iqwineapp/',
  'https://www.tiktok.com/@iqwine',
  'https://www.youtube.com/@iQWineApp',
] as const;

/**
 * L'organisation, enrichie.
 *
 * `Organization` seule ne dit rien de ce qu'on vend. On y ajoute l'éditeur
 * réel, la zone desservie et la langue, trois faits qu'un assistant reprend
 * volontiers et qu'aucune autre source de la page ne porte.
 *
 * ── La fondatrice, et elle seule (décision LOCKED d'Éric, 2026-09-25) ──────
 * Mégane Bigras est la fondatrice d'iQWine ; l'idée vient d'elle. Éric
 * l'accompagne et n'est JAMAIS présenté comme fondateur, ni ici ni ailleurs.
 * Le nom et le rôle sont ceux que la page « Notre histoire » affiche déjà
 * (`AProposContent`, « Fondatrice d'iQWine »), condition pour qu'un balisage
 * décrive le contenu visible.
 */
export function organizationLd(locale: Locale) {
  return {
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: 'iQWine',
    url: SITE,
    logo: `${SITE}/icon.png`,
    description:
      locale === 'en'
        ? 'The AI sommelier that knows what to open, what to buy and what to order.'
        : 'Le sommelier IA qui sait quoi ouvrir, quoi acheter et quoi commander.',
    areaServed: { '@type': 'AdministrativeArea', name: 'Québec, Canada' },
    knowsLanguage: ['fr-CA', 'en-CA'],
    founder: {
      '@type': 'Person',
      name: 'Mégane Bigras',
      jobTitle: locale === 'en' ? 'Founder of iQWine' : 'Fondatrice d’iQWine',
      url: absoluteUrl('/notre-maison', locale),
    },
    sameAs: [...PROFILS_OFFICIELS],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: absoluteUrl('/contact', locale),
      availableLanguage: ['fr', 'en'],
    },
  };
}

/**
 * Le produit et ses offres, DÉRIVÉS de la grille.
 *
 * `SoftwareApplication` plutôt que `Product` : c'est ce qu'iQWine est, et le
 * type porte des propriétés que `Product` n'a pas (catégorie d'application,
 * plateforme). L'essai est déclaré par sa VRAIE règle (`TRIAL_FULL` : la
 * durée, et les conseils inclus, qui ne la raccourcissent plus depuis le
 * 2026-11-03).
 */
export function softwareApplicationLd(locale: Locale) {
  /**
   * `GRILLE` et non `PLANS` : le Gratuit est une offre à 0 $, et la déclarer
   * est exact. L'omettre laissait un assistant répondre que l'entrée de gamme
   * d'iQWine coûte 14,95 $, ce qui est faux depuis que le Gratuit est une
   * colonne de la grille et non une note sous les cartes.
   */
  const offres = GRILLE.map((p) => ({
    '@type': 'Offer',
    // Le libellé LOCALISÉ — le balisage doit refléter ce que la page affiche.
    name: planLabel(p.id, locale),
    price: formatPriceCad(p.priceMonthlyCents, 'en'),
    priceCurrency: 'CAD',
    availability: 'https://schema.org/InStock',
    url: absoluteUrl('/tarifs', locale),
    // La périodicité, sans quoi « 14.95 » ne veut rien dire.
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: formatPriceCad(p.priceMonthlyCents, 'en'),
      priceCurrency: 'CAD',
      unitCode: 'MON',
      billingIncrement: 1,
    },
    // Les trois nombres qui distinguent réellement les paliers. Le reste des
    // fonctionnalités est commun aux trois forfaits : rien à déclarer par
    // offre, sans quoi le balisage inventerait des différences que la page
    // n'affiche pas.
    description:
      locale === 'en'
        ? `${maxBottlesLabel(p, 'en')} · ${p.monthlyRecommendations} pieces of personalized advice from Octave per month · ${p.includedUsers} user(s)`
        : `${maxBottlesLabel(p, 'fr')} · ${p.monthlyRecommendations} conseils personnalisés d'Octave par mois · ${p.includedUsers} utilisateur(s)`,
  }));

  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE}/#application`,
    name: 'iQWine',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web, iOS, Android',
    /**
     * Les adresses d'installation, DÉRIVÉES de `APP_STORE_URL` et de
     * `PLAY_STORE_URL`, comme tout le reste de ce fichier : les badges de la
     * page d'accueil et le balisage ne peuvent pas diverger.
     *
     * Deux boutiques depuis le 2026-09-16 (iOS le 2026-08-28, Android
     * approuvée par Google Play) : `downloadUrl` accepte plusieurs URL, et on
     * n'en déclare jamais une qui n'existe pas, d'où le filtre sur `null`,
     * qui rend son unique adresse au balisage si Android repassait à `null`.
     */
    downloadUrl: [APP_STORE_URL, PLAY_STORE_URL].filter(Boolean) as string[],
    publisher: { '@id': `${SITE}/#organization` },
    inLanguage: BCP47[locale],
    offers: offres,
    // L'essai, énoncé par sa règle complète — c'est l'écart D5 qu'on ne
    // reproduit pas ici.
    potentialAction: {
      '@type': 'RegisterAction',
      name:
        locale === 'en'
          ? `Free trial: ${TRIAL_FULL.en}`
          : `Essai gratuit : ${TRIAL_FULL.fr}`,
      target: absoluteUrl('/tarifs', locale),
    },
  };
}

/**
 * La FAQ, dérivée de `FAQ`.
 *
 * Les réponses passent en texte brut : Schema.org attend du texte, et une
 * apostrophe typographique ou un tiret cadratin y sont parfaitement valides —
 * c'est le HTML qui n'a rien à y faire.
 */
export function faqLd(locale: Locale) {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE}/#faq`,
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q[locale],
      acceptedAnswer: { '@type': 'Answer', text: item.a[locale] },
    })),
  };
}

/** Le graphe complet posé sur la page d'accueil. */
export function siteGraphLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationLd(locale),
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        name: 'iQWine',
        url: absoluteUrl('/', locale),
        publisher: { '@id': `${SITE}/#organization` },
        inLanguage: BCP47[locale],
      },
      softwareApplicationLd(locale),
    ],
  };
}

/**
 * ── POURQUOI `faqLd` A QUITTÉ CE GRAPHE (audit SEO, 2026-08-14) ──────────
 *
 * `siteGraphLd` est posé par le layout, donc sur les 28 URL. Il embarquait
 * `faqLd`, si bien que 26 pages déclaraient un `FAQPage` alors qu'elles
 * n'affichent AUCUNE question à l'écran : Conditions, Confidentialité,
 * Contact, Le film et toutes les pages Fonction.
 *
 * Google demande que les données structurées correspondent au contenu VISIBLE.
 * Le risque pratique était faible — les résultats enrichis FAQ sont restreints
 * aux sites gouvernementaux et de santé depuis 2023, donc rien ne s'affichait
 * de toute façon — mais le balisage était faux, et un balisage faux se corrige.
 *
 * La FAQ n'est rendue que par `SectionFaq`, importée par le seul
 * `TarifsContent`. `faqLd` est donc désormais injecté par la page Tarifs
 * elle-même, et par elle seule. Le jour où une autre page affichera vraiment
 * ces questions, elle l'appellera à son tour — jamais l'inverse.
 */
export function faqPageLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    ...faqLd(locale),
  };
}

/**
 * LE FIL D'ARIANE, en `BreadcrumbList` (audit du 2026-11-06).
 *
 * `FilAriane` l'affiche à l'écran depuis la v3 ; son commentaire annonçait le
 * balisage « posé côté serveur, page par page ». Les pages touchées par le
 * lot de contenus du 2026-11-06 le posent. Les éléments sont des chemins NUS :
 * la langue et le slug traduit viennent d'`absoluteUrl`, comme partout.
 */
export function breadcrumbLd(
  locale: Locale,
  elements: { nom: string; chemin: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: elements.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: e.nom,
      item: absoluteUrl(e.chemin, locale),
    })),
  };
}

/**
 * Un `FAQPage` pour une page qui AFFICHE ses propres questions (Guide,
 * Cellier, Apogée, Sommelier). Même règle que `faqLd` : le texte balisé est
 * exactement le texte visible, lu dans la même source.
 */
export function faqPageDepuis(
  locale: Locale,
  chemin: string,
  items: { q: Record<Locale, string>; a: Record<Locale, string> }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(chemin, locale)}#faq`,
    inLanguage: BCP47[locale],
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q[locale],
      acceptedAnswer: { '@type': 'Answer', text: item.a[locale] },
    })),
  };
}

/** Sérialise un ou plusieurs blocs JSON-LD pour un `<script>`, sans `<` brut. */
export function jsonLdScript(blocs: unknown): string {
  return JSON.stringify(blocs).replace(/</g, '\\u003c');
}

/** Le nombre de jours d'essai, pour les appelants qui l'affichent. */
export { TRIAL_DAYS };
