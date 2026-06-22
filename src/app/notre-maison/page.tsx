import type { Metadata } from 'next';
import NotreMaisonContent from '@/components/maison/NotreMaisonContent';

export const metadata: Metadata = {
  title: 'Notre maison — iQWine',
  description:
    'La maison où vit Octave, votre sommelier. iQWine est né d’une conviction : une cave qui se souvient à votre place. Conçu au Québec, hébergé au Canada.',
};

/**
 * /notre-maison — page de marque (Vague 4). La coquille serveur porte la
 * metadata SEO ; le corps bilingue (FR/EN) vit dans NotreMaisonContent (client).
 */
export default function NotreMaisonPage() {
  return <NotreMaisonContent />;
}
