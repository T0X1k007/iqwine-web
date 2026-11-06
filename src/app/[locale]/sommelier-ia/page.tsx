import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import SommelierContent from '@/components/fonctions/SommelierContent';
import { TRIAL_SHORT } from '@/lib/trial';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbLd, faqPageDepuis } from '@/lib/structured-data';
import { FAQ_SOMMELIER } from '@/lib/octave-verifiable';
import { DEFAULT_LOCALE, isLocale } from '@/lib/locale';

/**
 * /sommelier-ia — REFONTE v3 (conception LOCK, Eric 2026-08-13). La page de
 * la RELATION : qui est Octave, pourquoi ses conseils deviennent personnels.
 * URL conservée (autorité). L'ancien OctaveContent demeure dans le dépôt
 * (purge en fin de phase 2). Title/meta = hypothèses chantier 0.
 */
const TEXTES = {
  fr: {
    title: 'Octave, le sommelier IA qui apprend vos goûts · iQWine',
    description: `Pas un chatbot : un sommelier qui se souvient de vous. Ses choix sont expliqués, nourris par VOS dégustations. Essai : ${TRIAL_SHORT.fr}, sans carte.`,
  },
  en: {
    title: 'Octave, the AI sommelier that learns your taste · iQWine',
    description: `Not a chatbot: a sommelier who remembers you. His choices are explained and fed by YOUR tastings. Free trial: ${TRIAL_SHORT.en}, no card.`,
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/sommelier-ia', locale, TEXTES);
}

/**
 * Depuis le 2026-11-06, la page affiche « Octave vérifiable » et ses propres
 * questions : le `FAQPage` les déclare mot pour mot (`FAQ_SOMMELIER`).
 */
export default async function OctavePage({ params }: ParamsLocale) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(l, [
            { nom: l === 'fr' ? 'Accueil' : 'Home', chemin: '/' },
            { nom: l === 'fr' ? 'Octave, sommelier IA' : 'Octave, AI sommelier', chemin: '/sommelier-ia' },
          ]),
          faqPageDepuis(l, '/sommelier-ia', FAQ_SOMMELIER),
        ]}
      />
      <SommelierContent />
    </>
  );
}
