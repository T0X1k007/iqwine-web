import type { Locale } from './i18n';
import { TRIAL_CTA, TRIAL_SHORT } from '@/lib/trial';

/**
 * URL d'essai self-serve (app produit). Le CTA primaire mène à un essai
 * RÉEL sans carte, plus de gate bloquant côté marketing. La DURÉE de
 * l'essai n'est pas écrite ici : elle vit dans `src/lib/trial.ts`, seule
 * source, parce qu'elle a deux bornes et qu'on n'en a longtemps écrit qu'une.
 * Override possible via NEXT_PUBLIC_APP_SIGNUP_URL.
 */
export const APP_SIGNUP_URL =
  process.env.NEXT_PUBLIC_APP_SIGNUP_URL || 'https://app.iqwine.ai/signup';

/**
 * URL de connexion (app produit) pour les utilisateurs existants.
 * Override possible via NEXT_PUBLIC_APP_LOGIN_URL.
 */
export const APP_LOGIN_URL =
  process.env.NEXT_PUBLIC_APP_LOGIN_URL || 'https://app.iqwine.ai/login';

/**
 * LA BASCULE DE PUBLICATION (refonte v3, décision d'Eric 2026-08-12).
 *
 * `null` tant qu'iOS 1.0 n'est pas PUBLIÉE sur l'App Store (au 2026-08-12 :
 * soumise, en attente de vérification, donc null). Le jour de la publication,
 * poser ici l'URL App Store bascule le CTA principal du hero de
 * « Rencontrer Octave » vers « Télécharger iQWine » sans toucher au layout.
 * Aucune mention de téléchargement ne doit exister tant que c'est null.
 */
export const APP_STORE_URL: string | null = null;

/**
 * Construit l'URL d'essai en propageant l'attribution vers l'app (cross-domain) :
 * UTM standard + source (emplacement du CTA) + plan/période/langue éventuels.
 * L'app cellier-vin lit ces params au signup pour boucler visiteur→essai→payant.
 * Best-effort : retombe sur APP_SIGNUP_URL nu si l'URL est invalide.
 */
export function buildSignupUrl(
  source: string,
  opts?: { plan?: string; period?: 'monthly' | 'yearly'; lang?: Locale },
): string {
  try {
    const url = new URL(APP_SIGNUP_URL);
    url.searchParams.set('utm_source', 'marketing');
    url.searchParams.set('utm_medium', 'cta');
    url.searchParams.set('utm_campaign', 'trial');
    url.searchParams.set('src', source);
    if (opts?.plan) url.searchParams.set('plan', opts.plan);
    if (opts?.period) url.searchParams.set('period', opts.period);
    if (opts?.lang) url.searchParams.set('lang', opts.lang);
    return url.toString();
  } catch {
    return APP_SIGNUP_URL;
  }
}

/**
 * Copywriting iQWine, voix sommelier d'hôtel particulier.
 * Positionnement : « Le système d'intelligence privé de votre cave. »
 * (OS du collectionneur, semé subtilement, pas d'acronyme tech en clair.)
 *
 * Voix : vouvoiement éditorial luxe (FR) · same elevation in EN.
 * Phrases 8-14 mots. Voix active. Pas d'exclamation. Pas de SaaS-speak.
 * Vocabulaire collectionneur permis : collection, réserve, garde,
 * dégustation, millésime, apogée, plateau, finale, élevage.
 */

// ─── Navigation V5 (ancres existantes après condensation) ───
// ── Navigation (architecture Fonctions, validée par Eric le 2026-08-13) ────
// Quatre liens, pas quinze : Octave = QUI il est · Fonctions = CE qu'il fait ·
// Notre histoire = D'OÙ ça vient · Tarifs = COMMENT commencer. Les ancres de
// sections quittent la nav, la home se lit, elle ne se navigue pas.
//
// « Notre histoire » (Eric, 2026-08-14) est un LIBELLÉ de navigation, pas une
// page nouvelle : il pointe les URLs existantes (/notre-maison ↔
// /en/our-story). Aucune redirection, aucun canonical ni hreflang touché,
// aucun H1 modifié — l'identité SEO de la page ne bouge pas d'un octet.
const NAV_LINKS_MAP = {
  en: [
    { label: 'Octave', href: '/sommelier-ia' },
    { label: 'Our story', href: '/notre-maison' },
    { label: 'Pricing', href: '/tarifs' },
  ],
  fr: [
    { label: 'Octave', href: '/sommelier-ia' },
    { label: 'Notre histoire', href: '/notre-maison' },
    { label: 'Tarifs', href: '/tarifs' },
  ],
} as const;

