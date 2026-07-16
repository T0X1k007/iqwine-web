"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/motion/FadeInOnScroll";
import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { buildSignupUrl } from "@/lib/constants";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import {
  PLANS,
  formatPriceCad,
  annualSavingsCents,
  monthlyEquivalentCents,
  type PlanId,
} from "@/lib/plans";

/**
 * Tarification — 3 forfaits commerciaux définitifs (lit la SOT src/lib/plans.ts).
 * Standard / Pro (recommandé) / Famille (ancrage). Mensuel. « recommandations IA »
 * + « utilisateurs » uniquement — jamais tokens/crédits/API. 14 j d'essai, sans carte.
 */

interface PlanCopy {
  name: string;
  tagline: Record<Locale, string>;
  features: Array<Record<Locale, string>>;
}

const COPY: Record<PlanId, PlanCopy> = {
  // P22 — la porte d'entrée. Elle n'a PAS de carte d'achat (rien à acheter) : elle
  // vit dans le comparatif, avec ses vrais chiffres. Miroir exact de l'app, qui
  // l'affiche aussi en bloc, jamais en bouton de paiement.
  gratuit: {
    name: "Gratuit",
    tagline: {
      fr: "Votre cave, pour toujours.",
      en: "Your cellar, forever.",
    },
    features: [
      { fr: "Jusqu’à 75 bouteilles, à vie", en: "Up to 75 bottles, for life" },
      { fr: "Votre cave et vos souvenirs, sans date de fin", en: "Your cellar and memories, with no end date" },
      { fr: "Un avant-goût d’Octave chaque mois", en: "A taste of Octave every month" },
      { fr: "Sans carte de crédit", en: "No credit card" },
    ],
  },
  standard: {
    name: "Standard",
    tagline: {
      fr: "La cave vivante — l’amateur, sa cave personnelle.",
      en: "The living cellar — the wine lover, a personal cellar.",
    },
    features: [
      { fr: "Octave vous dit quoi ouvrir, soir après soir", en: "Octave tells you what to open, night after night" },
      { fr: "Un palais qui apprend à chaque verre", en: "A palate that learns with every glass" },
      { fr: "La disponibilité près de vous, en direct", en: "What’s in stock near you, live" },
      { fr: "Votre cave, toujours à jour", en: "Your cellar, always up to date" },
      { fr: "Une étiquette scannée, une bouteille rangée", en: "Scan a label, file a bottle" },
    ],
  },
  pro: {
    name: "Pro",
    tagline: {
      fr: "La veille — l’habitué, un usage régulier, une plus grande cave.",
      en: "The watch — the regular, frequent use, a larger cellar.",
    },
    features: [
      { fr: "Tout ce que fait le Standard, en plus généreux", en: "Everything Standard does, more generously" },
      { fr: "Un profil de goût qui s’affine en profondeur", en: "A taste profile that deepens over time" },
      { fr: "Des accords puisés dans votre cave, près de vous, ou les deux", en: "Pairings drawn from your cellar, near you, or both" },
      { fr: "De quoi accompagner une cave qui grandit", en: "Room for a cellar that keeps growing" },
    ],
  },
  famille: {
    name: "Passionné",
    tagline: {
      fr: "Le foyer & le patrimoine — plusieurs palais, une cave partagée.",
      en: "The household & the collection — several palates, one shared cellar.",
    },
    features: [
      { fr: "Tout ce que fait le Pro, pour toute la maisonnée", en: "Everything Pro does, for the whole household" },
      { fr: "Plusieurs palais, chacun le sien, dans une cave partagée", en: "Several palates, each its own, in one shared cellar" },
      { fr: "Octave suit votre rythme, même soutenu", en: "Octave keeps your pace, however lively" },
      { fr: "Vos recommandations passent devant", en: "Your recommendations come first" },
    ],
  },
};

