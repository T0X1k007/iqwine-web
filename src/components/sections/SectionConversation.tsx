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
    response: [
      'Votre Brunello Pian delle Vigne 2010.',
      'Tanins fondus, fruit ample, prêt pour la fumée du grill.',
      'Servir une heure avant la table.',
    ],
  },
  en: {
    question: 'What should I open with a grilled tomahawk tonight?',
    response: [
      'Your Brunello Pian delle Vigne 2010.',
      'Soft tannins, ample fruit, ready for the smoke of the grill.',
      'Decant one hour before the table.',
    ],
  },
};

export default function SectionConversation() {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' });
  const reduced = useReducedMotion();

  const [stage, setStage] = useState(reduced ? 4 : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const timers = [
      window.setTimeout(() => setStage(1), 250), // question apparait
      window.setTimeout(() => setStage(2), 1000), // ligne 1 réponse
      window.setTimeout(() => setStage(3), 1400), // ligne 2
      window.setTimeout(() => setStage(4), 1800), // ligne 3
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduced]);

  const qa = QA[locale];

  return (
    <SectionWrapper id="conversation" withDivider rhythm="standard">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <FadeInOnScroll>
          <div className="text-center mb-12 sm:mb-16">
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

        {/* Transcript éditorial */}
        <div className="grid grid-cols-1 gap-0 max-w-2xl mx-auto">
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

          {/* RESPONSE block */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={stage >= 2 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pt-10 sm:pt-12"
          >
            <div className="iq-eyebrow mb-5">
              {locale === 'fr' ? 'Votre sommelier' : 'Your sommelier'}
            </div>
            <div className="flex flex-col gap-3 sm:gap-4">
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
                      ? 'text-or text-3xl sm:text-[40px]'
                      : 'text-foreground text-xl sm:text-2xl'
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
