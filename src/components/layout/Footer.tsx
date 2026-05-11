import Logo from '@/components/ui/Logo';

export default function Footer() {
  return (
    <footer className="relative border-t border-border py-14">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 flex flex-col items-center gap-6">
        {/* Logo lockup — image officielle + wordmark */}
        <div className="flex items-center gap-2.5">
          <Logo size={28} />
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight leading-none">
            <span className="text-foreground">iQ</span>
            <span className="text-or">Wine</span>
          </span>
        </div>

        {/* Tagline éditoriale */}
        <p className="font-[family-name:var(--font-display)] italic text-foreground-dim text-sm tracking-wide text-center max-w-md">
          Le compagnon œnologique. Toujours à table.
        </p>

        <div className="flex gap-7 font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors duration-[140ms]">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground transition-colors duration-[140ms]">
            Terms
          </a>
          <a href="#" className="hover:text-foreground transition-colors duration-[140ms]">
            Contact
          </a>
        </div>

        <p className="font-mono text-[10px] tracking-[0.18em] text-foreground-faint">
          © {new Date().getFullYear()} iQWine — Digital Sommelier OS
        </p>
      </div>
    </footer>
  );
}
