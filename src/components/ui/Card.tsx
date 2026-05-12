interface CardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: 'cellier' | 'sommelier' | 'decouverte' | 'primary';
  /** Glassmorphism Apple VisionOS — matte, presque invisible (utiliser sur cards Suite) */
  glass?: boolean;
}

// Accent — gradient top bar fade-out + glow subtil au hover.
// Trois nuances chaudes : or signature, or-deep laiton, cuivre.
const accentGradient = {
  cellier:
    'before:bg-[linear-gradient(90deg,transparent,var(--color-cellier)_30%,var(--color-cellier)_70%,transparent)]',
  sommelier:
    'before:bg-[linear-gradient(90deg,transparent,var(--color-sommelier)_30%,var(--color-sommelier)_70%,transparent)]',
  decouverte:
    'before:bg-[linear-gradient(90deg,transparent,var(--color-decouverte)_30%,var(--color-decouverte)_70%,transparent)]',
  primary:
    'before:bg-[linear-gradient(90deg,transparent,var(--color-primary)_30%,var(--color-primary)_70%,transparent)]',
} as const;

const accentHoverGlow = {
  cellier: 'hover:shadow-[0_8px_32px_rgba(201,163,106,0.18)]',
  sommelier: 'hover:shadow-[0_8px_32px_rgba(140,111,68,0.20)]',
  decouverte: 'hover:shadow-[0_8px_32px_rgba(201,123,71,0.18)]',
  primary: 'hover:shadow-[0_8px_32px_rgba(122,31,31,0.22)]',
} as const;

export default function Card({
  children,
  className = '',
  accentColor,
  glass = false,
}: CardProps) {
  // Glassmorphism Apple VisionOS — matte, soft, presque invisible.
  // Background ivoire 2.5%, blur 24px (pas 40+), pas de saturation forte.
  const glassStyle: React.CSSProperties = glass
    ? {
        background: 'rgba(245, 239, 230, 0.025)',
        backdropFilter: 'blur(24px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.1)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
      }
    : {};

  return (
    <div
      style={glassStyle}
      className={`group relative ${glass ? '' : 'bg-card'} rounded-xl border border-border p-6 sm:p-8
        transition-all duration-[200ms] ease-[cubic-bezier(.32,.72,0,1)]
        hover:bg-hi hover:border-or/20
        ${accentColor ? `before:absolute before:top-0 before:inset-x-4 before:h-[2px] before:rounded-full ${accentGradient[accentColor]} ${accentHoverGlow[accentColor]}` : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}
