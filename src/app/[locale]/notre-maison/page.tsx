import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import NotreMaisonContent from '@/components/maison/NotreMaisonContent';

const TEXTES = {
  fr: {
    title: 'Notre maison — iQWine',
    description:
      'La maison où vit Octave, votre sommelier. iQWine est né d’une conviction : une cave qui se souvient à votre place. Conçu au Québec, hébergé au Canada.',
  },
  en: {
    title: 'Our story — iQWine',
    description:
      'Where Octave comes from. iQWine grew out of one conviction: a cellar that remembers so you don’t have to. Designed in Quebec, hosted in Canada.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/notre-maison', locale, TEXTES);
}

/**
 * /notre-maison — page de marque (Vague 4). La coquille serveur porte la
 * metadata SEO ; le corps bilingue (FR/EN) vit dans NotreMaisonContent (client).
 */
export default function NotreMaisonPage() {
  return <NotreMaisonContent />;
}
