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
 * SectionAI — « L'atelier du sommelier IA » V5-ter
 *
 * Direction Eric V5-ter (2026-05-20) :
 *   - Timing court ~4.5s total (utilisateur moderne scroll vite)
 *   - Intelligence VISIBLE : on doit voir l'IA RÉFLÉCHIR, pas
 *     juste sélectionner. Per-bottle analysis tags (✓/✗), 3 rejetées
 *     s'estompent, 3 retenues convergent.
 *   - Micro-floating ultra subtil sur cartes finales (drift Y ±2px,
 *     6s ease) — vivant sans pulsation.
 *   - 70/30 luxe/AI : palette Cormorant + or + espresso conservée.
 *
 * 4 stages narrés (~4.5s total, joue UNE fois useInView once:true) :
 *
 *   0 (0.6s) — LECTURE : 6 silhouettes entrent staggered
 *   1 (1.6s) — ANALYSE : tags par bouteille (3 rejet, 3 keep) — l'IA pense
 *   2 (0.8s) — CONCENTRATION : 3 retenues convergent, fiche Brunello +
 *              plat + accord hairline + checkmark
 *   3 (final) — TROIS BOUTEILLES : 3 cartes propositions + drift subtil
 *
 * prefers-reduced-motion → état final direct.
 *
 * SVG + Framer Motion uniquement. Pas de Lottie, pas de canvas.
 */

const STAGE_TIMING_MS = [600, 1600, 800]; // total 3s + transitions ~= 4.5s

// 6 bouteilles avec leur état pré-déterminé (l'IA "décide")
// Index 0, 1, 3 = rejetées | Index 2, 4, 5 = retenues (2 = focus Brunello)
type BottleVerdict = 'reject' | 'keep' | 'focus';

const BOTTLES: Array<{
  x: number;
  y: number;
  scale: number;
  delay: number;
  verdict: BottleVerdict;
  tag: Record<Locale, string>;
}> = [
  {
    x: 65,
    y: 175,
    scale: 1.6,
    delay: 0,
    verdict: 'reject',
    tag: { fr: 'trop jeune', en: 'too young' },
  },
  {
    x: 135,
    y: 175,
    scale: 1.6,
    delay: 0.06,
    verdict: 'reject',
    tag: { fr: 'pas ouverte', en: 'not yet open' },
  },
  {
    x: 215,
    y: 175,
    scale: 2.0,
    delay: 0.12,
    verdict: 'focus',
    tag: { fr: 'apogée maintenant', en: 'peak now' },
  },
  {
    x: 295,
    y: 175,
    scale: 1.6,
    delay: 0.18,
    verdict: 'reject',
    tag: { fr: 'tanins fermes', en: 'tight tannins' },
  },
  {
    x: 365,
    y: 175,
    scale: 1.6,
    delay: 0.24,
    verdict: 'keep',
    tag: { fr: 'accord parfait', en: 'ideal pairing' },
  },
  {
    x: 435,
    y: 175,
    scale: 1.6,
    delay: 0.3,
    verdict: 'keep',
    tag: { fr: 'fraîcheur idéale', en: 'right freshness' },
  },
];

