import type { Metadata } from 'next';
import BetaContent from '@/components/beta/BetaContent';

export const metadata: Metadata = {
  // P49 — /beta est une surface TRANSITOIRE (recrutement de testeurs), pas une
  // page de produit. Elle était indexable ET absente du sitemap : la pire
  // combinaison, un orphelin que Google trouve quand même par un lien externe.
  // On tranche : noindex assumé (Option B du doc de phase). Réversible d'une
  // ligne le jour où la bêta devient un argument public.
  robots: { index: false, follow: true },
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
