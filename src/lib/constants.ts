import type { Locale } from './i18n';

/**
 * URL d'essai self-serve (app produit). Le CTA primaire mène à un essai
 * RÉEL 14 jours sans carte — plus de gate bloquant côté marketing.
 * Override possible via NEXT_PUBLIC_APP_SIGNUP_URL.
 */
export const APP_SIGNUP_URL =
  process.env.NEXT_PUBLIC_APP_SIGNUP_URL || 'https://app.iqwine.ca/signup';

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
    { label: 'Pairing', href: '#demo' },
    { label: 'AI', href: '#ai' },
    { label: 'Cellar', href: '#cave-web' },
    { label: 'Restaurant', href: '#trois-moments' },
    { label: 'Pricing', href: '/tarifs' },
  ],
  fr: [
    { label: 'Accord', href: '#demo' },
    { label: 'IA', href: '#ai' },
    { label: 'Cave', href: '#cave-web' },
    { label: 'Restaurant', href: '#trois-moments' },
    { label: 'Tarifs', href: '/tarifs' },
  ],
} as const;

// ─── Hero ───
// Positionnement OS d'entrée + anchor concret + signal exclusivité subtil.
const HERO_MAP = {
  en: {
    badge: 'AI Sommelier · Cellar · SAQ · Restaurant',
    tagline: 'Your AI sommelier.',
    trust: [
      { title: 'Made in Québec', lines: ['Hosted in Canada', 'Private data'] },
      { title: 'Encrypted & private', lines: ['Private by design', 'Never sold'] },
      { title: 'Live SAQ', lines: ['Geolocated real-time inventory'] },
      { title: 'No card required', lines: ['Free 14-day trial', 'Cancel anytime'] },
    ],
    variantA: {
      headlineTop: 'Your AI sommelier.',
      headlineBottom: 'At home, at the SAQ, at the restaurant.',
      headline: 'Your AI sommelier. At home, at the SAQ, at the restaurant.',
      subheadline:
        'It knows your taste, your cellar, and live SAQ availability.',
      anchor: 'Made in Québec · Live SAQ availability · Private & encrypted',
    },
    variantB: {
      headlineTop: 'Your collection,',
      headlineBottom: 'finally alive.',
      headline: 'Your collection, finally alive.',
      subheadline:
        'Designed for collectors. Not for inventory.',
      anchor: 'Scan. Understand. Open at the right moment.',
    },
    ctaPrimary: 'Start free — 14 days, no card',
    ctaSecondary: 'Try the live demo',
  },
  fr: {
    badge: 'Sommelier IA · Cave · SAQ · Restaurant',
    tagline: 'Votre sommelier IA.',
    trust: [
      { title: 'Conçu au Québec', lines: ['Hébergé au Canada', 'Données privées'] },
      { title: 'Chiffré & privé', lines: ['Privé dès la conception', 'Jamais revendu'] },
      { title: 'SAQ en direct', lines: ['Inventaire géolocalisé en temps réel'] },
      { title: 'Aucune carte requise', lines: ['Essai gratuit 14 jours', 'Annulable en tout temps'] },
    ],
    variantA: {
      headlineTop: 'Votre sommelier IA.',
      headlineBottom: 'À la maison, à la SAQ, au restaurant.',
      headline: 'Votre sommelier IA. À la maison, à la SAQ, au restaurant.',
      subheadline:
        'Il connaît vos goûts, votre cave et la SAQ en temps réel.',
      anchor: 'Conçu au Québec · Disponibilités SAQ en direct · Données privées & chiffrées',
    },
    variantB: {
      headlineTop: 'Votre collection,',
      headlineBottom: 'enfin vivante.',
      headline: 'Votre collection, enfin vivante.',
      subheadline:
        'Pensé pour les collectionneurs. Pas pour des inventaires.',
      anchor: 'Scannez. Comprenez. Ouvrez au bon moment.',
    },
    ctaPrimary: 'Commencer — 14 jours, sans carte',
    ctaSecondary: 'Essayer la démo',
  },
};

// ─── Accessor functions ───
export function getNavLinks(locale: Locale) {
  return NAV_LINKS_MAP[locale];
}
export function getHero(locale: Locale) {
  return HERO_MAP[locale];
}
