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
    problem: '01 · Reality',
    platform: '02 · The Suite',
    impact: '03 · Intelligence',
    circle: '04 · The Circle',
    beta: '05 · Access',
  },
  fr: {
    problem: '01 · Constat',
    platform: '02 · La suite',
    impact: '03 · Intelligence',
    circle: '04 · Le cercle',
    beta: '05 · L\'accès',
  },
};

// ─── Navigation (4 ancres) ───
const NAV_LINKS_MAP = {
  en: [
    { label: 'Vision', href: '#problem' },
    { label: 'Suite', href: '#platform' },
    { label: 'Circle', href: '#circle' },
    { label: 'Access', href: '#beta' },
  ],
  fr: [
    { label: 'Vision', href: '#problem' },
    { label: 'Suite', href: '#platform' },
    { label: 'Cercle', href: '#circle' },
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

// ─── Problem (3 douleurs, cadrage collectionneur) ───
const PROBLEM_MAP = {
  en: {
    title: 'A collection is not an inventory.',
    points: [
      {
        icon: 'Clock' as const,
        title: 'Great bottles peak silently',
        description:
          'Vintage charts in books. Plateau windows uncertain. The cellar remembers — and tells you nothing.',
      },
      {
        icon: 'Utensils' as const,
        title: 'Pairings stay approximate',
        description:
          'Tonight\'s menu meets last week\'s instinct. The right bottle dies on a shelf, two rows away.',
      },
      {
        icon: 'Camera' as const,
        title: 'Memorable bottles disappear',
        description:
          'A gift. A discovery. A bottle from a trip. You meant to look it up. It became a memory.',
      },
    ],
  },
  fr: {
    title: 'Une collection n\'est pas un inventaire.',
    points: [
      {
        icon: 'Clock' as const,
        title: 'Les grands vins atteignent leur apogée en silence',
        description:
          'Les tables de millésime restent dans les livres. Les plateaux restent flous. Votre cave retient — et ne dit rien.',
      },
      {
        icon: 'Utensils' as const,
        title: 'Les accords restent approximatifs',
        description:
          'Le menu du soir rencontre l\'intuition de la semaine dernière. La bonne bouteille meurt sur une étagère, deux rangs plus loin.',
      },
      {
        icon: 'Camera' as const,
        title: 'Les bouteilles marquantes disparaissent',
        description:
          'Un cadeau. Une découverte. Une bouteille de voyage. Vous vouliez vous renseigner. C\'est devenu un souvenir.',
      },
    ],
  },
};

// ─── Compat types (sections retirées) ───
const SOLUTION_MAP = {
  en: { title: '', subtitle: '', pillars: [] as Array<{ icon: 'Eye' | 'Sparkles' | 'Compass'; title: string; description: string }> },
  fr: { title: '', subtitle: '', pillars: [] as Array<{ icon: 'Eye' | 'Sparkles' | 'Compass'; title: string; description: string }> },
};
const SHIFT_MAP = {
  en: { title: '', lines: [] as string[] },
  fr: { title: '', lines: [] as string[] },
};

// ─── Platform / La Suite — 6 gestes en langage collectionneur ───
const PLATFORM_MAP = {
  en: {
    title: 'A sommelier, six functions.',
    subtitle: 'Each one removes a friction. Together, they change the evening.',
    flowDescription:
      'See · Pair · Discover · Scan · Search · Calibrate.',
    modules: [
      {
        name: 'Living Cellar',
        color: 'cellier' as const,
        glyph: 'C',
        tagline: 'Visual plan & heatmap',
        description: 'The living plan of your collection.',
        details: 'Peaks pulse this week. Regions speak.',
        phase: 'See',
      },
      {
        name: 'Tonight Mode',
        color: 'sommelier' as const,
        glyph: 'T',
        tagline: 'Pairing intelligence',
        description: 'The menu on one side. The cellar on the other.',
        details: 'Three bottles, with their reasoning.',
        phase: 'Pair',
      },
      {
        name: 'Restaurant Mode',
        color: 'sommelier' as const,
        glyph: 'R',
        tagline: 'A discreet sommelier at the table',
        description: 'Photograph the wine list. Receive the right choice.',
        details: 'Without anyone seeing.',
        phase: 'Discover',
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
        tagline: 'Tasting memory that learns',
        description: 'Thirty tastings. A palate, mapped.',
        details: 'Wines you did not know you wanted.',
        phase: 'Calibrate',
      },
    ],
  },
  fr: {
    title: 'Un sommelier, six fonctions.',
    subtitle:
      'Chacune retire une friction. Ensemble, elles changent la soirée.',
    flowDescription:
      'Voir · Accorder · Découvrir · Scanner · Chercher · Calibrer.',
    modules: [
      {
        name: 'Cellier vivant',
        color: 'cellier' as const,
        glyph: 'C',
        tagline: 'Plan visuel & heatmap',
        description: 'Le plan vivant de votre collection.',
        details: 'Les apogées pulsent cette semaine. Les régions parlent.',
        phase: 'Voir',
      },
      {
        name: 'Mode Tonight',
        color: 'sommelier' as const,
        glyph: 'T',
        tagline: 'Intelligence d\'accord',
        description: 'Le menu d\'un côté. La cave de l\'autre.',
        details: 'Trois bouteilles, avec leur raisonnement.',
        phase: 'Accorder',
      },
      {
        name: 'Mode Restaurant',
        color: 'sommelier' as const,
        glyph: 'R',
        tagline: 'Un sommelier discret à table',
        description: 'Photographiez la carte. Recevez le bon choix.',
        details: 'Sans qu\'il y paraisse.',
        phase: 'Découvrir',
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
        tagline: 'Mémoire de dégustation qui apprend',
        description: 'Trente dégustations. Un palais cartographié.',
        details: 'Des vins que vous ignoriez aimer.',
        phase: 'Calibrer',
      },
    ],
  },
};

// ─── Compat (retiré) ───
const DIFFERENT_MAP = {
  en: { title: '', points: [] as string[], conclusion: '' },
  fr: { title: '', points: [] as string[], conclusion: '' },
};

// ─── Intelligence — 4 messages AI contextuels (DNA §10) ───
// Cette section démontre l'IA, pas la définit. Le système parle.
const IMPACT_MAP = {
  en: {
    title: 'What your cellar can now say.',
    subtitle: 'Four messages. One palate, listened to.',
    outcomes: [
      {
        icon: 'GlassWater' as const,
        title: 'Apogee',
        description:
          'Your Brunello enters its plateau this week. Tuesday would be ideal.',
      },
      {
        icon: 'Heart' as const,
        title: 'Pairing',
        description:
          'Three bottles, perfectly matched to the menu you just photographed.',
      },
      {
        icon: 'Sparkle' as const,
        title: 'Palate',
        description:
          'You increasingly favor mineral whites. Your last six choices confirm it.',
      },
      {
        icon: 'Library' as const,
        title: 'Opportunity',
        description:
          'This bottle is becoming rare. Tonight would be a fine moment.',
      },
    ],
  },
  fr: {
    title: 'Ce que votre cave peut désormais vous dire.',
    subtitle: 'Quatre messages. Un palais, enfin écouté.',
    outcomes: [
      {
        icon: 'GlassWater' as const,
        title: 'Apogée',
        description:
          'Votre Brunello entre dans son plateau cette semaine. Mardi serait idéal.',
      },
      {
        icon: 'Heart' as const,
        title: 'Accord',
        description:
          'Trois bouteilles, parfaitement accordées au menu que vous venez de photographier.',
      },
      {
        icon: 'Sparkle' as const,
        title: 'Palais',
        description:
          'Vous aimez de plus en plus les blancs minéraux. Vos six derniers choix le confirment.',
      },
      {
        icon: 'Library' as const,
        title: 'Opportunité',
        description:
          'Cette bouteille devient rare. Ce soir serait un beau moment.',
      },
    ],
  },
};

// ─── Le Cercle — Manifesto + lifestyle collectionneur (NEW) ───
const CIRCLE_MAP = {
  en: {
    title: 'For those who live with a collection.',
    manifesto:
      'iQWine was not built to catalogue bottles. It was built to live with a collection.',
    facets: [
      {
        icon: 'BookOpen' as const,
        title: 'Tasting memory',
        description:
          'Each evening is inscribed. The palate maps itself. The collection takes a shape.',
      },
      {
        icon: 'Sparkles' as const,
        title: 'Dinners that count',
        description:
          'Bottles opened, pairings remembered, moments you can revisit a year later.',
      },
      {
        icon: 'Map' as const,
        title: 'The journey found again',
        description:
          'Unknown labels archived. Travel bottles brought home. Nothing forgotten.',
      },
    ],
  },
  fr: {
    title: 'Pour celles et ceux qui vivent avec une collection.',
    manifesto:
      'iQWine n\'a pas été conçu pour cataloguer des bouteilles. Il a été conçu pour vivre avec une collection.',
    facets: [
      {
        icon: 'BookOpen' as const,
        title: 'Mémoire de dégustation',
        description:
          'Chaque soirée s\'inscrit. Le palais se cartographie. La collection prend forme.',
      },
      {
        icon: 'Sparkles' as const,
        title: 'Les soirées qui comptent',
        description:
          'Bouteilles ouvertes, accords retenus, moments que vous pourrez revisiter un an plus tard.',
      },
      {
        icon: 'Map' as const,
        title: 'Le voyage retrouvé',
        description:
          'Étiquettes inconnues archivées. Bouteilles de voyage ramenées. Rien d\'oublié.',
      },
    ],
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
export function getCircle(locale: Locale) {
  return CIRCLE_MAP[locale];
}
export function getBeta(locale: Locale) {
  return BETA_MAP[locale];
}
