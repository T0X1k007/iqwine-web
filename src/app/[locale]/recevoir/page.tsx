import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import PillarPage from '@/components/pillars/PillarPage';

const TEXTES = {
  fr: {
    title: 'Recevoir — Chaque repas, son fil de vins | iQWine',
    description:
      'Des invités à table : Octave compose la séquence de vins de toute votre soirée. Le bon vin, sur le bon plat, dans le bon ordre.',
    ogTitle: 'Recevoir — Chaque repas, son fil de vins',
    ogDescription: 'Octave compose la séquence de vins de votre soirée.',
  },
  en: {
    title: 'Entertaining — Every meal, its thread of wines | iQWine',
    description:
      'Guests at the table: Octave composes the wine sequence for your whole evening. The right wine, on the right dish, in the right order.',
    ogTitle: 'Entertaining — Every meal, its thread of wines',
    ogDescription: 'Octave composes the wine sequence for your evening.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/recevoir', locale, TEXTES);
}

export default function Page() {
  return <PillarPage slug="recevoir" />;
}
