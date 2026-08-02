import { PLANS, formatPriceCad, maxBottlesLabel, type MarketingPlan } from '@/lib/plans';
import { FAQ } from '@/lib/faq';
import { TRIAL_DAYS, TRIAL_FULL } from '@/lib/trial';

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
 * ── Une seule langue, et il faut le dire ──────────────────────────────────
 * Le site choisit sa langue côté CLIENT (`localStorage`, appliqué après le
 * montage). Un robot ne voit donc jamais que le rendu par défaut : le français.
 * Ces données sont produites en français et déclarées `fr-CA`, ce qui est la
 * vérité de ce qui est servi.
 *
 * Tant que l'anglais n'a pas ses propres URL, poser des `hreflang` serait
 * déclarer des variantes qui n'existent pas — pire que leur absence.
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.iqwine.ca';

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
export function organizationLd() {
  return {
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: 'iQWine',
    legalName: 'Groupe Medtech Inc.',
    url: SITE,
    logo: `${SITE}/icon.png`,
    description:
      'Le sommelier IA qui sait quoi ouvrir, quoi acheter et quoi commander.',
    areaServed: { '@type': 'AdministrativeArea', name: 'Québec, Canada' },
    knowsLanguage: ['fr-CA', 'en-CA'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${SITE}/contact`,
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
export function softwareApplicationLd() {
  const offres = PLANS.map((p) => ({
    '@type': 'Offer',
    name: NOM_FORFAIT[p.id],
    price: formatPriceCad(p.priceMonthlyCents, 'en'),
    priceCurrency: 'CAD',
    availability: 'https://schema.org/InStock',
    url: `${SITE}/tarifs`,
    // La périodicité, sans quoi « 14.95 » ne veut rien dire.
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: formatPriceCad(p.priceMonthlyCents, 'en'),
      priceCurrency: 'CAD',
      unitCode: 'MON',
      billingIncrement: 1,
    },
    // Le plafond de bouteilles, qui distingue réellement les paliers.
    description: `${maxBottlesLabel(p, 'fr')} · ${p.monthlyRecommendations} recommandations d'Octave par mois · ${p.includedUsers} utilisateur(s)`,
  }));

  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE}/#application`,
    name: 'iQWine',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web, iOS',
    publisher: { '@id': `${SITE}/#organization` },
    inLanguage: 'fr-CA',
    offers: offres,
    // L'essai, énoncé par sa règle complète — c'est l'écart D5 qu'on ne
    // reproduit pas ici.
    potentialAction: {
      '@type': 'RegisterAction',
      name: `Essai gratuit : ${TRIAL_FULL.fr}`,
      target: `${SITE}/tarifs`,
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
export function faqLd() {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE}/#faq`,
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q.fr,
      acceptedAnswer: { '@type': 'Answer', text: item.a.fr },
    })),
  };
}

/** Le graphe complet posé sur la page d'accueil. */
export function siteGraphLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationLd(),
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        name: 'iQWine',
        url: SITE,
        publisher: { '@id': `${SITE}/#organization` },
        inLanguage: 'fr-CA',
      },
      softwareApplicationLd(),
      faqLd(),
    ],
  };
}

/** Le nombre de jours d'essai, pour les appelants qui l'affichent. */
export { TRIAL_DAYS };
