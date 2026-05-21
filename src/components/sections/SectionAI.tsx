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
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8, delay, ease: [0.32, 0.72, 0, 1] }}
      transform={`translate(${x} ${y}) scale(${scale})`}
    >
      {highlighted && (
        <motion.circle
          cx={0}
          cy={0}
          r={32}
          fill="rgba(212, 165, 72, 0.14)"
          stroke="rgba(212, 165, 72, 0.3)"
          strokeWidth="0.4"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ transformOrigin: '0 0', transformBox: 'fill-box' }}
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
        fill={highlighted ? '#b8862a' : 'rgba(243, 236, 231, 0.5)'}
        stroke={highlighted ? '#d4a548' : 'rgba(243, 236, 231, 0.8)'}
        strokeWidth="0.9"
      />
      {/* Étiquette schématique */}
      <rect
        x={-4.5}
        y={2}
        width={9}
        height={10}
        fill={highlighted ? 'rgba(243, 236, 231, 0.92)' : 'rgba(22, 18, 16, 0.6)'}
        stroke={highlighted ? 'rgba(212, 165, 72, 0.9)' : 'rgba(243, 236, 231, 0.4)'}
        strokeWidth="0.4"
      />
      {/* Mini "écriture" sur étiquette si highlighted */}
      {highlighted && (
        <>
          <line x1={-3} y1={5} x2={3} y2={5} stroke="#161210" strokeWidth="0.4" />
          <line x1={-3} y1={7.5} x2={2} y2={7.5} stroke="#161210" strokeWidth="0.3" />
        </>
      )}
    </motion.g>
  );
}

// (FocusBottle retiré — la BottleSilhouette gère son propre halo via prop `highlighted`)

const WORDS: Array<{ label: Record<Locale, string>; x: number; y: number; delay: number }> = [
  { label: { fr: 'apogée 2025', en: 'peak 2025' }, x: 305, y: 115, delay: 0.3 },
  { label: { fr: 'tanins fondus', en: 'soft tannins' }, x: 345, y: 140, delay: 0.6 },
  { label: { fr: 'Sangiovese', en: 'Sangiovese' }, x: 385, y: 165, delay: 0.9 },
  { label: { fr: 'fraîcheur', en: 'freshness' }, x: 365, y: 195, delay: 1.2 },
  { label: { fr: 'long, ample', en: 'long, ample' }, x: 315, y: 220, delay: 1.5 },
];

function FicheVin({ visible, locale }: { visible: boolean; locale: Locale }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Fiche card */}
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
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      <line
        x1={215}
        y1={170}
        x2={x - 4}
        y2={y - 3}
        stroke="rgba(212, 165, 72, 0.45)"
        strokeWidth="0.5"
      />
      <circle cx={215} cy={170} r="1.5" fill="rgba(212, 165, 72, 0.7)" />
      <text
        fill="#f3ece7"
        fontSize="11"
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
      {/* hairline from plat vers fiche */}
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
        transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
      />
      {/* checkmark or sur l'arrow */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 1.4 }}
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
}: {
  visible: boolean;
  locale: Locale;
}) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {PROPOSITIONS.map((p, i) => {
        const x = 30 + i * 155;
        const isCenter = i === 1;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.15 + i * 0.15,
              ease: [0.16, 1, 0.3, 1],
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
            {/* mini bottle inside card */}
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
  const ficheVisible = stage >= 1;
  const wordsVisible = stage >= 1;
  const platVisible = stage >= 2;
  const propVisible = stage >= 3;

  // À stage 3 : on garde la focus bouteille, on cache les 5 autres
  // (narrative : "voici la sélectionnée, et voici les 3 propositions finales")

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
                className="relative block min-h-[380px] sm:min-h-[440px]"
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

                {/* Phase 1 — 6 silhouettes bouteilles, focus reste à stage 3 */}
                {BOTTLES.map((b, i) => {
                  const isFocus = i === 2;
                  // À stage 3 : on cache les 5 non-focus pour laisser place
                  // au triptyque fiche + plat + propositions.
                  const localVisible = bottleVisible && (stage < 3 || isFocus);
                  return (
                    <BottleSilhouette
                      key={i}
                      x={b.x}
                      y={b.y}
                      scale={b.scale}
                      highlighted={stage >= 1 && isFocus}
                      delay={b.delay}
                      visible={localVisible}
                    />
                  );
                })}

                {/* Phase 2 — fiche + mots (le halo est sur la BottleSilhouette highlighted) */}
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
