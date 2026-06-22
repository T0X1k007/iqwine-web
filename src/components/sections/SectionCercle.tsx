'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
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
      fr: 'Recevez, et faites dire à vos invités : « Tu t’y connais. »',
      en: 'Host, and have your guests say: “You really know your wine.”',
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
    title: { fr: 'Partager', en: 'Sharing' },
    body: {
      fr: 'Le plaisir du vin, partagé — pas une corvée de gestion.',
      en: 'The pleasure of wine, shared — not a chore of inventory.',
    },
  },
];

export default function SectionCercle() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <SectionWrapper id="cercle" withDivider rhythm="editorial">
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
              'Les membres d’iQWine partagent quelque chose. Ils ne possèdent pas simplement une cave — ils vivent avec elle. Une cave qui se souvient de ce qu’ils aiment, qui sait quand ouvrir, et qui fait d’eux l’hôte qui ne se trompe jamais.',
              'iQWine members share something. They don’t simply own a cellar — they live with it. A cellar that remembers what they love, that knows when to open, and that makes them the host who never gets it wrong.',
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
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-or/85">
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
    </SectionWrapper>
  );
}
