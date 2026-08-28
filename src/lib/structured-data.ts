import { PLANS, formatPriceCad, maxBottlesLabel, planLabel } from '@/lib/plans';
import { FAQ } from '@/lib/faq';
import { TRIAL_DAYS, TRIAL_FULL } from '@/lib/trial';
import { APP_STORE_URL } from '@/lib/constants';
import { BCP47, SITE_ORIGIN, absoluteUrl, type Locale } from '@/lib/locale';

/**
 * DONNÉES STRUCTURÉES — dérivées des sources typées, jamais écrites à la main.
 *
 * ── Le principe qui gouverne ce fichier ───────────────────────────────────
 * Rien ici n'est saisi en dur : les prix viennent de `PLANS`, les questions de
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
 * L'organisation, enrichie.
 *
 * `Organization` seule ne dit rien de ce qu'on vend. On y ajoute l'éditeur
 * réel, la zone desservie et la langue — trois faits qu'un assistant reprend
 * volontiers et qu'aucune autre source de la page ne porte.
 */
export function organizationLd(locale: Locale) {
  return {
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: 'iQWine',
    legalName: 'Groupe Medtech Inc.',
    url: SITE,
    logo: `${SITE}/icon.png`,
    description:
      locale === 'en'
        ? 'The AI sommelier that knows what to open, what to buy and what to order.'
        : 'Le sommelier IA qui sait quoi ouvrir, quoi acheter et quoi commander.',
    areaServed: { '@type': 'AdministrativeArea', name: 'Québec, Canada' },
    knowsLanguage: ['fr-CA', 'en-CA'],
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
 * plateforme). L'essai est déclaré par sa VRAIE règle — les deux bornes.
 */
export function softwareApplicationLd(locale: Locale) {
  const offres = PLANS.map((p) => ({
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
    // Le plafond de bouteilles, qui distingue réellement les paliers.
    description:
      locale === 'en'
        ? `${maxBottlesLabel(p, 'en')} · ${p.monthlyRecommendations} interactions with Octave per month · ${p.includedUsers} user(s)`
        : `${maxBottlesLabel(p, 'fr')} · ${p.monthlyRecommendations} interactions avec Octave par mois · ${p.includedUsers} utilisateur(s)`,
  }));

  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE}/#application`,
    name: 'iQWine',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web, iOS, Android',
    /**
     * L'adresse d'installation, depuis la publication iOS (2026-08-28). Elle
     * est DÉRIVÉE de `APP_STORE_URL`, comme tout le reste de ce fichier : le
     * badge de la page d'accueil et le balisage ne peuvent pas diverger.
     *
     * Android reste déclarée en `operatingSystem` — l'app web y fonctionne —
     * mais SANS adresse, parce qu'il n'y en a pas encore. Annoncer à Google un
     * téléchargement qui n'existe pas coûterait plus que le silence.
     */
    downloadUrl: APP_STORE_URL,
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

/** Le nombre de jours d'essai, pour les appelants qui l'affichent. */
export { TRIAL_DAYS };
