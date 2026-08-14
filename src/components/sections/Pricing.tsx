"use client";

import LocaleLink from '@/components/ui/LocaleLink';
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/motion/FadeInOnScroll";
import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { buildSignupUrl } from "@/lib/constants";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { TRIAL_SHORT } from '@/lib/trial';
import {
  PLANS,
  formatPriceCad,
  annualSavingsCents,
  monthlyEquivalentCents,
  maxBottlesLabel,
  type PlanId,
} from "@/lib/plans";

/**
 * Tarification, 3 forfaits commerciaux définitifs (lit la SOT src/lib/plans.ts).
 * Standard / Pro (recommandé) / Famille (ancrage). Mensuel. « recommandations IA »
 * + « utilisateurs » uniquement, jamais tokens/crédits/API. 14 j d'essai, sans carte.
 */

interface PlanCopy {
  /**
   * Le nom AFFICHÉ, par langue. Il était un `string` unique, ce qui rendait
   * impossible de localiser « Passionné » sans en faire un cas particulier.
   * Tout est bilingue, donc rien n'est une exception.
   */
  name: Record<'fr' | 'en', string>;
  tagline: Record<Locale, string>;
  features: Array<Record<Locale, string>>;
}

/**
 * Le nombre d'utilisateurs inclus, LU depuis la grille.
 *
 * Le Passionné se vend sur le partage : sa promesse nomme donc un nombre de
 * personnes. L'écrire à la main dans une phrase le condamnerait à diverger le
 * jour où la grille change, et une promesse commerciale fausse coûte plus cher
 * qu'un tableau faux, parce qu'elle est lue avant l'achat, pas après.
 */
function utilisateursInclus(id: PlanId): number {
  return PLANS.find((p) => p.id === id)?.includedUsers ?? 1;
}

