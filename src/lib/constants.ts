import type { Locale } from './i18n';

// ─── Eyebrows (mono uppercase, ouvre chaque section — signature éditoriale) ───
const EYEBROWS_MAP = {
  en: {
    problem: '01 · Reality',
    shift: '02 · Shift',
    solution: '03 · iQWine',
    platform: '04 · The Companion',
    different: '05 · Not An App',
    impact: '06 · Felt',
    beta: '07 · Coming Soon',
  },
  fr: {
    problem: '01 · Constat',
    shift: '02 · Bascule',
    solution: '03 · iQWine',
    platform: '04 · Le compagnon',
    different: '05 · Pas une app',
    impact: '06 · Ressenti',
    beta: '07 · Bientôt',
  },
};

// ─── Navigation ───
const NAV_LINKS_MAP = {
  en: [
    { label: 'Vision', href: '#problem' },
    { label: 'Companion', href: '#platform' },
    { label: 'Felt', href: '#impact' },
    { label: 'Access', href: '#beta' },
  ],
  fr: [
    { label: 'Vision', href: '#problem' },
    { label: 'Compagnon', href: '#platform' },
    { label: 'Ressenti', href: '#impact' },
    { label: 'Accès', href: '#beta' },
  ],
} as const;

// ─── Hero ───
const HERO_MAP = {
  en: {
    badge: 'Private Preview · Coming Soon',
    variantA: {
      headlineTop: 'Your cellar deserves',
      headlineBottom: 'more than a list.',
      headline: 'Your cellar deserves more than a list.',
      subheadline:
        'iQWine is the wine companion that understands your palate and your cellar better than you do. Not an inventory — a private second œnological brain.',
    },
    variantB: {
      headlineTop: 'A sommelier in your pocket.',
      headlineBottom: 'Always at the right moment.',
      headline: 'A sommelier in your pocket. Always at the right moment.',
      subheadline:
        'Discover, pair, scan, decide — with the calm and precision of a great house sommelier.',
    },
    ctaPrimary: 'Join the private preview',
    ctaSecondary: 'See the companion',
  },
  fr: {
    badge: 'Avant-première privée · Bientôt',
    variantA: {
      headlineTop: 'Votre cellier mérite',
      headlineBottom: 'mieux qu\'une liste.',
      headline: 'Votre cellier mérite mieux qu\'une liste.',
      subheadline:
        'iQWine est le compagnon œnologique qui comprend votre palais et votre cave mieux que vous-même. Pas un inventaire — un second cerveau œnologique privé.',
    },
    variantB: {
      headlineTop: 'Un sommelier dans la poche.',
      headlineBottom: 'Toujours au bon moment.',
      headline: 'Un sommelier dans la poche. Toujours au bon moment.',
      subheadline:
        'Découvrir, accorder, scanner, décider — avec le calme et la précision d\'un sommelier d\'hôtel particulier.',
    },
    ctaPrimary: 'Rejoindre l\'avant-première',
    ctaSecondary: 'Voir le compagnon',
  },
};

