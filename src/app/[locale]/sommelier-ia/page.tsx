import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import SommelierContent from '@/components/fonctions/SommelierContent';
import { TRIAL_SHORT } from '@/lib/trial';

/**
 * /sommelier-ia — REFONTE v3 (conception LOCK, Eric 2026-08-13). La page de
 * la RELATION : qui est Octave, pourquoi ses conseils deviennent personnels.
 * URL conservée (autorité). L'ancien OctaveContent demeure dans le dépôt
 * (purge en fin de phase 2). Title/meta = hypothèses chantier 0.
 */
const TEXTES = {
  fr: {
    title: 'Octave, le sommelier IA qui apprend vos goûts · iQWine',
    description: `Pas un chatbot : un sommelier qui se souvient de vous. Ses choix sont calculés, expliqués, et nourris par VOS dégustations. Essai : ${TRIAL_SHORT.fr}, sans carte.`,
  },
  en: {
    title: 'Octave, the AI sommelier that learns your taste · iQWine',
    description: `Not a chatbot: a sommelier who remembers you. His choices are computed, explained, and fed by YOUR tastings. Free trial: ${TRIAL_SHORT.en}, no card.`,
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/sommelier-ia', locale, TEXTES);
}

export default function OctavePage() {
  return <SommelierContent />;
}
