import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import ApogeeContent from '@/components/fonctions/ApogeeContent';

/**
 * /apogee — dernier pilier hérité refondu (GO d'Eric, 2026-08-14). Les URLs
 * et les slugs ne bougent PAS (/apogee ↔ /en/drinking-window) : seule la
 * page change, donc aucune redirection, aucune autorité perdue et aucun
 * contrôle de routage supplémentaire.
 *
 * Le title épouse la question telle qu'on la tape (« quand ouvrir une
 * bouteille de vin ») ; la description donne les trois états en langage
 * humain et la promesse de veille, sans empiler les requêtes.
 */
const TEXTES = {
  fr: {
    title: 'Quand ouvrir une bouteille de vin ? L’apogée avec Octave · iQWine',
    description:
      'Trop jeune, à son sommet, ou à boire sans tarder : Octave vous dit où en est chaque bouteille de votre cave, et vous prévient avant qu’il soit trop tard.',
    ogTitle: 'L’apogée, suivie par Octave',
    ogDescription: 'Vous l’avez gardée dix ans. Ne l’ouvrez pas un an trop tard.',
  },
  en: {
    title: 'When to open a bottle of wine? The drinking window · iQWine',
    description:
      'Too young, at its peak, or drink without delay: Octave tells you where each bottle in your cellar stands, and warns you before it’s too late.',
    ogTitle: 'The drinking window, tracked by Octave',
    ogDescription: 'You kept it ten years. Don’t open it a year too late.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/apogee', locale, TEXTES);
}

export default function ApogeePage() {
  return <ApogeeContent />;
}