// ─── Problem ───
const PROBLEM_MAP = {
  en: {
    title: 'Owning a cellar isn\'t the same as living with it.',
    points: [
      {
        icon: 'Clock' as const,
        title: 'Drinking windows pass in silence',
        description:
          'A great wine peaks — then declines — without warning. Your cellar remembers every bottle but tells you nothing.',
      },
      {
        icon: 'BookOpen' as const,
        title: 'Expertise lives in books, not in your hand',
        description:
          'Vintage charts, terroirs, optimal moments. Every bottle asks for context most cellars never give.',
      },
      {
        icon: 'Search' as const,
        title: 'Discovery happens by accident',
        description:
          'You open what you remember. The bottle that would have made the evening sleeps untouched, two shelves away.',
      },
      {
        icon: 'Utensils' as const,
        title: 'Pairing is a guess',
        description:
          'Tonight\'s menu meets last week\'s instinct. Without a sommelier, the match stays approximate.',
      },
      {
        icon: 'Camera' as const,
        title: 'Unknown labels stay strangers',
        description:
          'A gift, a discovery, a bottle from a trip. You meant to look it up. You never did.',
      },
      {
        icon: 'Wine' as const,
        title: 'Apps treat wine like inventory',
        description:
          'Spreadsheets. Five-star ratings. Crowd noise. The cellar you love deserves a different language.',
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
          'Un grand vin atteint son sommet — puis décline — sans prévenir. Votre cellier retient tout, mais ne dit rien.',
      },
      {
        icon: 'BookOpen' as const,
        title: 'L\'expertise vit dans les livres, pas dans votre main',
        description:
          'Tables des millésimes, terroirs, moments optimaux. Chaque bouteille réclame un contexte que la cave ne donne pas.',
      },
      {
        icon: 'Search' as const,
        title: 'La découverte se fait par hasard',
        description:
          'Vous ouvrez ce dont vous vous souvenez. La bouteille qui aurait sublimé la soirée dort intouchée, deux tablettes plus loin.',
      },
      {
        icon: 'Utensils' as const,
        title: 'L\'accord est un pari',
        description:
          'Le menu du soir rencontre l\'intuition de la semaine dernière. Sans sommelier, l\'accord reste approximatif.',
      },
      {
        icon: 'Camera' as const,
        title: 'Les étiquettes inconnues restent étrangères',
        description:
          'Un cadeau, une découverte, une bouteille de voyage. Vous vouliez vous renseigner. Vous ne l\'avez jamais fait.',
      },
      {
        icon: 'Wine' as const,
        title: 'Les applications traitent le vin comme un inventaire',
        description:
          'Tableaux. Cinq étoiles. Bruit de foule. La cave que vous chérissez mérite un autre langage.',
      },
    ],
  },
};

// ─── Shift ───
const SHIFT_MAP = {
  en: {
    title: 'A second brain. For wine.',
    lines: [
      'Your cellar holds the bottles. Your memory holds the moments.',
      'iQWine holds everything in between — and gives it back when you need it.',
    ],
  },
  fr: {
    title: 'Un second cerveau. Pour le vin.',
    lines: [
      'Votre cave garde les bouteilles. Votre mémoire garde les moments.',
      'iQWine garde tout ce qu\'il y a entre — et vous le rend quand vous en avez besoin.',
    ],
  },
};

// ─── Solution / WhatIsIQWine — 3 piliers conceptuels ───
const SOLUTION_MAP = {
  en: {
    title: 'Three things a cellar can\'t do alone.',
    subtitle: 'iQWine does them quietly, every day.',
    pillars: [
      {
        icon: 'Eye' as const,
        title: 'See the cellar living',
        description:
          'A visual plan, heatmaps, peaks that pulse this week. The cave stops being a list and becomes a landscape.',
      },
      {
        icon: 'Sparkles' as const,
        title: 'Hear the right suggestion',
        description:
          'Tonight, three bottles for the menu. At the restaurant, the discreet pick from the wine card. Always reasoned. Always cited.',
      },
      {
        icon: 'Compass' as const,
        title: 'Know your own palate',
        description:
          'Every tasting calibrates a quiet model of you. After a year, iQWine knows what you love before you do.',
      },
    ],
  },
  fr: {
    title: 'Trois choses qu\'une cave ne fait pas seule.',
    subtitle: 'iQWine les fait, calmement, tous les jours.',
    pillars: [
      {
        icon: 'Eye' as const,
        title: 'Voir le cellier vivant',
        description:
          'Plan visuel, heatmap, apogées qui pulsent cette semaine. La cave cesse d\'être une liste et devient un paysage.',
      },
      {
        icon: 'Sparkles' as const,
        title: 'Entendre la bonne suggestion',
        description:
          'Ce soir, trois bouteilles pour le menu. Au restaurant, le choix discret sur la carte. Toujours raisonné. Toujours sourcé.',
      },
      {
        icon: 'Compass' as const,
        title: 'Connaître son propre palais',
        description:
          'Chaque dégustation calibre un modèle silencieux de vous. Après un an, iQWine sait ce que vous aimez avant vous.',
      },
    ],
  },
};

