'use client';

import { ArrowRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import Button from '@/components/ui/Button';
import ScreenshotFrame from '@/components/screenshot/ScreenshotFrame';
import { useLocale } from '@/lib/i18n';
import { APP_SIGNUP_URL } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * SectionSaq (#saq) — le moat SAQ renforcé. Octave ne recommande pas dans le
 * vide : si le vin n'est pas dans votre cave, il sait où le trouver, en
 * tablette, à la succursale la plus proche, ce soir. Disponibilités SAQ en
 * temps réel — le différenciateur que personne d'autre ne réunit.
 */

export default function SectionSaq() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <SectionWrapper id="saq" tone="light" withDivider rhythm="standard">
      <div className="max-w-3xl mx-auto text-center">
        <FadeInOnScroll>
          <div className="iq-eyebrow mb-5">{t('JAMAIS À COURT', 'NEVER STUCK')}</div>
          <h2 className="iq-h1 italic">
            {t(
              'Octave sait exactement où elle est.',
              'Octave knows exactly where to find it.',
            )}
          </h2>
          <p className="iq-lead mt-6">
            {t(
              "Octave ne se contente pas de recommander un vin. S'il n'est pas dans votre cave, il sait où le trouver : la bonne bouteille, en tablette, à la succursale SAQ la plus proche — et si elle est disponible ce soir.",
              'Octave doesn’t just recommend a wine. If it isn’t in your cellar, it knows where to find it: the right bottle, on the shelf, at the nearest SAQ store — and whether it’s available tonight.',
            )}
          </p>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.12}>
          <p className="iq-body mt-6 text-foreground-dim">
            {t(
              'Disponibilités SAQ en temps réel, succursale par succursale, mises à jour en continu. Vous ne partez plus à l’aveugle : vous savez avant même de sortir.',
              'Live SAQ availability, store by store, continuously updated. You no longer head out blind: you know before you even leave.',
            )}
          </p>
          <p className="mt-4 font-mono text-[10px] tracking-[0.22em] uppercase text-foreground-faint">
            {t('Succursales SAQ du Québec', 'SAQ stores across Québec')}
          </p>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.2}>
          <p className="mt-10 font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl text-or">
            {t(
              "Pas seulement quoi ouvrir. Où l'avoir.",
              'Not just what to open. Where to get it.',
            )}
          </p>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.26}>
          <div className="mt-12 flex justify-center">
            <ScreenshotFrame
              src="/screenshots/06-recherche-hors-cave.png"
              alt={t(
                'Octave trouve la bouteille en tablette à votre SAQ',
                'Octave finds the bottle on the shelf at your SAQ',
              )}
              width={264}
              frame="iphone"
              glow
              rotation={-2}
            />
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.34}>
          <div className="mt-10">
            <a
              href={APP_SIGNUP_URL}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'saq' })}
            >
              <Button variant="cta" size="lg">
                {t('Rencontrer Octave', 'Meet Octave')}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>
          </div>
        </FadeInOnScroll>
      </div>
    </SectionWrapper>
  );
}
