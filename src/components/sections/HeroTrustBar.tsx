'use client';

import { Lock, ShieldCheck } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { getHero } from '@/lib/constants';

/**
 * Cartouche de confiance hero — 4 piliers dans une boîte arrondie bordée
 * alignée sur la largeur du contenu (flush CTA « 14 jours » → bord droit
 * de la démo Sommelier iQWine ; demande Eric 2026-06-11) : icône or à
 * gauche + titre gras + deux sous-lignes muted, séparés par des filets
 * verticaux (desktop). Ordre fixe aligné sur HERO_MAP.trust :
 * Québec · Chiffré & privé · SAQ en direct · Sans carte.
 */

function FleurDeLys({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 1.5c-1.7 2-2.6 3.9-2.6 5.7 0 1.9.9 3.6 2.6 5.1 1.7-1.5 2.6-3.2 2.6-5.1 0-1.8-.9-3.7-2.6-5.7Z" />
      <path d="M4.9 8c-.6 1.9-.5 3.4.4 4.6.8 1.1 2.2 1.8 4.1 2.1-.2-1.8-.8-3.3-1.7-4.5C7 9.4 6.1 8.7 4.9 8Z" />
      <path d="M19.1 8c-1.2.7-2.1 1.4-2.8 2.2-.9 1.2-1.5 2.7-1.7 4.5 1.9-.3 3.3-1 4.1-2.1.9-1.2 1-2.7.4-4.6Z" />
      <rect x="8" y="15.5" width="8" height="1.7" rx="0.85" />
      <path d="M10.4 18.2c.3 1.5.8 2.9 1.6 4.3.8-1.4 1.3-2.8 1.6-4.3h-3.2Z" />
    </svg>
  );
}

function SaqLive({ size = 22 }: { size?: number }) {
  return (
    <span className="flex flex-col items-center leading-none" aria-hidden>
      <svg
        width={size}
        height={Math.round(size * 0.68)}
        viewBox="0 0 24 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
      >
        <rect x="1.5" y="1" width="21" height="14" rx="2.5" />
        <path d="M6 6h12M6 10h7" />
      </svg>
      <span className="mt-1 font-mono text-[7px] font-semibold tracking-[0.18em]">
        SAQ
      </span>
    </span>
  );
}

export default function HeroTrustBar() {
  const { locale } = useLocale();
  const hero = getHero(locale);

  const items = [
    { ...hero.trust[0], icon: <FleurDeLys size={30} /> },
    { ...hero.trust[1], icon: <Lock size={26} strokeWidth={1.75} /> },
    { ...hero.trust[2], icon: <SaqLive size={28} /> },
    { ...hero.trust[3], icon: <ShieldCheck size={26} strokeWidth={1.75} /> },
  ];

  return (
    <div className="rounded-2xl border border-border bg-foreground/[0.03] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x divide-border">
      {items.map(({ title, lines, icon }) => (
        <div
          key={title}
          className="flex items-center gap-4 px-4 py-5 sm:px-6 lg:py-6 lg:justify-center"
        >
          <span className="text-or shrink-0">{icon}</span>
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground leading-snug">
              {title}
            </span>
            {lines.map((line) => (
              <span
                key={line}
                className="text-[13px] text-muted-foreground leading-snug"
              >
                {line}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
