'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Sparkles, ChevronLeft, Heart, Wine, Search } from 'lucide-react';
import type { DemoCard } from '@/lib/demoData';
import type { Locale } from '@/lib/i18n';

/**
 * DemoPhone — réplique « capture d'app » iQWine dans un cadre iPhone premium.
 * Écran CLAIR (crème/or, identité réelle de l'app), bouteille dominante, et de
 * vrais composants d'app : barre de navigation, encadré « Octave recommande »,
 * carte fenêtre de dégustation, barre d'onglets iOS. Photo réelle + repli silhouette.
 */

const WINE_PHOTOS: Record<string, string> = {
  'Castello di Ama': '/photos/wines/castello-ama.png',
  Masciarelli: '/photos/wines/masciarelli.png',
  'Domaine William Fèvre': '/photos/wines/william-fevre.png',
  'Château de la Ragotière': '/photos/wines/ragotiere.png',
  'Pierre Gimonnet': '/photos/wines/gimonnet.png',
  Trimbach: '/photos/wines/trimbach.png',
  'Pio Cesare': '/photos/wines/pio-cesare.png',
  'E. Guigal': '/photos/wines/guigal.png',
};

// Halo chaud TRÈS doux derrière la bouteille (sur écran crème).
const WINE_TINT: Record<DemoCard['color'], string> = {
  ROUGE: 'rgba(150,40,40,0.10)',
  BLANC: 'rgba(184,146,74,0.12)',
  EFFERVESCENT: 'rgba(184,146,74,0.14)',
};

function BottleSilhouette({ color }: { color: DemoCard['color'] }) {
  const fill = color === 'ROUGE' ? 'var(--color-wine-rouge)' : 'var(--color-wine-blanc)';
  return (
    <svg viewBox="0 0 60 200" className="h-full w-auto" aria-hidden role="img">
      <path
        d="M25 8h10v40c0 6 8 10 8 26v110a8 8 0 0 1-8 8H25a8 8 0 0 1-8-8V74c0-16 8-20 8-26V8z"
        fill={fill}
        opacity="0.85"
      />
      <rect x="24" y="4" width="12" height="8" rx="2" fill={fill} opacity="0.6" />
    </svg>
  );
}

