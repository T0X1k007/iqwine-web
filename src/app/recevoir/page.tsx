import type { Metadata } from 'next';
import PillarPage from '@/components/pillars/PillarPage';

export const metadata: Metadata = {
  title: 'Recevoir — Chaque repas, son fil de vins | iQWine',
  description:
    'Des invités à table : Octave compose la séquence de vins de toute votre soirée. Le bon vin, sur le bon plat, dans le bon ordre.',
  alternates: { canonical: '/recevoir' },
  openGraph: { title: 'Recevoir — Chaque repas, son fil de vins', description: 'Octave compose la séquence de vins de votre soirée.' },
};

export default function Page() {
  return <PillarPage slug="recevoir" />;
}
