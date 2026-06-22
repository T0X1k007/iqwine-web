'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';

/**
 * SectionCommentCaMarche (#comment) — « En trois gestes ». Lève l'objection
 * d'effort : pas de cave complète à saisir, première reco en 30 secondes. Trois
 * étapes numérotées, ton plaisir, jamais corvée.
 */

export default function SectionCommentCaMarche() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const steps = [
    t(
      'Ajoutez vos bouteilles — photo, scan ou import. (Ou commencez sans rien : Octave répond dès la première question.)',
      'Add your bottles — photo, scan or import. (Or start with nothing: Octave answers from the very first question.)',
    ),
    t(
      'Dites à Octave le moment — un repas, un soir, un invité.',
      'Tell Octave the moment — a meal, an evening, a guest.',
    ),
    t(
      'Ouvrez la bonne bouteille — de votre cave ou de la SAQ.',
      'Open the right bottle — from your cellar or the SAQ.',
    ),
  ];

  return (
    <SectionWrapper id="comment" withDivider rhythm="standard">
      <FadeInOnScroll>
        <div className="text-center mb-12 sm:mb-16">
          <div className="iq-eyebrow mb-5">{t('EN TROIS GESTES', 'IN THREE STEPS')}</div>
          <h2 className="iq-h1 italic max-w-3xl mx-auto">
            {t(
              'Simple comme ouvrir une bouteille.',
              'As simple as opening a bottle.',
            )}
          </h2>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
        {steps.map((step, i) => (
          <FadeInOnScroll key={i} delay={0.12 + i * 0.1} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-border-strong bg-card p-7 sm:p-8">
              <span className="font-[family-name:var(--font-display)] italic text-or text-4xl tabular-nums leading-none mb-5">
                {i + 1}
              </span>
              <p className="iq-body text-foreground-dim">{step}</p>
            </div>
          </FadeInOnScroll>
        ))}
      </div>

      <FadeInOnScroll delay={0.3}>
        <p className="mt-12 text-center font-mono text-[10px] tracking-[0.18em] uppercase text-foreground-faint">
          {t(
            'Première recommandation en 30 secondes. Aucune cave complète à saisir pour commencer.',
            'First recommendation in 30 seconds. No full cellar to enter to get started.',
          )}
        </p>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
