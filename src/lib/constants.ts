import type { Locale } from './i18n';

/**
 * URL d'essai self-serve (app produit). Le CTA primaire mène à un essai
 * RÉEL 14 jours sans carte — plus de gate bloquant côté marketing.
 * Override possible via NEXT_PUBLIC_APP_SIGNUP_URL.
 */
export const APP_SIGNUP_URL =
  process.env.NEXT_PUBLIC_APP_SIGNUP_URL || 'https://app.iqwine.ca/signup';

/**
 * URL de connexion (app produit) pour les utilisateurs existants.
 * Override possible via NEXT_PUBLIC_APP_LOGIN_URL.
 */
export const APP_LOGIN_URL =
  process.env.NEXT_PUBLIC_APP_LOGIN_URL || 'https://app.iqwine.ca/login';

/**
 * Copywriting iQWine — voix sommelier d'hôtel particulier.
 * Positionnement : « Le système d'intelligence privé de votre cave. »
 * (OS du collectionneur, semé subtilement — pas d'acronyme tech en clair.)
 *
 * Voix : vouvoiement éditorial luxe (FR) · same elevation in EN.
 * Phrases 8-14 mots. Voix active. Pas d'exclamation. Pas de SaaS-speak.
 * Vocabulaire collectionneur permis : collection, réserve, garde,
 * dégustation, millésime, apogée, plateau, finale, élevage.
 */

// ─── Navigation V5 (ancres existantes après condensation) ───
const NAV_LINKS_MAP = {
  en: [
    { label: 'Pairing', href: '/#demo' },
    { label: 'AI', href: '/#ai' },
    { label: 'Cellar', href: '/#cave-web' },
    { label: 'Restaurant', href: '/#trois-moments' },
    { label: 'Pricing', href: '/#tarifs' },
  ],
  fr: [
    { label: 'Accord', href: '/#demo' },
    { label: 'IA', href: '/#ai' },
    { label: 'Cave', href: '/#cave-web' },
    { label: 'Restaurant', href: '/#trois-moments' },
    { label: 'Tarifs', href: '/#tarifs' },
  ],
} as const;

// ─── Menu « Produit » (dropdown) — liens vers les pages dédiées ───
const PRODUCT_LINKS_MAP = {
  en: [
    { label: 'The smart cellar', href: '/' },
    { label: 'AI Sommelier', href: '/sommelier-ia' },
    { label: 'Pricing', href: '/tarifs' },
  ],
  fr: [
    { label: 'La cave intelligente', href: '/' },
    { label: 'Sommelier IA', href: '/sommelier-ia' },
    { label: 'Tarifs', href: '/tarifs' },
  ],
} as const;

// ─── Hero ───
// Positionnement OS d'entrée + anchor concret + signal exclusivité subtil.
const HERO_MAP = {
  en: {
    tagline: 'Your AI sommelier.',
    trust: [
      { title: 'Made in Québec', lines: ['Hosted in Canada', 'Private data'] },
      { title: 'Encrypted & private', lines: ['Private by design', 'Never sold'] },
      { title: 'Live SAQ', lines: ['Geolocated real-time inventory'] },
      { title: 'No card required', lines: ['Free 14-day trial', 'Cancel anytime'] },
    ],
    variantA: {
      eyebrow: 'YOUR PERSONAL SOMMELIER',
      headlineTop: 'Always know',
      headlineBottom: 'which bottle to open.',
      subheadline:
        "Octave knows your cellar, your taste, every bottle's peak and your SAQ's live stock — and turns it all into one decision: the right bottle, at the right moment.",
      categoryLine: 'Others organize your cellar. Octave tells you what to do with it.',
      reassurance: '14 days free · No card · No cellar to enter',
      ctaHeroPrimary: 'Find what to drink tonight',
      ctaHeroSecondary: 'See Octave in action',
    },
    ctaPrimary: 'Free Trial 14 Days',
  },
  fr: {
    tagline: 'Votre sommelier IA.',
    trust: [
      { title: 'Conçu au Québec', lines: ['Hébergé au Canada', 'Données privées'] },
      { title: 'Chiffré & privé', lines: ['Privé dès la conception', 'Jamais revendu'] },
      { title: 'SAQ en direct', lines: ['Inventaire géolocalisé en temps réel'] },
      { title: 'Aucune carte requise', lines: ['Essai gratuit 14 jours', 'Annulable en tout temps'] },
    ],
    variantA: {
      eyebrow: 'VOTRE SOMMELIER PERSONNEL',
      headlineTop: 'Sachez toujours',
      headlineBottom: 'quelle bouteille ouvrir.',
      subheadline:
        "Octave connaît votre cave, votre palais, l'apogée de chaque bouteille et le stock de votre SAQ en direct — et transforme tout ça en une décision : la bonne bouteille, au bon moment.",
      categoryLine: 'Les autres rangent votre cave. Octave vous dit quoi en faire.',
      reassurance: '14 jours gratuits · Sans carte · Aucune cave à saisir',
      ctaHeroPrimary: 'Trouver quoi boire ce soir',
      ctaHeroSecondary: 'Voir Octave en action',
    },
    ctaPrimary: 'Essai gratuit 14 jours',
  },
};

// ─── Accessor functions ───
export function getNavLinks(locale: Locale) {
  return NAV_LINKS_MAP[locale];
}

export function getProductLinks(locale: Locale) {
  return PRODUCT_LINKS_MAP[locale];
}
export function getHero(locale: Locale) {
  return HERO_MAP[locale];
}
