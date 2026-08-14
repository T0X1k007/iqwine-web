/**
 * LA LIGNE D'ACCORD, le motif signature de la refonte v3 « À l'unisson ».
 *
 * Un trait d'or fin (1 px) qui traverse le site : il s'infléchit dans les
 * mouvements (l'onde d'un palais, la courbe d'une apogée) et se résout à
 * l'horizontale dans la coda. Règle d'Eric (2026-08-12) : EXTRÊMEMENT subtile ,
 * une signature qu'on remarque presque inconsciemment, jamais un ornement
 * qu'on regarde avant le contenu. Si elle commence à faire gimmick : réduire.
 *
 * Aucune animation ici : le trait est statique, seule sa forme évolue d'un
 * mouvement à l'autre. `aria-hidden`, purement décoratif.
 */

type Variante = 'fragment' | 'inflexion' | 'resolue';
type Ton = 'jour' | 'nuit';

/** Amplitudes volontairement faibles : la ligne suggère, elle ne dessine pas. */
const TRACES: Record<Variante, string> = {
  // Une seule respiration douce, sous la signature du hero.
  fragment: 'M0,12 C40,12 60,5 100,5 C140,5 160,17 200,17 C240,17 260,12 320,12',
  // Deux inflexions, transition entre mouvements.
  inflexion:
    'M0,12 C50,12 70,4 120,4 C170,4 190,20 240,20 C290,20 310,7 360,7 C410,7 430,14 480,12',
  // La résolution : quasi plate, l'unisson (coda).
  resolue: 'M0,12 C120,12 180,10.5 240,10.5 C300,10.5 360,12 480,12',
};

const LARGEURS: Record<Variante, number> = { fragment: 320, inflexion: 480, resolue: 480 };

export default function LigneAccord({
  variante = 'fragment',
  ton = 'jour',
  className = '',
}: {
  variante?: Variante;
  ton?: Ton;
  className?: string;
}) {
  const largeur = LARGEURS[variante];
  return (
    <svg
      viewBox={`0 0 ${largeur} 24`}
      preserveAspectRatio="none"
      aria-hidden
      // `w-full` est INDISPENSABLE : sans largeur déclarée, un <svg> à viewBox
      // prend sa taille INTRINSÈQUE (480 px) au lieu de suivre son conteneur.
      // Mesuré le 2026-08-14 en QA : 142 px de défilement horizontal sur
      // l'accueil et Notre histoire à 393 px, et la ligne rognée ailleurs, là
      // où un `overflow-hidden` de section masquait le symptôme.
      className={`block h-[24px] w-full ${className}`}
    >
      <path
        d={TRACES[variante]}
        fill="none"
        stroke={ton === 'jour' ? 'var(--color-or-jour)' : 'var(--color-or)'}
        strokeWidth="1"
        opacity={ton === 'jour' ? 0.55 : 0.45}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
