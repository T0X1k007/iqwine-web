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
 * SectionAI — « L'atelier du sommelier IA »
 *
 * Direction V5-bis (Eric 2026-05-20) : l'IA qui DÉGUSTE mentalement
 * la cave, pas un graphique décoratif.
 *
 * Inspiration : Apple Intelligence, visionOS, Leica, Aman.
 *
 * Composition SVG en 4 phases narrées (~7s total, joue UNE fois) :
 *   1. LECTURE — 6 silhouettes de bouteilles glissent du LEFT,
 *      fade-in staggered (~1.5s)
 *   2. CONCENTRATION — une bouteille se met en vedette (halo or),
 *      fiche éditoriale glisse à côté avec millésime/appellation,
 *      mots œnologiques apparaissent autour (~2.5s)
 *   3. ACCORD — un plat surgit à gauche, hairline or se trace vers
 *      la fiche bouteille (~1s)
 *   4. PROPOSITIONS — 3 cartes sobres émergent en bas avec slide-up
 *      (Brunello, Bordeaux, Champagne — vraies bouteilles de la cave
 *      Bigras) (~1.5s)
 *
 * Final stable : panel calme avec 3 cartes visibles + bouteille focus
 * + mots œnologiques. Aucune pulsation, aucune boucle.
 *
 * prefers-reduced-motion : skip animation → état final direct.
 *
 * SVG + CSS + Framer Motion uniquement. Pas de Lottie, pas de canvas.
 */

const STAGE_TIMING_MS = [1500, 2500, 1000, 1500]; // total ~6.5s

// Silhouette bouteille — path simple élégant
function BottleSilhouette({
  x,
  y,
  scale = 1,
  highlighted = false,
  delay = 0,
  visible = false,
}: {
  x: number;
  y: number;
  scale?: number;
  highlighted?: boolean;
  delay?: number;
  visible?: boolean;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, x: x - 30 }}
      animate={visible ? { opacity: 1, x } : { opacity: 0, x: x - 30 }}
      transition={{ duration: 0.8, delay, ease: [0.32, 0.72, 0, 1] }}
    >
      {highlighted && (
        <motion.circle
          cx={0}
          cy={0}
          r={26}
          fill="rgba(212, 165, 72, 0.12)"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      )}
      <g transform={`translate(0 ${y * 0}) scale(${scale})`}>
        <path
          d="M -2.5 -22
             L -2.5 -10
             C -2.5 -10 -7 -8 -7 -2
             L -7 18
             C -7 21 -5 22 0 22
             C 5 22 7 21 7 18
             L 7 -2
             C 7 -8 2.5 -10 2.5 -10
             L 2.5 -22
             Z"
          fill={highlighted ? 'rgba(212, 165, 72, 0.85)' : 'rgba(243, 236, 231, 0.35)'}
          stroke={highlighted ? '#d4a548' : 'rgba(243, 236, 231, 0.55)'}
          strokeWidth="0.6"
        />
        {/* Étiquette schématique */}
        <rect
          x={-4.5}
          y={2}
          width={9}
          height={9}
          fill={highlighted ? 'rgba(22, 18, 16, 0.6)' : 'rgba(22, 18, 16, 0.45)'}
          stroke={highlighted ? 'rgba(212, 165, 72, 0.7)' : 'rgba(243, 236, 231, 0.25)'}
          strokeWidth="0.3"
        />
      </g>
    </motion.g>
  );
}

// Bouteille focus avec mots œnologiques autour
function FocusBottle({ visible }: { visible: boolean }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Halo */}
      <motion.ellipse
        cx={310}
        cy={170}
        rx={70}
        ry={50}
        fill="none"
        stroke="rgba(212, 165, 72, 0.18)"
        strokeWidth="0.5"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ transformOrigin: '310px 170px' }}
      />
    </motion.g>
  );
}

const WORDS: Array<{ label: Record<Locale, string>; x: number; y: number; delay: number }> = [
  { label: { fr: 'apogée 2025', en: 'peak 2025' }, x: 380, y: 130, delay: 0.3 },
  { label: { fr: 'tanins fondus', en: 'soft tannins' }, x: 395, y: 155, delay: 0.6 },
  { label: { fr: 'Sangiovese', en: 'Sangiovese' }, x: 385, y: 180, delay: 0.9 },
  { label: { fr: 'fraîcheur', en: 'freshness' }, x: 400, y: 205, delay: 1.2 },
  { label: { fr: 'long, ample', en: 'long, ample' }, x: 380, y: 230, delay: 1.5 },
];

function FicheVin({ visible, locale }: { visible: boolean; locale: Locale }) {
  return (
    <motion.g
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -10 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Fiche card */}
      <rect
        x={290}
        y={250}
        width={140}
        height={60}
        rx={6}
        fill="rgba(243, 236, 231, 0.04)"
        stroke="rgba(212, 165, 72, 0.35)"
        strokeWidth="0.5"
      />
      <text
        x={300}
        y={269}
        fill="rgba(212, 165, 72, 0.85)"
        fontSize="7"
        fontFamily="var(--font-mono), monospace"
        letterSpacing="1.5"
      >
        {locale === 'fr' ? 'FICHE' : 'PROFILE'}
      </text>
      <text
        x={300}
        y={284}
        fill="#f3ece7"
        fontSize="9"
        fontStyle="italic"
        fontFamily="var(--font-display), serif"
      >
        Brunello di Montalcino
      </text>
      <text
        x={300}
        y={298}
        fill="rgba(243, 236, 231, 0.6)"
        fontSize="8"
        fontFamily="var(--font-body), sans-serif"
      >
        Pian delle Vigne · 2010
      </text>
    </motion.g>
  );
}

