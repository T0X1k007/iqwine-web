'use client';

import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import LocaleLink from '@/components/ui/LocaleLink';
import Button from '@/components/ui/Button';
import BadgesPlateformes from '@/components/ui/BadgesPlateformes';
import { ArrowRight } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl, APP_STORE_URL, CTA_VERS_STORE } from '@/lib/constants';
import { TRIAL_SHORT } from '@/lib/trial';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * SECTION 6, LA RÉSOLUTION : cave + temps + apogée + signature + CTA
 * (architecture 6 sections, Eric 2026-08-13).
 *
 * Trois temps dans une seule nuit :
 *   1. LA CAVE, « Octave ne connaît pas seulement vos goûts. Il connaît
 *      votre cave. » Une cave n'est pas une liste.
 *   2. L'APOGÉE, le climax cérémonial : une bouteille, une lumière, la
 *      courbe de sa fenêtre (la ligne d'accord devenue courbe du temps),
 *      « Vous l'avez gardée six ans. Ce soir ? »
 *   3. LA SIGNATURE, la ligne se résout à l'horizontale : « Octave.
 *      À l'unisson de vos goûts. » Puis le CTA, calme.
 *
 * Vérité produit : fenêtre de dégustation par millésime ET par format ;
 * l'apogée est un repère, jamais une certitude (le produit le dit lui-même) ;
 * notifications calmes ≤ 2/semaine ; emplacements suivis case par case.
 * CTA : il mène à l'essai, et il y reste — iOS est publiée depuis le
 * 2026-08-28 sans que le libellé bascule (cf. `CTA_VERS_STORE`, constants.ts).
 * La disponibilité mobile se dit dessous, par les badges App Store / Android.
 * L'ancienne FinalCta est remplacée par cette résolution (fichier conservé).
 */

export default function SectionResolution() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const ctaLabel = CTA_VERS_STORE
    ? t('Télécharger iQWine', 'Download iQWine')
    : t('Rencontrer Octave', 'Meet Octave');
  const ctaHref = CTA_VERS_STORE
    ? APP_STORE_URL
    : buildSignupUrl('resolution', { lang: locale });

  return (
    <section
      id="cave"
      data-nav-delai="120"
      className="relative overflow-hidden text-foreground"
      style={{
        // Crépuscule bref : l'ivoire bascule dans la nuit en quelques pour
        // cent, pas de longue zone boueuse (retour visuel du 2026-08-13).
        background:
          'linear-gradient(180deg, var(--color-papier) 0%, #2a1d13 7%, #150f0c 20%, #120d0a 60%, #150f0c 100%)',
      }}
    >
      <div className="relative mx-auto max-w-[1440px] px-6 pb-14 pt-14 sm:pt-16 lg:px-8 lg:pb-16 lg:pt-20">
        {/* 1, La cave */}
        <div className="mx-auto max-w-[720px] text-center">
          <FadeInOnScroll>
            <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or">
              {t('Votre cave', 'Your cellar')}
            </p>
            <h2
              className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.2] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
            >
              {t('Octave ne connaît pas seulement vos goûts.', 'Octave doesn’t just know your taste.')}
              <br />
              <span className="text-or">{t('Il connaît votre cave.', 'He knows your cellar.')}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[46ch] text-[16.5px] leading-relaxed text-muted-foreground md:text-[17.5px]">
              {t(
                'Ce que vous possédez, où chaque bouteille est rangée, ce que vous avez pensé de la dernière. Car une cave n’est pas une liste : chaque bouteille attend son moment.',
                'What you own, where each bottle rests, what you thought of the last one. Because a cellar isn’t a list: every bottle is waiting for its moment.',
              )}
            </p>
            {/* Maillage narratif vers la page Fonction (activé à sa naissance). */}
            <LocaleLink
              href="/cellier-intelligent"
              className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-or transition-colors hover:text-or-soft"
            >
              {t('Découvrir le cellier intelligent', 'Discover the smart cellar')}
              <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </LocaleLink>
          </FadeInOnScroll>
        </div>

        {/* 2, L'apogée, cérémoniale */}
        <div className="relative mx-auto mt-10 max-w-[860px] text-center lg:mt-12">
          {/* Le faisceau sur la bouteille */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-40px] h-[420px] w-[420px] -translate-x-1/2"
            style={{
              background: 'radial-gradient(50% 50% at 50% 40%, rgba(217, 182, 103, 0.16), transparent 70%)',
            }}
          />
          <FadeInOnScroll>
            {/* eslint-disable-next-line @next/next/no-img-element -- bouteille détourée du dépôt */}
            <img
              src="/photos/wines/pio-cesare.webp"
              alt=""
              width={1000}
              height={1500}
              loading="lazy"
              decoding="async"
              className="relative mx-auto h-[210px] w-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)] sm:h-[240px]"
              draggable={false}
            />
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.12}>
            <h2
              className="mt-6 font-[family-name:var(--font-display)] font-medium leading-[1.16] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
            >
              {t('Vous l’avez gardée six ans.', 'You’ve kept it six years.')}
              <br />
              <em className="text-or">{t('Ce soir ?', 'Tonight?')}</em>
            </h2>
          </FadeInOnScroll>

          {/* La courbe du temps, la ligne d'accord devenue fenêtre de
              dégustation : elle monte, s'ouvre, et le moment est LÀ. */}
          <FadeInOnScroll delay={0.2}>
            <div className="relative mx-auto mt-6 w-[min(560px,88%)]">
              <svg viewBox="0 0 560 90" aria-hidden className="block h-[90px] w-full">
                <path
                  d="M0,82 C120,80 190,68 250,44 C300,24 340,16 400,16 C460,16 510,26 560,44"
                  fill="none"
                  stroke="var(--color-or)"
                  strokeWidth="1.2"
                  opacity="0.7"
                  vectorEffect="non-scaling-stroke"
                />
                <circle cx="400" cy="16" r="4" fill="var(--color-or)">
                  <animate attributeName="opacity" values="1;0.45;1" dur="2.6s" repeatCount="indefinite" />
                </circle>
              </svg>
              <span className="absolute right-[22%] top-[-14px] text-[10.5px] font-medium uppercase tracking-[0.22em] text-or">
                {t('Maintenant', 'Now')}
              </span>
            </div>
            <p className="mx-auto mt-4 max-w-[52ch] text-[13.5px] leading-relaxed text-foreground-faint">
              {t(
                'Chaque millésime a sa fenêtre, calculée jusqu’au format : un magnum ne vieillit pas comme une bouteille. Un repère assumé, jamais une promesse. Et Octave prévient sans harceler : deux notifications par semaine, au plus.',
                'Every vintage has its window, computed down to the format: a magnum doesn’t age like a bottle. A guide, never a promise. And Octave alerts without nagging: two notifications a week, at most.',
              )}
            </p>
          </FadeInOnScroll>
        </div>

        {/* 3, La résolution : la ligne s'apaise, la signature, le CTA. */}
        <div className="mx-auto mt-12 max-w-[760px] text-center lg:mt-14">
          <FadeInOnScroll>
            <div className="mx-auto h-px w-[min(420px,70%)] bg-or/60" />
            <p
              className="mt-7 font-[family-name:var(--font-display)] italic leading-[1.15]"
              style={{ fontSize: 'clamp(30px, 4.6vw, 52px)' }}
            >
              Octave.{' '}
              <span className="not-italic font-medium text-or">
                {t('À l’unisson de vos goûts.', 'In tune with your taste.')}
              </span>
            </p>
            <p className="mx-auto mt-5 max-w-[44ch] text-[15.5px] leading-relaxed text-muted-foreground">
              {t(
                'Au début, vous ne saviez pas quoi choisir. Maintenant, quelqu’un vous connaît.',
                'At first, you didn’t know what to choose. Now, someone knows you.',
              )}
            </p>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.12}>
            <div className="mt-7">
              <a
                href={ctaHref}
                onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'resolution' })}
              >
                <Button variant="or" size="lg">{ctaLabel}</Button>
              </a>
              <p className="mt-4 text-[13px] tracking-wide text-foreground-faint">
                {t(
                  `Essai gratuit, ${TRIAL_SHORT.fr} · Sans carte`,
                  `Free trial, ${TRIAL_SHORT.en} · No card required`,
                )}
              </p>

              {/* La section est centrée : la paire doit l'être aussi. */}
              <BadgesPlateformes ton="nuit" source="resolution" className="mt-6 justify-center" />
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
}
