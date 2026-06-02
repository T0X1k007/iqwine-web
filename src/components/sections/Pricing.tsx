'use client';

import { ArrowRight, Check } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { APP_SIGNUP_URL } from '@/lib/constants';

/**
 * Pricing V4 — adapté du layout etude.iqforge.ca (Solo / Famille).
 *
 * 2 plans côte à côte. Pro porte le badge "Plus populaire". CTA partout
 * "Demander l'accès" — jamais "Acheter maintenant" (ton premium calme
 * invitation privée, pas e-commerce). Scroll smooth vers #beta.
 *
 * 14 jours gratuits / aucune carte / TPS+TVQ en sus.
 *
 * Pas de "Free tier" public — l'accès gratuit est implicite aux 14 jours.
 * Volontairement court et lisible : un collectionneur ne lit pas une
 * matrice de fonctionnalités, il lit une carte de vin.
 */

type PlanId = 'standard' | 'pro';

interface Plan {
  id: PlanId;
  name: Record<Locale, string>;
  tagline: Record<Locale, string>;
  price: number;
  priceMonthly: number;
  period: Record<Locale, string>;
  periodMonthly: Record<Locale, string>;
  features: Array<Record<Locale, string>>;
  highlight?: boolean;
  ctaHref: string;
}

const PLANS: Plan[] = [
  {
    id: 'standard',
    name: { fr: 'Standard', en: 'Standard' },
    tagline: {
      fr: 'Pour la cave attentive du quotidien.',
      en: 'For the attentive everyday cellar.',
    },
    price: 149,
    priceMonthly: 14.95,
    period: { fr: '/ an', en: '/ year' },
    periodMonthly: { fr: '/ mois', en: '/ month' },
    features: [
      {
        fr: 'Jusqu\'à 500 bouteilles',
        en: 'Up to 500 bottles',
      },
      {
        fr: 'Sommelier privé · Mode Tonight (5/jour)',
        en: 'Private sommelier · Tonight mode (5/day)',
      },
      {
        fr: 'Scan d\'étiquettes IA · 20/mois',
        en: 'AI label scanning · 20/month',
      },
      {
        fr: 'Carnet de dégustation illimité',
        en: 'Unlimited tasting journal',
      },
      {
        fr: 'Suivi d\'apogée · alertes plateau',
        en: 'Drinking window tracking · plateau alerts',
      },
      {
        fr: 'Synchronisation iCloud chiffrée',
        en: 'Encrypted iCloud sync',
      },
    ],
    ctaHref: '#beta',
  },
  {
    id: 'pro',
    name: { fr: 'Pro', en: 'Pro' },
    tagline: {
      fr: 'Pour le collectionneur sérieux et son sommelier.',
      en: 'For the serious collector and their sommelier.',
    },
    price: 299,
    priceMonthly: 29.99,
    period: { fr: '/ an', en: '/ year' },
    periodMonthly: { fr: '/ mois', en: '/ month' },
    features: [
      {
        fr: 'Tout du plan Standard',
        en: 'Everything in Standard',
      },
      {
        fr: 'Capacité illimitée · multi-cave',
        en: 'Unlimited capacity · multi-cellar',
      },
      {
        fr: 'Mode Tonight illimité · Mode Restaurant',
        en: 'Unlimited Tonight · Restaurant mode',
      },
      {
        fr: 'Scan d\'étiquettes illimité',
        en: 'Unlimited label scanning',
      },
      {
        fr: 'Calibration profonde du palais',
        en: 'Deep palate calibration',
      },
      {
        fr: 'Accès à la cave d\'un sommelier dédié',
        en: 'Dedicated sommelier access',
      },
      {
        fr: 'Onboarding privé · support prioritaire',
        en: 'Private onboarding · priority support',
      },
    ],
    highlight: true,
    ctaHref: '#beta',
  },
];

