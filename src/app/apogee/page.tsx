import type { Metadata } from 'next';
import PillarPage from '@/components/pillars/PillarPage';

export const metadata: Metadata = {
  title: 'Apogée — Chaque bouteille à son sommet | iQWine',
  description:
    'Octave suit l’apogée de chaque bouteille : vous l’ouvrez au bon moment, jamais trop tôt, jamais trop tard. Trois états, un verdict clair.',
  alternates: { canonical: '/apogee' },
  openGraph: { title: 'Apogée — Chaque bouteille à son sommet', description: 'Octave veille sur l’apogée de chaque bouteille.' },
};

export default function Page() {
  return <PillarPage slug="apogee" />;
}
