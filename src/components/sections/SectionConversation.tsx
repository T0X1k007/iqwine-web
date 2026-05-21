'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

/**
 * SectionConversation — « Demandez à votre cave. »
 *
 * Direction V5-ter Eric : montrer la conversation IA × sommelier
 * de façon éditoriale magazine luxe — JAMAIS chat UI startup
 * (Discord/Slack/ChatGPT feel interdit).
 *
 * Format : transcript éditorial style interview Vogue / Monocle.
 *   - Eyebrow "VOUS" puis question italic Cormorant medium
 *   - Hairline or séparateur
 *   - Eyebrow "VOTRE SOMMELIER" puis réponse italic Cormorant large
 *
 * Animation : reveal staggered ligne par ligne (~1.5s total),
 * joue UNE fois via useInView once. prefers-reduced-motion = direct.
 */

const QA: Record<
  Locale,
  {
    question: string;
    response: string[];
  }
> = {
  fr: {
    question:
      'Que puis-je ouvrir avec un tomahawk grillé ce soir ?',
    // V5-quater Eric : plus de texture, plus de vin, plus de rituel.
    response: [
      'Votre Brunello Pian delle Vigne 2010.',
      'Laissez-le respirer une heure.',
      'Le fruit est ample maintenant,',
      'les tanins enfin assouplis.',
      'C\'est probablement sa plus belle fenêtre.',
    ],
  },
  en: {
    question: 'What should I open with a grilled tomahawk tonight?',
    response: [
      'Your Brunello Pian delle Vigne 2010.',
      'Let it breathe an hour.',
      'The fruit is ample now,',
      'the tannins finally softened.',
      'It is probably its most beautiful window.',
    ],
  },
};

// Questions fantômes — vivent en arrière-plan opacity 0.08-0.12, drift
// très lent. Sensation : "des centaines de conversations vivent dans
// votre cave". Eric V5-quater.
const GHOST_QUESTIONS: Record<Locale, Array<{ text: string; x: string; y: string; rotate: number }>> = {
  fr: [
    { text: 'Lequel est en apogée cette année ?', x: '8%', y: '12%', rotate: -1 },
    { text: 'Une bouteille pour un risotto aux truffes ?', x: '55%', y: '25%', rotate: 1.5 },
    { text: 'À boire avant 2027 ?', x: '10%', y: '78%', rotate: -1.5 },
    { text: 'Que reste-t-il du voyage en Toscane ?', x: '52%', y: '85%', rotate: 1 },
    { text: 'Qu\'est-ce qui s\'ouvre bien ce soir ?', x: '60%', y: '50%', rotate: -0.5 },
  ],
  en: [
    { text: 'Which one is at peak this year?', x: '8%', y: '12%', rotate: -1 },
    { text: 'A bottle for truffle risotto?', x: '55%', y: '25%', rotate: 1.5 },
    { text: 'To drink before 2027?', x: '10%', y: '78%', rotate: -1.5 },
    { text: 'What\'s left from the Tuscany trip?', x: '52%', y: '85%', rotate: 1 },
    { text: 'What opens well tonight?', x: '60%', y: '50%', rotate: -0.5 },
  ],
};

export default function SectionConversation() {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' });
  const reduced = useReducedMotion();

  // stage 0=initial, 1=question, 2-6=réponse 5 lignes
  const [stage, setStage] = useState(reduced ? 6 : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const timers = [
      window.setTimeout(() => setStage(1), 250), // question
      window.setTimeout(() => setStage(2), 1100), // ligne 1 (Brunello name)
      window.setTimeout(() => setStage(3), 1500), // ligne 2 (laissez respirer)
      window.setTimeout(() => setStage(4), 1850), // ligne 3 (fruit ample)
      window.setTimeout(() => setStage(5), 2150), // ligne 4 (tanins assouplis)
      window.setTimeout(() => setStage(6), 2500), // ligne 5 (sa plus belle fenêtre)
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduced]);

  const qa = QA[locale];
  const ghosts = GHOST_QUESTIONS[locale];

  return (
    <SectionWrapper id="conversation" withDivider rhythm="standard">
      <div className="relative max-w-3xl mx-auto" ref={ref}>
        {/* Questions fantômes — vivent en arrière-plan, drift très lent.
           Sensation : des centaines de conversations dans votre cave. */}
        {!reduced && (
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {ghosts.map((g, i) => (
              <motion.span
                key={i}
                className="absolute font-[family-name:var(--font-display)] italic text-foreground whitespace-nowrap"
                style={{
                  left: g.x,
                  top: g.y,
                  transform: `rotate(${g.rotate}deg)`,
                  fontSize: '14px',
                  letterSpacing: '-0.005em',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.10, 0.08, 0.11, 0.07, 0.10] }}
                transition={{
                  duration: 18 + i * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 1.2,
                }}
              >
                « {g.text} »
              </motion.span>
            ))}
          </div>
        )}

        <FadeInOnScroll>
          <div className="relative text-center mb-12 sm:mb-16">
            <div className="iq-eyebrow mb-5">
              {locale === 'fr' ? 'La conversation' : 'The conversation'}
            </div>
            <h2 className="iq-display italic">
              {locale === 'fr'
                ? 'Demandez à votre cave.'
                : 'Ask your cellar.'}
            </h2>
            <p className="iq-lead mt-5">
              {locale === 'fr'
                ? 'Elle répond, en sommelier.'
                : 'It answers, like a sommelier.'}
            </p>
          </div>
        </FadeInOnScroll>

        {/* Transcript éditorial — relative pour rester au-dessus des ghosts */}
        <div className="relative grid grid-cols-1 gap-0 max-w-2xl mx-auto">
          {/* QUESTION block */}
          <motion.article
            initial={{ opacity: 0, y: 8 }}
            animate={stage >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="pb-10 sm:pb-12 border-b border-or/20"
          >
            <div className="iq-eyebrow-mute mb-4">
              {locale === 'fr' ? 'Vous' : 'You'}
            </div>
            <p className="font-[family-name:var(--font-display)] italic text-foreground text-2xl sm:text-3xl leading-snug tracking-[-0.01em]">
              « {qa.question} »
            </p>
          </motion.article>

          {/* RESPONSE block — 5 lignes, plus sensuel, plus ritual */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={stage >= 2 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pt-10 sm:pt-12"
          >
            <div className="iq-eyebrow mb-5">
              {locale === 'fr' ? 'Votre sommelier' : 'Your sommelier'}
            </div>
            <div className="flex flex-col gap-3">
              {qa.response.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={
                    stage >= 2 + i ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                  }
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`font-[family-name:var(--font-display)] italic leading-relaxed tracking-[-0.005em] ${
                    i === 0
                      ? 'text-or text-3xl sm:text-[36px] mb-2'
                      : 'text-foreground text-xl sm:text-[22px]'
                  }`}
                >
                  {i === 0 ? '« ' : ''}
                  {line}
                  {i === qa.response.length - 1 ? ' »' : ''}
                </motion.p>
              ))}
            </div>
          </motion.article>
        </div>

        <FadeInOnScroll delay={0.4}>
          <div className="mt-16 text-center">
            <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
              <div className="h-px flex-1 bg-or/25" />
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-foreground-faint">
                {locale === 'fr'
                  ? 'Question · accord · service'
                  : 'Question · pairing · service'}
              </p>
              <div className="h-px flex-1 bg-or/25" />
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </SectionWrapper>
  );
}
