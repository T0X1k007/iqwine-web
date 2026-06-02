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

// Fragments sommelier-intuitifs : ressentis brefs, partiels, pas
// d'algorithme. "L'intelligence invisible" — pensée sommelier en train
// d'évaluer. Eric V5-quater : moins système, plus intuition.
const BOTTLES: Array<{
  x: number;
  y: number;
  scale: number;
  delay: number;
  verdict: BottleVerdict;
  tag: Record<Locale, string>;
  tagOffsetY: number; // décalage Y vertical pour effet manuscrit
  tagOffsetX: number; // décalage X horizontal pour casser l'alignement
  tagRotation: number; // léger angle pour annotation manuscrite
}> = [
  {
    x: 65,
    y: 175,
    scale: 1.6,
    delay: 0,
    verdict: 'reject',
    tag: { fr: 'trop fermé', en: 'too tight' },
    tagOffsetY: -38,
    tagOffsetX: -2,
    tagRotation: -2,
  },
  {
    x: 135,
    y: 175,
    scale: 1.6,
    delay: 0.18,
    verdict: 'reject',
    tag: { fr: 'attendre', en: 'wait' },
    tagOffsetY: -42,
    tagOffsetX: 4,
    tagRotation: 1.5,
  },
  {
    x: 215,
    y: 175,
    scale: 2.0,
    delay: 0.36,
    verdict: 'focus',
    tag: { fr: 'oui, maintenant', en: 'yes, now' },
    tagOffsetY: -44,
    tagOffsetX: -8,
    tagRotation: -1,
  },
  {
    x: 295,
    y: 175,
    scale: 1.6,
    delay: 0.54,
    verdict: 'reject',
    tag: { fr: 'tanins…', en: 'tannins…' },
    tagOffsetY: -38,
    tagOffsetX: 2,
    tagRotation: 2,
  },
  {
    x: 365,
    y: 175,
    scale: 1.6,
    delay: 0.72,
    verdict: 'keep',
    tag: { fr: '2027 ?', en: '2027 ?' },
    tagOffsetY: -42,
    tagOffsetX: 0,
    tagRotation: -1.5,
  },
  {
    x: 435,
    y: 175,
    scale: 1.6,
    delay: 0.9,
    verdict: 'keep',
    tag: { fr: 'fraîcheur', en: 'freshness' },
    tagOffsetY: -40,
    tagOffsetX: -4,
    tagRotation: 1,
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

// Fragment sommelier manuscrit : pensée brève qui émerge puis s'estompe.
// Pas de ✓/×. Juste un mot ou deux, italic Cormorant, légère rotation
// comme une annotation à la main. Apparaît, vit ~0.8s, disparaît.
function AnalysisTag({
  bottleX,
  bottleY,
  offsetX,
  offsetY,
  rotation,
  label,
  verdict,
  delay,
  visible,
}: {
  bottleX: number;
  bottleY: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  label: string;
  verdict: BottleVerdict;
  delay: number;
  visible: boolean;
}) {
  const isPositive = verdict === 'keep' || verdict === 'focus';
  const tagX = bottleX + offsetX;
  const tagY = bottleY + offsetY;
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={
        visible
          ? { opacity: [0, isPositive ? 0.95 : 0.5, isPositive ? 0.95 : 0.4, 0] }
          : { opacity: 0 }
      }
      transition={{
        duration: 1.4,
        delay: visible ? delay : 0,
        ease: 'easeInOut',
        times: [0, 0.2, 0.7, 1],
      }}
      transform={`rotate(${rotation} ${tagX} ${tagY})`}
    >
      <text
        x={tagX}
        y={tagY}
        fill={isPositive ? '#d4a548' : 'rgba(243, 236, 231, 0.65)'}
        fontSize="10"
        fontStyle="italic"
        fontFamily="var(--font-display), serif"
        textAnchor="middle"
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
    'LES BOUTEILLES PARLENT',
    'L\'ACCORD SE DESSINE',
    'TROIS POUR CE SOIR',
  ],
  en: [
    'READING THE CELLAR',
    'THE BOTTLES SPEAK',
    'THE PAIRING TAKES SHAPE',
    'THREE FOR TONIGHT',
  ],
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
              {locale === 'fr' ? 'La lecture' : 'The reading'}
            </div>
            <h2 className="iq-h1 italic mb-5">
              {locale === 'fr'
                ? 'Une intelligence qui répond, en sommelier.'
                : 'An intelligence that answers, like a sommelier.'}
            </h2>
            <p className="iq-lead">
              {locale === 'fr'
                ? 'Vos bouteilles lues, votre palais compris. Demandez — trois propositions, et pourquoi.'
                : 'Your bottles read, your palate understood. Just ask — three picks, and why.'}
            </p>
          </FadeInOnScroll>
        </div>

        <div className="lg:col-span-7" ref={ref}>
          <FadeInOnScroll delay={0.15}>
            <div className="relative w-full overflow-hidden rounded-2xl border border-or/15 bg-card">
              {/* Lumière chaude qui dérive lentement — sensation cave-vit subliminale */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212, 165, 72, 0.10), transparent 70%)',
                }}
                animate={
                  reduced
                    ? undefined
                    : {
                        opacity: [0.85, 1, 0.85],
                        backgroundPosition: ['50% 40%', '52% 38%', '50% 40%'],
                      }
                }
                transition={
                  reduced
                    ? undefined
                    : {
                        duration: 14,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                }
              />
              <svg
                viewBox="0 0 500 410"
                width="100%"
                role="img"
                aria-label={
                  locale === 'fr'
                    ? 'Lecture de la cave qui propose trois bouteilles pour ce soir.'
                    : 'Silent reading of the cellar suggesting three bottles for tonight.'
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

                {/* Poussière subliminale — sensation cave-vit ultra subtile (Eric V5-quater) */}
                {!reduced && (
                  <>
                    <motion.circle
                      cx={120} cy={90} r="0.7" fill="rgba(243, 236, 231, 0.18)"
                      animate={{ cy: [90, 96, 88, 92, 90], opacity: [0.18, 0.32, 0.18] }}
                      transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.circle
                      cx={380} cy={120} r="0.6" fill="rgba(243, 236, 231, 0.14)"
                      animate={{ cy: [120, 114, 122, 118, 120], opacity: [0.14, 0.28, 0.14] }}
                      transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    />
                    <motion.circle
                      cx={250} cy={70} r="0.5" fill="rgba(243, 236, 231, 0.12)"
                      animate={{ cy: [70, 76, 68, 72, 70], opacity: [0.12, 0.22, 0.12] }}
                      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                    />
                    <motion.circle
                      cx={70} cy={250} r="0.6" fill="rgba(243, 236, 231, 0.16)"
                      animate={{ cy: [250, 244, 252, 248, 250], opacity: [0.16, 0.26, 0.16] }}
                      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
                    />
                    <motion.circle
                      cx={440} cy={210} r="0.5" fill="rgba(243, 236, 231, 0.13)"
                      animate={{ cy: [210, 216, 208, 212, 210], opacity: [0.13, 0.23, 0.13] }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
                    />
                  </>
                )}

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

                {/* Fragments sommelier-intuitifs pendant stage 1 — émergent puis s'estompent */}
                {BOTTLES.map((b, i) => (
                  <AnalysisTag
                    key={`tag-${i}`}
                    bottleX={b.x}
                    bottleY={b.y}
                    offsetX={b.tagOffsetX}
                    offsetY={b.tagOffsetY}
                    rotation={b.tagRotation}
                    label={b.tag[locale]}
                    verdict={b.verdict}
                    delay={b.delay * 0.8}
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
