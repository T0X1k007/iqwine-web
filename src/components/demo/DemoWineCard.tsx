'use client';

import { MapPin, Sparkles, Clock, Utensils, Wine } from 'lucide-react';
import type { DemoCard, DemoAxes } from '@/lib/demoData';
import type { Locale } from '@/lib/i18n';

/**
 * Carte de recommandation — réplique éditoriale de la VRAIE fiche Octave (scan).
 * C1 : ce n'est plus une phrase générique, c'est un échange de sommelier —
 * personnalité, l'accord (pourquoi), notes de bouche, fenêtre de dégustation,
 * trois axes de profil, service, autres accords. 100 % statique (données factices).
 */

const WINE_DOT: Record<DemoCard['color'], string> = {
  ROUGE: 'bg-[var(--color-wine-rouge)]',
  BLANC: 'bg-[var(--color-wine-blanc)]',
  EFFERVESCENT: 'bg-[var(--color-wine-mousseux)]',
};

const AXIS_KEYS: { key: keyof DemoAxes; fr: string; en: string }[] = [
  { key: 'acidity', fr: 'Acidité', en: 'Acidity' },
  { key: 'body', fr: 'Corps', en: 'Body' },
  { key: 'intensity', fr: 'Intensité', en: 'Intensity' },
];

export default function DemoWineCard({ card, locale }: { card: DemoCard; locale: Locale }) {
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const isCave = card.source === 'cave';

  return (
    <article className="glass rounded-2xl border border-border-strong p-5 sm:p-6 text-left">
      {/* En-tête : identité + source */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span
            aria-hidden
            className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${WINE_DOT[card.color]}`}
          />
          <div className="min-w-0">
            <h3 className="font-[family-name:var(--font-display)] text-foreground text-xl sm:text-2xl leading-tight">
              {card.cuvee}
              {card.vintage ? (
                <span className="text-or tabular-nums"> {card.vintage}</span>
              ) : null}
            </h3>
            <p className="iq-small text-foreground-dim">
              {card.producer} · {card.region}
            </p>
            <p className="mt-1.5 font-[family-name:var(--font-display)] italic text-or text-[15px]">
              {card.personality[locale]}
            </p>
          </div>
        </div>
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

      {/* Statut : prix + dispo (SAQ) ou apogée (cave) */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
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

      {/* L'ACCORD — pourquoi ce vin, ce plat (la voix d'Octave) */}
      <div className="mt-5">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-foreground-faint mb-2">
          {t('L’accord', 'The pairing')}
        </p>
        <p className="font-[family-name:var(--font-display)] text-foreground/90 text-[17px] leading-relaxed">
          {card.why[locale]}
        </p>
      </div>

      {/* EN BOUCHE */}
      <div className="mt-5 flex items-start gap-2.5">
        <Wine size={15} strokeWidth={1.75} className="text-or/70 mt-0.5 shrink-0" aria-hidden />
        <p className="iq-small text-foreground-dim leading-relaxed">{card.tasting[locale]}</p>
      </div>

      {/* AXES de profil */}
      <dl className="mt-5 grid grid-cols-3 gap-x-4 gap-y-1.5">
        {AXIS_KEYS.map((a) => (
          <div key={a.key} className="min-w-0">
            <dt className="font-mono text-[9px] tracking-[0.14em] uppercase text-foreground-faint">
              {locale === 'fr' ? a.fr : a.en}
            </dt>
            <dd
              className="mt-1 h-px bg-border-strong relative"
              aria-label={`${card.axes[a.key]} / 10`}
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 bg-or/70"
                style={{ width: `${(card.axes[a.key] / 10) * 100}%` }}
              />
            </dd>
          </div>
        ))}
      </dl>

      {/* FENÊTRE + SERVICE */}
      <div className="mt-5 space-y-2 border-t border-border-strong/60 pt-4">
        <p className="flex items-start gap-2.5 iq-small text-foreground-dim leading-relaxed">
          <Clock size={14} strokeWidth={1.75} className="text-or/70 mt-0.5 shrink-0" aria-hidden />
          <span>{card.window[locale]}</span>
        </p>
        <p className="flex items-start gap-2.5 iq-small text-foreground-dim leading-relaxed">
          <Utensils
            size={14}
            strokeWidth={1.75}
            className="text-or/70 mt-0.5 shrink-0"
            aria-hidden
          />
          <span>
            <span className="text-foreground-faint">{t('Service : ', 'Serving: ')}</span>
            {card.serving[locale]}
            {' · '}
            <span className="text-foreground-faint">{t('Aussi avec ', 'Also with ')}</span>
            {card.alsoPairs[locale]}
          </span>
        </p>
      </div>
    </article>
  );
}
