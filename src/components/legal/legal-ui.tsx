import Link from 'next/link';
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
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-muted-foreground">
      <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl tracking-tight text-foreground mb-2 leading-tight">
        {title}
      </h1>
      <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-foreground-faint mb-12">
        {meta}
      </p>
      {children}
      <p className="mt-16">
        <Link href="/" className="text-or underline underline-offset-4 hover:text-foreground">
          ← Retour à l’accueil
        </Link>
      </p>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-foreground mb-3">
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
