import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { LEGAL_ENTITY } from '@/lib/legal-meta';

/**
 * Footer iQWine — grande maison discrète, désormais structuré en colonnes
 * (signal d'entreprise) sans perdre la signature éditoriale.
 *
 * Colonnes : Produit · Légal · Entreprise. Liens légaux RÉELS (plus de « # »),
 * mention « Conçu au Québec · Hébergé au Canada ». La langue est gérée par la
 * barre de navigation, pas dupliquée ici.
 */

type FooterLink = { label: string; href: string };

const PRODUIT: FooterLink[] = [
  { label: 'Fonctionnalités', href: '/#produit' },
  { label: 'Tarifs', href: '/#pricing' },
  { label: 'Comparatif', href: '/#comparatif' },
  { label: 'Questions fréquentes', href: '/#faq' },
];

const LEGAL: FooterLink[] = [
  { label: 'Confidentialité', href: '/confidentialite' },
  { label: 'Conditions', href: '/conditions' },
];

const ENTREPRISE: FooterLink[] = [{ label: 'Contact', href: '/contact' }];

export default function Footer() {
  return (
    <footer className="relative border-t border-border py-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-12 gap-x-8 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Bloc marque — lockup + signature + provenance */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <Logo size={28} />
              <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight leading-none">
                <span className="text-foreground">iQ</span>
                <span className="text-or">Wine</span>
              </span>
            </div>
            <p className="font-[family-name:var(--font-display)] italic text-foreground text-2xl tracking-tight leading-snug max-w-xs">
              La cave qui se souvient.
            </p>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              Conçu au Québec · Hébergé au Canada
            </p>
          </div>

          <FooterColumn title="Produit" links={PRODUIT} />
          <FooterColumn title="Légal" links={LEGAL} />
          <FooterColumn title="Entreprise" links={ENTREPRISE} />
        </div>

        {/* Bas de page — copyright */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="font-mono text-[10px] tracking-[0.18em] text-foreground-faint">
            © {new Date().getFullYear()} iQWine · {LEGAL_ENTITY.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <nav aria-label={title} className="flex flex-col gap-3.5">
      <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-or">
        {title}
      </p>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-[140ms]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