// ─── Platform — 6 vraies fonctionnalités du compagnon ───
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
        description: 'Every bottle, exactly where it is.',
        details:
          'Visual plan of your cave, heatmap by region and vintage, peaks that pulse this week. Drag to reorganize, tap to drill.',
        phase: 'See',
      },
      {
        name: 'Tonight Mode',
        color: 'sommelier' as const,
        glyph: 'T',
        tagline: 'Three bottles for tonight',
        description: 'Tell it the menu. Get the bottle.',
        details:
          'Type or speak the menu, the mood, the guests. Receive three reasoned suggestions from your cellar — with reasoning, sources, and confidence.',
        phase: 'Suggest',
      },
      {
        name: 'Restaurant Mode',
        color: 'sommelier' as const,
        glyph: 'R',
        tagline: 'Photograph the wine list',
        description: 'A discreet sommelier at the table.',
        details:
          'Snap the wine card. iQWine reads it, cross-checks vintages and value, suggests the best three for your menu — without anyone seeing.',
        phase: 'Pair',
      },
      {
        name: 'Label Scanner',
        color: 'decouverte' as const,
        glyph: 'S',
        tagline: 'Photo · QR · barcode',
        description: 'Point. Read. Remember.',
        details:
          'Scan any label — known, rare, foreign. Vintage chart, drinking window, full provenance. Add to your cellar in one tap.',
        phase: 'Scan',
      },
      {
        name: 'Natural Search',
        color: 'cellier' as const,
        glyph: 'Q',
        tagline: 'Talk to your cellar',
        description: '"Mineral white for tonight\'s fish."',
        details:
          'Plain language. Vector search across your cellar, vintages, regions, palate matches. The cave answers in your words.',
        phase: 'Search',
      },
      {
        name: 'Palate Calibration',
        color: 'decouverte' as const,
        glyph: 'P',
        tagline: 'Tasting notes that learn',
        description: 'A quiet model of you.',
        details:
          'Each tasting refines a personal palate radar. After thirty notes, iQWine surprises you with bottles you didn\'t know you wanted.',
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
        description: 'Chaque bouteille, exactement à sa place.',
        details:
          'Plan visuel de la cave, heatmap par région et millésime, apogées qui pulsent cette semaine. Glisser pour réorganiser, taper pour explorer.',
        phase: 'Voir',
      },
      {
        name: 'Mode Tonight',
        color: 'sommelier' as const,
        glyph: 'T',
        tagline: 'Trois bouteilles pour ce soir',
        description: 'Dis-lui le menu. Reçois la bouteille.',
        details:
          'Tape ou dicte le menu, l\'humeur, les invités. Reçois trois suggestions raisonnées issues de ta cave — avec raisonnement, sources, confiance.',
        phase: 'Suggérer',
      },
      {
        name: 'Mode Restaurant',
        color: 'sommelier' as const,
        glyph: 'R',
        tagline: 'Photographie la carte',
        description: 'Un sommelier discret à table.',
        details:
          'Photo de la carte. iQWine la lit, recoupe millésimes et rapport prix, suggère les trois meilleures pour ton menu — sans que personne ne le voie.',
        phase: 'Accorder',
      },
      {
        name: 'Scanner d\'étiquettes',
        color: 'decouverte' as const,
        glyph: 'S',
        tagline: 'Photo · QR · code-barres',
        description: 'Pointe. Lis. Retiens.',
        details:
          'Scanne toute étiquette — connue, rare, étrangère. Table des millésimes, fenêtre de garde, provenance. Ajoute au cellier en un geste.',
        phase: 'Scanner',
      },
      {
        name: 'Recherche naturelle',
        color: 'cellier' as const,
        glyph: 'Q',
        tagline: 'Parle à ta cave',
        description: '« Blanc minéral pour le poisson de ce soir. »',
        details:
          'Langage naturel. Recherche vectorielle dans ta cave, millésimes, régions, accords palais. La cave te répond dans tes mots.',
        phase: 'Chercher',
      },
      {
        name: 'Calibration du palais',
        color: 'decouverte' as const,
        glyph: 'P',
        tagline: 'Notes qui apprennent',
        description: 'Un modèle silencieux de toi.',
        details:
          'Chaque dégustation affine un radar personnel du palais. Après trente notes, iQWine te surprend avec des vins que tu ne savais pas vouloir.',
        phase: 'Calibrer',
      },
    ],
  },
};

