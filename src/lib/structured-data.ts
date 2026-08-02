import { PLANS, formatPriceCad, maxBottlesLabel, type MarketingPlan } from '@/lib/plans';
import { FAQ } from '@/lib/faq';
import { TRIAL_DAYS, TRIAL_FULL } from '@/lib/trial';
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

/** Nom commercial d'un forfait, tel qu'affiché. */
const NOM_FORFAIT: Record<MarketingPlan['id'], string> = {
  gratuit: 'Gratuit',
  standard: 'Standard',
  pro: 'Pro',
  famille: 'Passionné',
};

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
    name: NOM_FORFAIT[p.id],
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
        ? `${maxBottlesLabel(p, 'en')} · ${p.monthlyRecommendations} Octave recommendations per month · ${p.includedUsers} user(s)`
        : `${maxBottlesLabel(p, 'fr')} · ${p.monthlyRecommendations} recommandations d'Octave par mois · ${p.includedUsers} utilisateur(s)`,
  }));

  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE}/#application`,
    name: 'iQWine',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web, iOS',
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
      faqLd(locale),
    ],
  };
}

/** Le nombre de jours d'essai, pour les appelants qui l'affichent. */
export { TRIAL_DAYS };
