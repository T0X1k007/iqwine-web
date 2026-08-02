import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import OctaveContent from '@/components/octave/OctaveContent';

const TEXTES = {
  fr: {
    title: 'Sommelier IA — Octave | iQWine',
    description:
      'Octave n’est pas une fonctionnalité IA : c’est un sommelier personnel qui connaît votre cave, votre palais et la disponibilité locale, et vous dit quelle bouteille ouvrir ce soir.',
  },
  en: {
    title: 'AI Sommelier — Octave | iQWine',
    description:
      'Octave is not an AI feature: it is a personal sommelier that knows your cellar, your palate and what is available near you, and tells you which bottle to open tonight.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/sommelier-ia', locale, TEXTES);
}

/**
 * /sommelier-ia — page dédiée au sommelier personnel iQWine (« Octave » dans le
 * contenu). URL orientée SEO. Chrome global (Navbar + Footer) via le layout racine.
 */
export default function OctavePage() {
  return <OctaveContent />;
}