// ─── Different ───
const DIFFERENT_MAP = {
  en: {
    title: 'Not an app. A second brain.',
    points: [
      'Not a tracker.',
      'Not a five-star ranking.',
      'Not a marketplace.',
      'Not a guidebook.',
    ],
    conclusion:
      'A companion. Quietly intelligent. Always at the table.',
  },
  fr: {
    title: 'Pas une app. Un second cerveau.',
    points: [
      'Pas un carnet de notes.',
      'Pas un classement cinq étoiles.',
      'Pas une place de marché.',
      'Pas un guide.',
    ],
    conclusion:
      'Un compagnon. Discrètement intelligent. Toujours à table.',
  },
};

// ─── Impact ───
const IMPACT_MAP = {
  en: {
    title: 'What it actually feels like.',
    outcomes: [
      {
        icon: 'GlassWater' as const,
        title: 'Anticipation',
        description:
          '"My Brunello enters its plateau this week." A morning emotion before any data.',
      },
      {
        icon: 'Heart' as const,
        title: 'Gratitude',
        description:
          '"You have three perfect bottles for Saturday." The cave knew before you asked.',
      },
      {
        icon: 'Sparkle' as const,
        title: 'Self-knowledge',
        description:
          '"You haven\'t opened a Burgundy in four months. That\'s not random." The companion sees patterns you missed.',
      },
      {
        icon: 'Library' as const,
        title: 'Opportunity',
        description:
          '"This bottle won\'t come back. Now is the moment." A nudge, never a notification.',
      },
    ],
  },
  fr: {
    title: 'Ce que ça donne, vraiment.',
    outcomes: [
      {
        icon: 'GlassWater' as const,
        title: 'Anticipation',
        description:
          '« Ton Brunello entre dans son plateau cette semaine. » Une émotion du matin, avant la donnée.',
      },
      {
        icon: 'Heart' as const,
        title: 'Gratitude',
        description:
          '« Tu as trois bouteilles parfaites pour samedi. » La cave savait avant que tu ne demandes.',
      },
      {
        icon: 'Sparkle' as const,
        title: 'Connaissance de soi',
        description:
          '« Tu n\'as pas ouvert de Bourgogne depuis quatre mois. Ce n\'est pas un hasard. » Le compagnon voit ce que tu n\'as pas vu.',
      },
      {
        icon: 'Library' as const,
        title: 'Opportunité',
        description:
          '« Cette bouteille ne revient pas. C\'est le moment. » Un signal discret, jamais une notification.',
      },
    ],
  },
};

// ─── Beta — Coming Soon (sans formulaire) ───
const BETA_MAP = {
  en: {
    overline: 'Coming Soon',
    title: 'The private preview opens soon.',
    description:
      'iQWine enters its first private wave in 2026. The companion is being built quietly, by hand, for cellars that deserve more than a list.',
    note: 'No public sign-up yet — by invitation only.',
    detail:
      'When the door opens, the first cellars will be welcomed personally. Until then, the companion keeps learning.',
  },
  fr: {
    overline: 'Bientôt disponible',
    title: 'L\'avant-première privée ouvre bientôt.',
    description:
      'iQWine entre dans sa première vague privée en 2026. Le compagnon se construit en silence, à la main, pour des celliers qui méritent mieux qu\'une liste.',
    note: 'Pas d\'inscription publique pour l\'instant — sur invitation.',
    detail:
      'Quand la porte s\'ouvrira, les premiers celliers seront accueillis personnellement. D\'ici là, le compagnon continue d\'apprendre.',
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
