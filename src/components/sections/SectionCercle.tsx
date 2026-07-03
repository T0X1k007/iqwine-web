'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import ShareButton from '@/components/ui/ShareButton';
import { useLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

/**
 * SectionCercle (#cercle) — V2.5, la couche APPARTENANCE.
 *
 * Couche ADDITIVE d'appartenance, pas un badge. On ne touche PAS au signal
 * « Membres du programme bêta iQWine » (qui vit dans SectionConfiance). Ici on
 * raconte ce que les membres partagent : vivre AVEC une cave qui se souvient.
 * Trois piliers — l'hôte, le collectionneur, la culture du vin.
 *
 * Ton premium, sobre. Pas de fausse rareté, pas de « programme fondateur ».
 */

type Pilier = {
  eyebrow: Record<Locale, string>;
  title: Record<Locale, string>;
  body: Record<Locale, string>;
};

const PILIERS: Pilier[] = [
  {
    eyebrow: { fr: 'L’HÔTE', en: 'THE HOST' },
    title: { fr: 'Recevoir', en: 'Hosting' },
    body: {
      fr: 'Recevoir n’est pas servir un verre. C’est choisir le bon, pour les bonnes personnes.',
      en: 'Hosting isn’t pouring a glass. It’s choosing the right one, for the right people.',
    },
  },
  {
    eyebrow: { fr: 'LE COLLECTIONNEUR', en: 'THE COLLECTOR' },
    title: { fr: 'Transmettre', en: 'Passing it on' },
    body: {
      fr: 'Une cave qui se transmet, des bouteilles ouvertes au bon moment.',
      en: 'A cellar that passes on, bottles opened at exactly the right moment.',
    },
  },
  {
    eyebrow: { fr: 'LA CULTURE', en: 'THE CULTURE' },
    title: { fr: 'Vivre le vin', en: 'Living wine' },
    body: {
      fr: 'Le vin se vit, il ne se gère pas. Le plaisir d’abord, l’inventaire jamais.',
      en: 'Wine is lived, not managed. Pleasure first, inventory never.',
    },
  },
];

export default function SectionCercle() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <SectionWrapper id="cercle" withDivider rhythm="editorial" className="section-breathe">
      <div className="max-w-3xl mx-auto text-center">
        <FadeInOnScroll>
          <div className="iq-eyebrow mb-5">
            {t('LE CERCLE IQWINE', 'THE IQWINE CIRCLE')}
          </div>
          <h2 className="iq-h1 italic">
            {t(
              'Vivre avec une cave qui se souvient.',
              'Living with a cellar that remembers.',
            )}
          </h2>
          <p className="iq-lead mt-6">
            {t(
              'Les membres d’iQWine partagent une conviction : une bonne bouteille n’est jamais juste un achat, c’est un moment qu’on prépare. Ils ne possèdent pas une cave — ils vivent avec elle. Une cave qui se souvient de ce qu’ils aiment, qui sait quand ouvrir, et qui fait d’eux l’hôte qui sait toujours quoi ouvrir.',
              'iQWine members share a conviction: a good bottle is never just a purchase, it’s a moment you prepare for. They don’t own a cellar — they live with it. A cellar that remembers what they love, that knows when to open, and that makes them the host who always knows what to open.',
            )}
          </p>
        </FadeInOnScroll>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
        {PILIERS.map((p, i) => (
          <FadeInOnScroll key={i} delay={0.1 + i * 0.1} className="h-full">
            <article className="flex h-full flex-col rounded-2xl border border-border bg-card/40 p-7 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-6 bg-or/40 shrink-0" aria-hidden />
                <span className="font-body text-[10px] tracking-[0.28em] uppercase text-or/85">
                  {p.eyebrow[locale]}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] italic text-2xl text-foreground leading-snug mb-4 tracking-[-0.01em]">
                {p.title[locale]}
              </h3>
              <p className="iq-body text-foreground-dim leading-relaxed flex-1">
                {p.body[locale]}
              </p>
            </article>
          </FadeInOnScroll>
        ))}
      </div>

      <FadeInOnScroll delay={0.2}>
        <p className="mt-12 text-center font-body text-[11px] tracking-[0.18em] uppercase text-foreground-faint">
          {t(
            'Ce cercle existe déjà. Pour l’instant, on l’appelle le programme bêta.',
            'This circle already exists. For now, we call it the beta program.',
          )}
        </p>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.25}>
        <div className="mt-16 flex flex-col items-center text-center">
          <p className="iq-body text-foreground">
            {t(
              'Faites découvrir Octave à quelqu’un qui aime le vin.',
              'Introduce Octave to someone who loves wine.',
            )}
          </p>
          <p className="iq-body text-foreground-dim mt-1.5">
            {t('Comme on tend un verre.', 'Like passing a glass.')}
          </p>
          <div className="mt-6">
            <ShareButton source="cercle" />
          </div>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
