import type { Locale } from '@/lib/i18n';

export type PillarSlug = 'octave' | 'apogee' | 'recherche' | 'recevoir';
type L = Record<Locale, string>;

export type Pillar = {
  slug: PillarSlug;
  /** URL réelle (octave est servie par /sommelier-ia). */
  href: string;
  num: string; // chiffre romain
  emotion: L; // eyebrow
  name: L;
  title: L;
  lead: L;
  beats: { title: L; body: L }[];
  /** phrase de clôture, italique champagne. */
  closer: L;
};

export const PILLARS: Pillar[] = [
  {
    slug: 'octave',
    href: '/sommelier-ia',
    num: 'I',
    emotion: { fr: 'Confiance', en: 'Trust' },
    name: { fr: 'Octave', en: 'Octave' },
    title: { fr: 'Le sommelier qui vous connaît.', en: 'The sommelier who knows you.' },
    lead: {
      fr: 'Vous n’avez pas qu’une cave. Vous avez quelqu’un qui sait quoi ouvrir, ce soir, pour vous.',
      en: 'You don’t just have a cellar. You have someone who knows what to open, tonight, for you.',
    },
    beats: [
      {
        title: { fr: 'Il apprend votre palais', en: 'It learns your palate' },
        body: {
          fr: 'Chaque verre que vous notez affine sa lecture — jamais d’invention, seulement ce qu’il observe.',
          en: 'Every glass you rate sharpens its read — never invention, only what it observes.',
        },
      },
      {
        title: { fr: 'Il connaît votre cave', en: 'It knows your cellar' },
        body: {
          fr: 'Vos bouteilles, leurs apogées, leur histoire. Il choisit dans ce que vous avez déjà.',
          en: 'Your bottles, their peaks, their story. It picks from what you already have.',
        },
      },
      {
        title: { fr: 'Il vous dit pourquoi', en: 'It tells you why' },
        body: {
          fr: 'Une bouteille, et la raison qui va avec — comme un vrai sommelier, en une phrase.',
          en: 'A bottle, and the reason with it — like a real sommelier, in a sentence.',
        },
      },
    ],
    closer: {
      fr: 'Plus vous l’utilisez, plus il vous ressemble.',
      en: 'The more you use it, the more it sounds like you.',
    },
  },
  {
    slug: 'apogee',
    href: '/apogee',
    num: 'II',
    emotion: { fr: 'Anticipation', en: 'Anticipation' },
    name: { fr: 'Apogée', en: 'Peak' },
    title: { fr: 'Chaque bouteille à son sommet.', en: 'Every bottle at its peak.' },
    lead: {
      fr: 'Octave suit l’apogée de chaque bouteille — vous l’ouvrez au bon moment, jamais trop tôt, jamais trop tard.',
      en: 'Octave tracks each bottle’s drinking window — you open it at the right moment, never too early, never too late.',
    },
    beats: [
      {
        title: { fr: 'Trois états, un verdict', en: 'Three states, one verdict' },
        body: {
          fr: 'Trop jeune, à son sommet, ou à boire sans tarder : l’apogée en une phrase, pas en pourcentage.',
          en: 'Too young, at its peak, or drink without delay: the window in plain words, not a percentage.',
        },
      },
      {
        title: { fr: 'Octave veille', en: 'Octave watches over it' },
        body: {
          fr: 'Quand une grande bouteille approche de sa limite, il vous le dit — avant qu’il soit trop tard.',
          en: 'When a great bottle nears its limit, it tells you — before it’s too late.',
        },
      },
      {
        title: { fr: 'Jamais gâchée', en: 'Never wasted' },
        body: {
          fr: 'La tranquillité de savoir que votre plus belle bouteille sera ouverte à son meilleur.',
          en: 'The peace of mind that your finest bottle will be opened at its best.',
        },
      },
    ],
    closer: {
      fr: 'Une grande bouteille n’attend pas. Octave non plus.',
      en: 'A great bottle doesn’t wait. Neither does Octave.',
    },
  },
  {
    slug: 'recherche',
    href: '/recherche',
    num: 'III',
    emotion: { fr: 'Assurance', en: 'Assurance' },
    name: { fr: 'Recherche', en: 'Search' },
    title: { fr: 'De votre cave, ou près de vous.', en: 'From your cellar, or near you.' },
    lead: {
      fr: 'La bonne bouteille — dans votre cave, ou disponible près de vous, vérifiée magasin par magasin.',
      en: 'The right bottle — in your cellar, or available near you, verified store by store.',
    },
    beats: [
      {
        title: { fr: 'Votre cave d’abord', en: 'Your cellar first' },
        body: {
          fr: 'Octave cherche dans ce que vous avez déjà, selon votre palais et le moment.',
          en: 'Octave searches what you already own, by your palate and the moment.',
        },
      },
      {
        title: { fr: 'Puis près de vous', en: 'Then near you' },
        body: {
          fr: 'Pas dans votre cave ? Il vous guide vers la bouteille en tablette, partout au Québec.',
          en: 'Not in your cellar? It guides you to the bottle on the shelf, across Québec.',
        },
      },
      {
        title: { fr: 'Vérifié, pas deviné', en: 'Verified, not guessed' },
        body: {
          fr: 'Disponibilité réelle, point de vente par point de vente — jamais repartir les mains vides.',
          en: 'Real availability, store by store — never leave empty-handed.',
        },
      },
    ],
    closer: {
      fr: 'La bonne bouteille existe. Octave sait où elle est.',
      en: 'The right bottle exists. Octave knows where it is.',
    },
  },
  {
    slug: 'recevoir',
    href: '/recevoir',
    num: 'IV',
    emotion: { fr: 'Convivialité', en: 'Conviviality' },
    name: { fr: 'Recevoir', en: 'Hosting' },
    title: { fr: 'Chaque repas, son fil de vins.', en: 'Every meal, its thread of wines.' },
    lead: {
      fr: 'Des invités à table, un repas qui compte : Octave compose la séquence de vins de toute votre soirée.',
      en: 'Guests at the table, a meal that matters: Octave composes the wine sequence of your whole evening.',
    },
    beats: [
      {
        title: { fr: 'Le bon ordre', en: 'The right order' },
        body: {
          fr: 'Entrée, plat, dessert — chaque vin au bon moment, comme un sommelier le ferait.',
          en: 'Starter, main, dessert — each wine at the right moment, the way a sommelier would.',
        },
      },
      {
        title: { fr: 'Sans hésiter', en: 'Without hesitating' },
        body: {
          fr: 'Vous servez avec assurance ; Octave a pensé l’accord et la progression.',
          en: 'You serve with confidence; Octave has thought out the pairing and the progression.',
        },
      },
      {
        title: { fr: 'Au restaurant aussi', en: 'At the restaurant too' },
        body: {
          fr: 'Même hors de chez vous : scannez la carte, Octave lit CETTE carte pour VOTRE plat.',
          en: 'Even away from home: scan the list, Octave reads THIS list for YOUR dish.',
        },
      },
    ],
    closer: {
      fr: 'Le seul sommelier qui vous suit jusqu’à la table.',
      en: 'The only sommelier that follows you to the table.',
    },
  },
];

export const pillarBySlug = (slug: PillarSlug): Pillar | undefined =>
  PILLARS.find((p) => p.slug === slug);
