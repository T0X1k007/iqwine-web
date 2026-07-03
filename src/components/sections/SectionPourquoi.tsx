'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';

/**
 * SectionPourquoi (#pourquoi) — « Pourquoi iQWine existe ». Mouvement de TENSION
 * (VISUAL 2.0, 9 mouvements). On ne vend pas une feature : on nomme le problème,
 * viscéralement, avant de nommer la réponse. Éditorial, sobre, premium, zéro
 * jargon SaaS. La lumière (halo champagne) guide l'œil vers la résolution en or.
 */

export default function SectionPourquoi() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const tensions: Array<{ fr: string; en: string }> = [
    {
      fr: "Le millésime parfait passe son apogée dans l'ombre d'une cave.",
      en: 'The perfect vintage slips past its peak in the shadow of a cellar.',
    },
    {
      fr: "Une grande bouteille s'ouvre un soir ordinaire — et se perd.",
      en: 'A great bottle is opened on an ordinary night — and is lost.',
    },
    {
      fr: 'Et la note « 92 / 100 » d’un critique ne connaît rien de votre palais.',
      en: 'And a critic’s “92 / 100” knows nothing of your palate.',
    },
  ];

  return (
    <SectionWrapper id="pourquoi" withDivider rhythm="editorial">
      <div className="relative max-w-3xl mx-auto text-center">
        {/* Respiration lumineuse — la lumière monte vers la résolution */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[420px] w-[760px] max-w-[96%] -translate-x-1/2 -translate-y-1/4 rounded-full opacity-70 blur-[110px]"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 42%, rgba(217,182,103,0.11), transparent 70%)',
          }}
        />

        <FadeInOnScroll>
          <div className="iq-eyebrow mb-6">
            {t('Pourquoi iQWine existe', 'Why iQWine exists')}
          </div>
          <h2 className="iq-h1 italic">
            {t(
              'Les grandes bouteilles sont bues trop tôt. Ou oubliées trop tard.',
              'Great bottles are opened too soon. Or forgotten too late.',
            )}
          </h2>
        </FadeInOnScroll>

        <div className="mt-12 sm:mt-14 space-y-6 sm:space-y-7">
          {tensions.map((line, i) => (
            <FadeInOnScroll key={i} delay={0.14 + i * 0.1}>
              <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl leading-relaxed text-foreground/85 max-w-2xl mx-auto">
                {t(line.fr, line.en)}
              </p>
            </FadeInOnScroll>
          ))}
        </div>

        <FadeInOnScroll delay={0.5}>
          <p className="mt-14 sm:mt-16 font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl leading-relaxed text-or max-w-2xl mx-auto">
            {t(
              'iQWine existe pour ça. Une cave qui se souvient — de chaque bouteille, et de vous.',
              'That’s why iQWine exists. A cellar that remembers — every bottle, and you.',
            )}
          </p>
        </FadeInOnScroll>
      </div>
    </SectionWrapper>
  );
}
