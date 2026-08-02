import type { Metadata } from 'next';
import TarifsContent from '@/components/tarifs/TarifsContent';
import { TRIAL_SHORT } from '@/lib/trial';

export const metadata: Metadata = {
  alternates: { canonical: '/tarifs' },
  title: 'Tarifs — iQWine',
  description:
    `Trouvez la formule iQWine faite pour vous. Chaque plan commence par un essai gratuit — ${TRIAL_SHORT.fr} —, sans carte. Standard, Pro, Passionné — chacun son profil.`,
};

/**
 * /tarifs — page de décision (positionnement + prix + comment ça marche +
 * bénéfices + FAQ + plateformes + CTA). Chrome global fourni par le layout racine.
 */
export default function TarifsPage() {
  return <TarifsContent />;
}
