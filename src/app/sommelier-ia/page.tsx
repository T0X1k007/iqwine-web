import type { Metadata } from 'next';
import OctaveContent from '@/components/octave/OctaveContent';

export const metadata: Metadata = {
  title: 'Sommelier IA — Octave | iQWine',
  description:
    'Octave n’est pas une fonctionnalité IA : c’est un sommelier personnel qui connaît votre cave, votre palais et la SAQ, et vous dit quelle bouteille ouvrir ce soir.',
  alternates: { canonical: '/sommelier-ia' },
};

/**
 * /sommelier-ia — page dédiée au sommelier personnel iQWine (« Octave » dans le
 * contenu). URL orientée SEO. Chrome global (Navbar + Footer) via le layout racine.
 */
export default function OctavePage() {
  return <OctaveContent />;
}
