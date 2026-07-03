'use client';

import { ArrowRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale, type Locale } from '@/lib/i18n';

/**
 * SectionPiliers (#piliers) — « Les grands piliers » (VISUAL 2.0, 9 mouvements).
 * Octave · Apogée · Recherche · Recevoir. Chaque pilier est un CHAPITRE, pas une
 * carte : grand numéral, nom Cormorant, émotion, lumière champagne alternée
 * (rythme), et un lien « Découvrir » — l'entrée naturelle vers les futures
 * landing pages (/octave, /apogee, /recherche, /recevoir).
 *
 * hrefs = ancres Home pour l'instant (contenu déjà présent, zéro lien mort) ;
 * ils deviendront les routes landing dédiées quand elles seront construites.
 */

type L = Record<Locale, string>;
type Pilier = {
  num: string;
  href: string; // futur: /octave /apogee /recherche /recevoir
  emotion: L;
  name: L;
  tagline: L;
  line: L;
};

const PILIERS: Pilier[] = [
  {
    num: 'I',
    href: '#demo', // futur /octave
    emotion: { fr: 'Confiance', en: 'Trust' },
    name: { fr: 'Octave', en: 'Octave' },
    tagline: { fr: 'Le sommelier qui vous connaît.', en: 'The sommelier who knows you.' },
    line: {
      fr: 'Plus vous l’utilisez, plus il connaît votre palais.',
      en: 'The more you use it, the more it knows your palate.',
    },
  },
  {
    num: 'II',
    href: '#moments-enjeu', // futur /apogee
    emotion: { fr: 'Anticipation', en: 'Anticipation' },
    name: { fr: 'Apogée', en: 'Peak' },
    tagline: { fr: 'Chaque bouteille à son sommet.', en: 'Every bottle at its peak.' },
    line: {
      fr: 'Octave veille — vous ne manquez plus le moment.',
      en: 'Octave watches over it — you never miss the moment.',
    },
  },
  {
    num: 'III',
    href: '#saq', // futur /recherche
    emotion: { fr: 'Assurance', en: 'Assurance' },
    name: { fr: 'Recherche', en: 'Search' },
    tagline: { fr: 'De votre cave, ou près de vous.', en: 'From your cellar, or near you.' },
    line: {
      fr: 'La bonne bouteille, vérifiée magasin par magasin.',
      en: 'The right bottle, verified store by store.',
    },
  },
  {
    num: 'IV',
    href: '#trois-moments', // futur /recevoir
    emotion: { fr: 'Convivialité', en: 'Conviviality' },
    name: { fr: 'Recevoir', en: 'Hosting' },
    tagline: { fr: 'Chaque repas, son fil de vins.', en: 'Every meal, its thread of wines.' },
    line: {
      fr: 'Octave compose la séquence de votre soirée.',
      en: 'Octave composes the sequence of your evening.',
    },
  },
];

export default function SectionPiliers() {
  const { locale } = useLocale();

  return (
    <SectionWrapper id="piliers" withDivider rhythm="editorial">
      <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
        <FadeInOnScroll>
          <div className="iq-eyebrow mb-5">
            {locale === 'fr' ? 'Les grands piliers' : 'The pillars'}
          </div>
          <h2 className="iq-h1 italic">
            {locale === 'fr'
              ? 'Quatre chapitres, un seul sommelier.'
              : 'Four chapters, one sommelier.'}
          </h2>
        </FadeInOnScroll>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-16 sm:gap-24">
        {PILIERS.map((p, i) => (
          <FadeInOnScroll key={p.num} delay={0.06 * i}>
            <a href={p.href} className="group relative block text-center max-w-2xl mx-auto">
              {/* Lumière du chapitre — halo champagne centré, s'intensifie au survol */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[340px] w-[560px] max-w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[100px] transition-opacity duration-500 group-hover:opacity-90"
                style={{
                  background:
                    'radial-gradient(50% 50% at 50% 50%, rgba(217,182,103,0.16), transparent 70%)',
                }}
              />

              {/* Numéral + nom du chapitre — centrés */}
              <span className="block font-[family-name:var(--font-display)] text-5xl sm:text-6xl leading-none text-or/40 tabular-nums">
                {p.num}
              </span>
              <h3 className="iq-h2 italic mt-3">{p.name[locale]}</h3>
              <span className="mx-auto mt-6 block h-px w-12 bg-or/30" aria-hidden />

              {/* Émotion + tagline + line + lien — centrés */}
              <div className="iq-eyebrow mt-6 mb-4">{p.emotion[locale]}</div>
              <p className="iq-lead">{p.tagline[locale]}</p>
              <p className="mt-3 iq-body text-foreground-dim max-w-md mx-auto">
                {p.line[locale]}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-body text-[13px] font-medium tracking-[0.02em] text-or transition-transform duration-300 group-hover:translate-x-1">
                {locale === 'fr' ? 'Découvrir' : 'Discover'}
                <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
              </span>
            </a>
          </FadeInOnScroll>
        ))}
      </div>
    </SectionWrapper>
  );
}
