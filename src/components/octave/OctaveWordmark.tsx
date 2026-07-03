/**
 * OctaveWordmark — le MOT-SYMBOLE d'Octave, porté à l'IDENTIQUE depuis l'app
 * (cellier-vin/components/octave/OctaveWordmark.tsx). Le premier « O » de
 * « Octave » EST l'Anneau. ◯ctave. « Une seule peau » site ↔ app ↔ iOS.
 *
 * Signature de marque RARE, réservée aux moments où Octave entre en scène
 * (grand titre le nommant). Ailleurs → texte « Octave ». Le luxe vient de la rareté.
 *
 * Dessiné pour être perçu comme le O du mot, jamais comme une icône posée devant :
 * - taille en `em` (suit la typo Cormorant), calibrée sur la hauteur de capitale ;
 * - `verticalAlign -0.147em` : bas sur la ligne de base, haut à hauteur de capitale,
 *   avec le léger overshoot d'un vrai O serif ;
 * - `marginRight -0.037em` : crénage serré vers le « c » (chasse d'un « Oc » réel) ;
 * - trait 5.2 → équilibré avec le fût des lettres Cormorant.
 *
 * La LUMIÈRE d'Octave est INTÉGRÉE à l'anneau (dégradé plus clair à 12 h), pas un
 * point flottant → l'anneau se lit comme un O lumineux. Au REPOS : pas de nœud.
 *
 * Anneau = champagne (`text-or-soft` sur le svg) ; « ctave » hérite de la couleur
 * du titre → le O est le joyau, le mot reste naturel et lisible.
 */
export default function OctaveWordmark({
  className,
  italic = false,
  ariaLabel = 'Octave',
}: {
  className?: string;
  /** Titre en Cormorant ITALIC : incline l'anneau (~10°) pour qu'il lise comme
   *  un O italique — un O italique EST une ellipse penchée. Sans ça, un cercle
   *  droit trahit « icône posée » au milieu de lettres penchées. */
  italic?: boolean;
  ariaLabel?: string;
}) {
  return (
    <span className={`whitespace-nowrap ${className ?? ''}`} role="img" aria-label={ariaLabel}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
        className="inline-block text-or-soft"
        style={{
          width: '0.92em',
          height: '0.92em',
          verticalAlign: '-0.147em',
          marginRight: italic ? '-0.05em' : '-0.037em',
          transform: italic ? 'skewX(-10deg)' : undefined,
        }}
      >
        <defs>
          {/* lumière d'Octave intégrée à l'anneau — plus claire à 12 h */}
          <linearGradient id="octaveRingLight" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0" stopColor="#fbf1d8" />
            <stop offset="0.5" stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.72" />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="url(#octaveRingLight)"
          strokeWidth="5.2"
          opacity="0.95"
        />
      </svg>
      <span aria-hidden="true">ctave</span>
    </span>
  );
}
