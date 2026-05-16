import Logo from '@/components/ui/Logo';

/**
 * Footer iQWine — sensation de grande maison discrète.
 *
 * Phase 3 D3 : signature éditoriale italique « La cave qui se souvient. »
 * + retrait « Digital Sommelier OS » du copyright (positionnement consumer).
 * Minimalisme préservé — aucun CTA, aucune icône, aucune nouvelle section.
 */
export default function Footer() {
  return (
    <footer className="relative border-t border-border py-24">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 flex flex-col items-center gap-12">
        {/* Logo lockup — image officielle + wordmark */}
        <div className="flex items-center gap-2.5">
          <Logo size={28} />
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight leading-none">
            <span className="text-foreground">iQ</span>
            <span className="text-or">Wine</span>
          </span>
        </div>

        {/* Signature éditoriale — grande maison discrète, voix contemplative */}
        <p className="font-[family-name:var(--font-display)] italic text-foreground text-2xl sm:text-3xl tracking-tight text-center leading-snug max-w-2xl">
          La cave qui se souvient.
        </p>

        {/* Liens légaux — mono sobre */}
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

        {/* Copyright minimaliste — sans dev tooling, pure consumer */}
        <p className="font-mono text-[10px] tracking-[0.18em] text-foreground-faint">
          © {new Date().getFullYear()} iQWine
        </p>
      </div>
    </footer>
  );
}
