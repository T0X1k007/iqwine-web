import type { Texte } from '@/lib/guide';

/**
 * « OCTAVE VÉRIFIABLE », rapatrié sur iqwine.ai (audit du 2026-11-06, P3).
 *
 * Source : la page publique de l'application `app.iqwine.ai/octave-verifiable`
 * au tag `v0.163.0` (`app/(public)/octave-verifiable/page.tsx`, messages
 * `GuidePublic.verifiable*`), fermée aux moteurs. Les quatre preuves y sont
 * reprises dans le même ordre, réécrites pour la page Sommelier. L'app garde
 * sa page et son noindex : rien n'y est touché.
 *
 * Règle d'écriture (« montrer le résultat, jamais la mécanique », 2026-08-14) :
 * on dit CE QUI est garanti à l'utilisateur, jamais comment c'est calculé.
 */
export const PREUVES_VERIFIABLES: { id: string; titre: Texte; texte: Texte }[] = [
  {
    id: 'choix-calcule',
    titre: { fr: 'Un choix calculé, jamais tiré au hasard', en: 'A computed choice, never a roll of the dice' },
    texte: {
      fr: 'Le choix d’une bouteille vient de règles claires appliquées à votre cave et à votre palais, pas du hasard d’un modèle. Octave écrit le pourquoi ; le quoi, lui, ne s’improvise pas.',
      en: 'The choice of a bottle comes from clear rules applied to your cellar and your palate, not from the whims of a model. Octave writes the why; the what is never improvised.',
    },
  },
  {
    id: 'prix-reels',
    titre: { fr: 'Des prix réels', en: 'Real prices' },
    texte: {
      fr: 'Quand un prix en magasin existe, c’est lui qui s’affiche. Quand il est inconnu, Octave l’annonce comme une estimation, jamais comme un fait.',
      en: 'When an in-store price exists, that’s the one shown. When it’s unknown, Octave labels it an estimate, never presents it as fact.',
    },
  },
  {
    id: 'sources',
    titre: { fr: 'Des réponses ancrées à des sources', en: 'Answers anchored in sources' },
    texte: {
      fr: 'Quand vous posez une question au Guide d’Octave dans l’application, il répond à partir d’extraits sourcés, avec leurs références, pas de souvenirs approximatifs.',
      en: 'When you ask Octave’s Guide a question in the app, he answers from sourced excerpts, with their references, not from hazy memories.',
    },
  },
  {
    id: 'je-ne-sais-pas',
    titre: { fr: '« Je ne sais pas »', en: '“I don’t know”' },
    texte: {
      fr: 'Sans base fiable pour répondre, il le dit. Un « je ne sais pas » honnête vaut mieux qu’une belle phrase fausse.',
      en: 'Without a reliable basis to answer, he says so. An honest “I don’t know” beats a beautiful wrong sentence.',
    },
  },
];

/** Les questions de la page Sommelier : visibles ET balisées (`FAQPage`). */
export const FAQ_SOMMELIER: { q: Texte; a: Texte }[] = [
  {
    q: {
      fr: 'Octave est-il un assistant conversationnel généraliste ?',
      en: 'Is Octave a general-purpose chatbot?',
    },
    a: {
      fr: 'Non. Octave est un sommelier : il connaît votre cave à la case près, apprend votre palais de vos dégustations et choisit les bouteilles par des règles claires plutôt qu’au hasard. Il rédige le pourquoi de chaque conseil, mais il ne répond pas à tout : sa spécialité, c’est le vin que vous allez ouvrir, commander ou acheter.',
      en: 'No. Octave is a sommelier: he knows your cellar down to the slot, learns your palate from your tastings and picks bottles by clear rules rather than chance. He writes the why behind every piece of advice, but he doesn’t answer everything: his field is the wine you’re about to open, order or buy.',
    },
  },
  {
    q: { fr: 'Octave peut-il se tromper ?', en: 'Can Octave be wrong?' },
    a: {
      fr: 'Oui. Une fenêtre de dégustation est une estimation, un palais se précise avec le temps, et une donnée peut manquer. Ce qu’il ne fait pas : inventer. Quand il ne sait pas, il le dit. Quand rien dans votre cave ne convient au plat, il le dit aussi, et vous indique quoi chercher.',
      en: 'Yes. A drinking window is an estimate, a palate sharpens over time, and a piece of data can be missing. What he doesn’t do is make things up. When he doesn’t know, he says so. When nothing in your cellar suits the dish, he says that too, and tells you what to look for.',
    },
  },
  {
    q: { fr: 'Octave fonctionne-t-il hors du Québec ?', en: 'Does Octave work outside Québec?' },
    a: {
      fr: 'Oui, pour votre cave, l’apogée, les accords, la carte des vins au restaurant et le scan d’étiquette. La disponibilité et les prix en magasin, eux, couvrent le Québec.',
      en: 'Yes, for your cellar, drinking windows, pairings, restaurant wine lists and label scanning. In-store availability and prices cover Québec.',
    },
  },
  {
    q: {
      fr: 'iQWine touche-t-il une commission sur les vins conseillés ?',
      en: 'Does iQWine earn a commission on the wines it recommends?',
    },
    a: {
      fr: 'Non. iQWine ne vend pas de vin : aucun placement payé, aucune commission. Les conseils d’Octave ne servent que vous.',
      en: 'No. iQWine sells no wine: no paid placement, no commission. Octave’s advice serves only you.',
    },
  },
  {
    q: { fr: 'Octave apprend-il vraiment mes goûts ?', en: 'Does Octave really learn my taste?' },
    a: {
      fr: 'Oui, à partir de vos dégustations notées, sur tous les forfaits, Gratuit compris. Vous pouvez voir ce qu’il a compris de vous, dire vous-même ce que vous aimez, ou remettre à zéro ce qu’il a retenu de vos habitudes.',
      en: 'Yes, from your rated tastings, on every plan, Free included. You can see what he has understood about you, tell him yourself what you like, or reset what he has picked up from your habits.',
    },
  },
];
