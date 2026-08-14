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
    description: `Chaque bouteille entre en un geste, photo, code-barres ou reçu, puis votre cave se souvient de tout : emplacement, valeur, histoire, et le bon moment pour ouvrir. Essai : ${TRIAL_SHORT.fr}, sans carte.`,
  },
  en: {
    title: 'The wine cellar app that knows when to open · iQWine',
    description: `Every bottle gets in with one gesture, photo, barcode or receipt, then your cellar remembers everything: location, value, history, and the right moment to open. Free trial: ${TRIAL_SHORT.en}, no card.`,
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/cellier-intelligent', locale, TEXTES);
}

export default function CellierPage() {
  return <CellierContent />;
}
