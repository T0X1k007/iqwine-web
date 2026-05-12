'use client';

import { motion } from 'framer-motion';
import { Camera, Thermometer, Hourglass, Sparkles } from 'lucide-react';
import BottleSilhouette from '../BottleSilhouette';

/**
 * TonightScreen — écran héro émotionnel de l'app iQWine.
 *
 * Démontre Mode Tonight : menu photographié → 3 bouteilles raisonnées.
 * Chaque bouteille : producteur réel, millésime, t° service, temps de carafe,
 * micro-explication sommelier, badge apogée pulse si pertinent.
 *
 * Ce screen reçoit ~70% du polish visuel et motion de Phase B.
 */

interface Bottle {
  shape: 'bordeaux' | 'bourgogne' | 'rhone';
  wineColor: string;
  producer: string;
  cuvee: string;
  vintage: number;
  region: string;
  serviceTemp: string;
  carafe: string;
  reasoning: string;
  apogeePulse?: boolean;
  remaining?: number;
}

const BOTTLES: Bottle[] = [
  {
    shape: 'bordeaux',
    wineColor: '#5A1F1F',
    producer: 'Casanova di Neri',
    cuvee: 'Brunello di Montalcino · Tenuta Nuova',
    vintage: 2016,
    region: 'Toscane',
    serviceTemp: '17–18°C',
    carafe: 'Carafer 60 min',
    reasoning: 'Le tannin tient le romarin.',
    apogeePulse: true,
    remaining: 3,
  },
  {
    shape: 'bourgogne',
    wineColor: '#6B2418',
    producer: 'Giacomo Conterno',
    cuvee: 'Barolo · Cascina Francia',
    vintage: 2018,
    region: 'Piémont',
    serviceTemp: '17–18°C',
    carafe: 'Carafer 90 min',
    reasoning: 'Structure pour l\'agneau, finale longue.',
    remaining: 2,
  },
  {
    shape: 'rhone',
    wineColor: '#561818',
    producer: 'Vieux Télégraphe',
    cuvee: 'Châteauneuf-du-Pape · La Crau',
    vintage: 2019,
    region: 'Vallée du Rhône',
    serviceTemp: '17°C',
    carafe: 'Carafer 45 min',
    reasoning: 'Garrigue — rappelle les herbes de Provence.',
    remaining: 6,
  },
];

