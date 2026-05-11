import type { Locale } from './i18n';

/**
 * Copywriting iQWine — voix sommelier d'hôtel particulier.
 * Vouvoiement éditorial luxe (FR) · same elevation in EN.
 * Phrases 8-14 mots. Voix active. Pas d'exclamation. Pas de marketing-speak.
 * Vocabulaire œnologique permis : apogée, plateau, garde, finale, élevage, équilibre.
 */

// ─── Eyebrows (mono uppercase, ouvre chaque section) ───
const EYEBROWS_MAP = {
  en: {
    problem: '01 · Reality',
    platform: '02 · The Suite',
    impact: '03 · What Is Felt',
    beta: '04 · By Invitation',
  },
  fr: {
    problem: '01 · Constat',
    platform: '02 · La suite',
    impact: '03 · Ce qui se vit',
    beta: '04 · Sur invitation',
  },
};

// ─── Navigation ───
const NAV_LINKS_MAP = {
  en: [
    { label: 'Vision', href: '#problem' },
    { label: 'Suite', href: '#platform' },
    { label: 'Felt', href: '#impact' },
    { label: 'Access', href: '#beta' },
  ],
  fr: [
    { label: 'Vision', href: '#problem' },
    { label: 'Suite', href: '#platform' },
    { label: 'Ressenti', href: '#impact' },
    { label: 'Accès', href: '#beta' },
  ],
} as const;

// ─── Hero ───
const HERO_MAP = {
  en: {
    badge: 'Private Preview · By Invitation',
    variantA: {
      headlineTop: 'Your cellar deserves',
      headlineBottom: 'more than a list.',
      headline: 'Your cellar deserves more than a list.',
      subheadline:
        'The private sommelier for your cellar. Discreet. Precise. Always at the table.',
    },
    variantB: {
      headlineTop: 'A sommelier in your pocket.',
      headlineBottom: 'Always at the right moment.',
      headline: 'A sommelier in your pocket. Always at the right moment.',
      subheadline:
        'Discover, pair, scan, decide — with the calm of a great house.',
    },
    ctaPrimary: 'Request Access',
    ctaSecondary: 'See the Suite',
  },
  fr: {
    badge: 'Avant-première privée · Sur invitation',
    variantA: {
      headlineTop: 'Votre cellier mérite',
      headlineBottom: 'mieux qu\'une liste.',
      headline: 'Votre cellier mérite mieux qu\'une liste.',
      subheadline:
        'Le sommelier privé de votre cave. Discret. Précis. Toujours à table.',
    },
    variantB: {
      headlineTop: 'Un sommelier dans la poche.',
      headlineBottom: 'Toujours au bon moment.',
      headline: 'Un sommelier dans la poche. Toujours au bon moment.',
      subheadline:
        'Découvrir, accorder, scanner, décider — avec le calme d\'une grande maison.',
    },
    ctaPrimary: 'Demander l\'accès',
    ctaSecondary: 'Voir la suite',
  },
};

// ─── Problem (3 douleurs tranchantes) ───
const PROBLEM_MAP = {
  en: {
    title: 'Owning a cellar is not the same as living with it.',
    points: [
      {
        icon: 'Clock' as const,
        title: 'Peaks pass in silence',
        description:
          'A great wine reaches its plateau, then declines — without a word.',
      },
      {
        icon: 'Utensils' as const,
        title: 'Pairing remains a guess',
        description:
          'Tonight\'s menu meets last week\'s instinct. The match stays approximate.',
      },
      {
        icon: 'Camera' as const,
        title: 'Unknown labels stay strangers',
        description:
          'A gift, a discovery, a bottle from a trip. You meant to look it up.',
      },
    ],
  },
  fr: {
    title: 'Posséder une cave et y vivre, ce n\'est pas la même chose.',
    points: [
      {
        icon: 'Clock' as const,
        title: 'Les apogées passent en silence',
        description:
          'Un grand vin atteint son plateau, puis décline — sans un mot.',
      },
      {
        icon: 'Utensils' as const,
        title: 'L\'accord reste un pari',
        description:
          'Le menu du soir rencontre l\'intuition de la semaine dernière. L\'accord reste approximatif.',
      },
      {
        icon: 'Camera' as const,
        title: 'Les étiquettes inconnues restent muettes',
        description:
          'Un cadeau, une découverte, une bouteille de voyage. Vous vouliez vous renseigner.',
      },
    ],
  },
};