// ─── Menu « Fonctions » (dropdown), des MOMENTS, jamais des modules ───────
// Tant qu'une page Fonction n'est pas née (ordre L), son entrée mène au
// moment correspondant du hub ; on bascule vers la vraie route à sa naissance.
const FONCTIONS_LINKS_MAP = {
  en: [
    { label: 'Choosing a wine', sous: 'In the store, for your palate', href: '/choisir-un-vin' },
    { label: 'At the restaurant', sous: 'The wine list, read for you', href: '/carte-des-vins' },
    { label: 'Wine pairing', sous: 'The meal is ready, so is the bottle', href: '/accord-mets-vins' },
    { label: 'The cellar', sous: 'Your cave, known by heart', href: '/cellier-intelligent' },
    { label: 'Peak window', sous: 'Every bottle has its moment', href: '/apogee' },
    { label: 'All features →', sous: 'The whole day with Octave', href: '/fonctions' },
  ],
  fr: [
    { label: 'Choisir un vin', sous: 'En magasin, pour votre palais', href: '/choisir-un-vin' },
    { label: 'Au restaurant', sous: 'La carte des vins, lue pour vous', href: '/carte-des-vins' },
    { label: 'Accords mets-vins', sous: 'Le repas est prêt, la bouteille aussi', href: '/accord-mets-vins' },
    { label: 'Le cellier', sous: 'Votre cave, sue par cœur', href: '/cellier-intelligent' },
    { label: 'L’apogée', sous: 'Chaque bouteille a son moment', href: '/apogee' },
    { label: 'Toutes les fonctions →', sous: 'La journée complète avec Octave', href: '/fonctions' },
  ],
} as const;

// ─── Hero ───
// Positionnement OS d'entrée + anchor concret + signal exclusivité subtil.
const HERO_MAP = {
  en: {
    tagline: 'Your personal sommelier.',
    trust: [
      { title: 'Made in Québec', lines: ['Hosted in Canada', 'Private data'] },
      { title: 'Encrypted & private', lines: ['Private by design', 'Never sold'] },
      { title: 'Local availability', lines: ['Verified store by store, near you'] },
      { title: 'No card required', lines: [TRIAL_SHORT.en, 'Cancel anytime'] },
    ],
    variantA: {
      eyebrow: 'YOUR PERSONAL SOMMELIER',
      headlineTop: 'Always know',
      headlineBottom: 'which bottle to open.',
      subheadline:
        "Octave knows your cellar, your taste, every bottle's peak and where to find it near you, and turns it all into one decision: the right bottle, at the right moment.",
      categoryLine: 'Others organize your cellar. Octave tells you what to do with it.',
      reassurance: `${TRIAL_SHORT.en} · No card · No cellar to enter`,
      ctaHeroPrimary: 'Find what to drink tonight',
      ctaHeroSecondary: 'See Octave in action',
    },
    ctaPrimary: TRIAL_CTA.en,
  },
  fr: {
    tagline: 'Votre sommelier personnel.',
    trust: [
      { title: 'Conçu au Québec', lines: ['Hébergé au Canada', 'Données privées'] },
      { title: 'Chiffré & privé', lines: ['Privé dès la conception', 'Jamais revendu'] },
      { title: 'Disponibilité locale', lines: ['Vérifiée magasin par magasin, près de vous'] },
      { title: 'Aucune carte requise', lines: [TRIAL_SHORT.fr, 'Annulable en tout temps'] },
    ],
    variantA: {
      eyebrow: 'VOTRE SOMMELIER PERSONNEL',
      headlineTop: 'Sachez toujours',
      headlineBottom: 'quelle bouteille ouvrir.',
      subheadline:
        "Octave connaît votre cave, votre palais, l'apogée de chaque bouteille et où la trouver près de vous, et transforme tout ça en une décision : la bonne bouteille, au bon moment.",
      categoryLine: 'Les autres rangent votre cave. Octave vous dit quoi en faire.',
      reassurance: `${TRIAL_SHORT.fr} · Sans carte · Aucune cave à saisir`,
      ctaHeroPrimary: 'Trouver quoi boire ce soir',
      ctaHeroSecondary: 'Voir Octave en action',
    },
    ctaPrimary: TRIAL_CTA.fr,
  },
};

// ─── Accessor functions ───
export function getNavLinks(locale: Locale) {
  return NAV_LINKS_MAP[locale];
}

export function getFonctionsLinks(locale: Locale) {
  return FONCTIONS_LINKS_MAP[locale];
}
export function getHero(locale: Locale) {
  return HERO_MAP[locale];
}