export default function TonightScreen() {
  return (
    <div className="relative w-full h-full bg-[#0F0A08] text-[#F5EFE6] flex flex-col overflow-hidden">
      {/* Status bar — heure + signal/wifi/batterie iOS */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1.5 text-[11px] font-medium tracking-tight">
        <span>20:42</span>
        <div className="flex items-center gap-1 opacity-70">
          {/* Signal bars */}
          <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
            <rect x="0" y="6" width="2" height="4" rx="0.5" />
            <rect x="3.5" y="4" width="2" height="6" rx="0.5" />
            <rect x="7" y="2" width="2" height="8" rx="0.5" />
            <rect x="10.5" y="0" width="2" height="10" rx="0.5" />
          </svg>
          {/* Wifi */}
          <svg width="13" height="9" viewBox="0 0 13 9" fill="currentColor">
            <path d="M6.5 9 L 4.7 7.2 A 2.5 2.5 0 0 1 8.3 7.2 Z" />
            <path d="M6.5 6 L 3 2.5 A 5 5 0 0 1 10 2.5 Z M 6.5 6 L 4.7 4.2 A 2.5 2.5 0 0 1 8.3 4.2 Z" fillOpacity="0.6" />
          </svg>
          {/* Batterie */}
          <svg width="22" height="10" viewBox="0 0 22 10">
            <rect x="0.5" y="0.5" width="18" height="9" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.5" />
            <rect x="2" y="2" width="15" height="6" rx="1" fill="currentColor" />
            <rect x="19" y="3.5" width="1.5" height="3" rx="0.5" fill="currentColor" fillOpacity="0.5" />
          </svg>
        </div>
      </div>

      {/* Header — eyebrow + Ce soir + date */}
      <div className="px-6 pt-4 pb-3">
        <p className="font-mono text-[9px] tracking-[0.32em] uppercase text-[#C9A36A] mb-1.5">
          Ce soir · 20:45
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[28px] font-semibold tracking-tight leading-none">
          Trois bouteilles
        </h1>
      </div>

      {/* Menu scanné — pill avec photo icon + intitulé du plat */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1A130F] border border-[rgba(245,239,230,0.06)]">
          <div className="w-9 h-9 rounded-xl bg-[#28201B] flex items-center justify-center shrink-0">
            <Camera size={15} strokeWidth={1.75} className="text-[#C9A36A]" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-[#8A7B70] mb-0.5">
              Menu scanné
            </p>
            <p className="text-[12.5px] font-medium leading-tight text-[#F5EFE6] truncate">
              Carré d'agneau, jus au romarin
            </p>
          </div>
        </div>
      </div>

      {/* 3 bouteilles — scroll vertical */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="space-y-3">
          {BOTTLES.map((b, i) => (
            <BottleCard key={`${b.producer}-${b.vintage}`} bottle={b} index={i} />
          ))}
        </div>
      </div>

      {/* Home indicator iOS */}
      <div className="flex justify-center pb-2">
        <div className="w-[110px] h-[4px] rounded-full bg-white/30" />
      </div>
    </div>
  );
}

function BottleCard({ bottle, index }: { bottle: Bottle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: [0.32, 0.72, 0, 1] }}
      className="relative rounded-2xl bg-gradient-to-b from-[#1F1814] to-[#1A130F] border border-[rgba(245,239,230,0.05)] overflow-hidden"
    >
      {/* Glow apogée — pulse subtil */}
      {bottle.apogeePulse && (
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity }}
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 0% 50%, rgba(201,163,106,0.08), transparent 70%)',
          }}
        />
      )}

      <div className="relative flex p-4 gap-4">
        {/* Bouteille silhouette */}
        <div className="shrink-0 flex items-end pt-2">
          <BottleSilhouette
            shape={bottle.shape}
            wineColor={bottle.wineColor}
            width={42}
          />
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          {/* Header : producteur + millésime */}
          <div className="flex items-baseline justify-between gap-2 mb-0.5">
            <p className="text-[12.5px] font-semibold leading-tight tracking-tight text-[#F5EFE6] truncate">
              {bottle.producer}
            </p>
            <span className="text-[10px] font-mono text-[#C9A36A] tabular-nums shrink-0">
              {bottle.vintage}
            </span>
          </div>

          {/* Cuvée + région */}
          <p className="text-[10px] text-[#B8AC9C] leading-snug mb-2.5 truncate">
            {bottle.cuvee}
          </p>

          {/* Reasoning sommelier — italique éditorial */}
          <p className="font-[family-name:var(--font-display)] italic text-[11.5px] leading-snug text-[#F5EFE6] mb-3">
            « {bottle.reasoning} »
          </p>

          {/* Service info — t° + carafe */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <Thermometer size={10} strokeWidth={2} className="text-[#8A7B70]" />
              <span className="text-[9px] font-mono tabular-nums text-[#B8AC9C]">{bottle.serviceTemp}</span>
            </div>
            <div className="w-px h-2.5 bg-[rgba(245,239,230,0.1)]" />
            <div className="flex items-center gap-1">
              <Hourglass size={10} strokeWidth={2} className="text-[#8A7B70]" />
              <span className="text-[9px] font-mono text-[#B8AC9C]">{bottle.carafe}</span>
            </div>
          </div>

          {/* Apogée badge ou bouteilles restantes */}
          <div className="flex items-center gap-2">
            {bottle.apogeePulse && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[rgba(201,163,106,0.12)] border border-[rgba(201,163,106,0.3)]">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[#C9A36A]"
                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity }}
                />
                <Sparkles size={9} strokeWidth={2} className="text-[#C9A36A]" />
                <span className="text-[8.5px] font-mono uppercase tracking-wider text-[#C9A36A]">
                  Apogée cette semaine
                </span>
              </div>
            )}
            {bottle.remaining !== undefined && (
              <span className="text-[8.5px] font-mono text-[#8A7B70] tabular-nums">
                {bottle.remaining} en cave
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
