import LocaleLink from '@/components/ui/LocaleLink';
import type { ReactNode } from 'react';

/**
 * Primitives partagées des pages légales (Confidentialité, Conditions).
 * Évite la duplication du scaffold + des sous-composants Section/List entre
 * les deux pages. Style aligné sur le site marketing (serif display, mono).
 */

export function LegalPage({
  title,
  meta,
  children,
}: {
  title: string;
  /** Ligne d'en-tête (ex. « En vigueur le 9 juin 2026 · Conforme à la Loi 25 »). */
  meta: string;
  children: ReactNode;
}) {
  // Le titre passait SOUS la barre fixe (QA v3, 2026-08-14) : `py-24` valait
  // 96 px alors que la navbar mesure 128 px en desktop, soit 32 px de
  // recouvrement, et exactement 0 px d'écart en mobile. On part désormais de
  // la hauteur RÉELLE de la barre, à toutes les largeurs.
  return (
    <main
      className="mouvement-jour min-h-screen text-encre-2"
      style={{ paddingTop: 'calc(var(--nav-h) + 3rem)' }}
    >
      <div className="mx-auto max-w-2xl px-6 pb-24">
      <h1 className="mb-2 font-[family-name:var(--font-display)] text-4xl leading-tight tracking-tight text-encre sm:text-5xl">
        {title}
      </h1>
      <p className="mb-12 font-body text-[11px] uppercase tracking-[0.18em] text-or-jour">
        {meta}
      </p>
      {children}
        <p className="mt-16">
          <LocaleLink href="/" className="text-bordeaux-jour underline underline-offset-4 hover:text-or-jour">
            ← Retour à l’accueil
          </LocaleLink>
        </p>
      </div>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 font-[family-name:var(--font-display)] text-2xl tracking-tight text-encre">
        {title}
      </h2>
      <div className="text-[15px] leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}