const COPY: Record<PlanId, PlanCopy> = {
  // P22, la porte d'entrée. Elle n'a PAS de carte d'achat (rien à acheter) : elle
  // vit dans le comparatif, avec ses vrais chiffres. Miroir exact de l'app, qui
  // l'affiche aussi en bloc, jamais en bouton de paiement.
  gratuit: {
    name: { fr: 'Gratuit', en: 'Free' },
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
    name: { fr: 'Standard', en: 'Standard' },
    tagline: {
      fr: "L’essentiel, votre cave, et la bonne bouteille chez vous.",
      en: "The essentials, your cellar, and the right bottle at home.",
    },
    features: [
      { fr: "Plus de liberté pour demander des accords vins & mets", en: "More freedom to ask for food & wine pairings" },
      { fr: "Plus de liberté pour photographier vos plats et laisser Octave choisir", en: "More freedom to photograph your dishes and let Octave choose" },
      { fr: "Plus de liberté pour gérer votre cave, étiquette après étiquette", en: "More freedom to manage your cellar, label after label" },
    ],
  },
  pro: {
    name: { fr: 'Pro', en: 'Pro' },
    tagline: {
      fr: "Le forfait de l’amateur, partout où le vin se choisit.",
      en: "The wine lover’s plan, everywhere wine gets chosen.",
    },
    features: [
      { fr: "Tout ce que fait le Standard", en: "Everything Standard does" },
      // RETIRÉ (D6, 2026-07-16), « Un profil de goût qui s'affine en profondeur »
      // était un faux différenciateur : le palais s'apprend IDENTIQUEMENT sur tous
      // les plans (c'est la démo du moat, pas une option payante). Remplacé alors
      // par la capacité RÉELLE qui distingue Pro : son quota.
      //
      // RETIRÉ À NOUVEAU (Eric, 2026-08-02), le remplacement était juste sur le
      // fond et faux dans l'ensemble : le Pro était le SEUL des trois à répéter
      // son quota en puce, si bien qu'il avait l'air d'être le seul forfait
      // plafonné. Les trois le sont. Les trois chiffres vivent maintenant dans
      // l'encadré, à la même place sur chaque carte ; les puces redeviennent ce
      // qu'elles doivent être, des bénéfices, pas des limites.
      //
      // Ne pas réintroduire ici un nombre déjà porté par l'encadré : c'est
      // exactement ce qui a produit l'asymétrie.
      //
      // ── LA RÈGLE D'ÉCRITURE DE CES PUCES (Eric, 2026-08-02) ──────────────
      // Une puce dit ce que le VOLUME rend possible. Jamais ce qu'il
      // « débloque ».
      //
      // Le fait technique qui l'impose : le quota est UN SEUL budget mensuel,
      // que tous les gestes d'Octave consomment, l'accord du soir, le plat
      // photographié, la carte des vins d'un restaurant, l'étiquette scannée
      // en boutique, la soirée accordée plat par plat. Aucune de ces
      // fonctions n'est réservée à un forfait : elles existent TOUTES dès le
      // Standard. Seule la fréquence à laquelle on peut s'en servir change.
      //
      // Écrire « le Pro permet de photographier la carte des vins » serait
      // donc faux, et exactement le faux différenciateur que D6 avait purgé.
      // Écrire « de quoi photographier la carte des vins sans compter » est
      // vrai, et c'est ce qui donne envie : ce n'est pas une porte qui
      // s'ouvre, c'est une arithmétique qui disparaît.
      //
      // Le levier de désir est là : une soirée reçue consomme une dizaine
      // d'interactions d'un coup. Sur 50, on y pense. Sur 110, on n'y pense
      // plus. C'est la vraie différence, et elle se dit sans exagérer.
      { fr: "Plus de liberté pour être guidé au restaurant, carte des vins en main", en: "More freedom to be guided at the restaurant, wine list in hand" },
      { fr: "Plus de liberté pour concevoir des menus dégustation, plat par plat", en: "More freedom to design tasting menus, course by course" },
      { fr: "Plus de liberté pour explorer en succursale, étiquette après étiquette", en: "More freedom to explore in store, label after label" },
    ],
  },
  famille: {
    // Le seul forfait dont le nom est localisé : « Passionné » / « Enthusiast ».
    // Même identifiant, même priceId, même accès, seul le mot affiché change.
    name: { fr: 'Passionné', en: 'Enthusiast' },
    tagline: {
      fr: "À plusieurs, un Octave partagé, une cave sans fin.",
      en: "Together, one shared Octave, an endless cellar.",
    },
    features: [
      { fr: "Tout ce que fait le Pro", en: "Everything Pro does" },
      {
        // « avec les vôtres, N personnes », et non « avec N personnes » :
        // `includedUsers` compte le TOTAL, propriétaire compris. L'application
        // le dit ainsi dans sa propre grille (« Cave partagée, 4 personnes »).
        // Écrit « partager avec 4 personnes », le client en comprend cinq, et
        // découvre l'écart au moment d'inviter le dernier, c'est-à-dire après
        // avoir payé.
        fr: `Plus de liberté pour partager Octave avec les vôtres, ${utilisateursInclus("famille")} personnes, chacun son palais`,
        en: `More freedom to share Octave with your household, ${utilisateursInclus("famille")} people, each their own palate`,
      },
      { fr: "Plus de liberté pour recevoir toutes les semaines, sans compter vos interactions mensuelles avec Octave", en: "More freedom to host every week, without counting your monthly Octave interactions" },
      // RETIRÉ (D6, 2026-07-16), « Vos recommandations passent devant » est
      // « Priorité à Octave » REFORMULÉE : aucune file prioritaire n'existe, ni
      // n'a jamais existé. Retirée du comparatif ET d'ici. Remplacée par la
      // capacité RÉELLE du Passionné : sa cave sans plafond.
      { fr: "Plus de liberté pour collectionner sans plafond, la cave d’une vie", en: "More freedom to collect with no ceiling, a lifetime’s cellar" },
    ],
  },
};

/**
 * ── LE TON (passe de direction artistique, Eric 2026-08-14) ───────────────
 * `Pricing` ne connaissait que la nuit, et `/tarifs` devenait une longue masse
 * sombre, etrangere au langage v3. Le bloc des prix passe donc a l'IVOIRE :
 * c'est le moment ou l'on veut de la lumiere et de la lisibilite. Le ton reste
 * un PARAMETRE, avec la nuit par defaut, pour ne rien changer aux autres
 * appelants (SectionTarifs, dormant).
 */