// ─── Solution / WhatIsIQWine — RETIRÉ (redondant avec Platform) ───
// ─── Shift — RETIRÉ (redondant avec Hero subheadline + tagline) ───

// Conservé pour compat type system (les fichiers legacy l'importent encore le temps de la migration)
const SOLUTION_MAP = {
  en: { title: '', subtitle: '', pillars: [] as Array<{ icon: 'Eye' | 'Sparkles' | 'Compass'; title: string; description: string }> },
  fr: { title: '', subtitle: '', pillars: [] as Array<{ icon: 'Eye' | 'Sparkles' | 'Compass'; title: string; description: string }> },
};
const SHIFT_MAP = {
  en: { title: '', lines: [] as string[] },
  fr: { title: '', lines: [] as string[] },
};

// ─── Platform — 6 gestes du sommelier (descriptions raccourcies) ───
const PLATFORM_MAP = {
  en: {
    title: 'The companion. Six gestures.',
    subtitle: 'Each one removes a friction. Together, they change the evening.',
    flowDescription:
      'See · Suggest · Pair · Scan · Search · Calibrate.',
    modules: [
      {
        name: 'Living Cellar',
        color: 'cellier' as const,
        glyph: 'C',
        tagline: 'Visual plan & heatmap',
        description: 'The living plan of your cellar.',
        details: 'Peaks pulse this week. Regions speak.',
        phase: 'See',
      },
      {
        name: 'Tonight Mode',
        color: 'sommelier' as const,
        glyph: 'T',
        tagline: 'The pairing engine',
        description: 'The menu on one side. The cellar on the other.',
        details: 'Three bottles, with their reasoning.',
        phase: 'Suggest',
      },
      {
        name: 'Restaurant Mode',
        color: 'sommelier' as const,
        glyph: 'R',
        tagline: 'A discreet sommelier at the table',
        description: 'Photograph the wine list. Receive the right choice.',
        details: 'Without anyone seeing.',
        phase: 'Pair',
      },
      {
        name: 'Label Scanner',
        color: 'decouverte' as const,
        glyph: 'S',
        tagline: 'Photo · QR · barcode',
        description: 'Point at the label. Read its story.',
        details: 'From vintage to drinking window.',
        phase: 'Scan',
      },
      {
        name: 'Natural Search',
        color: 'cellier' as const,
        glyph: 'Q',
        tagline: 'Speak to your cellar',
        description: '"A mineral white for tonight\'s fish."',
        details: 'Your cellar answers in your words.',
        phase: 'Search',
      },
      {
        name: 'Palate Calibration',
        color: 'decouverte' as const,
        glyph: 'P',
        tagline: 'Tasting notes that learn',
        description: 'Thirty tastings. A palate, mapped.',
        details: 'Wines you did not know you wanted.',
        phase: 'Calibrate',
      },
    ],
  },
  fr: {
    title: 'Le compagnon. Six gestes.',
    subtitle:
      'Chacun retire une friction. Ensemble, ils changent la soirée.',
    flowDescription:
      'Voir · Suggérer · Accorder · Scanner · Chercher · Calibrer.',
    modules: [
      {
        name: 'Cellier vivant',
        color: 'cellier' as const,
        glyph: 'C',
        tagline: 'Plan visuel & heatmap',
        description: 'Le plan vivant de votre cave.',
        details: 'Les apogées pulsent cette semaine. Les régions parlent.',
        phase: 'Voir',
      },
      {
        name: 'Mode Tonight',
        color: 'sommelier' as const,
        glyph: 'T',
        tagline: 'Le moteur d\'accords',
        description: 'Le menu d\'un côté. La cave de l\'autre.',
        details: 'Trois bouteilles, avec leur raisonnement.',
        phase: 'Suggérer',
      },
      {
        name: 'Mode Restaurant',
        color: 'sommelier' as const,
        glyph: 'R',
        tagline: 'Un sommelier discret à table',
        description: 'Photographiez la carte. Recevez le bon choix.',
        details: 'Sans qu\'il y paraisse.',
        phase: 'Accorder',
      },
      {
        name: 'Scanner d\'étiquettes',
        color: 'decouverte' as const,
        glyph: 'S',
        tagline: 'Photo · QR · code-barres',
        description: 'Pointez l\'étiquette. Lisez son histoire.',
        details: 'Du millésime à la fenêtre de garde.',
        phase: 'Scanner',
      },
      {
        name: 'Recherche naturelle',
        color: 'cellier' as const,
        glyph: 'Q',
        tagline: 'Parlez à votre cave',
        description: '« Un blanc minéral pour le poisson de ce soir. »',
        details: 'Votre cave répond dans vos mots.',
        phase: 'Chercher',
      },
      {
        name: 'Calibration du palais',
        color: 'decouverte' as const,
        glyph: 'P',
        tagline: 'Notes de dégustation qui apprennent',
        description: 'Trente dégustations. Un palais cartographié.',
        details: 'Des vins que vous ignoriez aimer.',
        phase: 'Calibrer',
      },
    ],
  },
};

