import type { Locale } from './i18n';

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

// ─── Eyebrows (mono uppercase, ouvre chaque section) ───
const EYEBROWS_MAP = {
  en: {
    beta: 'Access · Founders',
  },
  fr: {
    beta: 'Accès · Fondateurs',
  },
};

// ─── Navigation V5 (4 ancres existantes après condensation) ───
const NAV_LINKS_MAP = {
  en: [
    { label: 'AI', href: '#ai' },
    { label: 'Cellar', href: '#cave-web' },
    { label: 'Moments', href: '#trois-moments' },
    { label: 'Access', href: '#beta' },
  ],
  fr: [
    { label: 'IA', href: '#ai' },
    { label: 'Cave', href: '#cave-web' },
    { label: 'Moments', href: '#trois-moments' },
    { label: 'Accès', href: '#beta' },
  ],
} as const;

// ─── Hero ───
// Positionnement OS d'entrée + anchor concret + signal exclusivité subtil.
const HERO_MAP = {
  en: {
    badge: 'First Wave · 100 Cellars · By Invitation',
    variantA: {
      headlineTop: 'The private intelligence',
      headlineBottom: 'of your cellar.',
      headline: 'The private intelligence of your cellar.',
      subheadline:
        'Private sommelier. Tasting memory. A living cellar.',
      anchor: 'Scan. Understand. Open at the right moment.',
    },
    variantB: {
      headlineTop: 'Your collection,',
      headlineBottom: 'finally alive.',
      headline: 'Your collection, finally alive.',
      subheadline:
        'Designed for collectors. Not for inventory.',
      anchor: 'Scan. Understand. Open at the right moment.',
    },
    ctaPrimary: 'Request Access',
    ctaSecondary: 'See the Suite',
  },
  fr: {
    badge: 'Première vague · 100 celliers · Sur invitation',
    variantA: {
      headlineTop: 'L\'intelligence privée',
      headlineBottom: 'de votre cave.',
      headline: 'L\'intelligence privée de votre cave.',
      subheadline:
        'Sommelier privé. Mémoire de dégustation. Cellier vivant.',
      anchor: 'Scannez. Comprenez. Ouvrez au bon moment.',
    },
    variantB: {
      headlineTop: 'Votre collection,',
      headlineBottom: 'enfin vivante.',
      headline: 'Votre collection, enfin vivante.',
      subheadline:
        'Pensé pour les collectionneurs. Pas pour des inventaires.',
      anchor: 'Scannez. Comprenez. Ouvrez au bon moment.',
    },
    ctaPrimary: 'Demander l\'accès',
    ctaSecondary: 'Voir la suite',
  },
};

// ─── Beta — Cercle des fondateurs avec FOMO subtil élégant ───
const BETA_MAP = {
  en: {
    overline: 'By Invitation',
    title: 'The first wave opens.',
    description:
      'First wave limited to 100 cellars. Private onboarding for founding members. No public sign-up.',
    note: '100 cellars · By invitation only',
    detail:
      'Founders shape the suite. Their reserves enter first. Their feedback writes the next chapter.',
  },
  fr: {
    overline: 'Sur invitation',
    title: 'La première vague s\'ouvre.',
    description:
      'Première vague limitée à 100 celliers. Onboarding privé pour les fondateurs. Pas d\'inscription publique.',
    note: '100 celliers · Sur invitation',
    detail:
      'Les fondateurs façonnent la suite. Leurs réserves entrent en premier. Leurs retours écrivent le chapitre suivant.',
  },
};

// Conservé pour rétrocompat (ancien form, plus utilisé)
export const MSP_SIZES = ['1-50', '51-200', '201-500', '501-1500', '1500+'];

// ─── Accessor functions ───
export function getEyebrows(locale: Locale) {
  return EYEBROWS_MAP[locale];
}
export function getNavLinks(locale: Locale) {
  return NAV_LINKS_MAP[locale];
}
export function getHero(locale: Locale) {
  return HERO_MAP[locale];
}
export function getBeta(locale: Locale) {
  return BETA_MAP[locale];
}
