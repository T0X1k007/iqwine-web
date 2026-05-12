'use client';

import { motion } from 'framer-motion';
import { Wine, Calendar } from 'lucide-react';
import BottleSilhouette from '../BottleSilhouette';

/**
 * ApogeeScreen — écran Living Cellar focalisé sur une bouteille en apogée.
 *
 * Émotionnel et vivant : glow respirant lent (3.2s loop), maturity ribbon
 * gradient sémantique cellier-vin (jeune-bleu → plateau-vert → apogée-or →
 * déclin-cuivre → passé-cendre), micro-données vivantes (restantes, dernière
 * ouverte, prochaine fenêtre).
 *
 * Sensation visée : anticipation, rareté, attachement collectionneur.
 */

const VINTAGE = 2016;
const PLATEAU_START = 2026;
const PLATEAU_END = 2032;
const DECLINE = 2034;

// Position du marker "Now" sur la bande maturity (en %).
// Now = entrée de plateau cette semaine → ~32%.
const NOW_POSITION = 32;

export default function ApogeeScreen() {
  return (
    <div className="relative w-full h-full bg-[#0F0A08] text-[#F5EFE6] flex flex-col overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1.5 text-[11px] font-medium tracking-tight">
        <span>20:42</span>
        <div className="flex items-center gap-1 opacity-70">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
            <rect x="0" y="6" width="2" height="4" rx="0.5" />
            <rect x="3.5" y="4" width="2" height="6" rx="0.5" />
            <rect x="7" y="2" width="2" height="8" rx="0.5" />
            <rect x="10.5" y="0" width="2" height="10" rx="0.5" />
          </svg>
          <svg width="22" height="10" viewBox="0 0 22 10">
            <rect x="0.5" y="0.5" width="18" height="9" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.5" />
            <rect x="2" y="2" width="15" height="6" rx="1" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 pt-4 pb-3">
        <p className="font-mono text-[9px] tracking-[0.32em] uppercase text-[#C9A36A] mb-1.5">
          Cellier · Apogée
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[24px] font-semibold tracking-tight leading-none">
          Cette semaine
        </h1>
      </div>

      {/* Hero bouteille — Brunello centré, glow respirant */}
      <div className="relative flex-1 flex flex-col items-center justify-start pt-4 px-6">
        {/* Glow respirant or — animation lente luxe */}
        <motion.div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[180px] h-[280px] -z-0"
          animate={{
            opacity: [0.5, 0.85, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4.2,
            ease: [0.45, 0, 0.55, 1] as [number, number, number, number],
            repeat: Infinity,
          }}
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(201,163,106,0.32), transparent 70%)',
            filter: 'blur(28px)',
          }}
        />

        {/* Bouteille */}
        <div className="relative z-10">
          <BottleSilhouette
            shape="bordeaux"
            wineColor="#5A1F1F"
            width={88}
          />
        </div>

        {/* Producteur */}
        <div className="relative z-10 text-center mt-4 mb-1">
          <p className="text-[14px] font-semibold tracking-tight leading-tight">
            Casanova di Neri
          </p>
          <p className="text-[10.5px] text-[#B8AC9C] mt-1 leading-tight">
            Brunello di Montalcino · Tenuta Nuova
          </p>
          <p className="text-[10px] font-mono text-[#C9A36A] tabular-nums mt-1.5">
            {VINTAGE} · Toscane
          </p>
        </div>
      </div>

      {/* Maturity ribbon — gradient sémantique 5 zones + Now marker pulse */}
      <div className="px-6 pb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-[8.5px] tracking-[0.28em] uppercase text-[#8A7B70]">
            Maturité
          </p>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#C9A36A]"
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.15, 0.9] }}
              transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity }}
            />
            <p className="text-[9.5px] font-mono uppercase tracking-wider text-[#C9A36A]">
              Plateau atteint
            </p>
          </div>
        </div>

        {/* Ribbon */}
        <div className="relative h-3 rounded-full overflow-hidden">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'linear-gradient(90deg, #4A6E8A 0%, #5C8A60 25%, #C9A36A 45%, #C9A36A 65%, #A56A48 85%, #6B5D55 100%)',
            }}
          />
          {/* Now marker — vertical line + glow */}
          <div
            className="absolute top-0 bottom-0"
            style={{ left: `${NOW_POSITION}%` }}
          >
            <motion.div
              className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-[#F5EFE6]"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
            />
            <motion.div
              className="absolute -left-[5px] -top-1 w-3 h-3 rounded-full bg-[#C9A36A]"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(201,163,106,0.5)',
                  '0 0 0 8px rgba(201,163,106,0)',
                  '0 0 0 0 rgba(201,163,106,0)',
                ],
              }}
              transition={{ duration: 1.8, ease: 'easeOut', repeat: Infinity }}
            />
          </div>
        </div>

        {/* Years labels */}
        <div className="flex justify-between mt-2 font-mono text-[8.5px] tabular-nums text-[#6B5D55]">
          <span>{VINTAGE}</span>
          <span className="text-[#C9A36A]">{PLATEAU_START}–{PLATEAU_END}</span>
          <span>{DECLINE}+</span>
        </div>
      </div>

      {/* Micro-données vivantes — hairlines */}
      <div className="px-6 pb-5">
        <div className="border-t border-[rgba(245,239,230,0.06)] pt-4 grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Wine size={10} strokeWidth={1.75} className="text-[#8A7B70]" />
              <p className="font-mono text-[8px] uppercase tracking-wider text-[#8A7B70]">
                Restantes
              </p>
            </div>
            <p className="text-[14px] font-semibold tabular-nums text-[#F5EFE6]">14</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Calendar size={10} strokeWidth={1.75} className="text-[#8A7B70]" />
              <p className="font-mono text-[8px] uppercase tracking-wider text-[#8A7B70]">
                Dernière ouverte
              </p>
            </div>
            <p className="text-[11.5px] tabular-nums text-[#F5EFE6]">déc. 2024</p>
          </div>
        </div>
      </div>

      {/* Home indicator iOS */}
      <div className="flex justify-center pb-2">
        <div className="w-[110px] h-[4px] rounded-full bg-white/30" />
      </div>
    </div>
  );
}
