'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { PILLARS, pillarBySlug, type PillarSlug } from './pillar-data';

/**
 * PillarPage — Experience 2.0. Chaque pilier devient une DESTINATION premium :
 * hero (chapitre) → 3 temps → clôture → CTA → les autres chapitres (continuité).
 * Piloté par pillar-data.ts (FR/EN). Octave a sa page dédiée (/sommelier-ia).
 */
export default function PillarPage({ slug }: { slug: PillarSlug }) {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const p = pillarBySlug(slug);
  if (!p) return null;
  const others = PILLARS.filter((x) => x.slug !== slug);

  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-[radial-gradient(ellipse_65%_70%_at_50%_0%,rgba(217,182,103,0.08),transparent_70%)]"
      />

      {/* Hero du chapitre */}
      <section className="relative px-6 pt-32 sm:pt-40 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/#piliers"
            className="mb-8 inline-flex items-center gap-2 font-body text-[13px] text-foreground-dim transition-colors hover:text-or"
          >
            <ArrowLeft size={15} strokeWidth={1.75} aria-hidden />
            {t('Les piliers', 'The pillars')}
          </Link>
          <div className="flex items-center justify-center gap-4">
            <span className="font-[family-name:var(--font-display)] text-4xl leading-none text-or/40 tabular-nums">
              {p.num}
            </span>
            <span className="h-px w-10 bg-or/30" aria-hidden />
            <span className="iq-eyebrow">{p.name[locale]}</span>
          </div>
          <h1 className="iq-h1 italic mt-6">{p.title[locale]}</h1>
          <p className="iq-lead mx-auto mt-6 max-w-2xl">{p.lead[locale]}</p>
        </div>
      </section>

      {/* 3 temps */}
      <section className="relative px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3 md:gap-8">
          {p.beats.map((bt, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="flex items-center justify-center gap-3 md:justify-start">
                <span className="font-body text-[11px] tracking-[0.28em] text-or/85 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="h-px w-6 bg-or/40" aria-hidden />
              </div>
              <h3 className="iq-h4 italic mt-4">{bt.title[locale]}</h3>
              <p className="iq-body mt-3 leading-relaxed text-foreground-dim">{bt.body[locale]}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-16 max-w-2xl text-center font-[family-name:var(--font-display)] text-xl italic leading-relaxed text-or sm:text-2xl">
          {p.closer[locale]}
        </p>
      </section>

      {/* CTA */}
      <section className="relative px-6 pb-8 text-center">
        <a
          href={buildSignupUrl(`pilier-${slug}`, { lang: locale })}
          onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: `pilier-${slug}` })}
        >
          <Button variant="cta" size="lg">
            {t('Rencontrer Octave', 'Meet Octave')}
            <ArrowRight size={16} strokeWidth={1.75} />
          </Button>
        </a>
      </section>

      {/* Les autres chapitres — continuité de l'histoire */}
      <section className="section-breathe relative px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="iq-eyebrow mb-8 text-center">
            {t('Les autres chapitres', 'The other chapters')}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={o.href}
                className="group rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-or/40"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-[family-name:var(--font-display)] text-2xl text-or/40 tabular-nums">
                    {o.num}
                  </span>
                  <span className="iq-eyebrow-mute">{o.emotion[locale]}</span>
                </div>
                <h3 className="iq-h4 italic mt-2">{o.name[locale]}</h3>
                <p className="iq-small mt-2 text-foreground-dim">{o.title[locale]}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-body text-[13px] text-or transition-transform duration-300 group-hover:translate-x-1">
                  {t('Découvrir', 'Discover')}
                  <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
