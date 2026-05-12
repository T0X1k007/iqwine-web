'use client';

import { motion } from 'framer-motion';
import { Camera, Check } from 'lucide-react';

/**
 * ScannerScreen — Mode Restaurant.
 *
 * Vue caméra (viewfinder) photographiant une carte des vins gastronomique
 * crédible. Overlay : 3 bouteilles présentes sur la carte qui matchent
 * le menu en cours, avec scoring discret.
 *
 * Sensation : sommelier discret à table, qui lit la carte avec vous.
 */

interface ScannedWine {
  producer: string;
  cuvee: string;
  vintage: number;
  match: 'Idéal' | 'Solide' | 'Alternative';
}

const SCANNED: ScannedWine[] = [
  {
    producer: 'Casanova di Neri',
    cuvee: 'Brunello di Montalcino',
    vintage: 2016,
    match: 'Idéal',
  },
  {
    producer: 'Vieux Télégraphe',
    cuvee: 'Châteauneuf-du-Pape',
    vintage: 2019,
    match: 'Solide',
  },
  {
    producer: 'Chave',
    cuvee: 'Hermitage',
    vintage: 2017,
    match: 'Alternative',
  },
];

const MATCH_COLOR = {
  Idéal: '#C9A36A',
  Solide: '#8C6F44',
  Alternative: '#C97B47',
};

export default function ScannerScreen() {
  return (
    <div className="relative w-full h-full bg-[#0F0A08] text-[#F5EFE6] flex flex-col overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1.5 text-[11px] font-medium tracking-tight z-30 relative">
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

      {/* Header eyebrow */}
      <div className="relative z-30 px-6 pt-4 pb-3">
        <p className="font-mono text-[9px] tracking-[0.32em] uppercase text-[#C9A36A] mb-1.5">
          Mode Restaurant
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[22px] font-semibold tracking-tight leading-none">
          Carte lue
        </h1>
      </div>

      {/* Viewfinder — carte des vins simulée + corners overlay */}
      <div className="relative flex-1 mx-4 mb-4 rounded-2xl overflow-hidden">
        {/* Carte des vins crédible — texture papier ivoire */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, #f4ecd9 0%, #ebe0c8 40%, #d8c9a8 100%)',
          }}
        >
          {/* Imitation carte — typo serif italique */}
          <div className="absolute inset-0 p-4 text-[#3a2a1a]">
            <p className="font-[family-name:var(--font-display)] italic text-[10px] text-center mb-2 opacity-60">
              Carte des vins
            </p>
            <div className="space-y-2 text-[8px] leading-tight">
              <div className="flex justify-between gap-2">
                <span className="font-medium">Brunello di Montalcino, Tenuta Nuova</span>
                <span className="font-mono opacity-70">2016</span>
              </div>
              <div className="flex justify-between gap-2 opacity-90">
                <span>Châteauneuf-du-Pape, La Crau</span>
                <span className="font-mono opacity-70">2019</span>
              </div>
              <div className="flex justify-between gap-2 opacity-80">
                <span>Hermitage, Chave</span>
                <span className="font-mono opacity-70">2017</span>
              </div>
              <div className="flex justify-between gap-2 opacity-70">
                <span>Volnay, Lafarge</span>
                <span className="font-mono opacity-60">2018</span>
              </div>
              <div className="flex justify-between gap-2 opacity-60">
                <span>Bandol, Tempier</span>
                <span className="font-mono opacity-50">2017</span>
              </div>
              <div className="flex justify-between gap-2 opacity-50">
                <span>Pomerol, Lafleur</span>
                <span className="font-mono opacity-50">2015</span>
              </div>
            </div>
          </div>

          {/* Vignette assombrissante autour pour focus center */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.4) 100%)',
            }}
          />
        </div>

        {/* Viewfinder corners (4 angles) */}
        {[
          { top: 12, left: 12, br: { rotate: 0 } },
          { top: 12, right: 12, br: { rotate: 90 } },
          { bottom: 12, right: 12, br: { rotate: 180 } },
          { bottom: 12, left: 12, br: { rotate: 270 } },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              transform: `rotate(${pos.br.rotate}deg)`,
            }}
          >
            <div className="w-4 h-4 border-l-2 border-t-2 border-[#C9A36A]" />
          </div>
        ))}

        {/* Suggestions overlay — bottom card glassmorphism */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="absolute bottom-3 left-3 right-3 rounded-xl overflow-hidden"
          style={{
            background: 'rgba(15, 10, 8, 0.88)',
            backdropFilter: 'blur(20px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
            border: '1px solid rgba(245,239,230,0.08)',
          }}
        >
          <div className="px-3.5 py-3 border-b border-[rgba(245,239,230,0.06)]">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[8.5px] tracking-[0.28em] uppercase text-[#C9A36A]">
                Pour votre menu
              </p>
              <div className="flex items-center gap-1">
                <Check size={10} strokeWidth={2.5} className="text-[#C9A36A]" />
                <span className="text-[9px] font-mono tabular-nums text-[#B8AC9C]">3 sur 6</span>
              </div>
            </div>
          </div>

          <div className="px-3.5 py-2.5 space-y-2">
            {SCANNED.map((wine) => (
              <div key={`${wine.producer}-${wine.vintage}`} className="flex items-center gap-2.5">
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: MATCH_COLOR[wine.match] }}
                />
                <div className="flex-1 min-w-0 flex items-baseline justify-between gap-2">
                  <p className="text-[10.5px] font-medium leading-tight truncate">
                    {wine.producer}
                  </p>
                  <span
                    className="text-[8px] font-mono uppercase tracking-wider tabular-nums shrink-0"
                    style={{ color: MATCH_COLOR[wine.match] }}
                  >
                    {wine.match}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom actions iOS — capture button mock */}
      <div className="flex items-center justify-center pb-4 z-30 relative">
        <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center">
          <Camera size={18} strokeWidth={2} className="text-[#0F0A08]" />
        </div>
      </div>

      {/* Home indicator iOS */}
      <div className="flex justify-center pb-2">
        <div className="w-[110px] h-[4px] rounded-full bg-white/30" />
      </div>
    </div>
  );
}
