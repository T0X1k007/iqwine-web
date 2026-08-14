'use client';

import LocaleLink from '@/components/ui/LocaleLink';

/**
 * Fil d'Ariane discret (architecture Fonctions, 2026-08-13), une ligne
 * d'overline, jamais un chemin de dossiers technique. Utilisé sur le hub et
 * les pages Fonction (« Accueil → Fonctions → Au restaurant »). Le balisage
 * BreadcrumbList (JSON-LD) sera posé côté serveur, page par page, avec leurs
 * autres données structurées.
 */
export default function FilAriane({
  elements,
  ton = 'jour',
}: {
  elements: { label: string; href?: string }[];
  ton?: 'jour' | 'nuit';
}) {
  const couleurs =
    ton === 'jour'
      ? { lien: 'text-encre-3 hover:text-bordeaux-jour', actif: 'text-encre-2', sep: 'text-encre-3/60' }
      : { lien: 'text-foreground-faint hover:text-or', actif: 'text-muted-foreground', sep: 'text-foreground-faint/60' };

  return (
    <nav aria-label="Fil d’Ariane" className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em]">
      {elements.map((e, i) => (
        <span key={e.label} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden className={couleurs.sep}>
              →
            </span>
          )}
          {e.href ? (
            <LocaleLink href={e.href} className={`${couleurs.lien} transition-colors`}>
              {e.label}
            </LocaleLink>
          ) : (
            <span className={couleurs.actif} aria-current="page">
              {e.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
