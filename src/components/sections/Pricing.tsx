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
  GRILLE,
  formatPriceCad,
  formatPriceCadShort,
  annualSavingsSentence,
  monthlyEquivalentCents,
  maxBottlesLabel,
  CONSEILS_NOTE,
  COMMON_BASE_NOTE,
  LAUNCH_PRICE,
  LAUNCH_PRICE_NOTE,
  type MarketingPlan,
  type PlanId,
} from "@/lib/plans";

/**
 * LA GRILLE, trois cartes, dans l'ordre : Gratuit · Standard · Premium.
 * (Lit la SOT `src/lib/plans.ts`, aucune valeur écrite ici.)
 *
 * ── Ce que la refonte du 2026-09-13 a changé ──────────────────────────────
 * Quatre paliers sont devenus trois, le Gratuit est ENTRÉ dans la grille comme
 * première colonne à 0 $ (il vivait sous les cartes, dans une bande d'un rang
 * visuel inférieur), et le RECOMMANDÉ est passé du palier haut au Standard :
 * c'est le forfait qu'on veut réellement vendre, pas celui qui sert d'ancrage.
 *
 * ── La règle d'écriture des puces, qui n'a pas changé ─────────────────────
 * Une puce dit ce que le VOLUME rend possible, jamais ce qu'il « débloque » :
 * aucune fonctionnalité n'est réservée à un forfait, et l'écrire serait le faux
 * différenciateur que ce fichier a déjà dû purger deux fois. Une puce ne répète
 * jamais non plus un nombre que l'encadré porte déjà (bouteilles, conseils,
 * utilisateurs) : le Pro le faisait, seul des trois, ce qui le faisait passer
 * pour le seul forfait plafonné alors qu'ils le sont tous.
 *
 * Jamais de tokens, de crédits ni d'appels API : « conseils personnalisés
 * d'Octave » et « utilisateurs inclus », rien d'autre. Le terme public a changé
 * le 2026-09-13 — « interaction » ne paraît plus nulle part, voir
 * `CONSEILS_NOTE` dans `plans.ts`.
 */

interface PlanCopy {
  /**
   * Le nom AFFICHÉ, par langue. Il était un `string` unique, ce qui rendait
   * impossible de localiser un libellé sans en faire un cas particulier.
   * Tout est bilingue, donc rien n'est une exception — même si, depuis la
   * sortie de « Passionné », les trois noms sont identiques dans les deux
   * langues.
   */
  name: Record<'fr' | 'en', string>;
  tagline: Record<Locale, string>;
  features: Array<Record<Locale, string>>;
}

/**
 * LES TROIS PROMESSES, dictées par Eric le 2026-09-13.
 *
 * Les taglines françaises sont les siennes, mot pour mot. Les puces disent ce
 * que le volume rend possible, et RIEN d'autre : pas une fonction nommée comme
 * si elle était réservée (elles sont toutes ouvertes à tous, Gratuit compris),
 * pas un nombre déjà porté par l'encadré chiffré.
 *
 * ⚠️ « sans jamais compter » est INTERDIT à propos du Premium : il reste
 * plafonné à 200 conseils par mois. « Assez pour recevoir toutes les
 * semaines » est vrai et donne envie ; « sans compter » est faux.
 */