// ─── Different — RETIRÉ (anti-définition creuse) ───
// Conservé pour compat type system
const DIFFERENT_MAP = {
  en: { title: '', points: [] as string[], conclusion: '' },
  fr: { title: '', points: [] as string[], conclusion: '' },
};

// ─── Impact — 4 micro-récits éditoriaux (DNA §1.3) ───
const IMPACT_MAP = {
  en: {
    title: 'What your cellar can say.',
    outcomes: [
      {
        icon: 'GlassWater' as const,
        title: 'Anticipation',
        description:
          'Tuesday. Your Brunello enters its plateau this week.',
      },
      {
        icon: 'Heart' as const,
        title: 'Gratitude',
        description:
          'Three bottles, perfect for Saturday\'s dinner.',
      },
      {
        icon: 'Sparkle' as const,
        title: 'Self-knowledge',
        description:
          'Four months without a Burgundy. That is not by chance.',
      },
      {
        icon: 'Library' as const,
        title: 'Opportunity',
        description:
          'This bottle will not return. Now is the moment.',
      },
    ],
  },
  fr: {
    title: 'Ce que votre cave peut dire.',
    outcomes: [
      {
        icon: 'GlassWater' as const,
        title: 'Anticipation',
        description:
          'Mardi. Votre Brunello entre dans son plateau cette semaine.',
      },
      {
        icon: 'Heart' as const,
        title: 'Gratitude',
        description:
          'Trois bouteilles, parfaites pour le souper de samedi.',
      },
      {
        icon: 'Sparkle' as const,
        title: 'Connaissance de soi',
        description:
          'Quatre mois sans Bourgogne. Ce n\'est pas un hasard.',
      },
      {
        icon: 'Library' as const,
        title: 'Opportunité',
        description:
          'Cette bouteille ne revient pas. C\'est le moment.',
      },
    ],
  },
};

// ─── Beta — Coming Soon, fier et sobre ───
const BETA_MAP = {
  en: {
    overline: 'By Invitation',
    title: 'Access opens by invitation.',
    description:
      'iQWine enters its first private wave in 2026. The companion is built quietly, by hand, for cellars that deserve more than a list.',
    note: 'No public sign-up — by invitation only.',
    detail: 'When the door opens, the first cellars will be welcomed personally.',
  },
  fr: {
    overline: 'Sur invitation',
    title: 'L\'accès s\'ouvre sur invitation.',
    description:
      'iQWine entre dans sa première vague privée en 2026. Le compagnon se construit en silence, à la main, pour des celliers qui méritent mieux qu\'une liste.',
    note: 'Pas d\'inscription publique — sur invitation uniquement.',
    detail: 'Quand la porte s\'ouvrira, les premiers celliers seront accueillis personnellement.',
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
export function getProblem(locale: Locale) {
  return PROBLEM_MAP[locale];
}
export function getShift(locale: Locale) {
  return SHIFT_MAP[locale];
}
export function getSolution(locale: Locale) {
  return SOLUTION_MAP[locale];
}
export function getPlatform(locale: Locale) {
  return PLATFORM_MAP[locale];
}
export function getDifferent(locale: Locale) {
  return DIFFERENT_MAP[locale];
}
export function getImpact(locale: Locale) {
  return IMPACT_MAP[locale];
}
export function getBeta(locale: Locale) {
  return BETA_MAP[locale];
}
