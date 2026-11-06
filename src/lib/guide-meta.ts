/**
 * Titres et descriptions des pages thématiques du Guide (≤ 62 et ≤ 155
 * caractères, contrôlés au moment de l'écriture).
 */
export const TEXTES_GUIDE_CONSEILS = {
  fr: {
    title: 'Accords, carte des vins, palais : les conseils d’Octave',
    description:
      'Décrire son plat, un vin pour plusieurs plats, la carte au restaurant, une bouteille en magasin, et comment Octave apprend vos goûts : le Guide, en clair.',
  },
  en: {
    title: 'Pairings, wine lists, your palate: Octave’s advice',
    description:
      'Describing your dish, one wine for several courses, restaurant wine lists, a bottle in store, and how Octave learns your taste: the Guide, made clear.',
  },
} as const;

export const TEXTES_GUIDE_CAVE = {
  fr: {
    title: 'Tenir sa cave à vin : ajouter, importer, noter · iQWine',
    description:
      'Ajouter une bouteille, importer sa cave depuis Excel ou une autre application, la retrouver, la noter, la servir au mieux : le Guide d’Octave.',
  },
  en: {
    title: 'Keeping a wine cellar: add, import, rate · iQWine',
    description:
      'Add a bottle, import your cellar from Excel or another app, find it, rate it, serve it at its best: Octave’s Guide to your cellar, step by step.',
  },
} as const;
