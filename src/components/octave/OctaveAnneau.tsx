/**
 * OctaveAnneau — la MARQUE d'Octave, portée à l'IDENTIQUE depuis l'app
 * (cellier-vin/components/octave/OctaveAnneau.tsx) : un anneau champagne fin +
 * un nœud lumineux posé dessus. « Une seule peau » site ↔ app ↔ iOS.
 *
 * Remplace le cliché ✦ (lucide Sparkles) LÀ OÙ OCTAVE EST LE SUJET, et
 * l'ancien monogramme « O dans un cercle » (letter-in-circle) qui divergeait
 * de la signature officielle (ici, l'ANNEAU EST le O).
 *
 * - Anneau = `currentColor` → hérite du token or du parent (`text-or-soft`).
 * - Nœud = famille champagne FIGÉE (#fff7e6 → #ebd7a6 → #d9b667) : littérale,
 *   un stop de gradient SVG ne prend pas de token Tailwind.
 * - `thinking` : le nœud orbite (parité app) ; coupé sous prefers-reduced-motion
 *   (cf. globals.css `.octave-anneau-orbit`).
 */
export default function OctaveAnneau({
  size = 20,
  thinking = false,
  strokeWidth,
  className,
  ariaLabel = 'Octave',
}: {
  size?: number;
  thinking?: boolean;
  strokeWidth?: number;
  className?: string;
  ariaLabel?: string;
}) {
  // Taille optique : petits corps = trait plus lourd (lisible 1x), grands corps
  // = trait affiné (élégance du O calibré).
  const stroke = strokeWidth ?? (size <= 32 ? 5 : 3.5);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label={ariaLabel}
      className={className}
    >
      <defs>
        <radialGradient id="octaveAnneauNode">
          <stop offset="0" stopColor="#fff7e6" />
          <stop offset="0.4" stopColor="#ebd7a6" />
          <stop offset="1" stopColor="#d9b667" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* l'anneau — champagne via currentColor (token du parent) */}
      <circle
        cx="60"
        cy="60"
        r="42"
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        opacity="0.9"
      />
      {/* le nœud lumineux qui veille (et orbite si thinking — origine gérée
          par .octave-anneau-orbit via transform-box: view-box) */}
      <g className={thinking ? 'octave-anneau-orbit' : undefined}>
        <circle cx="60" cy="18" r="14" fill="url(#octaveAnneauNode)" />
        <circle cx="60" cy="18" r="3" fill="#fff7e6" />
      </g>
    </svg>
  );
}