// Silhouette bouteille avec verdict state
function BottleSilhouette({
  x,
  y,
  scale,
  visible,
  verdict,
  stage,
  delay,
}: {
  x: number;
  y: number;
  scale: number;
  visible: boolean;
  verdict: BottleVerdict;
  stage: number;
  delay: number;
}) {
  // Stage 0-1 : neutre. Stage 1+ : verdict appliqué (fadé si reject, or si focus/keep)
  const verdictApplied = stage >= 1;
  const isRejected = verdictApplied && verdict === 'reject';
  const isKept = verdictApplied && verdict === 'keep';
  const isFocus = verdictApplied && verdict === 'focus';

  // À stage 3 : 5 silhouettes non-focus partent, focus reste
  const stage3Hide = stage >= 3 && !isFocus;

  const targetOpacity = !visible
    ? 0
    : stage3Hide
      ? 0
      : isRejected
        ? 0.18
        : 1;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: targetOpacity }}
      transition={{ duration: 0.6, delay: visible ? delay : 0, ease: 'easeOut' }}
      transform={`translate(${x} ${y}) scale(${scale})`}
    >
      {isFocus && (
        <motion.circle
          cx={0}
          cy={0}
          r={32}
          fill="rgba(212, 165, 72, 0.14)"
          stroke="rgba(212, 165, 72, 0.3)"
          strokeWidth="0.4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      )}
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
        fill={isFocus ? '#b8862a' : isKept ? 'rgba(212, 165, 72, 0.7)' : 'rgba(243, 236, 231, 0.5)'}
        stroke={
          isFocus
            ? '#d4a548'
            : isKept
              ? 'rgba(212, 165, 72, 0.9)'
              : 'rgba(243, 236, 231, 0.8)'
        }
        strokeWidth="0.9"
      />
      <rect
        x={-4.5}
        y={2}
        width={9}
        height={10}
        fill={
          isFocus
            ? 'rgba(243, 236, 231, 0.92)'
            : isKept
              ? 'rgba(243, 236, 231, 0.85)'
              : 'rgba(22, 18, 16, 0.6)'
        }
        stroke={
          isFocus
            ? 'rgba(212, 165, 72, 0.9)'
            : isKept
              ? 'rgba(212, 165, 72, 0.7)'
              : 'rgba(243, 236, 231, 0.4)'
        }
        strokeWidth="0.4"
      />
      {(isFocus || isKept) && (
        <>
          <line x1={-3} y1={5} x2={3} y2={5} stroke="#161210" strokeWidth="0.4" />
          <line x1={-3} y1={7.5} x2={2} y2={7.5} stroke="#161210" strokeWidth="0.3" />
        </>
      )}
    </motion.g>
  );
}

// Tag per-bottle qui flash au-dessus pendant l'analyse
function AnalysisTag({
  x,
  y,
  label,
  verdict,
  delay,
  visible,
}: {
  x: number;
  y: number;
  label: string;
  verdict: BottleVerdict;
  delay: number;
  visible: boolean;
}) {
  const isPositive = verdict === 'keep' || verdict === 'focus';
  return (
    <motion.g
      initial={{ opacity: 0, y: y + 8 }}
      animate={visible ? { opacity: 1, y } : { opacity: 0, y: y + 8 }}
      transition={{
        duration: 0.5,
        delay: visible ? delay : 0,
        ease: 'easeOut',
      }}
    >
      {/* Bullet ✓ ou × */}
      <circle
        cx={x - 2}
        cy={y - 2.5}
        r="3"
        fill={isPositive ? '#d4a548' : 'rgba(243, 236, 231, 0.18)'}
      />
      {isPositive ? (
        <path
          d={`M ${x - 3.2} ${y - 2.5} L ${x - 2.4} ${y - 1.7} L ${x - 0.8} ${y - 3.7}`}
          stroke="#161210"
          strokeWidth="0.7"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <>
          <line
            x1={x - 3.2}
            y1={y - 3.8}
            x2={x - 0.8}
            y2={y - 1.2}
            stroke="rgba(243, 236, 231, 0.55)"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
          <line
            x1={x - 3.2}
            y1={y - 1.2}
            x2={x - 0.8}
            y2={y - 3.8}
            stroke="rgba(243, 236, 231, 0.55)"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        </>
      )}
      <text
        x={x + 4}
        y={y}
        fill={isPositive ? '#f3ece7' : 'rgba(243, 236, 231, 0.55)'}
        fontSize="9"
        fontStyle="italic"
        fontFamily="var(--font-display), serif"
      >
        {label}
      </text>
    </motion.g>
  );
}

