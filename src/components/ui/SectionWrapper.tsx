interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  withDivider?: boolean;
  /**
   * Rhythm vertical éditorial — Phase 3 D4.
   *   - `standard` (défaut) : sections informatives (Constat, Suite, Intelligence)
   *   - `editorial` : sections émotionnelles, +40% respiration (Le Cercle, Accès)
   * Permet un rythme de magazine sans décoration ajoutée.
   */
  rhythm?: 'standard' | 'editorial';
}

const rhythmClasses: Record<NonNullable<SectionWrapperProps['rhythm']>, string> = {
  standard: 'py-20 sm:py-28 lg:py-36',
  editorial: 'py-28 sm:py-40 lg:py-52',
};

export default function SectionWrapper({
  children,
  id,
  className = '',
  withDivider = false,
  rhythm = 'standard',
}: SectionWrapperProps) {
  return (
    <section id={id} className={`relative ${rhythmClasses[rhythm]} ${className}`}>
      {/* Subtle horizontal rule — ivory low alpha, signature transition entre sections */}
      {withDivider && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(720px,90%)] h-px bg-border" />
      )}
      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-8">{children}</div>
    </section>
  );
}
