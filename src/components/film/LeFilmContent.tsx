'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import FilmPlayer from '@/components/film/FilmPlayer';
import Button from '@/components/ui/Button';
import { useLocale, type Locale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/** Les 7 scènes du film = les chapitres produit. */
const CHAPTERS: { num: string; label: Record<Locale, string> }[] = [
  { num: '01', label: { fr: 'L’ouverture', en: 'The pour' } },
  { num: '02', label: { fr: 'Le sommelier', en: 'The sommelier' } },
  { num: '03', label: { fr: 'L’apogée', en: 'The peak' } },
  { num: '04', label: { fr: 'La recherche', en: 'The search' } },
  { num: '05', label: { fr: 'Au restaurant', en: 'At the restaurant' } },
  { num: '06', label: { fr: 'Recevoir', en: 'Hosting' } },
  { num: '07', label: { fr: 'iQWine', en: 'iQWine' } },
];

export default function LeFilmContent() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(ellipse_70%_70%_at_50%_0%,rgba(217,182,103,0.08),transparent_70%)]"
      />

      <section className="relative px-6 pb-10 pt-32 sm:pt-40 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 font-body text-[13px] text-foreground-dim transition-colors hover:text-or"
          >
            <ArrowLeft size={15} strokeWidth={1.75} aria-hidden />
            {t('Retour', 'Back')}
          </Link>
          <div className="iq-eyebrow mb-5">{t('Le film', 'The film')}</div>
          <h1 className="iq-h1 italic">{t('iQWine, en une minute.', 'iQWine, in one minute.')}</h1>
          <p className="iq-lead mx-auto mt-6 max-w-2xl">
            {t(
              'Sept chapitres, un seul sommelier. Du verre que l’on ouvre au bon moment à la carte que l’on déchiffre au restaurant.',
              'Seven chapters, one sommelier. From the glass opened at the right moment to the wine list you decode at the restaurant.',
            )}
          </p>
        </div>
      </section>

      {/* Le film complet */}
      <section className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[20px] border border-or/15 shadow-[0_60px_160px_-50px_rgba(0,0,0,0.85)] ring-1 ring-white/5">
          <div className="aspect-[1280/588] w-full">
            <FilmPlayer variant="full" src="/video/film-iqwine.mp4" poster="/video/film-iqwine-poster.jpg" />
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {CHAPTERS.map((c) => (
            <span
              key={c.num}
              className="inline-flex items-baseline gap-2 font-body text-[12px] tracking-[0.04em] text-foreground-dim"
            >
              <span className="tabular-nums text-or/70">{c.num}</span>
              {c.label[locale]}
            </span>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="relative px-6 py-24 text-center lg:py-32">
        <p className="mx-auto max-w-2xl font-[family-name:var(--font-display)] text-2xl italic leading-relaxed text-or sm:text-3xl">
          {t('Votre cave. Votre palais. Votre sommelier.', 'Your cellar. Your palate. Your sommelier.')}
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href={buildSignupUrl('le-film', { lang: locale })}
            onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'le-film' })}
          >
            <Button variant="cta" size="lg">
              {t('Commencez votre essai gratuit', 'Start your free trial')}
              <ArrowRight size={16} strokeWidth={1.75} />
            </Button>
          </a>
        </div>
      </section>
    </main>
  );
}
