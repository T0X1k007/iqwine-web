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
    <div className="mx-auto w-full max-w-[350px]">
      {/* Étiquette source au-dessus */}
      <p className="mb-4 text-center font-mono text-[11px] tracking-[0.26em] uppercase text-foreground-faint">
        {isCave ? t('Votre cave', 'Your cellar') : t('À la SAQ', 'At the SAQ')}
      </p>

      {/* Cadre iPhone — profondeur : ombre portée ample + double liseré */}
      <div className="relative rounded-[3rem] border border-white/10 bg-[#0b0b0d] p-3 shadow-[0_50px_120px_-35px_rgba(0,0,0,0.92)] ring-1 ring-white/5">
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-4 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" aria-hidden />
        {/* Écran — léger dégradé vertical pour la profondeur */}
        <div className="relative overflow-hidden rounded-[2.4rem] bg-gradient-to-b from-elev to-[#101013]">
          {/* Header app */}
          <div className="flex items-center justify-between px-5 pt-9 pb-1">
            <span className="font-[family-name:var(--font-display)] italic text-or text-[17px]">Octave</span>
            <span
              className={`font-mono text-[9px] tracking-[0.16em] uppercase rounded-full px-2.5 py-1 border ${
                isCave ? 'text-or border-or/50 bg-or/15' : 'text-foreground-dim border-border-strong bg-sunk'
              }`}
            >
              {isCave ? t('Ma cave', 'My cellar') : 'SAQ'}
            </span>
          </div>

          {/* PHOTO dominante */}
          <div
            className="relative mx-auto flex h-64 w-full items-center justify-center"
            style={{ background: `radial-gradient(62% 72% at 50% 38%, ${WINE_TINT[card.color]}, transparent 76%)` }}
          >
            {photo && !imgError ? (
              <Image
                src={photo}
                alt={`${card.cuvee} — ${card.producer}`}
                width={170}
                height={248}
                onError={() => setImgError(true)}
                className="h-[248px] w-auto object-contain drop-shadow-[0_18px_34px_rgba(0,0,0,0.6)]"
              />
            ) : (
              <BottleSilhouette color={card.color} />
            )}
          </div>

          {/* Identité */}
          <div className="px-5 pt-4">
            <h4 className="font-[family-name:var(--font-display)] text-foreground text-xl leading-tight">
              {card.cuvee}
              {card.vintage ? <span className="text-or tabular-nums"> {card.vintage}</span> : null}
            </h4>
            <p className="text-foreground-dim text-[13px] mt-1">
              {card.producer} · {card.region}
            </p>

            {/* Badges — plus visibles (pastilles) */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {isCave && card.atPeak && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-or/45 bg-or/15 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] uppercase text-or">
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

            {/* Accord Octave (condensé, 3 lignes max) */}
            <p className="mt-3.5 font-[family-name:var(--font-display)] text-foreground/90 text-[14px] leading-relaxed line-clamp-3">
              {card.why[locale]}
            </p>

            {/* Fenêtre de dégustation — mini-jauge */}
            <div className="mt-5 mb-6">
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
