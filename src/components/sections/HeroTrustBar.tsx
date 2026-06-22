'use client';

import { Lock, ShieldCheck } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { getHero } from '@/lib/constants';
import { FleurDeLys, SaqLive } from '@/components/ui/brand-icons';

/**
 * Cartouche de confiance hero — 4 piliers dans une boîte arrondie bordée
 * alignée sur la largeur du contenu (flush CTA « 14 jours » → bord droit
 * de la démo Sommelier iQWine ; demande Eric 2026-06-11) : icône or à
 * gauche + titre gras + deux sous-lignes muted, séparés par des filets
 * verticaux (desktop). Ordre fixe aligné sur HERO_MAP.trust :
 * Québec · Chiffré & privé · SAQ en direct · Sans carte.
 */

export default function HeroTrustBar() {
  const { locale } = useLocale();
  const hero = getHero(locale);

  // Seul le pilier SAQ (index 2) est un différenciateur — les 3 autres sont de
  // l'hygiène. On le sort de la parité visuelle par un accent or léger.
  const items = [
    { ...hero.trust[0], icon: <FleurDeLys size={30} />, accent: false },
    { ...hero.trust[1], icon: <Lock size={26} strokeWidth={1.75} />, accent: false },
    { ...hero.trust[2], icon: <SaqLive size={28} />, accent: true },
    { ...hero.trust[3], icon: <ShieldCheck size={26} strokeWidth={1.75} />, accent: false },
  ];

  return (
    <div className="rounded-2xl border border-border bg-foreground/[0.03] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x divide-border">
      {items.map(({ title, lines, icon, accent }) => (
        <div
          key={title}
          className={`flex items-center gap-4 px-4 py-5 sm:px-6 lg:py-6 lg:justify-center ${
            accent ? 'bg-or/[0.06]' : ''
          }`}
        >
          <span className="text-or shrink-0">{icon}</span>
          <span className="flex flex-col gap-0.5">
            <span
              className={`text-sm font-semibold uppercase tracking-[0.08em] leading-snug ${
                accent ? 'text-or' : 'text-foreground'
              }`}
            >
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
