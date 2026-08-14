import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import AccordsContent from '@/components/fonctions/AccordsContent';
import { TRIAL_SHORT } from '@/lib/trial';

/**
 * /accord-mets-vins — page Fonction n°2 (conception validée avec correction
 * S1, Eric 2026-08-13). Intention : « accord mets et vins » (TOFU volume),
 * attaquée par le différenciateur : la photo du plat, VOTRE palais, VOTRE
 * cave. Absorbe l'ancienne /recevoir (301 posées dans next.config).
 */
const TEXTES = {
  fr: {
    title: 'Accords mets et vins, selon votre palais · iQWine',
    description: `Photographiez votre plat : Octave comprend ce que vous allez manger et choisit l'accord, jusque dans votre propre cave, à la case près. Essai : ${TRIAL_SHORT.fr}, sans carte.`,
  },
  en: {
    title: 'Wine pairing, tuned to your palate · iQWine',
    description: `Photograph your dish: Octave understands what you're about to eat and picks the pairing, down to your own cellar, slot included. Free trial: ${TRIAL_SHORT.en}, no card.`,
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/accord-mets-vins', locale, TEXTES);
}

export default function AccordsPage() {
  return <AccordsContent />;
}
