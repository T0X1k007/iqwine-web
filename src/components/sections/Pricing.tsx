'use client';

import { ArrowRight, Check } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { APP_SIGNUP_URL } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { PLANS, formatPriceCad, type PlanId } from '@/lib/plans';

/**
 * Tarification — 3 forfaits commerciaux définitifs (lit la SOT src/lib/plans.ts).
 * Standard / Pro (recommandé) / Expert (ancrage). Mensuel. « recommandations IA »
 * + « utilisateurs » uniquement — jamais tokens/crédits/API. 14 j d'essai, sans carte.
 */

interface PlanCopy {
  name: string;
  tagline: Record<Locale, string>;
  features: Array<Record<Locale, string>>;
}

const COPY: Record<PlanId, PlanCopy> = {
  standard: {
    name: 'Standard',
    tagline: {
      fr: 'Pour boire mieux, chaque soir.',
      en: 'To drink better, every night.',
    },
    features: [
      { fr: 'Sommelier IA', en: 'AI sommelier' },
      { fr: 'Disponibilités SAQ en temps réel', en: 'Live SAQ availability' },
      { fr: 'Ma cave', en: 'My cellar' },
      { fr: 'Historique des accords', en: 'Pairing history' },
      { fr: 'Scan d’étiquette', en: 'Label scan' },
    ],
  },
  pro: {
    name: 'Pro',
    tagline: {
      fr: 'Pour le passionné et son foyer.',
      en: 'For the enthusiast and their household.',
    },
    features: [
      { fr: 'Tout du forfait Standard', en: 'Everything in Standard' },
      { fr: 'Profil de goût avancé', en: 'Advanced taste profile' },
      { fr: 'Apprentissage du palais', en: 'Palate learning' },
      { fr: 'Recommandations Cave + SAQ + Les deux', en: 'Cellar + SAQ + Both recommendations' },
    ],
  },
  expert: {
    name: 'Expert',
    tagline: {
      fr: 'Pour la cave familiale et l’usage intensif.',
      en: 'For the family cellar and heavy use.',
    },
    features: [
      { fr: 'Tout du forfait Pro', en: 'Everything in Pro' },
      { fr: 'Usage intensif', en: 'Heavy usage' },
      { fr: 'Cave familiale', en: 'Family cellar' },
      { fr: 'Priorité IA', en: 'AI priority' },
    ],
  },
};

export default function Pricing() {
  const { locale } = useLocale();

  return (
    <SectionWrapper id="pricing" tone="light" withDivider rhythm="editorial">
      <FadeInOnScroll>
        <div className="text-center mb-16 sm:mb-20">
          <div className="iq-eyebrow mb-6">
            {locale === 'fr' ? 'Tarification' : 'Pricing'}
          </div>
          <h2 className="iq-display italic max-w-3xl mx-auto">
            {locale === 'fr' ? 'Trois entrées dans le cercle.' : 'Three paths into the circle.'}
          </h2>
          <p className="iq-lead mt-6 max-w-2xl mx-auto">
            {locale === 'fr'
              ? '14 jours offerts, sans engagement. Aucune carte demandée.'
              : '14 days on the house, no strings. No card required.'}
          </p>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 max-w-6xl mx-auto items-stretch">
        {PLANS.map((plan, i) => (
          <FadeInOnScroll key={plan.id} delay={0.12 + i * 0.1} className="h-full">
            <PlanCard plan={plan} locale={locale} />
          </FadeInOnScroll>
        ))}
      </div>

      <FadeInOnScroll delay={0.5}>
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-foreground-faint leading-relaxed">
            {locale === 'fr'
              ? '14 jours gratuits · Aucune carte requise · TPS et TVQ en sus'
              : '14 free days · No credit card · GST/QST extra'}
          </p>
          <p className="mt-8 font-[family-name:var(--font-display)] italic text-or text-lg sm:text-xl leading-relaxed">
            {locale === 'fr'
              ? '« Le prix d’une bonne bouteille, pour boire juste toute l’année. »'
              : '"The price of one fine bottle, to drink right all year."'}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}

/* ───────────────────────── plan card ───────────────────────── */

function PlanCard({
  plan,
  locale,
}: {
  plan: (typeof PLANS)[number];
  locale: Locale;
}) {
  const copy = COPY[plan.id];
  const highlight = plan.highlight ?? false;
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl p-8 sm:p-9 transition-colors duration-[160ms] ${
        highlight
          ? 'bg-card border border-or/40 shadow-[0_0_0_1px_rgba(184,146,74,0.35),0_20px_56px_rgba(33,27,23,0.14)]'
          : 'bg-card border border-border-strong'
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-2 rounded-full bg-or px-4 py-1 font-mono text-[10px] font-medium tracking-[0.22em] uppercase text-on-gold">
            {t('Recommandé', 'Recommended')}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl text-foreground mb-2 tracking-[-0.01em]">
          {copy.name}
        </h3>
        <p className="iq-small text-foreground-dim">{copy.tagline[locale]}</p>
      </div>

      {/* Prix mensuel — headline */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-[family-name:var(--font-display)] italic text-[56px] sm:text-[68px] text-or leading-none tracking-[-0.025em] tabular-nums">
          {formatPriceCad(plan.priceMonthlyCents, locale)}
        </span>
        <span className="text-foreground-faint font-mono text-[11px] tracking-[0.18em] uppercase">$ CAD</span>
      </div>
      <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-5">
        {t('/ mois', '/ month')}
      </p>

      {/* Ce qui est inclus — recommandations IA + utilisateurs (jamais tokens) */}
      <div className="rounded-lg border border-border bg-sunk px-4 py-3 mb-7">
        <p className="text-foreground text-(length:--text-body-sm) leading-snug">
          <span className="tabular-nums font-medium">{plan.monthlyRecommendations}</span>{' '}
          {t('recommandations IA / mois', 'AI recommendations / month')}
        </p>
        <p className="text-foreground-dim text-(length:--text-body-sm) leading-snug mt-1">
          <span className="tabular-nums font-medium">{plan.includedUsers}</span>{' '}
          {plan.includedUsers > 1 ? t('utilisateurs inclus', 'users included') : t('utilisateur', 'user')}
        </p>
      </div>

      <ul className="flex flex-col gap-3.5 mb-9 flex-1">
        {copy.features.map((feature) => (
          <li key={feature[locale]} className="flex items-start gap-3">
            <Check
              size={16}
              strokeWidth={2}
              className={`flex-shrink-0 mt-0.5 ${highlight ? 'text-or' : 'text-or/75'}`}
            />
            <span className="iq-small text-foreground-dim leading-snug">{feature[locale]}</span>
          </li>
        ))}
      </ul>

      <a
        href={APP_SIGNUP_URL}
        onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'pricing' })}
        className="block mt-auto"
      >
        <Button variant={highlight ? 'cta' : 'secondary'} size="lg" className="w-full">
          {t('Commencer — sans carte', 'Start free — no card')}
          <ArrowRight size={16} strokeWidth={1.75} />
        </Button>
      </a>
    </div>
  );
}
