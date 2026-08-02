import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import PillarPage from '@/components/pillars/PillarPage';

const TEXTES = {
  fr: {
    title: 'Recherche — De votre cave, ou près de vous | iQWine',
    description:
      'La bonne bouteille, dans votre cave ou disponible près de vous, vérifiée magasin par magasin, partout au Québec.',
    ogTitle: 'Recherche — De votre cave, ou près de vous',
    ogDescription: 'La bonne bouteille, vérifiée magasin par magasin.',
  },
  en: {
    title: 'Search — From your cellar, or near you | iQWine',
    description:
      'The right bottle, in your cellar or available near you, checked store by store, anywhere in Quebec.',
    ogTitle: 'Search — From your cellar, or near you',
    ogDescription: 'The right bottle, checked store by store.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/recherche', locale, TEXTES);
}

export default function Page() {
  return <PillarPage slug="recherche" />;
}
