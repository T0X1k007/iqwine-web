interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

// Flat pill: mono uppercase — serves as eyebrow signature.
export default function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full font-mono text-[11px] font-medium tracking-[0.22em] uppercase bg-primary/[0.08] text-primary border border-border-hot ${className}`}
    >
      {children}
    </span>
  );
}
