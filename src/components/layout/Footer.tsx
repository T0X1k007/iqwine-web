'use client';

import LocaleLink from '@/components/ui/LocaleLink';
import Logo from '@/components/ui/Logo';
import { LEGAL_ENTITY } from '@/lib/legal-meta';
import { useLocale } from '@/lib/i18n';

/**
 * Footer iQWine, architecture Fonctions (Eric, 2026-08-13) : la profondeur
 * vit en bas. Colonnes : Fonctions · Produit · Entreprise · Légal, le footer
 * est le second réseau de maillage vers les pages Fonction, sans alourdir la
 * nav. Les liens internes passent par LocaleLink (un lien de pied de page qui
 * perdait la langue anglaise via la redirection héritée est un bug corrigé au
 * passage). Tant qu'une page Fonction n'est pas née, son lien mène au moment
 * correspondant du hub.
 */

type FooterLink = { label: string; href: string };

export default function Footer() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const fonctions: FooterLink[] = [
    { label: t('Choisir un vin', 'Choosing a wine'), href: '/choisir-un-vin' },
    { label: t('Au restaurant', 'At the restaurant'), href: '/carte-des-vins' },
    { label: t('Accords mets-vins', 'Wine pairing'), href: '/accord-mets-vins' },
    { label: t('Le cellier', 'The cellar'), href: '/cellier-intelligent' },
    { label: t('L’apogée', 'Peak window'), href: '/apogee' },
    { label: t('Octave, sommelier IA', 'Octave, AI sommelier'), href: '/sommelier-ia' },
    { label: t('Toutes les fonctions →', 'All features →'), href: '/fonctions' },
  ];

  const produit: FooterLink[] = [
    { label: t('Tarifs', 'Pricing'), href: '/tarifs' },
    { label: t('Le film (1 min)', 'The film (1 min)'), href: '/le-film' },
    { label: t('Questions fréquentes', 'FAQ'), href: '/tarifs#faq' },
    { label: t('Programme bêta', 'Beta program'), href: '/beta' },
    // Deux pages de contenu servies par l'application (P24). Le domaine suit la
    // bascule du 2026-08-02 : `app.iqwine.ca` redirige, mais un lien de pied de
    // page vit des années et ne doit pas dépendre d'une redirection.
    //
    // Le commentaire d'origine les présentait comme des « liens entrants SEO ».
    // Mesuré le 2026-08-02, les deux répondent `x-robots-tag: noindex, nofollow`
    //, l'application entière est fermée aux moteurs, et c'est voulu. Ce sont
    // donc des liens pour des HUMAINS, pas un levier de référencement : ne pas
    // les compter comme tel en jugeant le SEO du site.
    { label: t('Apprendre le vin', 'Learn wine'), href: 'https://app.iqwine.ai/apprendre' },
    {
      label: t('Octave vérifiable', 'Verifiable Octave'),
      href: 'https://app.iqwine.ai/octave-verifiable',
    },
  ];

  const legal: FooterLink[] = [
    { label: t('Confidentialité', 'Privacy'), href: '/confidentialite' },
    { label: t('Conditions', 'Terms'), href: '/conditions' },
  ];

  const entreprise: FooterLink[] = [
    // Nomenclature unifiée sur tout le site (Eric, 2026-08-14) : la barre du
    // haut et le pied de page disent « Notre histoire », l'URL ne bouge pas.
    { label: t('Notre histoire', 'Our story'), href: '/notre-maison' },
    { label: t('Contact', 'Contact'), href: '/contact' },
  ];

  return (
    <footer className="relative border-t border-border py-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-12 gap-x-8 lg:grid-cols-[1.4fr_1.1fr_1fr_0.9fr_0.9fr]">
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
              {/* Refonte v3 : la signature du site se referme sur Octave
                  (l'ancienne « Une cave qui se souvient » vivra sur la page
                  Cellier). */}
              {t('Octave. À l’unisson de vos goûts.', 'Octave. In tune with your taste.')}
            </p>
            <p className="font-body text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              {t(
                'Conçu au Québec · Hébergé au Canada',
                'Made in Québec · Hosted in Canada',
              )}
            </p>
          </div>

          <FooterColumn title={t('Fonctions', 'Features')} links={fonctions} />
          <FooterColumn title={t('Produit', 'Product')} links={produit} />
          <FooterColumn title={t('Entreprise', 'Company')} links={entreprise} />
          <FooterColumn title={t('Légal', 'Legal')} links={legal} />
        </div>

        {/* Bas de page, copyright + avis de marque + consommation responsable */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col gap-2">
          <p className="font-body text-[10px] tracking-[0.18em] text-foreground-faint">
            © {new Date().getFullYear()} iQWine · {LEGAL_ENTITY.legalName}
          </p>
          {/* Avis de marque — IDENTIQUE sur /fr et /en, volontairement jamais
              traduit : c'est l'ancrage français que la Charte de la langue
              française exige quand `iQWine` s'affiche en contexte anglais
              (audit OQLF 2026-08-14). « sommelier virtuel » = le générique
              déclaré au REQ. ™ tant que la marque n'est pas ENREGISTRÉE à
              l'OPIC (demande 2494635) — jamais ®, jamais « marque déposée ». */}
          <p className="text-[11px] text-foreground-faint">
            iQWine™, sommelier virtuel, est une marque de commerce de {LEGAL_ENTITY.legalName}
          </p>
          <p className="text-[11px] text-foreground-faint">
            {t(
              "Réservé aux personnes en âge de consommer de l'alcool.",
              'For those of legal drinking age.',
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <nav aria-label={title} className="flex flex-col gap-3.5">
      <p className="font-body text-[10px] tracking-[0.28em] uppercase text-or">
        {title}
      </p>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <LocaleLink
              href={link.href}
              className="text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-[140ms]"
            >
              {link.label}
            </LocaleLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
