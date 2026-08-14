import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import FonctionsContent from '@/components/fonctions/FonctionsContent';
import { TRIAL_SHORT } from '@/lib/trial';

/**
 * /fonctions, LE HUB (architecture validée par Eric, 2026-08-13).
 * « Une journée avec Octave » : compréhension + orientation + preuves +
 * distribution vers les pages Fonction. Pas une seconde homepage.
 * Title/meta = hypothèses du chantier 0, affinables après données réelles.
 */
const TEXTES = {
  fr: {
    title: 'Fonctions · iQWine, votre sommelier IA',
    description: `Choisir en magasin, lire une carte des vins, accorder un plat, suivre votre cave et l'apogée de chaque bouteille, un sommelier IA qui apprend vos goûts. Essai : ${TRIAL_SHORT.fr}, sans carte.`,
  },
  en: {
    title: 'Features · iQWine, your AI sommelier',
    description: `Choose in the store, read a wine list, pair a meal, follow your cellar and every bottle's peak, an AI sommelier that learns your taste. Free trial: ${TRIAL_SHORT.en}, no card.`,
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/fonctions', locale, TEXTES);
}

export default function FonctionsPage() {
  return <FonctionsContent />;
}
