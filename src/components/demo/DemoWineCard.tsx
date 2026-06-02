'use client';

import { MapPin, Check, Sparkles } from 'lucide-react';
import type { DemoCard } from '@/lib/demoData';
import type { Locale } from '@/lib/i18n';

/**
 * Carte de recommandation — réplique éditoriale de la carte produit iQWine.
 * Affiche : couleur, producteur/cuvée/région, badge source (Ma cave / SAQ),
 * prix SAQ (tabular-nums), badge « Disponible à votre SAQ » ou « À son meilleur »,
 * et l'explication contextualisée au plat. 100 % statique (données factices).
 */

const WINE_DOT: Record<DemoCard['color'], string> = {
  ROUGE: 'bg-[var(--color-wine-rouge)]',
  BLANC: 'bg-[var(--color-wine-blanc)]',
  EFFERVESCENT: 'bg-[var(--color-wine-mousseux)]',
};

export default function DemoWineCard({
  card,
  locale,
}: {
  card: DemoCard;
  locale: Locale;
}) {
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const isCave = card.source === 'cave';

  return (
    <article className="glass rounded-xl border border-border-strong p-4 sm:p-5 text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span
            aria-hidden
            className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${WINE_DOT[card.color]}`}
          />
          <div className="min-w-0">
            <h3 className="font-[family-name:var(--font-display)] text-foreground text-lg sm:text-xl leading-tight truncate">
              {card.cuvee}
            </h3>
            <p className="iq-small text-foreground-dim truncate">
              {card.producer} · {card.region}
            </p>
          </div>
        </div>

        {/* Badge source */}
        <span
          className={`shrink-0 font-mono text-[9px] tracking-[0.18em] uppercase rounded-pill px-2.5 py-1 border ${
            isCave
              ? 'text-or border-or/40 bg-or/10'
              : 'text-foreground-dim border-border-strong bg-elev'
          }`}
        >
          {isCave ? t('Ma cave', 'My cellar') : 'SAQ'}
        </span>
      </div>

      {/* Ligne statut : prix SAQ + dispo, ou apogée */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        {!isCave && typeof card.priceCad === 'number' && (
          <span className="tabular font-medium text-foreground text-[15px]">
            {card.priceCad.toFixed(2)} $
          </span>
        )}
        {!isCave && card.available && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-signal)]">
            <MapPin size={12} strokeWidth={2} />
            {t('Disponible à votre SAQ', 'In stock at your SAQ')}
          </span>
        )}
        {isCave && card.atPeak && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-or">
            <Sparkles size={12} strokeWidth={2} />
            {t('À son meilleur', 'At its peak')}
          </span>
        )}
      </div>

      {/* Explication IA */}
      <p className="mt-3 iq-small text-foreground-dim leading-relaxed flex items-start gap-2">
        <Check size={14} strokeWidth={2} className="text-or/70 mt-0.5 shrink-0" />
        <span>{card.why[locale]}</span>
      </p>
    </article>
  );
}
