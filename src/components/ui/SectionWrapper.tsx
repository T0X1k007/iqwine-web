interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  withDivider?: boolean;
}

export default function SectionWrapper({
  children,
  id,
  className = '',
  withDivider = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative py-20 sm:py-28 lg:py-36 ${className}`}
    >
      {/* Subtle horizontal rule — ivory low alpha, not orange glow */}
      {withDivider && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(720px,90%)] h-px bg-border" />
      )}
      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
