'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

/**
 * SectionAI — « L'IA privée de votre cave »
 *
 * Animation éditoriale Apple/Aman, JAMAIS cyberpunk :
 *   - 16 dots (bouteilles) en constellation organique
 *   - Hairlines or qui se tracent (stroke-dashoffset) entre dots
 *   - Texte mono synchronisé (4 stages, ~6.5s total)
 *   - Final : 3 dots illuminés or (propositions), autres atténués
 *
 * Joue UNE seule fois (useInView once:true). Aucune pulsation
 * permanente. prefers-reduced-motion : skip → état final direct.
 *
 * Pas de capture app fake. Animation conçue, illustrant l'IA au
 * travail sans prétendre être une vraie capture.
 */

// 16 dots = bouteilles, layout déterministe (pas de Math.random)
const DOTS: Array<{ x: number; y: number }> = [
  { x: 80, y: 90 },
  { x: 165, y: 70 },
  { x: 245, y: 115 },
  { x: 320, y: 85 },
  { x: 400, y: 120 },
  { x: 475, y: 95 },
  { x: 530, y: 165 },
  { x: 75, y: 185 },
  { x: 155, y: 235 },
  { x: 240, y: 205 },
  { x: 320, y: 265 },
  { x: 400, y: 225 },
  { x: 480, y: 280 },
  { x: 115, y: 305 },
  { x: 205, y: 335 },
  { x: 355, y: 345 },
];

// Les 3 "propositions" finales — choisies pour former un triangle visuel équilibré
const SELECTED = new Set([4, 9, 14]);

// Hairlines tracées progressivement
const LINES_S1: Array<[number, number]> = [
  [0, 7],
  [1, 8],
  [2, 9],
  [3, 10],
  [5, 12],
];
const LINES_S2: Array<[number, number]> = [
  [4, 9],
  [9, 14],
  [4, 14],
  [6, 12],
  [13, 11],
];

const STAGE_LABELS: Record<Locale, string[]> = {
  fr: [
    'ANALYSE DE LA CAVE',
    '487 BOUTEILLES · 75 APPELLATIONS',
    'FENÊTRES D\'APOGÉE · ACCORDS POSSIBLES',
    '3 PROPOSITIONS POUR CE SOIR',
  ],
  en: [
    'ANALYZING THE CELLAR',
    '487 BOTTLES · 75 APPELLATIONS',
    'DRINKING WINDOWS · PAIRINGS',
    '3 SUGGESTIONS FOR TONIGHT',
  ],
};

const STAGE_TIMING_MS = [1800, 1800, 1500, 1400]; // total ~6.5s

