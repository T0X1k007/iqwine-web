import type { Metadata } from 'next';
import TarifsContent from '@/components/tarifs/TarifsContent';

export const metadata: Metadata = {
  title: 'Tarifs — iQWine',
  description:
    'Trouvez la formule iQWine faite pour vous. Chaque plan commence par 14 jours gratuits, sans carte. Standard, Pro, Famille — chacun son profil.',
};

/**
 * /tarifs — page de décision (positionnement + prix + comment ça marche +
 * bénéfices + FAQ + plateformes + CTA). Chrome global fourni par le layout racine.
 */
export default function TarifsPage() {
  return <TarifsContent />;
}
