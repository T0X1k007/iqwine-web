import type { Metadata } from 'next';
import OctaveContent from '@/components/octave/OctaveContent';

export const metadata: Metadata = {
  title: 'Octave, votre sommelier — iQWine',
  description:
    'Octave n’est pas une fonctionnalité IA : c’est un sommelier personnel qui connaît votre cave, votre palais et la SAQ, et vous dit quelle bouteille ouvrir ce soir.',
};

/**
 * /octave — page dédiée au sommelier personnel iQWine. Chrome global (Navbar +
 * Footer) fourni par le layout racine.
 */
export default function OctavePage() {
  return <OctaveContent />;
}