export default function SectionAI() {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' });
  const reduced = useReducedMotion();

  const [stage, setStage] = useState(reduced ? 3 : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    let i = 0;
    const advance = () => {
      i += 1;
      if (i <= 3) setStage(i);
      if (i < 3) {
        timer = window.setTimeout(advance, STAGE_TIMING_MS[i] ?? 1500);
      }
    };
    let timer = window.setTimeout(advance, STAGE_TIMING_MS[0]);
    return () => window.clearTimeout(timer);
  }, [inView, reduced]);

  return (
    <SectionWrapper id="ai" withDivider rhythm="standard">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 max-w-6xl mx-auto items-center">
        {/* LEFT — typo */}
        <div className="lg:col-span-5">
          <FadeInOnScroll>
            <div className="iq-eyebrow mb-6">
              {locale === 'fr' ? 'L\'intelligence' : 'The intelligence'}
            </div>
            <h2 className="iq-h1 italic mb-6">
              {locale === 'fr'
                ? 'L\'IA privée de votre cave.'
                : 'The private AI of your cellar.'}
            </h2>
            <p className="iq-lead">
              {locale === 'fr'
                ? 'Vos bouteilles. Vos accords. Votre palais. Trois propositions, en silence, chaque soir.'
                : 'Your bottles. Your pairings. Your palate. Three suggestions, in silence, every evening.'}
            </p>
          </FadeInOnScroll>
        </div>

        {/* RIGHT — Constellation IA */}
        <div className="lg:col-span-7" ref={ref}>
          <FadeInOnScroll delay={0.2}>
            <div className="relative w-full overflow-hidden rounded-2xl border border-or/15 bg-card">
              {/* Glow center */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212, 165, 72, 0.10), transparent 70%)',
                }}
              />
              <svg
                viewBox="0 0 600 400"
                width="100%"
                role="img"
                aria-label={
                  locale === 'fr'
                    ? 'Animation : votre cave analysée par l\'IA.'
                    : 'Animation: your cellar analyzed by AI.'
                }
                className="relative block"
              >
                {/* Hairlines stage 1 */}
                {LINES_S1.map(([a, b], i) => (
                  <motion.line
                    key={`s1-${i}`}
                    x1={DOTS[a]!.x}
                    y1={DOTS[a]!.y}
                    x2={DOTS[b]!.x}
                    y2={DOTS[b]!.y}
                    stroke="rgba(212, 165, 72, 0.35)"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={
                      stage >= 1
                        ? { pathLength: 1, opacity: stage >= 3 ? 0.25 : 0.7 }
                        : { pathLength: 0, opacity: 0 }
                    }
                    transition={{
                      pathLength: { duration: 1.4, delay: i * 0.12, ease: 'easeOut' },
                      opacity: { duration: 0.8 },
                    }}
                  />
                ))}
                {/* Hairlines stage 2 — focus on selected triangle */}
                {LINES_S2.map(([a, b], i) => (
                  <motion.line
                    key={`s2-${i}`}
                    x1={DOTS[a]!.x}
                    y1={DOTS[a]!.y}
                    x2={DOTS[b]!.x}
                    y2={DOTS[b]!.y}
                    stroke="rgba(212, 165, 72, 0.6)"
                    strokeWidth="0.7"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={
                      stage >= 2
                        ? {
                            pathLength: 1,
                            opacity: SELECTED.has(a) && SELECTED.has(b) && stage >= 3 ? 0.85 : 0.4,
                          }
                        : { pathLength: 0, opacity: 0 }
                    }
                    transition={{
                      pathLength: { duration: 1.2, delay: i * 0.1, ease: 'easeOut' },
                      opacity: { duration: 0.8 },
                    }}
                  />
                ))}
                {/* Dots */}
                {DOTS.map((d, i) => {
                  const isSelected = SELECTED.has(i);
                  const dimmedAfter = stage >= 3 && !isSelected;
                  return (
                    <motion.circle
                      key={`dot-${i}`}
                      cx={d.x}
                      cy={d.y}
                      r={isSelected && stage >= 3 ? 5 : 3}
                      fill={isSelected && stage >= 3 ? '#d4a548' : 'rgba(212, 165, 72, 0.5)'}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: dimmedAfter ? 0.2 : isSelected && stage >= 3 ? 1 : 0.7,
                        scale: 1,
                      }}
                      transition={{
                        delay: i * 0.06,
                        duration: 0.6,
                        ease: 'easeOut',
                      }}
                    />
                  );
                })}
                {/* Halo discret sur les 3 selected en fin */}
                {Array.from(SELECTED).map((idx) => {
                  const d = DOTS[idx]!;
                  return (
                    <motion.circle
                      key={`halo-${idx}`}
                      cx={d.x}
                      cy={d.y}
                      r="12"
                      fill="none"
                      stroke="rgba(212, 165, 72, 0.4)"
                      strokeWidth="0.5"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={
                        stage >= 3
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.6 }
                      }
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  );
                })}
              </svg>

              {/* Stage label mono — AnimatePresence cross-fade */}
              <div className="absolute bottom-5 left-0 right-0 flex justify-center px-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.4 }}
                    className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-or tabular-nums text-center"
                  >
                    {STAGE_LABELS[locale][stage]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </SectionWrapper>
  );
}
