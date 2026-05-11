interface CardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: 'cellier' | 'sommelier' | 'decouverte' | 'primary';
}

// Accent — 2px top bar (signature fonctionnelle, pas glow décoratif).
// Max radius 12px, cohérent avec brand luxe sobre.
const accentTopBorder = {
  cellier: 'before:bg-cellier',
  sommelier: 'before:bg-sommelier',
  decouverte: 'before:bg-decouverte',
  primary: 'before:bg-primary',
} as const;

export default function Card({
  children,
  className = '',
  accentColor,
}: CardProps) {
  return (
    <div
      className={`relative bg-card rounded-lg border border-border p-6 sm:p-8
        hover:bg-hi
        transition-colors duration-[140ms] ease-[cubic-bezier(.2,.8,.2,1)]
        ${accentColor ? `before:absolute before:top-0 before:inset-x-0 before:h-[2px] before:rounded-t-lg ${accentTopBorder[accentColor]}` : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}
