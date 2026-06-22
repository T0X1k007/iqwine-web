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
                'Ouvrez votre Barolo 2013 de Pio Cesare : il est à son apogée, et il a exactement les tanins fondus que vous avez aimés le mois dernier.',
                'Open your 2013 Pio Cesare Barolo: it’s at its peak, and it has exactly the melted tannins you loved last month.',
              )}
              &nbsp;»
            </blockquote>
          </figure>
        </FadeInOnScroll>
      </div>

      {/* Progression — le palais qui mûrit dans le temps (le moat) */}
      <div className="mt-20 max-w-5xl mx-auto">
        <FadeInOnScroll delay={0.22}>
          <div className="text-center mb-10 sm:mb-12">
            <div className="iq-eyebrow mb-5">
              {t(
                'PLUS VOUS L’UTILISEZ, PLUS IL VOUS CONNAÎT',
                'THE MORE YOU USE IT, THE MORE IT KNOWS YOU',
              )}
            </div>
            <h3 className="iq-h2 italic">
              {t('Votre palais, mois après mois.', 'Your palate, month after month.')}
            </h3>
          </div>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <FadeInOnScroll delay={0.26} className="h-full">
            <figure className="flex h-full flex-col rounded-2xl border border-border bg-card/40 p-7 sm:p-8">
              <figcaption className="font-mono text-[11px] tracking-[0.24em] uppercase text-or tabular-nums mb-2">
                {t('Jour 1', 'Day 1')}
              </figcaption>
              <div className="h-px bg-or/40 mb-5" />
              <blockquote className="font-[family-name:var(--font-display)] italic text-foreground-dim text-lg leading-relaxed flex-1">
                {t(
                  'Un rouge prêt à boire ce soir ? Voici trois pistes dans votre cave.',
                  'A red ready tonight? Here are three options in your cellar.',
                )}
              </blockquote>
            </figure>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.32} className="h-full">
            <figure className="flex h-full flex-col rounded-2xl border border-border bg-card/40 p-7 sm:p-8">
              <figcaption className="font-mono text-[11px] tracking-[0.24em] uppercase text-or tabular-nums mb-2">
                {t('Mois 3', 'Month 3')}
              </figcaption>
              <div className="h-px bg-or/40 mb-5" />
              <blockquote className="font-[family-name:var(--font-display)] italic text-foreground-dim text-lg leading-relaxed flex-1">
                {t(
                  'Vous avez aimé les rouges souples : je mets de côté ce Brunello encore serré et je vous sors le Rioja Gran Reserva.',
                  'You’ve leaned to supple reds: I’ll hold back that still-firm Brunello and pull out the Rioja Gran Reserva.',
                )}
              </blockquote>
            </figure>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.38} className="h-full">
            <figure className="flex h-full flex-col rounded-2xl border border-or/30 bg-or/[0.06] p-7 sm:p-8">
              <figcaption className="font-mono text-[11px] tracking-[0.24em] uppercase text-or tabular-nums mb-2">
                {t('Mois 12', 'Month 12')}
              </figcaption>
              <div className="h-px bg-or/40 mb-5" />
              <blockquote className="font-[family-name:var(--font-display)] italic text-foreground text-lg leading-relaxed flex-1">
                {t(
                  'Je connais vos soirs : tanins fondus en semaine, plus de structure quand vous recevez. Ce vendredi, votre Crozes-Hermitage.',
                  'I know your evenings: melted tannins midweek, more structure when you host. This Friday, your Crozes-Hermitage.',
                )}
              </blockquote>
            </figure>
          </FadeInOnScroll>
        </div>
      </div>

      <FadeInOnScroll delay={0.22}>
        <div className="mt-20 flex flex-col items-center">
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
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <p className="iq-lead">
            {t(
              'Jamais deux personnes ne reçoivent la même recommandation.',
              'No two people ever get the same recommendation.',
            )}
          </p>
          <p className="mt-4 iq-lead text-foreground">
            {t(
              'Une IA générique vous redécouvre à chaque question. Octave, lui, ne repart jamais de zéro.',
              'A generic AI rediscovers you with every question. Octave never starts from scratch.',
            )}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