function WordTag({
  label,
  x,
  y,
  delay,
  visible,
}: {
  label: string;
  x: number;
  y: number;
  delay: number;
  visible: boolean;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, x: x + 8 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? x : x + 8 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      <line
        x1={325}
        y1={170}
        x2={x - 4}
        y2={y - 2}
        stroke="rgba(212, 165, 72, 0.3)"
        strokeWidth="0.3"
      />
      <text
        fill="rgba(243, 236, 231, 0.85)"
        fontSize="8"
        fontStyle="italic"
        fontFamily="var(--font-display), serif"
      >
        <tspan x={x} y={y}>
          {label}
        </tspan>
      </text>
    </motion.g>
  );
}

function PlatTag({ visible, locale }: { visible: boolean; locale: Locale }) {
  return (
    <motion.g
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -8 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <rect
        x={70}
        y={245}
        width={110}
        height={28}
        rx={4}
        fill="rgba(243, 236, 231, 0.04)"
        stroke="rgba(243, 236, 231, 0.15)"
        strokeWidth="0.5"
      />
      <text
        x={80}
        y={258}
        fill="rgba(243, 236, 231, 0.65)"
        fontSize="6"
        fontFamily="var(--font-mono), monospace"
        letterSpacing="1.2"
      >
        {locale === 'fr' ? 'CE SOIR' : 'TONIGHT'}
      </text>
      <text
        x={80}
        y={269}
        fill="#f3ece7"
        fontSize="9"
        fontStyle="italic"
        fontFamily="var(--font-display), serif"
      >
        {locale === 'fr' ? 'Bœuf bourguignon' : 'Beef bourguignon'}
      </text>
      {/* hairline from plat vers fiche */}
      <motion.line
        x1={180}
        y1={259}
        x2={290}
        y2={279}
        stroke="rgba(212, 165, 72, 0.45)"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: visible ? 1 : 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
      />
    </motion.g>
  );
}

const PROPOSITIONS: Array<{
  name: Record<Locale, string>;
  meta: Record<Locale, string>;
}> = [
  {
    name: { fr: 'Brunello Pian delle Vigne', en: 'Brunello Pian delle Vigne' },
    meta: { fr: '2010 · apogée 2025', en: '2010 · peak 2025' },
  },
  {
    name: { fr: 'Château Cordeillan Bages', en: 'Château Cordeillan Bages' },
    meta: { fr: '2018 · apogée 2025', en: '2018 · peak 2025' },
  },
  {
    name: { fr: 'Champagne Louis Roederer', en: 'Champagne Louis Roederer' },
    meta: { fr: '2011 · apogée 2027', en: '2011 · peak 2027' },
  },
];

function PropositionCards({
  visible,
  locale,
}: {
  visible: boolean;
  locale: Locale;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 14 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {PROPOSITIONS.map((p, i) => {
        const x = 60 + i * 175;
        const isCenter = i === 1;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{
              duration: 0.7,
              delay: 0.15 + i * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <rect
              x={x}
              y={340}
              width={150}
              height={50}
              rx={6}
              fill={isCenter ? 'rgba(212, 165, 72, 0.08)' : 'rgba(243, 236, 231, 0.04)'}
              stroke={
                isCenter
                  ? 'rgba(212, 165, 72, 0.5)'
                  : 'rgba(243, 236, 231, 0.15)'
              }
              strokeWidth="0.5"
            />
            {/* mini bottle inside card */}
            <g transform={`translate(${x + 14} 365)`}>
              <path
                d="M -1.5 -10 L -1.5 -5 C -1.5 -5 -4 -4 -4 -1 L -4 7 C -4 9 -3 9 0 9 C 3 9 4 9 4 7 L 4 -1 C 4 -4 1.5 -5 1.5 -5 L 1.5 -10 Z"
                fill={isCenter ? '#d4a548' : 'rgba(243, 236, 231, 0.55)'}
                stroke={isCenter ? '#d4a548' : 'rgba(243, 236, 231, 0.4)'}
                strokeWidth="0.3"
              />
            </g>
            <text
              x={x + 28}
              y={358}
              fill="#f3ece7"
              fontSize="7"
              fontStyle="italic"
              fontFamily="var(--font-display), serif"
            >
              {p.name[locale].slice(0, 26)}
            </text>
            <text
              x={x + 28}
              y={372}
              fill={isCenter ? 'rgba(212, 165, 72, 0.85)' : 'rgba(243, 236, 231, 0.55)'}
              fontSize="6.5"
              fontFamily="var(--font-mono), monospace"
              letterSpacing="0.8"
            >
              {p.meta[locale].toUpperCase()}
            </text>
          </motion.g>
        );
      })}
    </motion.g>
  );
}

