'use client';

import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { LEGAL_ENTITY } from '@/lib/legal-meta';
import { useLocale } from '@/lib/i18n';

/**
 * Footer iQWine, grande maison discrète, structuré en colonnes
 * (signal d'entreprise) sans perdre la signature éditoriale.
 *
 * Colonnes : Produit · Légal · Entreprise. Liens RÉELS alignés sur les IDs des
 * sections de la home (#cave-web, #tarifs, #comparatif, #faq — plus de « # »
 * morts). Bilingue FR/EN via le même pattern que la barre de navigation
 * (useLocale + t(fr, en)).
 */

type FooterLink = { label: string; href: string };

export default function Footer() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const produit: FooterLink[] = [
    { label: t('Fonctionnalités', 'Features'), href: '/#cave-web' },
    { label: t('Tarifs', 'Pricing'), href: '/#tarifs' },
    { label: t('Comparatif', 'Comparison'), href: '/#comparatif' },
    { label: t('Questions fréquentes', 'FAQ'), href: '/#faq' },
  ];

  const legal: FooterLink[] = [
    { label: t('Confidentialité', 'Privacy'), href: '/confidentialite' },
    { label: t('Conditions', 'Terms'), href: '/conditions' },
  ];

  const entreprise: FooterLink[] = [
    { label: t('Notre maison', 'Our house'), href: '/notre-maison' },
    { label: t('Contact', 'Contact'), href: '/contact' },
  ];

  return (
    <footer className="relative border-t border-border py-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-12 gap-x-8 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Bloc marque, lockup + signature + provenance */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <Logo size={28} />
              <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight leading-none">
                <span className="text-foreground">iQ</span>
                <span className="text-or">Wine</span>
              </span>
            </div>
            <p className="font-[family-name:var(--font-display)] italic text-foreground text-2xl tracking-tight leading-snug max-w-xs">
              {t('Une cave qui se souvient.', 'A cellar that remembers.')}
            </p>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              {t(
                'Conçu au Québec · Hébergé au Canada',
                'Made in Québec · Hosted in Canada',
              )}
            </p>
          </div>

          <FooterColumn title={t('Produit', 'Product')} links={produit} />
          <FooterColumn title={t('Légal', 'Legal')} links={legal} />
          <FooterColumn title={t('Entreprise', 'Company')} links={entreprise} />
        </div>

        {/* Bas de page, copyright */}
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
