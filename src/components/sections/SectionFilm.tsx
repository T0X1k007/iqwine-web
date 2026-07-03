'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import FilmPlayer from '@/components/film/FilmPlayer';
import { useLocale } from '@/lib/i18n';

/**
 * SectionFilm (#film) — Experience 2.0. Le film de marque devient la pièce
 * maîtresse : juste après le Hero (mvt #2), une bande cinémascope qui joue le
 * teaser (12 s, muet, boucle) et invite au film complet sur /le-film.
 */
export default function SectionFilm() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <SectionWrapper id="film" rhythm="editorial" className="section-breathe">
      <FadeInOnScroll>
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <div className="iq-eyebrow mb-5">{t('Le film', 'The film')}</div>
          <h2 className="iq-h1 italic">
            {t('Une minute pour comprendre.', 'One minute to understand.')}
          </h2>
          <p className="iq-lead mx-auto mt-6 max-w-2xl">
            {t(
              'Ce que change une cave qui se souvient — et un sommelier qui vous connaît, du premier verre au dernier.',
              'What changes when your cellar remembers — and a sommelier who knows you, from the first glass to the last.',
            )}
          </p>
        </div>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.15}>
        <Link
          href="/le-film"
          aria-label={t('Voir le film iQWine', 'Watch the iQWine film')}
          className="group relative mx-auto block max-w-5xl overflow-hidden rounded-[20px] border border-or/15 shadow-[0_50px_140px_-50px_rgba(0,0,0,0.8)] ring-1 ring-white/5 transition-colors duration-500 hover:border-or/35"
        >
          {/* halo champagne au survol */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
            style={{
              background: 'radial-gradient(50% 50% at 50% 50%, rgba(217,182,103,0.18), transparent 70%)',
            }}
          />
          <div className="aspect-[1280/588] w-full">
            <FilmPlayer variant="teaser" src="/video/film-teaser.mp4" poster="/video/film-iqwine-poster.jpg" />
          </div>
          {/* voile bas + bouton lecture */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-background/85 via-background/10 to-transparent px-5 py-5 sm:px-8 sm:py-7">
            <span className="font-[family-name:var(--font-display)] text-lg italic text-foreground sm:text-2xl">
              iQWine — {t('le film', 'the film')}
            </span>
            <span className="inline-flex items-center gap-2 rounded-pill bg-or px-5 py-2.5 text-[13px] font-medium tracking-[0.02em] text-on-gold shadow-lg transition-transform duration-300 group-hover:scale-[1.04]">
              <Play size={13} strokeWidth={2} fill="currentColor" aria-hidden />
              {t('Voir le film', 'Watch the film')}
            </span>
          </div>
        </Link>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