const STAGE_LABELS: Record<Locale, string[]> = {
  fr: [
    'LECTURE DE LA CAVE',
    'CONCENTRATION SUR UNE BOUTEILLE',
    'ACCORDS POSSIBLES',
    'TROIS BOUTEILLES RETENUES',
  ],
  en: [
    'READING THE CELLAR',
    'FOCUS ON A BOTTLE',
    'POSSIBLE PAIRINGS',
    'THREE BOTTLES SELECTED',
  ],
};

// 6 bouteilles initiales — la 3e (index 2) sera la focus
const BOTTLES = [
  { x: 80, y: 170, scale: 1.5, delay: 0 },
  { x: 145, y: 170, scale: 1.5, delay: 0.12 },
  { x: 215, y: 170, scale: 1.8, delay: 0.24 }, // focus future
  { x: 285, y: 170, scale: 1.5, delay: 0.36 },
  { x: 350, y: 170, scale: 1.5, delay: 0.48 },
  { x: 415, y: 170, scale: 1.5, delay: 0.6 },
];

export default function SectionAI() {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' });
  const reduced = useReducedMotion();

  const [stage, setStage] = useState(reduced ? 3 : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    let i = 0;
    let timer = window.setTimeout(function advance() {
      i += 1;
      if (i <= 3) setStage(i);
      if (i < 3) {
        timer = window.setTimeout(advance, STAGE_TIMING_MS[i] ?? 1500);
      }
    }, STAGE_TIMING_MS[0]);
    return () => window.clearTimeout(timer);
  }, [inView, reduced]);

  // Stages activation
  const bottleVisible = stage >= 0; // dès l'entrée
  const focusVisible = stage >= 1;
  const ficheVisible = stage >= 1;
  const wordsVisible = stage >= 1;
  const platVisible = stage >= 2;
  const propVisible = stage >= 3;

  // Once stage 3 → 3 propositions remplacent les 6 silhouettes
  const showSilhouettes = stage < 3;

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
                ? 'Une lecture silencieuse de vos bouteilles, de vos plats, de votre palais. Trois propositions, chaque soir.'
                : 'A silent reading of your bottles, your dishes, your palate. Three suggestions, every evening.'}
            </p>
          </FadeInOnScroll>
        </div>

        {/* RIGHT — Atelier sommelier IA */}
        <div className="lg:col-span-7" ref={ref}>
          <FadeInOnScroll delay={0.2}>
            <div className="relative w-full overflow-hidden rounded-2xl border border-or/15 bg-card">
              {/* Glow background */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212, 165, 72, 0.08), transparent 70%)',
                }}
              />
              <svg
                viewBox="0 0 500 410"
                width="100%"
                role="img"
                aria-label={
                  locale === 'fr'
                    ? 'Animation : un sommelier IA déguste mentalement la cave et propose trois bouteilles.'
                    : 'Animation: an AI sommelier mentally tastes the cellar and suggests three bottles.'
                }
                className="relative block"
              >
                {/* Stage label top */}
                <foreignObject x={20} y={14} width={460} height={20}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={stage}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.4 }}
                      className="font-mono text-[10px] tracking-[0.32em] uppercase text-or tabular-nums"
                    >
                      {STAGE_LABELS[locale][stage]}
                    </motion.div>
                  </AnimatePresence>
                </foreignObject>

                {/* hairline horizontale séparateur top */}
                <line
                  x1={20}
                  y1={50}
                  x2={480}
                  y2={50}
                  stroke="rgba(212, 165, 72, 0.15)"
                  strokeWidth="0.5"
                />

                {/* Phase 1 — 6 silhouettes bouteilles */}
                {showSilhouettes &&
                  BOTTLES.map((b, i) => (
                    <BottleSilhouette
                      key={i}
                      x={b.x}
                      y={b.y}
                      scale={b.scale}
                      highlighted={stage >= 1 && i === 2}
                      delay={b.delay}
                      visible={bottleVisible}
                    />
                  ))}

                {/* Phase 2 — focus halo + fiche + mots */}
                <FocusBottle visible={focusVisible} />
                <FicheVin visible={ficheVisible} locale={locale} />
                {wordsVisible &&
                  WORDS.map((w, i) => (
                    <WordTag
                      key={i}
                      label={w.label[locale]}
                      x={w.x}
                      y={w.y}
                      delay={w.delay}
                      visible={wordsVisible}
                    />
                  ))}

                {/* Phase 3 — plat + accord hairline */}
                <PlatTag visible={platVisible} locale={locale} />

                {/* Phase 4 — 3 cartes propositions (en bas) */}
                <PropositionCards visible={propVisible} locale={locale} />

                {/* hairline horizontale séparateur bottom */}
                {propVisible && (
                  <motion.line
                    x1={20}
                    y1={325}
                    x2={480}
                    y2={325}
                    stroke="rgba(212, 165, 72, 0.15)"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                )}
              </svg>
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </SectionWrapper>
  );
}
