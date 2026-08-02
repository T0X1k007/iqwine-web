import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import TarifsContent from '@/components/tarifs/TarifsContent';
import { TRIAL_SHORT } from '@/lib/trial';

const TEXTES = {
  fr: {
    title: 'Tarifs — iQWine',
    description: `Trouvez la formule iQWine faite pour vous. Chaque plan commence par un essai gratuit — ${TRIAL_SHORT.fr} —, sans carte. Standard, Pro, Passionné — chacun son profil.`,
  },
  en: {
    title: 'Pricing — iQWine',
    description: `Find the iQWine plan that fits you. Every plan starts with a free trial — ${TRIAL_SHORT.en} —, no card. Standard, Pro, Passionné — one for each profile.`,
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/tarifs', locale, TEXTES);
}

/**
 * /tarifs — page de décision (positionnement + prix + comment ça marche +
 * bénéfices + FAQ + plateformes + CTA). Chrome global fourni par le layout racine.
 */
export default function TarifsPage() {
  return <TarifsContent />;
}