const COPY: Record<PlanId, PlanCopy> = {
  // LA PORTE D'ENTRÉE, désormais une carte comme les autres — même gabarit,
  // même encadré chiffré, même CTA. Ce qui la distingue tient au prix, pas au
  // rang : elle ne porte ni liseré d'or ni bandeau « Recommandé ».
  gratuit: {
    name: { fr: 'Gratuit', en: 'Free' },
    tagline: {
      fr: "Commencez votre cave, gardez vos souvenirs et découvrez Octave gratuitement.",
      en: "Start your cellar, keep your memories, and discover Octave for free.",
    },
    features: [
      { fr: "Sans carte de crédit", en: "No credit card" },
      { fr: "Votre cave et vos souvenirs, sans date de fin", en: "Your cellar and your memories, with no end date" },
      { fr: "Un avant-goût d’Octave", en: "A taste of Octave" },
    ],
  },
  standard: {
    name: { fr: 'Standard', en: 'Standard' },
    tagline: {
      fr: "Octave apprend votre palais et vous aide à choisir la bonne bouteille, chez vous et au quotidien.",
      en: "Octave learns your palate and helps you choose the right bottle, at home and every day.",
    },
    // ⚠️ NE PAS FAIRE REPOSER CETTE CARTE SUR LA TAILLE DE LA CAVE (2026-09-13).
    // Depuis que le Gratuit monte à 100 bouteilles, l'écart n'est plus qu'un
    // facteur deux : réel, mais secondaire. Ce qui vend le Standard, c'est
    // 50 conseils par mois contre 2, donc la fréquence et le palais qu'elle
    // permet d'affiner. La cave passe en troisième, et sans emphase.
    features: [
      { fr: "Assez de conseils pour qu’Octave apprenne vraiment votre palais", en: "Enough advice for Octave to truly learn your palate" },
      { fr: "De quoi lui demander la bonne bouteille plusieurs fois par semaine", en: "Enough to ask him for the right bottle several times a week" },
      { fr: "Une cave qui grandit avec vous", en: "A cellar that grows with you" },
    ],
  },
  // « Premium » à l'écran, `pro` dans le code et dans la facturation (voir
  // `PlanId`). Ses trois puces disent ses trois vraies différences : la cave
  // sans plafond, la fréquence, et les palais qui ne se mélangent pas.
  pro: {
    name: { fr: 'Premium', en: 'Premium' },
    tagline: {
      fr: "Octave vous accompagne partout, avec une cave sans limite et jusqu’à quatre utilisateurs.",
      en: "Octave goes with you everywhere, with a limitless cellar and up to four users.",
    },
    features: [
      { fr: "Une cave sans plafond, la collection d’une vie", en: "A cellar with no ceiling, a lifetime’s collection" },
      // Le partage est le seul « verrou » réel de la grille, et il est
      // purement numérique : l'application refuse une invitation dès que le
      // forfait n'inclut qu'une place. Il se dit donc par les palais, pas par
      // une fonction qu'on « débloquerait ».
      { fr: "Chacun son palais : les goûts ne se mélangent jamais", en: "Each their own palate: tastes never blend" },
      { fr: "Assez de conseils pour recevoir toutes les semaines", en: "Enough advice to host every week" },
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

      {/* Bascule mensuel / annuel. Annuel par défaut, aucune fausse urgence.
          « Deux mois offerts » a été RETIRÉ d'ici (2026-09-13) : la formule
          dérivait à chaque mouvement de prix sans rien signaler — 3,37 mois de
          Standard sous la grille à 129 $, 2,03 sous celle à 149 $. Le prix de
          lancement la remplace, et il ne paraît QUE sous l'annuel — il n'existe
          pas sur le mensuel. */}
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
          <div className="flex min-h-[3.25rem] flex-col items-center gap-1.5">
            {billingPeriod === "yearly" && (
              <span className={`rounded-full px-3 py-1 text-xs font-medium tracking-wide ${jour ? "bg-or-jour/12 text-or-jour" : "bg-or/12 text-or"}`}>
                {t(LAUNCH_PRICE.fr, LAUNCH_PRICE.en)}
              </span>
            )}
            <span className={`text-[13px] ${jour ? "text-encre-3" : "iq-small text-foreground-dim"}`}>
              {billingPeriod === "yearly"
                ? t(LAUNCH_PRICE_NOTE.fr, LAUNCH_PRICE_NOTE.en)
                : t("Sans engagement, résiliable en tout temps.", "No commitment, cancel anytime.")}
            </span>
          </div>
        </div>
      </FadeInOnScroll>

      {/* LE SOCLE COMMUN, en toutes lettres (Eric, 2026-09-13).
          Il dissout la peur qui bloque le plus d'achats : « faut-il payer plus
          pour avoir le vrai produit ? ». Non — aucune fonctionnalité n'est
          réservée à un forfait, c'est établi par audit du code applicatif. Le
          texte vit dans `COMMON_BASE_NOTE`, il paraît aussi au-dessus du
          comparatif, et deux rédactions de la même promesse divergent. */}
      <FadeInOnScroll delay={0.08}>
        <p className={`mx-auto mb-3 max-w-[58ch] text-center text-[15.5px] leading-relaxed md:text-[16.5px] ${jour ? "text-encre-2" : "text-muted-foreground"}`}>
          {t(COMMON_BASE_NOTE.fr, COMMON_BASE_NOTE.en)}
        </p>
        <p className={`mx-auto mb-10 max-w-[58ch] text-center text-[14px] leading-relaxed ${jour ? "text-encre-3" : "text-foreground-dim"}`}>
          {t('Ce qui change d’un forfait à l’autre : le nombre de conseils personnalisés d’Octave, la taille de votre cave et le nombre d’utilisateurs.',
             'What changes from one plan to the next: how much personalized advice you get from Octave, the size of your cellar, and how many users.')}
        </p>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 max-w-6xl mx-auto items-stretch">
        {/* `GRILLE` et non `PLANS` : la première carte est le Gratuit, qui n'a
            pas de prix et ne fait donc pas partie du parcours d'achat.
            AUCUN `order-first` ici (retiré le 2026-09-13) : il remontait le
            recommandé en tête sur mobile, ce qui plaçait Standard AVANT
            Gratuit et cassait la lecture Gratuit → Standard → Premium, qui est
            précisément la progression que la grille raconte. */}
        {GRILLE.map((plan, i) => (
          <FadeInOnScroll key={plan.id} delay={0.12 + i * 0.1} className="h-full">
            <PlanCard plan={plan} locale={locale} billingPeriod={billingPeriod} jour={jour} />
          </FadeInOnScroll>
        ))}
      </div>

      {/* ── LA BANDE HORIZONTALE DU GRATUIT A DISPARU (Eric, 2026-09-13) ──
          Elle existait parce que le Gratuit n'avait pas sa place dans la
          grille : il sortait sous les trois cartes payantes, délibérément d'un
          rang visuel inférieur, « sans jamais concurrencer le Pro ». La grille
          n'a plus que trois colonnes, le Gratuit en occupe la première, et il
          n'a plus besoin d'une seconde apparition.
          NE PAS LA RÉTABLIR : deux présentations du même forfait sur un même
          écran, c'est deux copies à tenir, et l'une des deux finit par mentir. */}

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
  plan: MarketingPlan;
  locale: Locale;
  billingPeriod: "monthly" | "yearly";
  jour?: boolean;
}) {
  const copy = COPY[plan.id];
  const highlight = plan.highlight ?? false;
  const isYearly = billingPeriod === "yearly";
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  /**
   * ── LE CAS PRIX ZÉRO, OBLIGATOIRE DEPUIS QUE LE GRATUIT EST UNE CARTE ────
   *
   * Sans lui, la carte du Gratuit passerait par la même arithmétique que les
   * autres et afficherait, sous la bascule Annuel : « 0,00 $ · facturé 0 $
   * annuellement · Économisez 0,00 $ par an ». Trois phrases exactes et
   * absurdes, sur la carte qui doit être la plus simple de la page.
   *
   * Le Gratuit ignore donc la bascule : un forfait sans prix n'a pas de période
   * de facturation. Il garde en revanche tout le reste du gabarit — l'encadré
   * chiffré, la note sur les conseils, les puces, le CTA — parce que c'est ce qui
   * en fait une colonne comparable et non une note de bas de page.
   */
  const gratuit = plan.priceMonthlyCents === 0;
  const annuel = isYearly && !gratuit;

  // Le grand nombre en annuel = l'équivalent MENSUEL (pas la facture annuelle).
  const bigCents = annuel ? monthlyEquivalentCents(plan) : plan.priceMonthlyCents;

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
          {/* « 0 » et non « 0,00 » : deux décimales sur la gratuité font lire un
              prix là où il n'y en a pas. */}
          {gratuit ? "0" : formatPriceCad(bigCents, locale)}
        </span>
        {annuel && (
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
      {/* ── LA COMPARAISON ANNUELLE, HONNÊTE (Eric, 2026-09-13) ────────────
       *
       * Ce bloc affichait « Économisez X $ par an » sous un prix régulier
       * annuel barré (179,40 $ / 359,40 $). Ces montants n'ont JAMAIS été des
       * prix annuels commercialisés : les barrer inventait une réduction. Eric
       * les a retirés.
       *
       * Ce qui reste se vérifie avec les deux seuls chiffres que la carte
       * affiche déjà : la facture annuelle, et douze fois le tarif mensuel.
       * Le prix barré qui subsiste À CÔTÉ DU GRAND NOMBRE est d'une autre
       * nature, et il est vrai : il compare l'équivalent mensuel de l'annuel
       * (12,42) au tarif mensuel réellement pratiqué (14,95). Eric l'a
       * explicitement validé le 2026-09-14, après le passage à 149 $.
       *
       * ⚠️ « Prix de lancement » ne paraît QUE dans cette branche annuelle, et
       * il ne promet RIEN au-delà du lancement — relire `LAUNCH_PRICE`. */}
      <p className="mb-5 text-[13.5px] leading-snug">
        {gratuit ? (
          <span className={jour ? "text-encre-2" : "text-foreground-dim"}>
            {t("Gratuit à vie.", "Free for life.")}
          </span>
        ) : annuel ? (
          <span className="flex flex-col gap-1">
            <span className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${jour ? "text-encre-2" : "text-foreground-dim"}`}>
              <span>
                {t(
                  `Facturé ${formatPriceCadShort(plan.priceYearlyCents, locale)} $ annuellement.`,
                  `Billed $${formatPriceCadShort(plan.priceYearlyCents, locale)} yearly.`,
                )}
              </span>
              <span className={`rounded-full px-2 py-0.5 font-body text-[10px] font-medium uppercase tracking-[0.14em] ${jour ? "bg-or-jour/12 text-or-jour" : "bg-or/12 text-or"}`}>
                {t(LAUNCH_PRICE.fr, LAUNCH_PRICE.en)}
              </span>
            </span>
            <span className={`font-medium tabular-nums ${jour ? "text-or-jour" : "text-or"}`}>
              {annualSavingsSentence(plan, locale)}
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
       * vrai : 100 au Gratuit, 200 au Standard. On vendait un plafond sans le
       * dire, et l'acheteur le découvrait en le heurtant.
       *
       * Les trois chiffres sont lus depuis la SOT, jamais écrits ici : le
       * comparatif plus bas lit la même source, et deux tableaux de prix qui
       * divergent est une faute qu'on ne voit qu'une fois vendue.
       *
       * Corollaire tenu ailleurs dans ce fichier : plus aucune puce ne répète
       * un de ces nombres. Un seul forfait le faisait, ce qui le faisait passer
       * pour le seul à être plafonné alors qu'ils le sont tous. */}
      {/* ── PLUS DE CARTE DANS LA CARTE (Eric, 2026-08-14) ─────────────────
          Les trois limites vivaient dans un rectangle sombre a fond plein :
          sur mobile, la page devenait une pile de boites imbriquees, un
          langage de tableau de bord SaaS plutot que celui d'iQWine. Elles
          deviennent une COMPOSITION TYPOGRAPHIQUE, tenue par deux filets et de
          l'espace : le nombre porte le poids, le mot reste discret. Aucune
          information n'est retiree, les trois chiffres viennent toujours de
          `plans.ts`. */}
      <div className={`mb-7 space-y-2 border-y py-4 ${jour ? "border-encre/10" : "border-border"}`}>
        {/* `tabular-nums` sur le paragraphe entier, et non sur un `<span>` :
         * l'étiquette rend une phrase complète (« Jusqu'à 100 bouteilles », ou
         * « Bouteilles illimitées » quand il n'y a pas de plafond), le nombre
         * n'est donc pas isolable. Sans ça, le « 100 » du Gratuit et le « 200 »
         * du Standard ne s'alignent pas d'une carte à l'autre. */}
        <p className={`text-[14.5px] font-medium leading-snug tabular-nums ${jour ? "text-encre" : "text-foreground"}`}>
          {maxBottlesLabel(plan, locale)}
        </p>
        <p className={`text-[14px] leading-snug ${jour ? "text-encre-2" : "text-foreground"}`}>
          <span className={`tabular-nums font-medium ${jour ? "text-encre" : ""}`}>
            {plan.monthlyRecommendations}
          </span>{" "}
          {/* « advice » est indénombrable en anglais : « pieces of », sans quoi
              le nombre qui précède rendrait « 50 personalized advice ». */}
          {t("conseils personnalisés d’Octave / mois", "pieces of personalized advice / month")}
        </p>
        <p className={`text-[14px] leading-snug ${jour ? "text-encre-2" : "text-foreground-dim"}`}>
          <span className={`tabular-nums font-medium ${jour ? "text-encre" : ""}`}>{plan.includedUsers}</span>{" "}
          {plan.includedUsers > 1
            ? t("utilisateurs inclus", "users included")
            : t("utilisateur", "user")}
        </p>
      </div>

      {/* CE QU'EST UN CONSEIL, sous les chiffres et pas ailleurs.
       *
       * Le nombre seul ne répond pas à la question qui bloque l'achat : est-ce
       * que remplir ma cave l'entame ? La réponse est non, et c'est le meilleur
       * argument que ce forfait possède. Elle se dit donc ici, à l'endroit
       * exact du doute.
       *
       * NOTE DE BAS DE BLOC, jamais un encadré ni une pastille : elle explique
       * les chiffres, elle ne leur dispute pas le regard. D'où le corps réduit,
       * la teinte estompée et l'absence de fond. La rendre visible reviendrait
       * à annoncer une limite là où on décrit une liberté.
       *
       * Le texte vient de `CONSEILS_NOTE` (`lib/plans.ts`) : il paraît aussi
       * sous le comparatif, et deux rédactions de la même promesse divergent. */}
      <p
        className={`-mt-4 mb-7 text-[12.5px] leading-snug ${jour ? "text-encre-3" : "text-foreground-faint"}`}
      >
        {t(CONSEILS_NOTE.fr, CONSEILS_NOTE.en)}
      </p>

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
          // Le Gratuit ne transporte PAS de période : il n'en a pas.
          href={buildSignupUrl("pricing_card", {
            plan: plan.id,
            period: gratuit ? undefined : billingPeriod,
            lang: locale,
          })}
          onClick={() =>
            track(ANALYTICS_EVENTS.PLAN_SELECTED, {
              plan: plan.id,
              period: gratuit ? "none" : billingPeriod,
            })
          }
          className="block"
        >
          <Button
            variant={jour ? (highlight ? "primary" : "secondary") : highlight ? "cta" : "secondary"}
            size="lg"
            className={`w-full ${jour && !highlight ? "!border-encre/25 !bg-transparent !text-encre hover:!bg-encre/5 hover:!border-encre/35" : ""}`}
          >
            {gratuit
              ? t("Commencer gratuitement", "Start for free")
              : t(`Choisir ${copy.name.fr}`, `Choose ${copy.name.en}`)}
            <ArrowRight size={16} strokeWidth={1.75} />
          </Button>
        </a>

        {/* Inversion du risque, on désamorce l'engagement juste sous le CTA. */}
        <p className={`mt-3 text-center text-[13px] leading-snug ${jour ? "text-encre-3" : "iq-small text-foreground-dim"}`}>
          {gratuit
            ? t(
                "Aucune carte de crédit, à aucun moment. Votre cave reste la vôtre.",
                "No credit card, ever. Your cellar stays yours.",
              )
            : t(
                "Sans engagement. Résiliable en un geste. Vous ne payez que si vous décidez de rester.",
                "No commitment. Cancel in one tap. You only pay if you choose to stay.",
              )}
        </p>
      </div>
    </div>
  );
}
