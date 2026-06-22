'use client';

import { ArrowRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import Button from '@/components/ui/Button';
import { useLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * SectionMomentsEnjeu (#moments-enjeu) — V2.6, les MOMENTS À ENJEU.
 *
 * On nomme l'ICP : une cave qui compte, qui reçoit, qui ne veut pas gâcher une
 * grande bouteille. Quatre moments — chacun avec sa conséquence évitée et sa
 * valeur. Chute : la tranquillité d'esprit + le palais qui apprend + l'apogée.
 *
 * Honnêteté produit : mécanismes RÉELS confirmés — « suit l'apogée »,
 * « apprend votre palais ». Pas de promesse d'alerte temps réel non vérifiée.
 */

type Moment = {
  eyebrow: Record<Locale, string>;
  body: Record<Locale, string>;
};

/** Frise apogée — 3 états, le langage EST l'argument (ni graphique, ni %). */
type ApogeeState = {
  label: Record<Locale, string>;
  body: Record<Locale, string>;
};

const APOGEE_STATES: ApogeeState[] = [
  {
    label: { fr: 'TROP JEUNE', en: 'TOO YOUNG' },
    body: {
      fr: 'Encore austère, les tanins serrent. Laissez-lui du temps — ou carafez deux heures.',
      en: 'Still austere, the tannins grip. Give it time — or decant two hours.',
    },
  },
  {
    label: { fr: 'À SON SOMMET', en: 'AT ITS PEAK' },
    body: {
      fr: 'C’est le moment. Tout est en place : ouvrez-la, elle ne sera jamais meilleure.',
      en: 'This is the moment. Everything’s in place: open it, it’ll never be better.',
    },
  },
  {
    label: { fr: 'À BOIRE SANS TARDER', en: 'DRINK WITHOUT DELAY' },
    body: {
      fr: 'Elle a passé le cap. Encore belle, mais le fruit s’efface. À boire bientôt.',
      en: 'It’s past the threshold. Still lovely, but the fruit is fading. Drink it soon.',
    },
  },
];

const MOMENTS: Moment[] = [
  {
    eyebrow: { fr: 'RECEVOIR', en: 'HOSTING' },
    body: {
      fr: 'Des invités à table. Octave compose l’accord, vous servez sans hésiter.',
      en: 'Guests at the table. Octave composes the pairing, you serve without hesitating.',
    },
  },
  {
    eyebrow: { fr: 'UN REPAS QUI COMPTE', en: 'A MEAL THAT MATTERS' },
    body: {
      fr: 'Le bon vin sur le bon plat, dans le bon ordre — comme un sommelier le ferait.',
      en: 'The right wine on the right dish, in the right order — the way a sommelier would.',
    },
  },
  {
    eyebrow: { fr: 'UNE GRANDE BOUTEILLE', en: 'A GREAT BOTTLE' },
    body: {
      fr: 'Octave suit l’apogée : vous l’ouvrez à son sommet, jamais trop tôt, jamais trop tard.',
      en: 'Octave tracks the drinking window: you open it at its peak, never too early, never too late.',
    },
  },
  {
    eyebrow: { fr: 'ÉVITER L’ERREUR COÛTEUSE', en: 'AVOIDING THE COSTLY MISTAKE' },
    body: {
      fr: 'Ne plus jamais gâcher une bouteille précieuse passée de l’autre côté.',
      en: 'Never again waste a precious bottle that has slipped past its prime.',
    },
  },
];

export default function SectionMomentsEnjeu() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <SectionWrapper id="moments-enjeu" tone="light" withDivider rhythm="standard">
      <div className="max-w-3xl mx-auto text-center">
        <FadeInOnScroll>
          <div className="iq-eyebrow mb-5">
            {t('QUAND ÇA COMPTE VRAIMENT', 'WHEN IT REALLY MATTERS')}
          </div>
          <h2 className="iq-h1 italic">
            {t(
              'Les soirs où il ne faut pas se tromper.',
              'The nights you can’t get it wrong.',
            )}
          </h2>
          <p className="iq-lead mt-6">
            {t(
              'Pour qui a une cave qui compte, reçoit, et n’a pas envie de gâcher une grande bouteille.',
              'For those with a cellar that matters, who host, and who don’t want to waste a great bottle.',
            )}
          </p>
        </FadeInOnScroll>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
        {MOMENTS.map((m, i) => (
          <FadeInOnScroll key={i} delay={0.1 + i * 0.08} className="h-full">
            <article className="flex h-full flex-col rounded-2xl border border-border bg-card/40 p-7 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-or/85 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="h-px w-6 bg-or/40 shrink-0" aria-hidden />
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-or/85">
                  {m.eyebrow[locale]}
                </span>
              </div>
              <p className="iq-body text-foreground-dim leading-relaxed flex-1">
                {m.body[locale]}
              </p>
            </article>
          </FadeInOnScroll>
        ))}
      </div>

      {/* L'APOGÉE EN LANGAGE HUMAIN — frise 3 états, reliés par un fil (timeline) */}
      <div className="mt-20 max-w-5xl mx-auto">
        <FadeInOnScroll>
          <div className="text-center mb-12">
            <div className="iq-eyebrow mb-4">
              {t(
                'L’APOGÉE, EN LANGAGE HUMAIN',
                'THE DRINKING WINDOW, IN PLAIN WORDS',
              )}
            </div>
            <h3 className="iq-h2 italic">
              {t(
                'Trois états. Un seul verdict clair.',
                'Three states. One clear verdict.',
              )}
            </h3>
          </div>
        </FadeInOnScroll>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Fil reliant les 3 cartes — timeline (desktop) */}
          <span
            className="hidden md:block absolute top-[34px] left-[16.66%] right-[16.66%] h-px bg-or/40"
            aria-hidden
          />
          {APOGEE_STATES.map((s, i) => (
            <FadeInOnScroll key={i} delay={0.1 + i * 0.1} className="h-full">
              <article className="relative flex h-full flex-col rounded-2xl border border-border bg-card/40 p-7 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-or/85 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="h-px w-6 bg-or/40 shrink-0" aria-hidden />
                  <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-or/85">
                    {s.label[locale]}
                  </span>
                </div>
                <p className="iq-body text-foreground-dim leading-relaxed flex-1">
                  {s.body[locale]}
                </p>
              </article>
            </FadeInOnScroll>
          ))}
        </div>

        <FadeInOnScroll delay={0.36}>
          <p className="mt-10 text-center iq-body text-foreground-dim max-w-2xl mx-auto leading-relaxed">
            {t(
              'Et quand une grande bouteille approche de sa limite, Octave vous le dit — avant qu’il soit trop tard.',
              'And when a great bottle nears its limit, Octave tells you — before it’s too late.',
            )}
          </p>
        </FadeInOnScroll>
      </div>

      <FadeInOnScroll delay={0.3}>
        <p className="mt-14 text-center font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl text-or max-w-3xl mx-auto leading-relaxed">
          {t(
            'La tranquillité de toujours savoir. Octave apprend votre palais et veille sur l’apogée de chaque bouteille — pour que les grands soirs soient à la hauteur.',
            'The peace of mind of always knowing. Octave learns your palate and watches over the drinking window of every bottle — so the great nights live up to them.',
          )}
        </p>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.38}>
        <div className="mt-12 flex justify-center">
          <a
            href={buildSignupUrl('moments-enjeu', { lang: locale })}
            onClick={() =>
              track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'moments-enjeu' })
            }
          >
            <Button variant="cta" size="lg">
              {t('Rencontrer Octave', 'Meet Octave')}
              <ArrowRight size={16} strokeWidth={1.75} />
            </Button>
          </a>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
