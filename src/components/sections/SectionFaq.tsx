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

const QA: { q: Record<'fr' | 'en', string>; a: Record<'fr' | 'en', string> }[] = [
  {
    q: { fr: 'Dois-je donner ma carte de crédit ?', en: 'Do I need a credit card?' },
    a: {
      fr: 'Non. L’essai dure 14 jours, sans carte. Vous décidez ensuite.',
      en: 'No. The trial is 14 days, no card. You decide afterwards.',
    },
  },
  {
    q: { fr: 'Puis-je résilier ?', en: 'Can I cancel?' },
    a: {
      fr: 'Oui, à tout moment, en un geste. Aucun engagement.',
      en: 'Yes, anytime, in one tap. No commitment.',
    },
  },
  {
    q: { fr: 'Mes données sont-elles privées ?', en: 'Is my data private?' },
    a: {
      fr: 'Vos goûts et votre cave vous appartiennent : chiffrés, privés, exportables.',
      en: 'Your taste and cellar are yours: encrypted, private, exportable.',
    },
  },
  {
    q: { fr: 'La disponibilité SAQ, c’est partout ?', en: 'Is SAQ availability everywhere?' },
    a: {
      fr: 'Les disponibilités en temps réel couvrent la SAQ (Québec). Ailleurs, iQWine recommande depuis votre cave et par scan d’étiquette ou de carte.',
      en: 'Live availability covers the SAQ (Québec). Elsewhere, iQWine recommends from your cellar and via label or menu scan.',
    },
  },
  {
    q: { fr: 'Dois-je saisir toute ma cave ?', en: 'Do I have to enter my whole cellar?' },
    a: {
      fr: 'Non. Octave répond dès la première question ; ajoutez vos bouteilles à votre rythme.',
      en: 'No. Octave answers from your very first question; add your bottles at your own pace.',
    },
  },
  {
    q: {
      fr: 'Combien de temps avant ma première recommandation ?',
      en: 'How long until my first recommendation?',
    },
    a: {
      fr: 'Environ 30 secondes.',
      en: 'About 30 seconds.',
    },
  },
  {
    q: { fr: 'Sur quels appareils ?', en: 'On which devices?' },
    a: {
      fr: 'Sur le web et sur mobile (iOS), installable en un geste.',
      en: 'On the web and on mobile (iOS), installable in one tap.',
    },
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
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
        <span className="iq-h4 text-foreground">{q}</span>
        <span
          aria-hidden
          className={`text-or text-2xl leading-none shrink-0 transition-transform duration-[240ms] ease-[cubic-bezier(.32,.72,0,1)] ${
            open ? 'rotate-45' : ''
          }`}
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
            <p className="iq-body text-foreground-dim pb-5 -mt-1 max-w-xl">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SectionFaq() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <SectionWrapper id="faq" withDivider rhythm="standard">
      <FadeInOnScroll>
        <div className="text-center mb-10 sm:mb-14">
          <div className="iq-eyebrow mb-5">{t('Questions', 'Questions')}</div>
          <h2 className="iq-h1 italic">{t('Avant de commencer.', 'Before you start.')}</h2>
        </div>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.1}>
        <div className="mx-auto max-w-2xl divide-y divide-border border-y border-border">
          {QA.map((item) => (
            <FaqItem key={item.q.en} q={item.q[locale]} a={item.a[locale]} />
          ))}
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
