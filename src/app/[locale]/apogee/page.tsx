import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import PillarPage from '@/components/pillars/PillarPage';

const TEXTES = {
  fr: {
    title: 'Apogée — Chaque bouteille à son sommet | iQWine',
    description:
      'Octave suit l’apogée de chaque bouteille : vous l’ouvrez au bon moment, jamais trop tôt, jamais trop tard. Trois états, un verdict clair.',
    ogTitle: 'Apogée — Chaque bouteille à son sommet',
    ogDescription: 'Octave veille sur l’apogée de chaque bouteille.',
  },
  en: {
    title: 'Drinking window — Every bottle at its best | iQWine',
    description:
      'Octave tracks each bottle’s drinking window: you open it at the right moment, never too early, never too late. Three states, one clear verdict.',
    ogTitle: 'Drinking window — Every bottle at its best',
    ogDescription: 'Octave watches over each bottle’s drinking window.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/apogee', locale, TEXTES);
}

export default function Page() {
  return <PillarPage slug="apogee" />;
}
