/**
 * BottleSilhouette — SVG silhouette d'une bouteille de vin.
 * Trois formes : bordelaise (épaule droite), bourgogne (épaule penchée),
 * rhodanienne (sloping syrah). Remplie avec un gradient warm vinous selon teinte.
 */

interface BottleSilhouetteProps {
  shape?: 'bordeaux' | 'bourgogne' | 'rhone';
  /** Couleur du vin (rouge profond par défaut) */
  wineColor?: string;
  width?: number;
  className?: string;
}

const SHAPES = {
  bordeaux:
    'M 30 0 L 30 32 C 30 36, 28 38, 26 42 L 22 50 C 20 54, 19 58, 19 64 L 19 152 C 19 156, 22 158, 26 158 L 54 158 C 58 158, 61 156, 61 152 L 61 64 C 61 58, 60 54, 58 50 L 54 42 C 52 38, 50 36, 50 32 L 50 0 Z',
  bourgogne:
    'M 30 0 L 30 30 C 30 34, 27 38, 24 44 C 20 50, 17 58, 17 70 L 17 152 C 17 156, 20 158, 24 158 L 56 158 C 60 158, 63 156, 63 152 L 63 70 C 63 58, 60 50, 56 44 C 53 38, 50 34, 50 30 L 50 0 Z',
  rhone:
    'M 30 0 L 30 28 C 30 33, 28 36, 25 41 C 22 46, 20 53, 20 60 L 20 152 C 20 156, 23 158, 27 158 L 53 158 C 57 158, 60 156, 60 152 L 60 60 C 60 53, 58 46, 55 41 C 52 36, 50 33, 50 28 L 50 0 Z',
};

export default function BottleSilhouette({
  shape = 'bordeaux',
  wineColor = '#6B1F1F',
  width = 80,
  className = '',
}: BottleSilhouetteProps) {
  const height = Math.round((width * 158) / 80);
  const id = `bottle-grad-${shape}-${wineColor.replace('#', '')}`;
  const capId = `bottle-cap-${shape}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 158"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        {/* Gradient vinous : highlight droit (lumière), ombre gauche (verre) */}
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={wineColor} stopOpacity="0.6" />
          <stop offset="35%" stopColor={wineColor} stopOpacity="0.95" />
          <stop offset="50%" stopColor={wineColor} stopOpacity="1" />
          <stop offset="65%" stopColor={wineColor} stopOpacity="0.85" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
        {/* Cap noir mat avec highlight subtil */}
        <linearGradient id={capId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="50%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
      </defs>

      {/* Capsule (cap) en haut du goulot */}
      <rect
        x="29"
        y="0"
        width="22"
        height="20"
        fill={`url(#${capId})`}
        rx="1"
      />

      {/* Corps + goulot de la bouteille */}
      <path
        d={SHAPES[shape]}
        fill={`url(#${id})`}
      />

      {/* Highlight verre — fine bande lumineuse à droite */}
      <path
        d={SHAPES[shape]}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />

      {/* Reflet vertical subtil côté gauche */}
      <rect
        x="22"
        y="50"
        width="2"
        height="100"
        fill="rgba(255,255,255,0.08)"
        rx="1"
      />
    </svg>
  );
}
