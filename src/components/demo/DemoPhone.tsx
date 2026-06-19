'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Sparkles } from 'lucide-react';
import type { DemoCard } from '@/lib/demoData';
import type { Locale } from '@/lib/i18n';

/**
 * DemoPhone — réplique « capture d'app » dans un cadre iPhone premium. La PHOTO
 * de bouteille domine ; le texte (condensé) supporte. Fenêtre de dégustation en
 * mini-jauge. Photo réelle (next/image) avec repli silhouette si absente.
 */

const WINE_PHOTOS: Record<string, string> = {
  'Castello di Ama': '/photos/wines/castello-ama.jpg',
  Masciarelli: '/photos/wines/masciarelli.jpg',
  'Domaine William Fèvre': '/photos/wines/william-fevre.jpg',
  'Château de la Ragotière': '/photos/wines/ragotiere.jpg',
  'Pierre Gimonnet': '/photos/wines/gimonnet.jpg',
  Trimbach: '/photos/wines/trimbach.jpg',
  'Pio Cesare': '/photos/wines/pio-cesare.jpg',
  'Domaine de la Présidente': '/photos/wines/presidente.jpg',
};

const WINE_TINT: Record<DemoCard['color'], string> = {
  ROUGE: 'rgba(142,42,42,0.22)',
  BLANC: 'rgba(212,169,72,0.16)',
  EFFERVESCENT: 'rgba(212,169,72,0.18)',
};

function BottleSilhouette({ color }: { color: DemoCard['color'] }) {
  const fill =
    color === 'ROUGE' ? 'var(--color-wine-rouge)' : 'var(--color-wine-blanc)';
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

export default function DemoPhone({ card, locale }: { card: DemoCard; locale: Locale }) {
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const [imgError, setImgError] = useState(false);
  const isCave = card.source === 'cave';
  const photo = WINE_PHOTOS[card.producer];

  // Fenêtre de dégustation : position du marqueur 0→1 (Jeune · Apogée · Déclin).
  const stage = card.atPeak ? 0.62 : isCave ? 0.45 : 0.28;

  return (
    <div className="mx-auto w-full max-w-[280px]">
      {/* Étiquette source au-dessus */}
      <p className="mb-3 text-center font-mono text-[10px] tracking-[0.24em] uppercase text-foreground-faint">
        {isCave ? t('Votre cave', 'Your cellar') : t('À la SAQ', 'At the SAQ')}
      </p>

      {/* Cadre iPhone */}
      <div className="relative rounded-[2.6rem] border border-white/10 bg-[#0b0b0d] p-2.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-3.5 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black" aria-hidden />
        {/* Écran */}
        <div className="relative overflow-hidden rounded-[2.1rem] bg-elev">
          {/* Header app */}
          <div className="flex items-center justify-between px-4 pt-7 pb-2">
            <span className="font-[family-name:var(--font-display)] italic text-or text-[15px]">Octave</span>
            <span
              className={`font-mono text-[8px] tracking-[0.16em] uppercase rounded-full px-2 py-0.5 border ${
                isCave ? 'text-or border-or/40 bg-or/10' : 'text-foreground-dim border-border-strong'
              }`}
            >
              {isCave ? t('Ma cave', 'My cellar') : 'SAQ'}
            </span>
          </div>

          {/* PHOTO dominante */}
          <div
            className="relative mx-auto flex h-44 w-full items-center justify-center"
            style={{ background: `radial-gradient(60% 70% at 50% 35%, ${WINE_TINT[card.color]}, transparent 75%)` }}
          >
            {photo && !imgError ? (
              <Image
                src={photo}
                alt={`${card.cuvee} — ${card.producer}`}
                width={120}
                height={176}
                onError={() => setImgError(true)}
                className="h-[176px] w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]"
              />
            ) : (
              <BottleSilhouette color={card.color} />
            )}
          </div>

          {/* Identité */}
          <div className="px-4 pt-3">
            <h4 className="font-[family-name:var(--font-display)] text-foreground text-lg leading-tight">
              {card.cuvee}
              {card.vintage ? <span className="text-or tabular-nums"> {card.vintage}</span> : null}
            </h4>
            <p className="text-foreground-dim text-[12px] mt-0.5">
              {card.producer} · {card.region}
            </p>

            {/* Badge */}
            <div className="mt-2.5">
              {isCave && card.atPeak && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] uppercase text-or">
                  <Sparkles size={11} strokeWidth={2} />
                  {t('À son meilleur', 'At its peak')}
                </span>
              )}
              {!isCave && (
                <span className="inline-flex items-center gap-2.5 font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--color-signal)]">
                  <span className="text-foreground font-medium normal-case text-[13px] tracking-normal">
                    {typeof card.priceCad === 'number' ? `${card.priceCad.toFixed(2)} $` : ''}
                  </span>
                  {card.available && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} strokeWidth={2} />
                      {t('Disponible', 'In stock')}
                    </span>
                  )}
                </span>
              )}
            </div>

            {/* Accord Octave (condensé, 3 lignes max) */}
            <p className="mt-3 font-[family-name:var(--font-display)] text-foreground/85 text-[13px] leading-relaxed line-clamp-3">
              {card.why[locale]}
            </p>

            {/* Fenêtre de dégustation — mini-jauge */}
            <div className="mt-4 mb-5">
              <div className="flex items-center justify-between font-mono text-[8px] tracking-[0.12em] uppercase text-foreground-faint">
                <span>{t('Jeune', 'Young')}</span>
                <span className="text-or">{t('Apogée', 'Peak')}</span>
                <span>{t('Déclin', 'Decline')}</span>
              </div>
              <div className="relative mt-1.5 h-1 rounded-full bg-border-strong">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-border-strong via-or/60 to-border-strong"
                  style={{ width: '100%' }}
                  aria-hidden
                />
                <span
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-or ring-2 ring-elev"
                  style={{ left: `${stage * 100}%` }}
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
