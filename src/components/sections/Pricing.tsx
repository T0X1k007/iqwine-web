"use client";

import LocaleLink from "@/components/ui/LocaleLink";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/motion/FadeInOnScroll";
import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { buildSignupUrl } from "@/lib/constants";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import {
  TRIAL_ON_SIGNUP,
  TRIAL_ENDS_FREE,
  FREE_ALWAYS,
  SIGNUP_CTA,
} from "@/lib/trial";
import {
  GRILLE,
  formatPriceCad,
  formatPriceCadShort,
  annualSavingsSentence,
  monthlyEquivalentCents,
  maxBottlesLabel,
  CONSEILS_NOTE,
  LAUNCH_PRICE,
  LAUNCH_PRICE_NOTE,
  planLabel,
  type MarketingPlan,
  type PlanId,
} from "@/lib/plans";

/**
 * LA GRILLE, trois cartes, dans l'ordre : Gratuit · Passionné · Premium.
 * (Lit la SOT `src/lib/plans.ts`, aucune valeur écrite ici.)
 *
 * ── Ce que la refonte du 2026-09-13 a changé ──────────────────────────────
 * Quatre paliers sont devenus trois, le Gratuit est ENTRÉ dans la grille comme
 * première colonne à 0 $ (il vivait sous les cartes, dans une bande d'un rang
 * visuel inférieur), et le RECOMMANDÉ est passé du palier haut au Passionné :
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
    tagline: {
      fr: "Commencez votre cave, gardez vos souvenirs et découvrez Octave gratuitement.",
      en: "Start your cellar, keep your memories, and discover Octave for free.",
    },
    // ⚠️ « Un avant-goût d'Octave » a été RETIRÉ le 2026-09-14. « Avant-goût »
    // désigne ce qui précède autre chose : le mot rangeait, à lui seul, le
    // forfait permanent dans la catégorie des préliminaires — exactement la
    // confusion que cette page devait lever. Aucun mot de cette carte ne doit
    // situer le Gratuit AVANT quoi que ce soit.
    features: [
      {
        fr: "Sans carte de crédit, à aucun moment",
        en: "No credit card, ever",
      },
      {
        fr: "Votre cave et vos souvenirs, sans date de fin",
        en: "Your cellar and your memories, with no end date",
      },
      {
        fr: "Octave vous conseille chaque mois, pour toujours",
        en: "Octave advises you every month, forever",
      },
    ],
  },
  standard: {
    tagline: {
      fr: "Octave apprend votre palais et vous aide à choisir la bonne bouteille, chez vous et au quotidien.",
      en: "Octave learns your palate and helps you choose the right bottle, at home and every day.",
    },
    // ⚠️ NE PAS FAIRE REPOSER CETTE CARTE SUR LA TAILLE DE LA CAVE (2026-09-13).
    // Depuis que le Gratuit monte à 100 bouteilles, l'écart n'est plus qu'un
    // facteur deux : réel, mais secondaire. Ce qui vend le Passionné, c'est
    // 50 conseils par mois contre 2, donc la fréquence et le palais qu'elle
    // permet d'affiner. La cave passe en troisième, et sans emphase.
    features: [
      {
        fr: "Assez de conseils pour qu’Octave apprenne vraiment votre palais",
        en: "Enough advice for Octave to truly learn your palate",
      },
      {
        fr: "De quoi lui demander la bonne bouteille plusieurs fois par semaine",
        en: "Enough to ask him for the right bottle several times a week",
      },
      {
        fr: "Une cave qui grandit avec vous",
        en: "A cellar that grows with you",
      },
    ],
  },
  // « Premium » à l'écran, `pro` dans le code et dans la facturation (voir
  // `PlanId`). Ses trois puces disent ses trois vraies différences : la cave
  // sans plafond, la fréquence, et les palais qui ne se mélangent pas.
  pro: {
    tagline: {
      fr: "Octave vous accompagne partout, avec une cave sans limite et jusqu’à quatre utilisateurs.",
      en: "Octave goes with you everywhere, with a limitless cellar and up to four users.",
    },
    features: [
      {
        fr: "Une cave sans plafond, la collection d’une vie",
        en: "A cellar with no ceiling, a lifetime’s collection",
      },
      // Le partage est le seul « verrou » réel de la grille, et il est
      // purement numérique : l'application refuse une invitation dès que le
      // forfait n'inclut qu'une place. Il se dit donc par les palais, pas par
      // une fonction qu'on « débloquerait ».
      {
        fr: "Chacun son palais : les goûts ne se mélangent jamais",
        en: "Each their own palate: tastes never blend",
      },
      {
        fr: "Assez de conseils pour recevoir toutes les semaines",
        en: "Enough advice to host every week",
      },
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
export default function Pricing({
  ton = "nuit",
}: { ton?: "jour" | "nuit" } = {}) {
  const jour = ton === "jour";
  const { locale } = useLocale();
  // Annuel par défaut : on présente d'emblée la formule la plus avantageuse.
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "yearly",
  );
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  const selectPeriod = (period: "monthly" | "yearly") => {
    setBillingPeriod(period);
    track(ANALYTICS_EVENTS.BILLING_PERIOD_TOGGLE, { period });
  };

  return (
    <SectionWrapper
      id="pricing"
      tone={jour ? undefined : "light"}
      withDivider={!jour}
      rhythm="editorial"
      className={jour ? "mouvement-jour" : ""}
    >
      {/* ── EN-TETE ALLEGE (v3, 2026-08-14) ────────────────────────────────
          Il portait un oeil-de-boeuf « Tarification », un H2 « Trois formules,
          un seul Octave » et un chapeau sur l'essai : les trois redisaient le
          hero de /tarifs, situe 400 px plus haut, et repoussaient d'autant le
          premier prix. Seul l'ancrage de valeur reste, c'est le seul element
          qui n'existe nulle part ailleurs. */}
      <FadeInOnScroll>
        <div className="text-center mb-8 sm:mb-10">
          <p
            className={`mx-auto max-w-2xl font-[family-name:var(--font-display)] text-[17px] italic leading-relaxed sm:text-lg ${jour ? "text-or-jour" : "text-or"}`}
          >
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
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium tracking-wide ${jour ? "bg-or-jour/12 text-or-jour" : "bg-or/12 text-or"}`}
              >
                {t(LAUNCH_PRICE.fr, LAUNCH_PRICE.en)}
              </span>
            )}
            <span
              className={`text-[13px] ${jour ? "text-encre-3" : "iq-small text-foreground-dim"}`}
            >
              {billingPeriod === "yearly"
                ? t(LAUNCH_PRICE_NOTE.fr, LAUNCH_PRICE_NOTE.en)
                : t(
                    "Sans engagement, résiliable en tout temps.",
                    "No commitment, cancel anytime.",
                  )}
            </span>
          </div>
        </div>
      </FadeInOnScroll>

      {/* LE SOCLE COMMUN A ÉTÉ RETIRÉ D'ICI (Eric, 2026-09-14), après l'avoir
          vu sur la page en production. Deux paragraphes explicatifs entre le
          sélecteur et la grille repoussaient les cartes sous la ligne de
          flottaison — le visiteur lisait une leçon avant de voir une offre.

          La promesse n'est PAS perdue : `COMMON_BASE_NOTE` paraît toujours
          au-dessus du comparatif (`TarifsContent`), là où quelqu'un compare
          vraiment les forfaits et où la question « faut-il payer plus pour
          avoir le vrai produit ? » se pose réellement. Ne la remettez pas ici
          sans la retirer de là-bas : deux rédactions de la même promesse
          divergent, c'est ce que le commentaire précédent redoutait déjà. */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 max-w-6xl mx-auto items-stretch">
        {/* `GRILLE` et non `PLANS` : la première carte est le Gratuit, qui n'a
            pas de prix et ne fait donc pas partie du parcours d'achat.
            AUCUN `order-first` ici (retiré le 2026-09-13) : il remontait le
            recommandé en tête sur mobile, ce qui plaçait le palier payé AVANT
            Gratuit et cassait la lecture Gratuit → Passionné → Premium, qui est
            précisément la progression que la grille raconte. */}
        {GRILLE.map((plan, i) => (
          <FadeInOnScroll
            key={plan.id}
            delay={0.12 + i * 0.1}
            className="h-full"
          >
            <PlanCard
              plan={plan}
              locale={locale}
              billingPeriod={billingPeriod}
              jour={jour}
            />
          </FadeInOnScroll>
        ))}
      </div>

      {/* ══ LE MODÈLE, SOUS LA GRILLE ET NULLE PART AILLEURS ═══════════════
          (Eric, 2026-09-14)

          Une seule ligne, en texte courant, qui dit le parcours entier : on
          entre gratuitement, on reçoit le Passionné 14 jours, puis on choisit.

          ── Pourquoi ICI ────────────────────────────────────────────────────
          • Pas au-dessus de la grille : le lecteur n'a pas encore de forfaits
            en tête, la phrase n'aurait aucun objet auquel s'accrocher.
          • Pas sous la bascule mensuel/annuel : cette zone porte déjà deux
            lignes de petit texte (« Prix de lancement » et sa note).
          • Pas dans un encadré, JAMAIS. La consigne de forme est absolue :
            aucun quatrième objet sélectionnable. Du texte courant, centré,
            sans fond ni filet, ne peut pas se prendre pour une carte.

          ── Pourquoi une flèche, et pourquoi EN FLUX ─────────────────────────
          La phrase décrit un PARCOURS dans le temps. D'un seul tenant, elle se
          lit comme une liste de conditions ; scandée par une flèche, elle se
          lit comme un chemin. Le second temps porte le poids typographique :
          c'est celui qui lève la peur.

          ⚠️ EN FLUX DE TEXTE, PAS EN FLEX (corrigé après relecture en rendu
          réel). Les deux temps ont vécu dans deux `<p>` d'une rangée flex : à
          1440 px, le premier repliait « 14 jours. » seul sur une deuxième
          ligne et la flèche se retrouvait centrée entre deux blocs de largeurs
          inégales — la ligne la plus importante de la page était la plus mal
          composée. En flux, la coupure tombe où la mesure l'impose. */}
      <FadeInOnScroll delay={0.44}>
        <p
          className={`mx-auto mt-10 max-w-[64ch] text-balance text-center text-[15.5px] leading-relaxed md:text-[17px] ${jour ? "text-encre-2" : "text-foreground-dim"}`}
        >
          {/* Premier temps et flèche SOLIDAIRES au-dessus de 640 px : sans ça,
              `text-balance` rejetait le début du second temps à la fin de la
              première ligne et cassait le rythme. En dessous, le texte se
              replie librement — figer une ligne longue sur un téléphone la
              ferait déborder. */}
          <span className="sm:whitespace-nowrap">
            {t(
              `Inscription gratuite, ${TRIAL_ON_SIGNUP.fr}.`,
              `Free sign-up, ${TRIAL_ON_SIGNUP.en}.`,
            )}{" "}
            <span
              aria-hidden
              className={`px-0.5 font-body ${jour ? "text-or-jour" : "text-or"}`}
            >
              →
            </span>
          </span>{" "}
          {/* `sm:block` : le second temps prend sa propre ligne dès qu'il y a
              la place, pour que les deux battements restent lisibles comme
              deux étapes et non comme une phrase continue. */}
          <strong
            className={`font-medium sm:block ${jour ? "text-encre" : "text-foreground"}`}
          >
            {t(
              "Ensuite : Gratuit, Passionné ou Premium, à vous de voir.",
              "Then: Free, Enthusiast or Premium, up to you.",
            )}
          </strong>
        </p>
      </FadeInOnScroll>

      {/* ── LA BANDE HORIZONTALE DU GRATUIT A DISPARU (Eric, 2026-09-13) ──
          Elle existait parce que le Gratuit n'avait pas sa place dans la
          grille : il sortait sous les trois cartes payantes, délibérément d'un
          rang visuel inférieur, « sans jamais concurrencer le Pro ». La grille
          n'a plus que trois colonnes, le Gratuit en occupe la première, et il
          n'a plus besoin d'une seconde apparition.
          NE PAS LA RÉTABLIR : deux présentations du même forfait sur un même
          écran, c'est deux copies à tenir, et l'une des deux finit par mentir. */}

      {/* « POURQUOI UN ABONNEMENT ? » A ÉTÉ RETIRÉ (Eric, 2026-09-14), vu sur
          la page en production. La v3 l'avait déplacé du haut vers le bas de
          section, pour que l'objection « pourquoi pas un achat unique » se pose
          APRÈS les prix et non avant. Ce placement était juste ; c'est la
          réponse elle-même qui n'a plus lieu d'être ici.

          La page ne défend plus le principe de l'abonnement : elle ouvre sur un
          forfait Gratuit permanent et sur quatorze jours de Passionné offerts.
          Justifier l'abonnement sous une grille qui commence à 0 $ répond à une
          objection que la page vient de désamorcer — et la rappeler la réveille.

          NE PAS LA RÉTABLIR sans que la grille ait cessé d'offrir une porte
          gratuite : c'est cette porte, et non un argument, qui traite
          l'objection aujourd'hui. */}

      {/* Au-delà de quatre membres : pas de cinquième palier public, on compose
          sur mesure. Ton éditorial, invitation. */}
      <FadeInOnScroll delay={0.4}>
        <p
          className={`mx-auto mt-12 max-w-xl text-center text-[13.5px] ${jour ? "text-encre-2" : "iq-small text-foreground-dim"}`}
        >
          {t("Plus de quatre membres ? ", "More than four members? ")}
          <LocaleLink
            href="/contact"
            className={`underline underline-offset-4 ${jour ? "text-bordeaux-jour hover:text-or-jour" : "text-or hover:text-or/80"}`}
          >
            {t("Écrivez-nous", "Write to us")}
          </LocaleLink>
          {t(
            ", on compose l’accès qu’il vous faut.",
            ", we’ll tailor the right access.",
          )}
        </p>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.5}>
        <div className="mt-16 text-center max-w-2xl mx-auto">
          {/* ⚠️ CETTE BANDE NE PORTE PLUS DE DURÉE (Eric, 2026-09-14), et ne
              doit jamais en reprendre une. Elle disait « 14 jours ou 12
              conseils · Aucune carte requise », pleine largeur, sous les trois
              colonnes — donc aussi sous le Gratuit, à qui elle donnait une
              échéance qu'il n'a pas. C'était la source la plus coûteuse de la
              confusion, parce qu'elle n'était fausse par aucun mot : seulement
              par sa largeur.
              La durée de l'essai vit sur la carte du Passionné, et la séquence
              complète juste sous la grille. Ici, on ne garde que ce qui vaut
              VRAIMENT pour les trois forfaits. */}
          <p
            className={`font-body text-[10px] uppercase leading-relaxed tracking-[0.22em] ${jour ? "text-encre-3" : "text-foreground-faint"}`}
          >
            {locale === "fr"
              ? "Aucune carte requise · Résiliable en tout temps · TPS et TVQ en sus"
              : "No credit card required · Cancel anytime · GST/QST extra"}
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

  /**
   * ⚠️ IL N'Y A PLUS DE DRAPEAU « ESSAI » SUR UNE CARTE (Eric, 2026-09-14).
   *
   * Une première version en posait un sur la carte Standard : ligne dorée
   * « 14 jours gratuits », bouton « Essayer Standard gratuitement ». C'était
   * déjà mieux qu'un essai flottant au-dessus des trois colonnes, mais cela
   * laissait DEUX objets à comparer — un forfait et une modalité — donc encore
   * une question à trancher avant de choisir.
   *
   * Les 14 jours sont désormais un BÉNÉFICE DE L'INSCRIPTION, reçu par toute
   * nouvelle entrée, y compris par la carte Gratuit. Ils s'annoncent donc là
   * où l'on entre — sur le Gratuit — et jamais comme une option à cocher.
   * Le Passionné redevient un forfait qu'on choisit, tout simplement.
   */

  // Le grand nombre en annuel = l'équivalent MENSUEL (pas la facture annuelle).
  const bigCents = annuel
    ? monthlyEquivalentCents(plan)
    : plan.priceMonthlyCents;

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
      {/* ── LE MÊME EMPLACEMENT, DEUX POIDS (2026-09-14) ───────────────────
          Le Gratuit reçoit lui aussi un bandeau, et il dit la seule chose que
          le visiteur avait besoin d'entendre : ce forfait ne se termine pas.
          Sans lui, la permanence n'existait qu'en 13,5 px sous le « 0 », face
          à des « gratuit » de toutes tailles ailleurs sur la page.

          Il est DÉLIBÉRÉMENT plus faible que « Recommandé » : filet et teinte
          estompée contre aplat d'or plein. Deux bandeaux de même force
          feraient deux recommandations, et le Passionné cesserait d'être le choix
          mis en avant. Même emplacement + poids différent = une hiérarchie ;
          c'est exactement ce qu'on veut dire — les deux cartes se lisent
          ensemble, l'une est conseillée, l'autre ne finit jamais. */}
      {highlight ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1 font-body text-[10px] font-medium uppercase tracking-[0.22em] ${jour ? "bg-or-jour text-papier" : "bg-or text-on-gold"}`}
          >
            {t("Recommandé", "Recommended")}
          </span>
        </div>
      ) : gratuit ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-1 font-body text-[10px] font-medium uppercase tracking-[0.22em] ${jour ? "border-or-jour/45 bg-papier text-or-jour" : "border-or/45 bg-card text-or"}`}
          >
            {t(TRIAL_ON_SIGNUP.fr, TRIAL_ON_SIGNUP.en)}
          </span>
        </div>
      ) : null}

      <div className="mb-6">
        <h3
          className={`mb-2 font-[family-name:var(--font-display)] text-3xl italic tracking-[-0.01em] sm:text-4xl ${jour ? "text-encre" : "text-foreground"}`}
        >
          {planLabel(plan.id, locale)}
        </h3>
        <p
          className={`text-[14px] leading-snug sm:min-h-[2.75rem] ${jour ? "text-encre-2" : "iq-small text-foreground-dim"}`}
        >
          {copy.tagline[locale]}
        </p>
      </div>

      {/* Prix, en annuel, le grand nombre est l'ÉQUIVALENT MENSUEL ; le mensuel
          plein est barré à côté et la facture annuelle passe en sous-ligne. */}
      <div className="flex items-baseline gap-2 mb-1">
        <span
          className={`font-[family-name:var(--font-display)] text-[56px] italic leading-none tracking-[-0.025em] tabular-nums sm:text-[68px] ${jour ? "text-bordeaux-jour" : "text-or"}`}
        >
          {/* « 0 » et non « 0,00 » : deux décimales sur la gratuité font lire un
              prix là où il n'y en a pas. */}
          {gratuit ? "0" : formatPriceCad(bigCents, locale)}
        </span>
        {annuel && (
          <span
            className={`font-body text-base tabular-nums line-through ${jour ? "text-encre-3" : "text-foreground-faint"}`}
          >
            {formatPriceCad(plan.priceMonthlyCents, locale)}
          </span>
        )}
        <span
          className={`font-body text-[11px] uppercase tracking-[0.18em] ${jour ? "text-encre-3" : "text-foreground-faint"}`}
        >
          $ CAD
        </span>
      </div>
      <p
        className={`mb-1.5 font-body text-[11px] uppercase tracking-[0.22em] ${jour ? "text-encre-3" : "text-muted-foreground"}`}
      >
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
            {t(`${FREE_ALWAYS.fr}.`, `${FREE_ALWAYS.en}.`)}
          </span>
        ) : annuel ? (
          <span className="flex flex-col gap-1">
            <span
              className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${jour ? "text-encre-2" : "text-foreground-dim"}`}
            >
              <span>
                {t(
                  `Facturé ${formatPriceCadShort(plan.priceYearlyCents, locale)} $ annuellement.`,
                  `Billed $${formatPriceCadShort(plan.priceYearlyCents, locale)} yearly.`,
                )}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 font-body text-[10px] font-medium uppercase tracking-[0.14em] ${jour ? "bg-or-jour/12 text-or-jour" : "bg-or/12 text-or"}`}
              >
                {t(LAUNCH_PRICE.fr, LAUNCH_PRICE.en)}
              </span>
            </span>
            <span
              className={`font-medium tabular-nums ${jour ? "text-or-jour" : "text-or"}`}
            >
              {annualSavingsSentence(plan, locale)}
            </span>
          </span>
        ) : (
          <span className={jour ? "text-encre-2" : "text-foreground-dim"}>
            {t("Facturé chaque mois.", "Billed each month.")}
          </span>
        )}
      </p>

      {/* Ce qui est inclus, LES TROIS limites réelles, jamais de tokens.
       *
       * ── Ce que cet encadré a corrigé (Eric, 2026-08-02) ──────────────────
       * Il n'annonçait que les recommandations et les utilisateurs. Le plafond
       * de BOUTEILLES n'apparaissait nulle part sur la carte, ni ici, ni dans
       * les puces, alors que c'est la limite qui arrête un client pour de
       * vrai : 100 au Gratuit, 200 au Passionné. On vendait un plafond sans le
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
      <div
        className={`mb-7 space-y-2 border-y py-4 ${jour ? "border-encre/10" : "border-border"}`}
      >
        {/* `tabular-nums` sur le paragraphe entier, et non sur un `<span>` :
         * l'étiquette rend une phrase complète (« Jusqu'à 100 bouteilles », ou
         * « Bouteilles illimitées » quand il n'y a pas de plafond), le nombre
         * n'est donc pas isolable. Sans ça, le « 100 » du Gratuit et le « 200 »
         * du Passionné ne s'alignent pas d'une carte à l'autre. */}
        <p
          className={`text-[14.5px] font-medium leading-snug tabular-nums ${jour ? "text-encre" : "text-foreground"}`}
        >
          {maxBottlesLabel(plan, locale)}
        </p>
        <p
          className={`text-[14px] leading-snug ${jour ? "text-encre-2" : "text-foreground"}`}
        >
          <span
            className={`tabular-nums font-medium ${jour ? "text-encre" : ""}`}
          >
            {plan.monthlyRecommendations}
          </span>{" "}
          {/* « advice » est indénombrable en anglais : « pieces of », sans quoi
              le nombre qui précède rendrait « 50 personalized advice ». */}
          {t(
            "conseils personnalisés d’Octave / mois",
            "pieces of personalized advice / month",
          )}
        </p>
        <p
          className={`text-[14px] leading-snug ${jour ? "text-encre-2" : "text-foreground-dim"}`}
        >
          <span
            className={`tabular-nums font-medium ${jour ? "text-encre" : ""}`}
          >
            {plan.includedUsers}
          </span>{" "}
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
            <span
              className={`text-[14px] leading-snug ${jour ? "text-encre-2" : "iq-small text-foreground-dim"}`}
            >
              {feature[locale]}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {/* ── L'ESSAI VIT ICI, ET NULLE PART AILLEURS DANS LA GRILLE ────────
            (Eric, 2026-09-14)

            Il tenait auparavant dans une bande sous les TROIS cartes
            (« 14 jours ou 12 conseils · Aucune carte requise »). Une bande
            pleine largeur appartient typographiquement à tout ce qu'elle
            souligne : elle posait donc un compte à rebours sous la colonne du
            Gratuit, et c'est là que naissait la confusion — pas dans un mot,
            dans un alignement.

            L'essai est une MODALITÉ D'ACCÈS AU STANDARD. Il se dit donc sur la
            carte du Passionné, à l'endroit exact de la décision, en trois
            degrés décroissants : la durée (en or, elle porte le regard), le
            bouton, puis la sortie. Aucun encadré, aucun bandeau : un essai qui
            prendrait la forme d'une carte redeviendrait un quatrième forfait. */}
        <a
          /**
           * ⚠️ LE GRATUIT NE TRANSPORTE PLUS `plan` (Eric, 2026-09-14). C'EST
           * UN CORRECTIF DE VÉRITÉ, PAS UNE SIMPLIFICATION — NE PAS LE DÉFAIRE.
           *
           * Cette carte envoyait `?plan=gratuit`, que l'application lit comme
           * un choix EXPLICITE de forfait Gratuit : elle pose alors
           * `trialDays: 0` et n'accorde AUCUN jour de Passionné. La page aurait
           * donc promis « Standard offert les 14 premiers jours » sur la seule
           * carte dont le bouton demandait, en silence, de ne rien offrir.
           *
           * Sans `plan`, l'inscription passe par la porte par défaut, celle
           * qui accorde les 14 jours. C'est la porte UNIQUE du nouveau modèle.
           *
           * Les cartes payantes, elles, gardent leur `plan` : elles expriment
           * un choix d'abonnement réel, pas une entrée dans le produit.
           * `period` n'accompagne que celles-là — un forfait sans prix n'a pas
           * de période de facturation.
           */
          href={buildSignupUrl("pricing_card", {
            plan: gratuit ? undefined : plan.id,
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
            variant={
              jour
                ? highlight
                  ? "primary"
                  : "secondary"
                : highlight
                  ? "cta"
                  : "secondary"
            }
            size="lg"
            className={`w-full ${jour && !highlight ? "!border-encre/25 !bg-transparent !text-encre hover:!bg-encre/5 hover:!border-encre/35" : ""}`}
          >
            {gratuit
              ? t(SIGNUP_CTA.fr, SIGNUP_CTA.en)
              : t(
                  `Choisir ${planLabel(plan.id, "fr")}`,
                  `Choose ${planLabel(plan.id, "en")}`,
                )}
            <ArrowRight size={16} strokeWidth={1.75} />
          </Button>
        </a>

        {/* ── TROIS NOTES QUI SE LISENT EN RANGÉE, ET S'OPPOSENT ────────────
            Elles occupent la même ligne d'un bout à l'autre de la grille, au
            même corps : c'est le seul endroit de la page où les trois forfaits
            se comparent MOT À MOT sur le temps. Le Gratuit y dit « jamais de
            date de fin », le Passionné y dit « à la fin de l'essai, vous passez
            au forfait Gratuit ». Lues côte à côte, elles rendent la confusion
            impossible sans qu'aucune des deux n'ait à expliquer l'autre.

            La note du Passionné ne parlait que d'abonnement (« Vous ne payez
            que si vous décidez de rester »), ce qui laissait supposer qu'à
            défaut de payer il ne restait rien. */}
        {/* HAUTEUR RÉSERVÉE IDENTIQUE aux trois notes (Eric, 2026-09-14).
            Le bloc du bouton est ancré en bas (`mt-auto`) : une note plus
            haute REMONTE donc son bouton. Celle du Gratuit faisait quatre
            lignes contre deux aux payantes, et les trois boutons ne
            s'alignaient pas. Raccourcir le texte ne suffit pas — la prochaine
            réécriture le rallongerait. On réserve la place, et l'alignement
            survit à la copie. */}
        <p
          className={`mt-3 min-h-[3.5rem] text-center text-[13px] leading-snug ${jour ? "text-encre-3" : "iq-small text-foreground-dim"}`}
        >
          {gratuit
            ? // La carte d'entrée porte la SUITE du bénéfice annoncé par son
              // bandeau : ce qu'on reçoit, puis où l'on atterrit. Sans cette
              // seconde moitié, « Standard offert 14 jours » se lirait comme
              // une échéance posée sur le forfait permanent.
              t(TRIAL_ENDS_FREE.fr, TRIAL_ENDS_FREE.en)
            : t(
                "Sans engagement. Résiliable en un geste. Vous ne payez que si vous décidez de rester.",
                "No commitment. Cancel in one tap. You only pay if you choose to stay.",
              )}
        </p>
      </div>
    </div>
  );
}