export default function Pricing({ ton = 'nuit' }: { ton?: 'jour' | 'nuit' } = {}) {
  const jour = ton === 'jour';
  const { locale } = useLocale();
  // Annuel par défaut : on présente d'emblée la formule la plus avantageuse.
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  const selectPeriod = (period: "monthly" | "yearly") => {
    setBillingPeriod(period);
    track(ANALYTICS_EVENTS.BILLING_PERIOD_TOGGLE, { period });
  };

  return (
    <SectionWrapper id="pricing" tone={jour ? undefined : "light"} withDivider={!jour} rhythm="editorial" className={jour ? "mouvement-jour" : ""}>
      {/* ── EN-TETE ALLEGE (v3, 2026-08-14) ────────────────────────────────
          Il portait un oeil-de-boeuf « Tarification », un H2 « Trois formules,
          un seul Octave » et un chapeau sur l'essai : les trois redisaient le
          hero de /tarifs, situe 400 px plus haut, et repoussaient d'autant le
          premier prix. Seul l'ancrage de valeur reste, c'est le seul element
          qui n'existe nulle part ailleurs. */}
      <FadeInOnScroll>
        <div className="text-center mb-8 sm:mb-10">
          <p className={`mx-auto max-w-2xl font-[family-name:var(--font-display)] text-[17px] italic leading-relaxed sm:text-lg ${jour ? "text-or-jour" : "text-or"}`}>
            {locale === "fr"
              ? "« Pour le prix d’une belle bouteille, un sommelier qui vous accompagne, soir après soir. »"
              : '"For the price of a fine bottle, a sommelier by your side, night after night."'}
          </p>
        </div>
      </FadeInOnScroll>

      {/* Bascule mensuel / annuel, « 2 mois offerts » est un fait honnête
          (l'annuel = 10× le mensuel), aucune fausse urgence. Annuel par défaut. */}
      <FadeInOnScroll delay={0.08}>
        <div className="flex flex-col items-center gap-3 mb-12 sm:mb-14">
          <div
            className={`inline-flex items-center rounded-full p-1 ${jour ? "border border-encre/15 bg-papier-2/60" : "border border-border-strong bg-card"}`}
            role="tablist"
            aria-label={t("Période de facturation", "Billing period")}
          >
            <button
              type="button"
              role="tab"
              aria-selected={billingPeriod === "monthly"}
              onClick={() => selectPeriod("monthly")}
              className={`rounded-full px-5 py-2 text-sm transition-colors duration-[160ms] ${
                billingPeriod === "monthly"
                  ? jour
                    ? "bg-or-jour font-medium text-papier"
                    : "bg-or text-on-gold font-medium"
                  : jour
                    ? "text-encre-2 hover:text-encre"
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
              className={`relative rounded-full px-5 py-2 text-sm transition-colors duration-[160ms] ${
                billingPeriod === "yearly"
                  ? jour
                    ? "bg-or-jour font-medium text-papier"
                    : "bg-or text-on-gold font-medium"
                  : jour
                    ? "text-encre-2 hover:text-encre"
                    : "text-foreground-dim hover:text-foreground"
              }`}
            >
              {t("Annuel", "Yearly")}
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide align-middle ${
                  billingPeriod === "yearly"
                    ? jour
                      ? "bg-papier/25 text-papier"
                      : "bg-on-gold/15 text-on-gold"
                    : jour
                      ? "bg-or-jour/12 text-or-jour"
                      : "bg-or/12 text-or"
                }`}
              >
                {t("Le plus avantageux", "Best value")}
              </span>
            </button>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className={`rounded-full px-3 py-1 text-xs font-medium tracking-wide ${jour ? "bg-or-jour/12 text-or-jour" : "bg-or/12 text-or"}`}>
              {t("Deux mois offerts avec l’abonnement annuel.", "Two months free with the annual plan.")}
            </span>
            <span className={`text-[13px] ${jour ? "text-encre-3" : "iq-small text-foreground-dim"}`}>
              {t("Un palais qu’Octave affine toute l’année.", "A palate Octave sharpens all year long.")}
            </span>
          </div>
        </div>
      </FadeInOnScroll>

      {/* LE SOCLE COMMUN (v3, 2026-08-14) : dit en UNE ligne ce que le
          comparatif met 12 lignes à démontrer, et dissout la peur de « payer
          plus pour avoir le vrai produit ». */}
      <FadeInOnScroll delay={0.08}>
        <p className={`mx-auto mb-10 max-w-[54ch] text-center text-[15.5px] leading-relaxed md:text-[16.5px] ${jour ? "text-encre-2" : "text-muted-foreground"}`}>
          {t('Le même sommelier dans toutes les formules. Ce qui change, c’est la taille de votre cave et le nombre de personnes qui la partagent.',
             'The same sommelier in every plan. What changes is the size of your cellar and how many people share it.')}
        </p>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 max-w-6xl mx-auto items-stretch">
        {PLANS.map((plan, i) => (
          <FadeInOnScroll
            key={plan.id}
            delay={0.12 + i * 0.1}
            // Le recommandé passe EN TÊTE sur mobile : empilé, il se retrouvait
            // au milieu, là où l'œil ne va pas (v3, 2026-08-14).
            className={`h-full ${plan.highlight ? 'order-first lg:order-none' : ''}`}
          >
            <PlanCard plan={plan} locale={locale} billingPeriod={billingPeriod} jour={jour} />
          </FadeInOnScroll>
        ))}
      </div>

      {/* ── LA PORTE D'ENTRÉE GRATUITE, ENFIN VISIBLE (Eric, 2026-08-14) ──
          Elle ne vivait que dans le comparatif, donc invisible pour qui ne
          défilait pas jusque-là, alors que c'est le meilleur argument
          d'acquisition du site. Elle sort en carte HORIZONTALE, délibérément
          d'un rang visuel inférieur aux trois cartes payantes : ni liseré d'or,
          ni ombre portée, ni grand prix. Visible et crédible, sans jamais
          concurrencer le Pro, qui reste le héros commercial.
          Mesuré avant de trancher : en quatrième colonne, les cartes tombaient
          à 283 px de large pour 968 px de haut, comprimées. */}
      <FadeInOnScroll delay={0.42}>
        <div className={`mx-auto mt-8 max-w-6xl rounded-2xl border p-6 sm:p-7 ${jour ? "border-encre/12 bg-papier-2/35" : "border-white/10 bg-white/[0.02]"}`}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="lg:max-w-[34%]">
              <p className={`font-[family-name:var(--font-display)] text-[22px] italic ${jour ? "text-encre" : "text-foreground"}`}>
                {COPY.gratuit.name[locale]}
              </p>
              <p className={`mt-1 text-[14.5px] leading-snug ${jour ? "text-encre-2" : "text-muted-foreground"}`}>
                {COPY.gratuit.tagline[locale]}
              </p>
            </div>
            <ul className="flex flex-1 flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-x-6">
              {COPY.gratuit.features.map((f) => (
                <li key={f.en} className="flex items-start gap-2">
                  <Check size={15} strokeWidth={2} className={`mt-0.5 shrink-0 ${jour ? "text-or-jour/75" : "text-or/80"}`} aria-hidden />
                  <span className={`text-[13.5px] leading-snug ${jour ? "text-encre-2" : "text-foreground/85"}`}>{f[locale]}</span>
                </li>
              ))}
            </ul>
            <a
              href={buildSignupUrl('tarifs-gratuit', { lang: locale })}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'tarifs-gratuit' })}
              className="shrink-0"
            >
              <Button
                variant="secondary"
                size="md"
                className={jour ? "!border-encre/25 !bg-transparent !text-encre hover:!bg-encre/5 hover:!border-encre/35" : ""}
              >
                {t('Commencer gratuitement', 'Start for free')}
                <ArrowRight size={15} strokeWidth={1.75} />
              </Button>
            </a>
          </div>
        </div>
      </FadeInOnScroll>

      {/* L'objection « pourquoi pas un achat unique » se pose APRES avoir vu
          les prix, jamais avant (v3, 2026-08-14) : elle a donc quitte le haut
          de section, ou elle retardait le premier chiffre. */}
      <FadeInOnScroll delay={0.46}>
        <p className={`mx-auto mt-10 max-w-2xl text-center text-[14px] leading-relaxed ${jour ? "text-encre-2" : "text-foreground-dim"}`}>
          {locale === "fr"
            ? "Pourquoi un abonnement ? Parce qu’une cave vit, évolue et se boit. Octave la suit, soir après soir, pas une fois, toujours."
            : "Why a subscription? Because a cellar lives, evolves and gets poured. Octave follows it, night after night, not once, always."}
        </p>
      </FadeInOnScroll>

      {/* Au-delà de quatre membres : pas de cinquième palier public, on compose
          sur mesure. Ton éditorial, invitation. */}
      <FadeInOnScroll delay={0.4}>
        <p className={`mx-auto mt-12 max-w-xl text-center text-[13.5px] ${jour ? "text-encre-2" : "iq-small text-foreground-dim"}`}>
          {t("Plus de quatre membres ? ", "More than four members? ")}
          <LocaleLink
            href="/contact"
            className={`underline underline-offset-4 ${jour ? "text-bordeaux-jour hover:text-or-jour" : "text-or hover:text-or/80"}`}
          >
            {t("Écrivez-nous", "Write to us")}
          </LocaleLink>
          {t(", on compose l’accès qu’il vous faut.", ", we’ll tailor the right access.")}
        </p>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.5}>
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className={`font-body text-[10px] uppercase leading-relaxed tracking-[0.22em] ${jour ? "text-encre-3" : "text-foreground-faint"}`}>
            {locale === "fr"
              ? `${TRIAL_SHORT.fr} · Aucune carte requise · TPS et TVQ en sus`
              : `${TRIAL_SHORT.en} · No credit card · GST/QST extra`}
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
  jour = false,
}: {
  plan: (typeof PLANS)[number];
  locale: Locale;
  billingPeriod: "monthly" | "yearly";
  jour?: boolean;
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
      className={`relative flex h-full flex-col rounded-2xl p-8 transition-colors duration-[160ms] sm:p-9 ${
        jour
          ? highlight
            ? "border border-or-jour/45 bg-[#fdfaf3] shadow-[0_30px_70px_-28px_rgba(60,38,18,0.38)]"
            : "border border-encre/12 bg-papier-2/45"
          : highlight
            ? "bg-card border border-or/40 shadow-[0_0_0_1px_rgba(184,146,74,0.35),0_20px_56px_rgba(33,27,23,0.14)]"
            : "bg-card border border-border-strong"
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1 font-body text-[10px] font-medium uppercase tracking-[0.22em] ${jour ? "bg-or-jour text-papier" : "bg-or text-on-gold"}`}>
            {t("Recommandé", "Recommended")}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className={`mb-2 font-[family-name:var(--font-display)] text-3xl italic tracking-[-0.01em] sm:text-4xl ${jour ? "text-encre" : "text-foreground"}`}>
          {copy.name[locale]}
        </h3>
        <p className={`text-[14px] leading-snug sm:min-h-[2.75rem] ${jour ? "text-encre-2" : "iq-small text-foreground-dim"}`}>{copy.tagline[locale]}</p>
      </div>

      {/* Prix, en annuel, le grand nombre est l'ÉQUIVALENT MENSUEL ; le mensuel
          plein est barré à côté et la facture annuelle passe en sous-ligne. */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className={`font-[family-name:var(--font-display)] text-[56px] italic leading-none tracking-[-0.025em] tabular-nums sm:text-[68px] ${jour ? "text-bordeaux-jour" : "text-or"}`}>
          {formatPriceCad(bigCents, locale)}
        </span>
        {isYearly && (
          <span className={`font-body text-base tabular-nums line-through ${jour ? "text-encre-3" : "text-foreground-faint"}`}>
            {formatPriceCad(plan.priceMonthlyCents, locale)}
          </span>
        )}
        <span className={`font-body text-[11px] uppercase tracking-[0.18em] ${jour ? "text-encre-3" : "text-foreground-faint"}`}>
          $ CAD
        </span>
      </div>
      <p className={`mb-1.5 font-body text-[11px] uppercase tracking-[0.22em] ${jour ? "text-encre-3" : "text-muted-foreground"}`}>
        {t("/ mois", "/ month")}
      </p>
      <p className="mb-5 text-[13.5px] leading-snug">
        {isYearly ? (
          <span className="flex flex-col gap-1">
            <span className={jour ? "text-encre-2" : "text-foreground-dim"}>
              {t(
                `Facturé ${formatPriceCad(plan.priceYearlyCents, locale)} $ annuellement.`,
                `Billed $${formatPriceCad(plan.priceYearlyCents, locale)} yearly.`,
              )}
            </span>
            <span className={`font-medium tabular-nums ${jour ? "text-or-jour" : "text-or"}`}>
              {t(
                `Économisez ${formatPriceCad(savingsCents, locale)} $ par an.`,
                `Save $${formatPriceCad(savingsCents, locale)} per year.`,
              )}
            </span>
          </span>
        ) : (
          <span className={jour ? "text-encre-2" : "text-foreground-dim"}>{t("Facturé chaque mois.", "Billed each month.")}</span>
        )}
      </p>

      {/* Ce qui est inclus, LES TROIS limites réelles, jamais de tokens.
       *
       * ── Ce que cet encadré a corrigé (Eric, 2026-08-02) ──────────────────
       * Il n'annonçait que les recommandations et les utilisateurs. Le plafond
       * de BOUTEILLES n'apparaissait nulle part sur la carte, ni ici, ni dans
       * les puces, alors que c'est la limite qui arrête un client pour de
       * vrai : 200 en Standard, 1 000 en Pro. On vendait un plafond sans le
       * dire, et l'acheteur le découvrait en le heurtant.
       *
       * Les trois chiffres sont lus depuis `PLANS`, jamais écrits ici : le
       * comparatif plus bas lit la même source, et deux tableaux de prix qui
       * divergent est une faute qu'on ne voit qu'une fois vendue.
       *
       * Corollaire tenu ailleurs dans ce fichier : plus aucune puce ne répète
       * un de ces nombres. Le Pro le faisait, seul des trois, ce qui le faisait
       * passer pour le seul forfait plafonné. */}
      {/* ── PLUS DE CARTE DANS LA CARTE (Eric, 2026-08-14) ─────────────────
          Les trois limites vivaient dans un rectangle sombre a fond plein :
          sur mobile, la page devenait une pile de boites imbriquees, un
          langage de tableau de bord SaaS plutot que celui d'iQWine. Elles
          deviennent une COMPOSITION TYPOGRAPHIQUE, tenue par deux filets et de
          l'espace : le nombre porte le poids, le mot reste discret. Aucune
          information n'est retiree, les trois chiffres viennent toujours de
          `PLANS`. */}
      <div className={`mb-7 space-y-2 border-y py-4 ${jour ? "border-encre/10" : "border-border"}`}>
        {/* `tabular-nums` sur le paragraphe entier, et non sur un `<span>` :
         * l'étiquette rend une phrase complète (« Jusqu'à 1 000 bouteilles »,
         * ou « Bouteilles illimitées » quand il n'y a pas de plafond), le
         * nombre n'est donc pas isolable. Sans ça, le « 200 » du Standard et
         * le « 1 000 » du Pro ne s'alignent pas d'une carte à l'autre. */}
        <p className={`text-[14.5px] font-medium leading-snug tabular-nums ${jour ? "text-encre" : "text-foreground"}`}>
          {maxBottlesLabel(plan, locale)}
        </p>
        <p className={`text-[14px] leading-snug ${jour ? "text-encre-2" : "text-foreground"}`}>
          <span className={`tabular-nums font-medium ${jour ? "text-encre" : ""}`}>
            {plan.monthlyRecommendations}
          </span>{" "}
          {t("interactions avec Octave / mois", "interactions with Octave / month")}
        </p>
        <p className={`text-[14px] leading-snug ${jour ? "text-encre-2" : "text-foreground-dim"}`}>
          <span className={`tabular-nums font-medium ${jour ? "text-encre" : ""}`}>{plan.includedUsers}</span>{" "}
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
              className={`mt-0.5 flex-shrink-0 ${jour ? (highlight ? "text-or-jour" : "text-or-jour/70") : highlight ? "text-or" : "text-or/75"}`}
            />
            <span className={`text-[14px] leading-snug ${jour ? "text-encre-2" : "iq-small text-foreground-dim"}`}>
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
            variant={jour ? (highlight ? "primary" : "secondary") : highlight ? "cta" : "secondary"}
            size="lg"
            className={`w-full ${jour && !highlight ? "!border-encre/25 !bg-transparent !text-encre hover:!bg-encre/5 hover:!border-encre/35" : ""}`}
          >
            {t(`Choisir ${copy.name.fr}`, `Choose ${copy.name.en}`)}
            <ArrowRight size={16} strokeWidth={1.75} />
          </Button>
        </a>

        {/* Inversion du risque, on désamorce l'engagement juste sous le CTA. */}
        <p className={`mt-3 text-center text-[13px] leading-snug ${jour ? "text-encre-3" : "iq-small text-foreground-dim"}`}>
          {t(
            "Sans engagement. Résiliable en un geste. Vous ne payez que si vous décidez de rester.",
            "No commitment. Cancel in one tap. You only pay if you choose to stay.",
          )}
        </p>
      </div>
    </div>
  );
}
