'use client';

import type { ReactNode } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import Button from '@/components/ui/Button';
import ScreenshotFrame from '@/components/screenshot/ScreenshotFrame';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * SectionSaq (#saq) — le moat disponibilité locale renforcé. Octave ne
 * recommande pas dans le vide : si le vin n'est pas dans votre cave, il sait où
 * le trouver, en tablette, au point de vente le plus proche, ce soir.
 * Disponibilités locales vérifiées, magasin par magasin — le différenciateur
 * que personne d'autre ne réunit.
 */

export default function SectionSaq() {
  const { locale } = useLocale();
  const t = <T extends ReactNode>(fr: T, en: T) => (locale === 'fr' ? fr : en);

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
              "Octave ne se contente pas de recommander un vin. S'il n'est pas dans votre cave, il sait où le trouver : la bonne bouteille, en tablette, au point de vente le plus proche — et si elle est disponible ce soir.",
              'Octave doesn’t just recommend a wine. If it isn’t in your cellar, it knows where to find it: the right bottle, on the shelf, at the nearest store — and whether it’s available tonight.',
            )}
          </p>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.12}>
          <p className="iq-body mt-6 text-foreground-dim">
            {t(
              'Disponibilités locales vérifiées, magasin par magasin, partout au Québec. Vous ne partez plus à l’aveugle : vous savez avant même de sortir.',
              'Local availability, verified store by store, across Québec. You no longer head out blind: you know before you even leave.',
            )}
          </p>
          <p className="mt-4 font-mono text-[10px] tracking-[0.22em] uppercase text-foreground-faint">
            {t(
              <>Un réseau de points de vente, partout au Québec</>,
              <>A network of stores, across Québec</>,
            )}
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
                'Octave trouve la bouteille en tablette, près de vous',
                'Octave finds the bottle on the shelf, near you',
              )}
              width={264}
              frame="iphone"
              glow
              rotation={-2}
            />
          </div>

          {/* Artefact : point de vente réel + statut de disponibilité (sans
              quantité exacte ni horodatage — la dispo est best-effort). Le
              point animé reste un décor visuel, pas une promesse temps réel. */}
          <div className="mt-7 flex justify-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-or/20 bg-or/[0.05] px-4 py-2 font-mono text-[11px] tracking-[0.06em] text-foreground/80">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-or/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-or" />
              </span>
              <span>
                {t(
                  <>Point de vente · Outremont · Disponible en tablette</>,
                  <>Store · Outremont · In stock in-store</>,
                )}
              </span>
            </div>
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.3}>
          {/* Démo chiffrée, présentée comme une réponse d'Octave (italique or). */}
          <figure className="mt-12 mx-auto max-w-2xl rounded-2xl border border-or/15 bg-or/[0.03] p-7 text-left">
            <figcaption className="font-mono text-[10px] tracking-[0.18em] uppercase text-or mb-3 inline-flex items-center gap-2">
              <Sparkles size={13} strokeWidth={2} aria-hidden />
              {t('Octave répond', 'Octave answers')}
            </figcaption>
            <blockquote className="font-[family-name:var(--font-display)] italic text-or text-lg sm:text-xl leading-relaxed">
              {t(
                <>
                  « Près de vous, le Guigal Côtes-du-Rhône à{' '}
                  <span className="tabular-nums not-italic">24,50 $</span> est en
                  tablette — charnu, épicé, parfait ce soir. »
                </>,
                <>
                  “Near you, the Guigal Côtes-du-Rhône at{' '}
                  <span className="tabular-nums not-italic">$24.50</span> is on the
                  shelf — fleshy, spiced, perfect tonight.”
                </>,
              )}
            </blockquote>
          </figure>

          {/* Non-copiabilité : le « pourquoi personne d'autre ». Sobre, factuel. */}
          <p className="iq-body mt-8 mx-auto max-w-2xl text-foreground-dim">
            {t(
              'Aucune app étrangère ne sait ce qui est disponible près de vous, magasin par magasin.',
              'No foreign app knows what’s available near you, store by store.',
            )}
          </p>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.34}>
          <div className="mt-10">
            <a
              href={buildSignupUrl('saq', { lang: locale })}
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
