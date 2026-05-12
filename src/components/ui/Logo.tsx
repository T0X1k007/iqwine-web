/**
 * Logo iQWine — image officielle (verre à vin doré, signature iQ).
 * Source : public/logo-iqwine.png — dimensions natives 228×256 (ratio 0.890625).
 *
 * <img> natif pour bypasser le bug intermittent next/image + Turbopack en dev.
 * Dimensions explicites + aspect-ratio CSS pour zéro CLS au chargement.
 */

interface LogoProps {
  /** Hauteur cible en px (le ratio 228/256 est respecté par aspect-ratio) */
  size?: number;
  className?: string;
  glow?: boolean;
  priority?: boolean;
}

const RATIO_W = 228;
const RATIO_H = 256;

export default function Logo({
  size = 32,
  className = '',
  glow,
  priority,
}: LogoProps) {
  const computedWidth = Math.round((size * RATIO_W) / RATIO_H);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-iqwine.png"
      alt="iQWine"
      width={computedWidth}
      height={size}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
      style={{
        width: computedWidth,
        height: size,
        aspectRatio: `${RATIO_W} / ${RATIO_H}`,
        filter: glow
          ? 'drop-shadow(0 0 32px rgba(201, 163, 106, 0.45))'
          : undefined,
      }}
    />
  );
}
