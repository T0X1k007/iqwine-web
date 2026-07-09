import type { Metadata } from 'next';
import BetaContent from '@/components/beta/BetaContent';

export const metadata: Metadata = {
  title: 'Devenir bêta-testeur — iQWine',
  description:
    'Rejoignez le cercle restreint des bêta-testeurs iQWine : accès en avant-première, en échange d’un vrai temps de test et de vos commentaires.',
};

/**
 * /beta — candidature bêta-testeur. La coquille serveur porte la metadata SEO ;
 * le corps bilingue (attentes + formulaire) vit dans BetaContent (client). Le
 * formulaire POST vers /api/contact (category BETA → forward app cellier-vin).
 */
export default function BetaPage() {
  return <BetaContent />;
}
