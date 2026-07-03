import type { Metadata } from 'next';
import PillarPage from '@/components/pillars/PillarPage';

export const metadata: Metadata = {
  title: 'Recherche — De votre cave, ou près de vous | iQWine',
  description:
    'La bonne bouteille, dans votre cave ou disponible près de vous, vérifiée magasin par magasin, partout au Québec.',
  alternates: { canonical: '/recherche' },
  openGraph: { title: 'Recherche — De votre cave, ou près de vous', description: 'La bonne bouteille, vérifiée magasin par magasin.' },
};

export default function Page() {
  return <PillarPage slug="recherche" />;
}
