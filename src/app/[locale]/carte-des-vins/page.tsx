import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import CarteContent from '@/components/fonctions/CarteContent';
import { TRIAL_SHORT } from '@/lib/trial';

/**
 * /carte-des-vins — page Fonction n°4 (conception LOCK avec amendements,
 * Eric 2026-08-13). Intention ajustée au chantier 0 : « choisir un vin au
 * restaurant » en principal (« carte des vins » seul est ambigu), « scanner
 * carte des vins » en secondaire. La preuve maîtresse — LA VIDÉO RÉELLE du
 * scan — vit ici et nulle part ailleurs.
 */
const TEXTES = {
  fr: {
    title: 'Choisir un vin au restaurant, avec votre sommelier IA · iQWine',
    description: `La carte arrive, longue, parfois dans une autre langue. Photographiez-la : Octave la lit et met en évidence les vins faits pour votre palais. Essai : ${TRIAL_SHORT.fr}, sans carte.`,
  },
  en: {
    title: 'Choosing wine at a restaurant, with your AI sommelier · iQWine',
    description: `The wine list arrives, long, sometimes in another language. Photograph it: Octave reads it and highlights the wines made for your palate. Free trial: ${TRIAL_SHORT.en}, no card.`,
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/carte-des-vins', locale, TEXTES);
}

/**
 * VideoObject — même motif que /le-film : l'indexeur vidéo de Google va
 * CHERCHER ces fichiers, donc les URL sont absolues sur le domaine canonique,
 * jamais relatives ni sur l'ancien domaine. Durée mesurée : 90,4 s.
 * La vidéo est un enregistrement d'écran RÉEL de l'application.
 */
const DEMO_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'Octave met en évidence les vins faits pour votre palais',
  description:
    'Démonstration réelle : les vins retenus par Octave, avec le pourquoi de chacun en une phrase.',
  thumbnailUrl: 'https://iqwine.ai/video/octave-demo-poster.jpg',
  contentUrl: 'https://iqwine.ai/video/octave-demo.mp4',
  uploadDate: '2026-07-17T09:00:00-04:00',
  // Durée de la version SERVIE, recadrée sur les résultats le 2026-08-14
  // (protection du produit) : l'original de 90 s vit dans sources-videos/.
  duration: 'PT34S',
};

export default function CartePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(DEMO_JSONLD).replace(/</g, '\\u003c') }}
      />
      <CarteContent />
    </>
  );
}
