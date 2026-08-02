import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import OctaveContent from '@/components/octave/OctaveContent';

const TEXTES = {
  fr: {
    title: 'Sommelier IA — Octave | iQWine',
    description:
      'Octave n’est pas une fonctionnalité IA. C’est un sommelier personnel qui connaît votre cave, votre palais et le stock local, et dit quoi ouvrir ce soir.',
  },
  en: {
    title: 'AI Sommelier — Octave | iQWine',
    description:
      'Octave is not an AI feature. It is a personal sommelier that knows your cellar, your palate and local stock, and says which bottle to open tonight.',
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
