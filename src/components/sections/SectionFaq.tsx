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
      fr: 'Oui, à tout moment. La résiliation prend effet au renouvellement de votre terme mensuel ou annuel.',
      en: 'Yes, anytime. Cancellation takes effect at the renewal of your monthly or annual term.',
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
    q: { fr: 'Où Octave vérifie-t-il la disponibilité ?', en: 'Where does Octave check availability?' },
    a: {
      fr: 'La disponibilité par magasin est vérifiée à partir de données officielles à jour, partout au Québec. Ailleurs, iQWine recommande depuis votre cave et par scan d’étiquette ou de carte.',
      en: 'Store-level availability is verified from up-to-date official data, across Québec. Elsewhere, iQWine recommends from your cellar and via label or menu scan.',
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
  {
    q: { fr: 'Que se passe-t-il à la fin des 14 jours ?', en: 'What happens after 14 days?' },
    a: {
      fr: 'Rien d’automatique. Comme l’essai est sans carte, vous n’êtes jamais débité par surprise : à la fin des 14 jours, vous choisissez de continuer ou non. Votre cave et votre palais, eux, restent.',
      en: 'Nothing automatic. Since the trial needs no card, you’re never charged by surprise: after 14 days, you choose whether to continue. Your cellar and your palate stay with you.',
    },
  },
  {
    q: { fr: 'Octave peut-il se tromper ?', en: 'Can Octave be wrong?' },
    a: {
      fr: 'Octave ne devine pas : il s’appuie sur des données de disponibilité réelles et à jour, votre cave et vos goûts — pas sur un assistant générique. Et il vous dit quand il hésite plutôt que d’inventer.',
      en: 'Octave doesn’t guess: it relies on real, up-to-date availability data, your cellar and your taste — not a generic assistant. And it tells you when it’s unsure rather than making things up.',
    },
  },
  {
    q: { fr: 'Pourquoi choisir l’annuel ?', en: 'Why choose annual?' },
    a: {
      fr: 'Deux mois offerts, et un palais qu’Octave affine toute l’année. Vous vous installez pour de bon — c’est aussi le meilleur prix.',
      en: 'Two months free, and a palate Octave sharpens all year long. You settle in for good — and it’s the best price.',
    },
  },
  {
    q: { fr: 'Et si je change d’avis ?', en: 'What if I change my mind?' },
    a: {
      fr: 'Vous résiliez en un geste, en tout temps. En annuel, vous pouvez aussi repasser au mensuel quand vous voulez.',
      en: 'Cancel in one tap, anytime. On annual, you can also switch back to monthly whenever you like.',
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
    <SectionWrapper id="faq" withDivider rhythm="standard" className="section-breathe">
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