function FicheVin({ visible, locale }: { visible: boolean; locale: Locale }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <rect
        x={285}
        y={240}
        width={195}
        height={70}
        rx={6}
        fill="rgba(243, 236, 231, 0.06)"
        stroke="rgba(212, 165, 72, 0.5)"
        strokeWidth="0.8"
      />
      <text
        x={297}
        y={261}
        fill="#d4a548"
        fontSize="10"
        fontFamily="var(--font-mono), monospace"
        letterSpacing="2"
        fontWeight="600"
      >
        {locale === 'fr' ? 'FICHE' : 'PROFILE'}
      </text>
      <text
        x={297}
        y={282}
        fill="#f3ece7"
        fontSize="13"
        fontStyle="italic"
        fontFamily="var(--font-display), serif"
      >
        Brunello di Montalcino
      </text>
      <text
        x={297}
        y={300}
        fill="rgba(243, 236, 231, 0.75)"
        fontSize="11"
        fontFamily="var(--font-body), sans-serif"
      >
        Pian delle Vigne · 2010
      </text>
    </motion.g>
  );
}

function PlatTag({ visible, locale }: { visible: boolean; locale: Locale }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <rect
        x={50}
        y={240}
        width={155}
        height={38}
        rx={6}
        fill="rgba(243, 236, 231, 0.06)"
        stroke="rgba(243, 236, 231, 0.25)"
        strokeWidth="0.8"
      />
      <text
        x={62}
        y={258}
        fill="rgba(243, 236, 231, 0.7)"
        fontSize="9"
        fontFamily="var(--font-mono), monospace"
        letterSpacing="2"
        fontWeight="600"
      >
        {locale === 'fr' ? 'CE SOIR' : 'TONIGHT'}
      </text>
      <text
        x={62}
        y={273}
        fill="#f3ece7"
        fontSize="12"
        fontStyle="italic"
        fontFamily="var(--font-display), serif"
      >
        {locale === 'fr' ? 'Bœuf bourguignon' : 'Beef bourguignon'}
      </text>
      <motion.line
        x1={205}
        y1={262}
        x2={285}
        y2={272}
        stroke="rgba(212, 165, 72, 0.55)"
        strokeWidth="0.7"
        strokeDasharray="2 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: visible ? 1 : 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.9 }}
        transform="translate(245 263)"
      >
        <circle r="3" fill="#d4a548" />
        <path
          d="M -1.3 0 L -0.3 1 L 1.3 -0.8"
          stroke="#161210"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>
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
  reduced,
}: {
  visible: boolean;
  locale: Locale;
  reduced: boolean;
}) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {PROPOSITIONS.map((p, i) => {
        const x = 30 + i * 155;
        const isCenter = i === 1;
        // Micro-float ultra subtil — drift Y ±2px sur 6s, déphasé par card
        const floatAnim =
          !reduced && visible
            ? {
                y: [0, -2, 0, 2, 0],
              }
            : { y: 0 };
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1, ...floatAnim } : { opacity: 0 }}
            transition={{
              opacity: {
                duration: 0.5,
                delay: 0.1 + i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              },
              y: {
                duration: 6 + i * 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              },
            }}
          >
            <rect
              x={x}
              y={335}
              width={150}
              height={60}
              rx={6}
              fill={isCenter ? 'rgba(212, 165, 72, 0.12)' : 'rgba(243, 236, 231, 0.05)'}
              stroke={
                isCenter
                  ? 'rgba(212, 165, 72, 0.7)'
                  : 'rgba(243, 236, 231, 0.25)'
              }
              strokeWidth="1"
            />
            <g transform={`translate(${x + 18} 365)`}>
              <path
                d="M -1.8 -13 L -1.8 -6 C -1.8 -6 -5 -5 -5 -1 L -5 10 C -5 12 -4 13 0 13 C 4 13 5 12 5 10 L 5 -1 C 5 -5 1.8 -6 1.8 -6 L 1.8 -13 Z"
                fill={isCenter ? '#d4a548' : 'rgba(243, 236, 231, 0.6)'}
                stroke={isCenter ? '#b8862a' : 'rgba(243, 236, 231, 0.5)'}
                strokeWidth="0.6"
              />
              <rect
                x={-2.8}
                y={-1}
                width={5.6}
                height={6.5}
                fill={isCenter ? 'rgba(243, 236, 231, 0.92)' : 'rgba(22, 18, 16, 0.7)'}
                stroke={isCenter ? '#b8862a' : 'rgba(243, 236, 231, 0.3)'}
                strokeWidth="0.3"
              />
            </g>
            <text
              x={x + 34}
              y={358}
              fill="#f3ece7"
              fontSize="9"
              fontStyle="italic"
              fontFamily="var(--font-display), serif"
            >
              {p.name[locale].slice(0, 22)}
            </text>
            <text
              x={x + 34}
              y={376}
              fill={isCenter ? '#d4a548' : 'rgba(243, 236, 231, 0.7)'}
              fontSize="8"
              fontFamily="var(--font-mono), monospace"
              letterSpacing="1.5"
              fontWeight="500"
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
    'ANALYSE EN COURS',
    'CONVERGENCE',
    'TROIS BOUTEILLES RETENUES',
  ],
  en: ['READING THE CELLAR', 'ANALYZING', 'CONVERGING', 'THREE BOTTLES SELECTED'],
};

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
        timer = window.setTimeout(advance, STAGE_TIMING_MS[i] ?? 800);
      }
    }, STAGE_TIMING_MS[0]);
    return () => window.clearTimeout(timer);
  }, [inView, reduced]);

  const bottleVisible = stage >= 0;
  const tagsVisible = stage === 1; // tags flash ONLY during stage 1
  const ficheVisible = stage >= 2;
  const platVisible = stage >= 2;
  const propVisible = stage >= 3;

  return (
    <SectionWrapper id="ai" withDivider rhythm="standard">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 max-w-6xl mx-auto items-center">
        <div className="lg:col-span-5">
          <FadeInOnScroll>
            <div className="iq-eyebrow mb-5">
              {locale === 'fr' ? 'L\'intelligence' : 'The intelligence'}
            </div>
            <h2 className="iq-h1 italic mb-5">
              {locale === 'fr'
                ? 'L\'IA privée de votre cave.'
                : 'The private AI of your cellar.'}
            </h2>
            <p className="iq-lead">
              {locale === 'fr'
                ? 'Lecture des bouteilles, écoute du palais, calibration de l\'accord. Trois propositions, en silence.'
                : 'Reading the bottles, listening to the palate, calibrating the pairing. Three suggestions, in silence.'}
            </p>
          </FadeInOnScroll>
        </div>

        <div className="lg:col-span-7" ref={ref}>
          <FadeInOnScroll delay={0.15}>
            <div className="relative w-full overflow-hidden rounded-2xl border border-or/15 bg-card">
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
                className="relative block min-h-[380px] sm:min-h-[440px]"
              >
                <foreignObject x={20} y={14} width={460} height={20}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={stage}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.35 }}
                      className="font-mono text-[10px] tracking-[0.32em] uppercase text-or tabular-nums"
                    >
                      {STAGE_LABELS[locale][stage]}
                    </motion.div>
                  </AnimatePresence>
                </foreignObject>

                <line
                  x1={20}
                  y1={50}
                  x2={480}
                  y2={50}
                  stroke="rgba(212, 165, 72, 0.15)"
                  strokeWidth="0.5"
                />

                {/* 6 silhouettes */}
                {BOTTLES.map((b, i) => (
                  <BottleSilhouette
                    key={i}
                    x={b.x}
                    y={b.y}
                    scale={b.scale}
                    visible={bottleVisible}
                    verdict={b.verdict}
                    stage={stage}
                    delay={b.delay}
                  />
                ))}

                {/* Tags d'analyse flash pendant stage 1 */}
                {BOTTLES.map((b, i) => (
                  <AnalysisTag
                    key={`tag-${i}`}
                    x={b.x - 4}
                    y={b.y - 38}
                    label={b.tag[locale]}
                    verdict={b.verdict}
                    delay={0.04 * i}
                    visible={tagsVisible}
                  />
                ))}

                {/* Stage 2+ : fiche + plat */}
                <FicheVin visible={ficheVisible} locale={locale} />
                <PlatTag visible={platVisible} locale={locale} />

                {/* Stage 3 : 3 cartes propositions avec micro-float */}
                <PropositionCards visible={propVisible} locale={locale} reduced={!!reduced} />

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
                    transition={{ duration: 0.6 }}
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