export default function DemoPhone({
  card,
  locale,
  caption,
}: {
  card: DemoCard;
  locale: Locale;
  caption?: string;
}) {
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const [imgError, setImgError] = useState(false);
  const isCave = card.source === 'cave';
  const photo = WINE_PHOTOS[card.producer];

  // Fenêtre de dégustation (années, comme l'app) : marqueur à l'apogée.
  const span = Math.max(1, card.windowTo - card.windowFrom);
  const stage = Math.min(0.92, Math.max(0.08, (card.windowPeak - card.windowFrom) / span));

  return (
    <div className="mx-auto w-full max-w-[350px]">
      <p className="mb-4 text-center font-mono text-[11px] tracking-[0.26em] uppercase text-foreground-faint">
        {caption ?? (isCave ? t('Votre cave', 'Your cellar') : t('À la SAQ', 'At the SAQ'))}
      </p>

      {/* Cadre iPhone (bezel sombre) — profondeur */}
      <div className="relative rounded-[3rem] border border-black/30 bg-[#0b0b0d] p-3 shadow-[0_50px_120px_-35px_rgba(40,28,16,0.55)] ring-1 ring-white/5">
        <div className="absolute left-1/2 top-4 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" aria-hidden />

        {/* ÉCRAN CLAIR (crème/or — identité iQWine) */}
        <div className="relative overflow-hidden rounded-[2.4rem] bg-elev">
          {/* Barre de navigation app */}
          <div className="flex items-center justify-between px-4 pt-9 pb-2.5 border-b border-[var(--color-foreground)]/8">
            <ChevronLeft size={18} strokeWidth={2} className="text-foreground-faint" aria-hidden />
            <span className="font-[family-name:var(--font-display)] italic text-or text-[16px]">Octave</span>
            <Heart size={17} strokeWidth={1.75} className="text-or-soft" aria-hidden />
          </div>

          {/* PHOTO dominante */}
          <div
            className="relative mx-auto flex h-60 w-full items-center justify-center"
            style={{ background: `radial-gradient(60% 70% at 50% 42%, ${WINE_TINT[card.color]}, transparent 76%)` }}
          >
            {photo && !imgError ? (
              <Image
                src={photo}
                alt={`${card.cuvee} — ${card.producer}`}
                width={160}
                height={234}
                onError={() => setImgError(true)}
                className="h-[234px] w-auto object-contain drop-shadow-[0_16px_26px_rgba(60,40,20,0.28)]"
              />
            ) : (
              <BottleSilhouette color={card.color} />
            )}
          </div>

          {/* Contenu */}
          <div className="px-4 pb-3">
            {/* Rangée de chips : source + palais (cave) */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] uppercase ${
                  isCave ? 'bg-or/15 text-or' : 'bg-sunk text-foreground-dim'
                }`}
              >
                {isCave ? <Wine size={11} strokeWidth={2} /> : <MapPin size={11} strokeWidth={2} />}
                {isCave ? t('Ma cave', 'My cellar') : 'SAQ'}
              </span>
              {isCave && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-or/15 px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] uppercase text-or">
                  <Heart size={11} strokeWidth={2} />
                  {t('Pour votre palais', 'For your palate')}
                </span>
              )}
            </div>

            {/* Identité */}
            <h4 className="mt-2.5 font-[family-name:var(--font-display)] text-foreground text-xl leading-tight">
              {card.cuvee}
              {card.vintage ? <span className="text-or tabular-nums"> {card.vintage}</span> : null}
            </h4>
            <p className="text-foreground-dim text-[13px] mt-0.5">
              {card.producer} · {card.region}
            </p>

            {/* Badge apogée / prix + dispo */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {isCave && card.atPeak && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-or/40 bg-or/12 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] uppercase text-or">
                  <Sparkles size={12} strokeWidth={2} />
                  {t('À son meilleur', 'At its peak')}
                </span>
              )}
              {!isCave && (
                <>
                  <span className="font-medium text-foreground text-[17px] tabular-nums">
                    {typeof card.priceCad === 'number' ? `${card.priceCad.toFixed(2)} $` : ''}
                  </span>
                  {card.available && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-signal)]/45 bg-[var(--color-signal)]/12 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-signal)]">
                      <MapPin size={12} strokeWidth={2} />
                      {t('Disponible', 'In stock')}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Encadré « Octave recommande » */}
            <div className="mt-3 rounded-2xl bg-sunk border border-or/15 px-3.5 py-3">
              <p className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-or mb-1.5">
                <Sparkles size={11} strokeWidth={2} />
                {t('Octave recommande', 'Octave recommends')}
              </p>
              <p className="font-[family-name:var(--font-display)] text-foreground text-[14px] leading-relaxed line-clamp-3">
                {card.why[locale]}
              </p>
            </div>

            {/* Carte fenêtre de dégustation */}
            <div className="mt-2.5 rounded-2xl border border-[var(--color-foreground)]/8 px-3.5 py-3">
              <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-foreground-faint mb-2">
                {t('Fenêtre de dégustation', 'Drinking window')}
              </p>
              <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.1em] uppercase text-foreground-faint tabular-nums">
                <span>{card.windowFrom}</span>
                <span className="text-or font-medium">
                  {t('Apogée', 'Peak')} {card.windowPeak}
                </span>
                <span>{card.windowTo}</span>
              </div>
              <div className="relative mt-1.5 h-1.5 rounded-full bg-[var(--color-foreground)]/10">
                <span
                  className="absolute inset-y-0 left-0 right-0 rounded-full bg-gradient-to-r from-transparent via-or/55 to-transparent"
                  aria-hidden
                />
                <span
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-or ring-2 ring-elev"
                  style={{ left: `${stage * 100}%` }}
                  aria-hidden
                />
              </div>
            </div>
          </div>

          {/* Barre d'onglets iOS */}
          <div className="flex items-center justify-around border-t border-[var(--color-foreground)]/8 px-2 pt-2.5 pb-4">
            {[
              { icon: Sparkles, label: t('Sommelier', 'Sommelier'), on: true },
              { icon: Wine, label: t('Cave', 'Cellar'), on: false },
              { icon: Search, label: t('Cherche', 'Search'), on: false },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <span
                  key={tab.label}
                  className={`flex flex-col items-center gap-1 ${tab.on ? 'text-or' : 'text-foreground-faint'}`}
                >
                  <Icon size={17} strokeWidth={tab.on ? 2 : 1.75} aria-hidden />
                  <span className="font-mono text-[8px] tracking-[0.1em] uppercase">{tab.label}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