export default function Pricing() {
  const { locale } = useLocale();

  return (
    <SectionWrapper id="pricing" withDivider rhythm="editorial">
      <FadeInOnScroll>
        <div className="text-center mb-16 sm:mb-20">
          <div className="iq-eyebrow mb-6">
            {locale === 'fr' ? 'Tarification' : 'Pricing'}
          </div>
          <h2 className="iq-display italic max-w-3xl mx-auto">
            {locale === 'fr'
              ? 'Deux entrées dans le cercle.'
              : 'Two paths into the circle.'}
          </h2>
          <p className="iq-lead mt-6 max-w-2xl mx-auto">
            {locale === 'fr'
              ? '14 jours offerts, sans engagement. Aucune carte demandée.'
              : '14 days on the house, no strings. No card required.'}
          </p>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {PLANS.map((plan, i) => (
          <FadeInOnScroll key={plan.id} delay={0.15 + i * 0.12}>
            <PlanCard plan={plan} locale={locale} />
          </FadeInOnScroll>
        ))}
      </div>

      <FadeInOnScroll delay={0.5}>
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-foreground-faint leading-relaxed">
            {locale === 'fr'
              ? '14 jours gratuits · Aucune carte requise · TPS et TVQ en sus · Paiement par virement Interac'
              : '14 free days · No credit card · GST/QST extra · Interac payment'}
          </p>
          <p className="mt-8 font-[family-name:var(--font-display)] italic text-or/85 text-lg sm:text-xl leading-relaxed">
            {locale === 'fr'
              ? '« Le prix d\'une bonne bouteille, pour préserver toute votre cave. »'
              : '"The price of one fine bottle, to honor your whole cellar."'}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}

/* ───────────────────────── plan card ───────────────────────── */

function PlanCard({ plan, locale }: { plan: Plan; locale: Locale }) {
  const highlight = plan.highlight ?? false;
  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl p-8 sm:p-10 transition-colors duration-[160ms] ${
        highlight
          ? 'bg-card border border-or/40 shadow-[0_0_0_1px_rgba(212,165,72,0.16),0_24px_64px_rgba(0,0,0,0.36)]'
          : 'bg-card border border-border-strong'
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-2 rounded-full bg-or px-4 py-1 font-mono text-[10px] font-medium tracking-[0.22em] uppercase text-primary-foreground">
            {locale === 'fr' ? 'Plus populaire' : 'Most popular'}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl text-foreground mb-2 tracking-[-0.01em]">
          {plan.name[locale]}
        </h3>
        <p className="iq-small text-foreground-dim">{plan.tagline[locale]}</p>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-[family-name:var(--font-display)] italic text-[64px] sm:text-[80px] text-or leading-none tracking-[-0.025em] tabular-nums">
          {plan.price}
        </span>
        <span className="text-foreground-faint font-mono text-[11px] tracking-[0.18em] uppercase">
          $ CAD
        </span>
      </div>
      <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-2">
        {plan.period[locale]}
      </p>
      <p className="font-[family-name:var(--font-display)] italic text-foreground-dim text-base mb-8">
        {locale === 'fr' ? 'ou ' : 'or '}
        <span className="tabular-nums">{plan.priceMonthly.toFixed(2).replace('.', ',')}</span>
        {' $ '}
        <span className="text-foreground-faint">{plan.periodMonthly[locale]}</span>
      </p>

      <div className="h-px w-full bg-border mb-7" aria-hidden />

      <ul className="flex flex-col gap-4 mb-10 flex-1">
        {plan.features.map((feature) => (
          <li key={feature[locale]} className="flex items-start gap-3">
            <Check
              size={16}
              strokeWidth={2}
              className={`flex-shrink-0 mt-0.5 ${
                highlight ? 'text-or' : 'text-or/75'
              }`}
            />
            <span className="iq-body text-foreground-dim leading-snug">
              {feature[locale]}
            </span>
          </li>
        ))}
      </ul>

      <a href={APP_SIGNUP_URL} className="block">
        <Button
          variant={highlight ? 'or' : 'secondary'}
          size="lg"
          className="w-full"
        >
          {locale === 'fr' ? 'Commencer — sans carte' : 'Start free — no card'}
          <ArrowRight size={16} strokeWidth={1.75} />
        </Button>
      </a>
    </div>
  );
}
