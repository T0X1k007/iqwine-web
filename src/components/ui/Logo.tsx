/**
 * Logo iQWine — image officielle (verre à vin doré, signature iQ).
 * Source : public/logo-iqwine.png (copié depuis cellier-vin/public/logo.png).
 *
 * Implémentation en <img> natif plutôt que next/image — Next 16 + Turbopack
 * a un bug intermittent avec l'optimizer en dev sur les PNG transparents.
 */

interface LogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export default function Logo({ size = 32, className = '', glow }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-iqwine.png"
      alt="iQWine"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: 'auto',
        filter: glow
          ? 'drop-shadow(0 0 32px rgba(201, 163, 106, 0.45))'
          : undefined,
      }}
    />
  );
}
