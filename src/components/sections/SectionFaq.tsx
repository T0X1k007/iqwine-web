'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';

/**
 * SectionFaq (#faq), lève les objections au point de décision (avant/avec le
 * pricing). Accordéon à ouverture/fermeture FLUIDE (framer-motion height),
 * accessible (button + aria-expanded). reduced-motion : fondu simple.
 */

import { FAQ } from '@/lib/faq';

const QA = FAQ;


function FaqItem({ q, a, jour = false }: { q: string; a: string; jour?: boolean }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 cursor-pointer list-none py-5 select-none text-left"
      >
        <span className={`iq-h4 ${jour ? "text-encre" : "text-foreground"}`}>{q}</span>
        <span
          aria-hidden
          className={`shrink-0 text-2xl leading-none transition-transform duration-[240ms] ease-[cubic-bezier(.32,.72,0,1)] ${
            jour ? 'text-or-jour' : 'text-or'
          } ${open ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <p className={`iq-body -mt-1 max-w-xl pb-5 ${jour ? "text-encre-2" : "text-foreground-dim"}`}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SectionFaq({ ton = 'nuit' }: { ton?: 'jour' | 'nuit' } = {}) {
  // La FAQ suit le mouvement de la page qui l'accueille (v3, 2026-08-14).
  const jour = ton === 'jour';
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <SectionWrapper id="faq" withDivider={!jour} rhythm="standard" className={`section-breathe ${jour ? "mouvement-jour" : ""}`}>
      <FadeInOnScroll>
        <div className="text-center mb-10 sm:mb-14">
          <div className={`iq-eyebrow mb-5 ${jour ? "text-or-jour" : ""}`}>{t('Questions', 'Questions')}</div>
          <h2 className={`iq-h1 italic ${jour ? "text-encre" : ""}`}>{t('Avant de commencer.', 'Before you start.')}</h2>
        </div>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.1}>
        <div className={`mx-auto max-w-2xl divide-y border-y ${jour ? "divide-encre/10 border-encre/10" : "divide-border border-border"}`}>
          {QA.map((item) => (
            <FaqItem key={item.q.en} q={item.q[locale]} a={item.a[locale]} jour={jour} />
          ))}
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