export default function Pricing() {
  const { locale } = useLocale();
  // Annuel par défaut : on présente d'emblée la formule la plus avantageuse.
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  const selectPeriod = (period: "monthly" | "yearly") => {
    setBillingPeriod(period);
    track(ANALYTICS_EVENTS.BILLING_PERIOD_TOGGLE, { period });
  };

  return (
    <SectionWrapper id="pricing" tone="light" withDivider rhythm="editorial">
      <FadeInOnScroll>
        <div className="text-center mb-16 sm:mb-20">
          <div className="iq-eyebrow mb-6">
            {locale === "fr" ? "Tarification" : "Pricing"}
          </div>
          <h2 className="iq-display italic max-w-3xl mx-auto">
            {locale === "fr"
              ? "Trois formules, un seul Octave."
              : "Three plans, one Octave."}
          </h2>
          <p className="iq-lead mt-6 max-w-2xl mx-auto">
            {locale === "fr"
              ? "14 jours offerts, sans engagement. Aucune carte demandée."
              : "14 days on the house, no strings. No card required."}
          </p>

          {/* Ancrage remonté au-dessus de la grille : on cadre la valeur avant
              le premier chiffre. */}
          <p className="mt-10 font-[family-name:var(--font-display)] italic text-or text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            {locale === "fr"
              ? "« Pour le prix d’une belle bouteille, un sommelier qui vous accompagne, soir après soir. »"
              : '"For the price of a fine bottle, a sommelier by your side, night after night."'}
          </p>
        </div>
      </FadeInOnScroll>

      {/* Pourquoi un abonnement ? — on lève l'objection « pourquoi pas un achat
          unique » : une cave est vivante, Octave la suit en continu. */}
      <FadeInOnScroll delay={0.06}>
        <p className="text-center iq-small text-foreground-dim max-w-2xl mx-auto -mt-8 mb-12">
          {locale === "fr"
            ? "Pourquoi un abonnement ? Parce qu’une cave vit, évolue et se boit. Octave la suit, soir après soir — pas une fois, toujours."
            : "Why a subscription? Because a cellar lives, evolves and gets poured. Octave follows it, night after night — not once, always."}
        </p>
      </FadeInOnScroll>

      {/* Bascule mensuel / annuel — « 2 mois offerts » est un fait honnête
          (l'annuel = 10× le mensuel), aucune fausse urgence. Annuel par défaut. */}
      <FadeInOnScroll delay={0.08}>
        <div className="flex flex-col items-center gap-3 mb-12 sm:mb-14">
          <div
            className="inline-flex items-center rounded-full border border-border-strong bg-card p-1"
            role="tablist"
            aria-label={t("Période de facturation", "Billing period")}
          >
            <button
              type="button"
              role="tab"
              aria-selected={billingPeriod === "monthly"}
              onClick={() => selectPeriod("monthly")}
              className={`px-5 py-2 rounded-full text-sm transition-colors duration-[160ms] ${
                billingPeriod === "monthly"
                  ? "bg-or text-on-gold font-medium"
                  : "text-foreground-dim hover:text-foreground"
              }`}
            >
              {t("Mensuel", "Monthly")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={billingPeriod === "yearly"}
              onClick={() => selectPeriod("yearly")}
              className={`relative px-5 py-2 rounded-full text-sm transition-colors duration-[160ms] ${
                billingPeriod === "yearly"
                  ? "bg-or text-on-gold font-medium"
                  : "text-foreground-dim hover:text-foreground"
              }`}
            >
              {t("Annuel", "Yearly")}
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide align-middle ${
                  billingPeriod === "yearly"
                    ? "bg-on-gold/15 text-on-gold"
                    : "bg-or/12 text-or"
                }`}
              >
                {t("Le plus avantageux", "Best value")}
              </span>
            </button>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="rounded-full bg-or/12 text-or px-3 py-1 text-xs font-medium tracking-wide">
              {t("Deux mois offerts avec l’abonnement annuel.", "Two months free with the annual plan.")}
            </span>
            <span className="iq-small text-foreground-dim">
              {t("Un palais qu’Octave affine toute l’année.", "A palate Octave sharpens all year long.")}
            </span>
          </div>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 max-w-6xl mx-auto items-stretch">
        {PLANS.map((plan, i) => (
          <FadeInOnScroll
            key={plan.id}
            delay={0.12 + i * 0.1}
            className="h-full"
          >
            <PlanCard plan={plan} locale={locale} billingPeriod={billingPeriod} />
          </FadeInOnScroll>
        ))}
      </div>

      {/* Au-delà de quatre membres : pas de cinquième palier public, on compose
          sur mesure. Ton éditorial, invitation. */}
      <FadeInOnScroll delay={0.4}>
        <p className="mt-12 text-center iq-small text-foreground-dim max-w-xl mx-auto">
          {t("Plus de quatre membres ? ", "More than four members? ")}
          <Link
            href="/contact"
            className="text-or underline underline-offset-4 hover:text-or/80"
          >
            {t("Écrivez-nous", "Write to us")}
          </Link>
          {t(", on compose l’accès qu’il vous faut.", ", we’ll tailor the right access.")}
        </p>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.5}>
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className="font-body text-[10px] tracking-[0.22em] uppercase text-foreground-faint leading-relaxed">
            {locale === "fr"
              ? "14 jours gratuits · Aucune carte requise · TPS et TVQ en sus"
              : "14 free days · No credit card · GST/QST extra"}
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
  billingPeriod,
}: {
  plan: (typeof PLANS)[number];
  locale: Locale;
  billingPeriod: "monthly" | "yearly";
}) {
  const copy = COPY[plan.id];
  const highlight = plan.highlight ?? false;
  const isYearly = billingPeriod === "yearly";
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  // Le grand nombre en annuel = l'équivalent MENSUEL (pas la facture annuelle).
  const bigCents = isYearly ? monthlyEquivalentCents(plan) : plan.priceMonthlyCents;
  const savingsCents = annualSavingsCents(plan);

  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl p-8 sm:p-9 transition-colors duration-[160ms] ${
        highlight
          ? "bg-card border border-or/40 shadow-[0_0_0_1px_rgba(184,146,74,0.35),0_20px_56px_rgba(33,27,23,0.14)]"
          : "bg-card border border-border-strong"
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-2 rounded-full bg-or px-4 py-1 font-body text-[10px] font-medium tracking-[0.22em] uppercase text-on-gold">
            {t("Recommandé", "Recommended")}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl text-foreground mb-2 tracking-[-0.01em]">
          {copy.name}
        </h3>
        <p className="iq-small text-foreground-dim sm:min-h-[2.75rem]">{copy.tagline[locale]}</p>
      </div>

      {/* Prix — en annuel, le grand nombre est l'ÉQUIVALENT MENSUEL ; le mensuel
          plein est barré à côté et la facture annuelle passe en sous-ligne. */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-[family-name:var(--font-display)] italic text-[56px] sm:text-[68px] text-or leading-none tracking-[-0.025em] tabular-nums">
          {formatPriceCad(bigCents, locale)}
        </span>
        {isYearly && (
          <span className="text-foreground-faint font-body text-base line-through tabular-nums">
            {formatPriceCad(plan.priceMonthlyCents, locale)}
          </span>
        )}
        <span className="text-foreground-faint font-body text-[11px] tracking-[0.18em] uppercase">
          $ CAD
        </span>
      </div>
      <p className="font-body text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-1.5">
        {t("/ mois", "/ month")}
      </p>
      <p className="iq-small mb-5">
        {isYearly ? (
          <span className="flex flex-col gap-1">
            <span className="text-foreground-dim">
              {t(
                `Facturé ${formatPriceCad(plan.priceYearlyCents, locale)} $ annuellement.`,
                `Billed $${formatPriceCad(plan.priceYearlyCents, locale)} yearly.`,
              )}
            </span>
            <span className="text-or font-medium tabular-nums">
              {t(
                `Économisez ${formatPriceCad(savingsCents, locale)} $ par an.`,
                `Save $${formatPriceCad(savingsCents, locale)} per year.`,
              )}
            </span>
          </span>
        ) : (
          <span className="text-foreground-dim">{t("Facturé chaque mois.", "Billed each month.")}</span>
        )}
      </p>

      {/* Ce qui est inclus — recommandations IA + utilisateurs (jamais tokens) */}
      <div className="rounded-lg border border-border bg-sunk px-4 py-3 mb-7">
        <p className="text-foreground text-(length:--text-body-sm) leading-snug">
          <span className="tabular-nums font-medium">
            {plan.monthlyRecommendations}
          </span>{" "}
          {t("recommandations d’Octave / mois", "Octave recommendations / month")}
        </p>
        <p className="text-foreground-dim text-(length:--text-body-sm) leading-snug mt-1">
          <span className="tabular-nums font-medium">{plan.includedUsers}</span>{" "}
          {plan.includedUsers > 1
            ? t("utilisateurs inclus", "users included")
            : t("utilisateur", "user")}
        </p>
      </div>

      <ul className="flex flex-col gap-3.5 mb-9 flex-1">
        {copy.features.map((feature) => (
          <li key={feature[locale]} className="flex items-start gap-3">
            <Check
              size={16}
              strokeWidth={2}
              className={`flex-shrink-0 mt-0.5 ${highlight ? "text-or" : "text-or/75"}`}
            />
            <span className="iq-small text-foreground-dim leading-snug">
              {feature[locale]}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <a
          href={buildSignupUrl("pricing_card", {
            plan: plan.id,
            period: billingPeriod,
            lang: locale,
          })}
          onClick={() =>
            track(ANALYTICS_EVENTS.PLAN_SELECTED, {
              plan: plan.id,
              period: billingPeriod,
            })
          }
          className="block"
        >
          <Button
            variant={highlight ? "cta" : "secondary"}
            size="lg"
            className="w-full"
          >
            {t(`Choisir ${copy.name}`, `Choose ${copy.name}`)}
            <ArrowRight size={16} strokeWidth={1.75} />
          </Button>
        </a>

        {/* Inversion du risque — on désamorce l'engagement juste sous le CTA. */}
        <p className="mt-3 text-center iq-small text-foreground-dim leading-snug">
          {t(
            "Sans engagement. Résiliable en un geste. Vous ne payez que si vous décidez de rester.",
            "No commitment. Cancel in one tap. You only pay if you choose to stay.",
          )}
        </p>
      </div>
    </div>
  );
}
