import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import CellierContent from '@/components/fonctions/CellierContent';
import { TRIAL_SHORT } from '@/lib/trial';

/**
 * /cellier-intelligent — première page Fonction (conception validée par Eric,
 * 2026-08-13). Intention : « application cave à vin » (BOFU). L'histoire :
 * une cave qui se souvient, ET un sommelier qui comprend ce qu'elle contient.
 * Title/meta = hypothèses du chantier 0, affinables sur données réelles.
 */
const TEXTES = {
  fr: {
    title: 'L’application de cave à vin qui sait quand ouvrir · iQWine',
    description: `Photo, code-barres ou reçu : chaque bouteille entre en un geste, et votre cave sait quand l’ouvrir. Essai : ${TRIAL_SHORT.fr}, sans carte.`,
  },
  en: {
    title: 'The wine cellar app that knows when to open · iQWine',
    description: `Photo, barcode or receipt: each bottle gets in at once, and your cellar knows when to open it. Free trial: ${TRIAL_SHORT.en}, no card.`,
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/cellier-intelligent', locale, TEXTES);
}

export default function CellierPage() {
  return <CellierContent />;
}
