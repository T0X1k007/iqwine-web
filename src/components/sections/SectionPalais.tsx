'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import ScreenshotFrame from '@/components/screenshot/ScreenshotFrame';
import { useLocale } from '@/lib/i18n';

/**
 * SectionPalais (#palais) — « Octave apprend votre palais ».
 *
 * Démonstration par le contraste : même question, deux réponses. L'IA
 * générique sert une moyenne ; Octave parle de VOTRE Barolo, de VOTRE apogée,
 * de VOS tanins fondus. La preuve par l'exemple que la reco est personnelle,
 * jamais une note moyenne.
 */

export default function SectionPalais() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <SectionWrapper id="palais" withDivider rhythm="standard">
      <FadeInOnScroll>
        <div className="text-center mb-12 sm:mb-16">
          <div className="iq-eyebrow mb-5">
            {t('VOTRE PALAIS, PAS UNE NOTE MOYENNE', 'YOUR PALATE, NOT AN AVERAGE SCORE')}
          </div>
          <h2 className="iq-h1 italic max-w-3xl mx-auto">
            {t('Même question. Deux réponses.', 'Same question. Two answers.')}
          </h2>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
        {/* IA générique — terne, anonyme */}
        <FadeInOnScroll delay={0.1} className="h-full">
          <figure className="flex h-full flex-col rounded-2xl border border-border bg-card/40 p-7 sm:p-8">
            <figcaption className="iq-eyebrow-mute mb-5">
              {t('IA générique', 'Generic AI')}
            </figcaption>
            <blockquote className="font-[family-name:var(--font-display)] italic text-foreground-dim text-xl leading-relaxed flex-1">
              «&nbsp;
              {t(
                'Un rouge corsé conviendrait, par exemple un Bordeaux.',
                'A full-bodied red would work, for example a Bordeaux.',
              )}
              &nbsp;»
            </blockquote>
          </figure>
        </FadeInOnScroll>

        {/* Octave — précis, personnel, cadre or */}
        <FadeInOnScroll delay={0.18} className="h-full">
          <figure className="flex h-full flex-col rounded-2xl border border-or/30 bg-or/[0.06] p-7 sm:p-8">
            <figcaption className="iq-eyebrow mb-5">Octave</figcaption>
            <blockquote className="font-[family-name:var(--font-display)] italic text-foreground text-xl leading-relaxed flex-1">
              «&nbsp;
              {t(
                "Ouvrez votre Barolo 2019 de Pio Cesare : il entre dans son apogée, et il a exactement les tanins fondus que vous avez aimés le mois dernier.",
                'Open your 2019 Barolo from Pio Cesare: it’s entering its drinking window, and it has exactly the soft tannins you loved last month.',
              )}
              &nbsp;»
            </blockquote>
          </figure>
        </FadeInOnScroll>
      </div>

      <FadeInOnScroll delay={0.22}>
        <div className="mt-14 flex flex-col items-center">
          <ScreenshotFrame
            src="/screenshots/04-carnet.png"
            alt={t(
              'Votre carnet de dégustation — la mémoire de votre palais',
              'Your tasting journal — your palate’s memory',
            )}
            width={264}
            frame="iphone"
            glow
            rotation={2}
          />
          <p className="mt-5 font-mono text-[11px] tracking-[0.24em] uppercase text-foreground-faint">
            {t('Votre carnet de dégustation', 'Your tasting journal')}
          </p>
        </div>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.3}>
        <p className="mt-12 text-center iq-lead max-w-2xl mx-auto">
          {t(
            'Jamais deux personnes ne reçoivent la même recommandation.',
            'No two people ever get the same recommendation.',
          )}
        </p>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
