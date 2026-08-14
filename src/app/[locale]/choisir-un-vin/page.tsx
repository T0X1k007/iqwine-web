import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import ChoisirContent from '@/components/fonctions/ChoisirContent';
import { TRIAL_SHORT } from '@/lib/trial';

/**
 * /choisir-un-vin — page Fonction n°5 (conception validée avec 3 ajustements,
 * Eric 2026-08-14). La requête la plus large du site : « comment choisir un
 * vin ». Absorbe l'ancien pilier /recherche (301 posées dans next.config, le
 * chemin nu passe par l'ALIAS du middleware).
 *
 * Le title épouse la question telle qu'on la tape ; la description dit le
 * bénéfice (palais, budget, cave, proximité) sans jamais décrire la mécanique.
 */
const TEXTES = {
  fr: {
    title: 'Comment choisir un bon vin ? Votre sommelier IA vous guide · iQWine',
    description: `Devant le rayon, des centaines d’étiquettes et une seule question : laquelle est pour vous ? Octave connaît votre palais et votre budget, dans votre cave comme près de vous. Essai : ${TRIAL_SHORT.fr}, sans carte.`,
  },
  en: {
    title: 'How to choose a good wine? Your AI sommelier guides you · iQWine',
    description: `Hundreds of labels, one question: which one is for you? Octave knows your palate and your budget, in your cellar and near you. Free trial: ${TRIAL_SHORT.en}, no card.`,
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/choisir-un-vin', locale, TEXTES);
}

export default function ChoisirPage() {
  return <ChoisirContent />;
}
