'use client';

import LocaleLink from '@/components/ui/LocaleLink';
import { ArrowRight, Check, Minus, ShieldCheck, CalendarClock, Lock, XCircle, Smartphone } from 'lucide-react';
import OctaveWordmark from '@/components/octave/OctaveWordmark';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import Pricing from '@/components/sections/Pricing';
import SectionFaq from '@/components/sections/SectionFaq';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import {
  PLANS,
  FREE_PLAN,
  formatPriceCad,
  planLabel,
  INTERACTION_NOTE,
  type MarketingPlan,
} from '@/lib/plans';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { TRIAL_CTA, TRIAL_SHORT, TRIAL_FULL } from '@/lib/trial';

/**
 * /tarifs, page de DÉCISION. Aide le visiteur à choisir (positionnement par
 * profil), puis les prix, le « comment ça marche », les bénéfices, la FAQ, les
 * plateformes, un CTA. Contenu 100 % original. Réutilise Pricing + SectionFaq.
 */

type T = (fr: string, en: string) => string;

// POSITIONS retire (v3, 2026-08-14) : la section « Lequel est pour vous »
// doublonnait la tagline portee par chaque carte de forfait.

// STEPS et BENEFITS retires (v3, 2026-08-14) : leurs sections ont fusionne en
// une phrase + un lien vers /fonctions, ou ce contenu vit en entier. Les
// donnees ne servaient plus qu'a des sections supprimees.

const REASSURANCE: { icon: typeof ShieldCheck; fr: [string, string]; en: [string, string] }[] = [
  {
    icon: CalendarClock,
    fr: [TRIAL_CTA.fr, `${TRIAL_FULL.fr}. Découvrez Octave avant tout choix.`],
    en: [TRIAL_CTA.en, `${TRIAL_FULL.en}. Discover Octave before you choose.`],
  },
  {
    icon: XCircle,
    fr: ['Résiliable en tout temps', 'Aucun engagement, aucune pénalité.'],
    en: ['Cancel anytime', 'No commitment, no penalty.'],
  },
  {
    icon: Lock,
    fr: ['Données privées', 'Hébergées au Canada, jamais revendues.'],
    en: ['Private data', 'Hosted in Canada, never resold.'],
  },
  {
    icon: ShieldCheck,
    fr: ['Conçu au Québec', 'Pensé pour le marché local.'],
    en: ['Built in Québec', 'Made for the local market.'],
  },
  // « Plateformes » avait sa propre section pour UNE ligne (v3, 2026-08-14) :
  // elle rejoint les preuves, là où elle lève vraiment un doute.
  {
    icon: Smartphone,
    fr: ['iPhone et web', 'Votre cave vous suit, partout.'],
    en: ['iPhone and web', 'Your cellar follows you, everywhere.'],
  },
];

// Comparatif : il doit VENDRE LA MONTÉE EN GAMME, pas niveler les plans. Chaque
// cellule est soit un booléen (✓ /,), soit une « intensité » progressive
// (1→3 pastilles) qui montre qu’un même bénéfice s’enrichit avec le plan, soit
// un court texte qualitatif. Le palais qui apprend est VISIBLE dès Standard.
// Prix, recommandations et utilisateurs restent calculés depuis PLANS plus bas.
type CompareCell = boolean | { level: 1 | 2 | 3 } | { text: { fr: string; en: string } };

const COMPARE_FEATURES: {
  label: { fr: string; en: string };
  hint?: { fr: string; en: string };
  /** [Gratuit, Standard, Pro, Passionné] */
  values: [CompareCell, CompareCell, CompareCell, CompareCell];
}[] = [
  {
    label: { fr: 'Octave apprend votre palais', en: 'Octave learns your palate' },
    hint: { fr: 'Dès la première recommandation', en: 'From your very first recommendation' },
    // Le palais s'apprend sur TOUS les plans, Gratuit compris : c'est une capacité
    // universelle (la démo du moat), jamais un différenciateur.
    values: [true, true, true, true],
  },
  // RETIRÉ (P22/R3, 2026-07-16), « Profil de goût qui s'affine » affichait trois
  // niveaux croissants (1→2→3) : un différenciateur INVENTÉ. Le palais est
  // universel et identique sur tous les plans ; la ligne précédente le dit déjà.
  // L'app a retiré la même promesse (« Profil de goût avancé » / « Apprentissage
  // du palais ») en P21A Lot D, sa garde CI `pricing↔gates` les interdit désormais.
  {
    label: { fr: 'Mode restaurant', en: 'Restaurant mode' },
    hint: { fr: 'Un accord à partir de la carte', en: 'A pairing from the wine list' },
    values: [true, true, true, true],
  },
  {
    label: { fr: 'Disponibilité locale en direct', en: 'Live local availability' },
    values: [true, true, true, true],
  },
  {
    label: { fr: 'Carnet de dégustation', en: 'Tasting journal' },
    // La cave-mémoire est la promesse du Gratuit : le carnet en fait partie.
    // Cette ligne existe pour que le partage (ligne suivante) se lise comme un
    // SUPPLÉMENT et non comme la seule façon d'avoir un carnet.
    values: [true, true, true, true],
  },
  {
    label: { fr: 'Carnet partagé', en: 'Shared journal' },
    // Ce qui se partage, ce sont LES NOTES, jamais le goût. Le modèle `Tasting`
    // porte une note PAR USER : « toutes les notes sont visibles, mais le palais
    // de chacun n'est nourri que par SES propres notes ». Le palais est
    // strictement personnel côté app (`palateProfile` par `userId`,
    // `@@unique([userId, dimension, value])`) — la séparation est même un
    // CORRECTIF : en multi-utilisateur, le membre B écrasait la note de A et
    // héritait de son `userId`, corrompant le palais de A.
    //
    // D'où le libellé : « carnet partagé », jamais « mémoire de goût partagée »,
    // qui promettrait la mise en commun d'un palais que le produit sépare
    // exprès, et qui frôle les formulations bannies par `pricing-gates-guard`
    // (`/profil de goût avancé/i`, `/apprentissage du palais/i`).
    //
    // Gaté par le NOMBRE DE MEMBRES : `resolveCellarAttribution` se tait sous
    // deux membres, donc actif dès `includedUsers > 1`, soit Pro (2) et
    // Passionné (4).
    hint: {
      fr: 'Les notes de chacun, visibles de tous. Votre palais reste le vôtre.',
      en: 'Everyone’s notes, visible to all. Your palate stays yours.',
    },
    values: [false, false, true, true],
  },
  {
    label: { fr: 'Cave partagée', en: 'Shared cellar' },
    // Enfin VRAIE (P26, 2026-07-16) : inviter un compte existant, basculer de cave,
    // rôle lecture seule hermétique, journal familial. Elle était affichée ici
    // AVANT d'exister, le produit l'a rattrapée.
    // Pro était SOUS-VENDU : `plan-catalog.ts` donne `includedUsers` 1 / 2 / 4
    // (Standard / Pro / Passionné) et le verrou d'invitation de l'app est
    // purement numérique (`maxMembers <= 1` refuse), son message disant déjà
    // « Passez à Pro ou Passionné pour inviter des membres ». Le site était le
    // dernier endroit à prétendre le contraire. L'infobulle porte les DEUX
    // chiffres : un crochet nu sous « jusqu'à 4 personnes » promettrait quatre
    // places sur un forfait qui en a deux.
    hint: {
      fr: 'Une cave à plusieurs : 2 personnes sur Pro, 4 sur Passionné',
      en: 'One cellar, together: 2 people on Pro, 4 on Enthusiast',
    },
    values: [false, false, true, true],
  },
  // RETIRÉ (P22/R3, 2026-07-16), « Priorité à Octave / Vos demandes passent devant »
  // n'a JAMAIS existé : aucune file prioritaire n'est câblée. L'app l'a retirée en
  // P21A Lot D et sa garde CI l'interdit (`/priorité ia/i` dans BANNED). Le site
  // était le dernier endroit où cette promesse survivait.
];

/**
 * Les noms de forfaits, LOCALISÉS.
 *
 * C'était une table figée en français. Depuis la décision d'Eric, `famille`
 * s'affiche « Passionné » ou « Enthusiast » selon la langue, un LIBELLÉ, pas
 * un second produit : l'identifiant, le priceId et l'accès sont identiques.
 */
const planNames = (locale: 'fr' | 'en'): Record<string, string> => ({
  gratuit: planLabel('gratuit', locale),
  standard: planLabel('standard', locale),
  pro: planLabel('pro', locale),
  famille: planLabel('famille', locale),
});

/** Colonnes du comparatif : la porte gratuite EN TÊTE, puis les 3 vendables. */
const COMPARE_COLUMNS: MarketingPlan[] = [FREE_PLAN, ...PLANS];

// Rendu d’une cellule du comparatif. Le niveau d’intensité (1→3) se lit comme
// trois pastilles : plus elles sont dorées, plus le bénéfice s’enrichit avec le
// plan, il reste présent (et doré) dès le niveau 1, jamais barré.
function renderCompareCell(cell: CompareCell, t: T) {
  if (typeof cell === 'boolean') {
    return cell ? (
      <Check size={17} strokeWidth={2} className="inline text-or" aria-label={t('Inclus', 'Included')} />
    ) : (
      <Minus size={15} className="inline text-foreground-faint/50" aria-label={t('Non inclus', 'Not included')} />
    );
  }
  if ('level' in cell) {
    const labels = [t('De base', 'Baseline'), t('Approfondi', 'In-depth'), t('Le plus fin', 'Finest')] as const;
    return (
      <span
        className="inline-flex items-center gap-1"
        role="img"
        aria-label={labels[cell.level - 1]}
      >
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full ${n <= cell.level ? 'bg-or' : 'bg-foreground-faint/25'}`}
          />
        ))}
      </span>
    );
  }
  return (
    <span className="text-[13px] text-foreground">{t(cell.text.fr, cell.text.en)}</span>
  );
}

export default function TarifsContent() {
  const { locale } = useLocale();
  const t: T = (fr, en) => (locale === 'fr' ? fr : en);

  // Lignes chiffrées du comparatif, lues depuis PLANS (jamais de tokens).
  const numericRows = [
    {
      label: t('Prix par mois', 'Price per month'),
      cells: COMPARE_COLUMNS.map((p) =>
        p.priceMonthlyCents === 0 ? t('0 $', '$0') : `${formatPriceCad(p.priceMonthlyCents, locale)} $`,
      ),
    },
    {
      label: t('Interactions avec Octave / mois', 'Interactions with Octave / mo'),
      cells: COMPARE_COLUMNS.map((p) => p.monthlyRecommendations.toString()),
    },
    {
      label: t('Utilisateurs inclus', 'Users included'),
      cells: COMPARE_COLUMNS.map((p) => p.includedUsers.toString()),
    },
    {
      /**
       * MFP-09, le plafond de bouteilles, enfin visible.
       *
       * Il est appliqué par l'application depuis toujours et n'apparaissait
       * NULLE PART sur le site : un collectionneur de 400 bouteilles pouvait
       * souscrire Standard et heurter un mur à 200, après avoir importé sa
       * cave. C'est aussi le seul argument Standard → Pro qui existait déjà et
       * que personne n'utilisait.
       */
      label: t('Bouteilles au cellier', 'Bottles in the cellar'),
      cells: COMPARE_COLUMNS.map((p) =>
        p.maxBottles < 0
          ? t('Illimité', 'Unlimited')
          : p.maxBottles.toLocaleString(locale === 'en' ? 'en-CA' : 'fr-CA'),
      ),
    },
  ];

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      {/* ══ S1 · L'OUVERTURE — courte, le prix arrive juste apres ══════
          Mesure avant refonte : le premier prix apparaissait a 2 253 px, soit
          deux ecrans et demi. Le hero perd ~40 % de sa hauteur et la section
          « Lequel est pour vous » disparait (elle doublonnait les taglines des
          cartes). Le prix doit etre la premiere chose qu'on comprend. */}
      <section className="relative px-6 pb-8 pt-[calc(var(--nav-h)+1.5rem)] text-center sm:pt-[calc(var(--nav-h)+2.5rem)] lg:pb-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(142,42,42,0.10),transparent_70%)]" aria-hidden />
        <div className="relative mx-auto max-w-3xl">
          <p className="iq-eyebrow mb-4 sm:mb-6">{t('Tarifs', 'Pricing')}</p>
          {/* Moment d'identité, le mot-symbole ◯ctave dans le grand titre Cormorant
              italique (anneau incliné pour lire comme un O italique). */}
          {/* Echelle v3 (58 px maxi) : `iq-display` montait a 96 px, hors
              systeme et lent a lire sur une page de decision. */}
          <h1
            className="font-[family-name:var(--font-display)] font-medium italic leading-[1.08] tracking-[-0.02em] text-foreground"
            style={{ fontSize: 'clamp(34px, 5vw, 58px)' }}
          >
            {t('Trouvez votre ', 'Find your ')}
            <OctaveWordmark italic />.
          </h1>
          <p className="mx-auto mt-4 max-w-[56ch] text-[16.5px] leading-relaxed text-muted-foreground sm:mt-5 md:text-[17.5px]">
            {t(
              `Essayez gratuitement, ${TRIAL_FULL.fr}, sans carte. Vous choisissez après.`,
              `Try it free, ${TRIAL_FULL.en}, no card. You choose afterwards.`,
            )}
          </p>
          <div className="mt-6 flex justify-center sm:mt-7">
            <a
              href={buildSignupUrl('tarifs-hero', { lang: locale })}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'tarifs-hero' })}
            >
              <Button variant="cta" size="lg">
                {t(TRIAL_CTA.fr, TRIAL_CTA.en)}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>
          </div>
          <p className="mt-4 font-[family-name:var(--font-display)] text-[14.5px] italic text-or/85 sm:mt-5">
            {t(
              'Une application créée par des passionnés, pour des passionnés de vin.',
              'An app built by enthusiasts, for wine enthusiasts.',
            )}
          </p>
        </div>
      </section>

      {/* « Lequel est pour vous » RETIREE (v3, 2026-08-14) : ses trois
          profils redisaient, en moins bien, la tagline deja portee par chaque
          carte de forfait, et repoussaient le prix d'un ecran entier.
          L'information utile vit desormais dans les cartes elles-memes. */}

      {/* LES PRIX (réutilise la section Pricing : plans + toggle annuel) */}
      {/* La descente de la nuit du hero vers l'ivoire des prix : c'est la
          respiration qui manquait, et le moment ou la page redevient iQWine. */}
      <div
        aria-hidden
        className="h-24 w-full"
        style={{ background: 'linear-gradient(180deg, var(--color-background) 0%, #2a1d13 26%, var(--color-papier-2) 72%, var(--color-papier) 100%)' }}
      />
      <Pricing ton="jour" />

      {/* COMPARATIF DES PLANS */}
      {/* Retour a la NUIT pour le detail : on entre dans la comparaison. */}
      <div
        aria-hidden
        className="h-24 w-full"
        style={{ background: 'linear-gradient(180deg, var(--color-papier) 0%, var(--color-papier-2) 24%, #2a1d13 74%, var(--color-background) 100%)' }}
      />
      <section className="px-6 pb-16 lg:pb-24">
        <div className="mx-auto max-w-4xl">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <p className="iq-eyebrow mb-5">{t('Comparer', 'Compare')}</p>
              <h2 className="iq-h1 italic max-w-2xl mx-auto">
                {t(
                  'Le même Octave. Plus vous lui en confiez, mieux il vous connaît.',
                  'The same Octave. The more you entrust him, the better he knows you.',
                )}
              </h2>
            </div>
          </FadeInOnScroll>
          {/* Le tableau garde son defilement horizontal sur mobile : le
              convertir en cartes empilees detruirait la lecture COMPARATIVE,
              qui est tout l'objet de la section. On ajoute seulement
              l'affordance qui manquait, invisible des que tout tient. */}
          <p className="mb-3 text-center text-[12px] tracking-wide text-foreground-faint sm:hidden">
            {t('Faites glisser le tableau pour comparer', 'Swipe the table to compare')}
          </p>
          <FadeInOnScroll delay={0.1}>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[480px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 font-body text-[11px] tracking-[0.14em] uppercase text-foreground-faint font-normal">
                      {t('Fonctionnalité', 'Feature')}
                    </th>
                    {COMPARE_COLUMNS.map((p) => (
                      <th
                        key={p.id}
                        className={`p-4 text-center font-[family-name:var(--font-display)] italic text-lg ${p.highlight ? 'text-or' : 'text-foreground'}`}
                      >
                        {planNames(locale)[p.id]}
                        {p.highlight && (
                          <span className="block font-body not-italic text-[9px] tracking-[0.14em] uppercase text-or/70">
                            {t('Populaire', 'Popular')}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {numericRows.map((row, i) => (
                    <tr key={`n${i}`} className="border-b border-white/5">
                      <td className="p-4 text-[14px] text-muted-foreground">{row.label}</td>
                      {row.cells.map((c, j) => (
                        <td
                          key={j}
                          className={`p-4 text-center text-[15px] tabular-nums ${COMPARE_COLUMNS[j]?.highlight ? 'text-or bg-or/[0.04]' : 'text-foreground'}`}
                        >
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {COMPARE_FEATURES.map((row, i) => (
                    <tr key={`f${i}`} className="border-b border-white/5 last:border-0">
                      <td className="p-4">
                        <span className="block text-[14px] text-muted-foreground">
                          {locale === 'fr' ? row.label.fr : row.label.en}
                        </span>
                        {row.hint && (
                          <span className="block text-[12px] leading-snug text-foreground-faint/70 mt-0.5">
                            {locale === 'fr' ? row.hint.fr : row.hint.en}
                          </span>
                        )}
                      </td>
                      {row.values.map((v, j) => (
                        <td key={j} className={`p-4 text-center ${COMPARE_COLUMNS[j]?.highlight ? 'bg-or/[0.04]' : ''}`}>
                          {renderCompareCell(v, t)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CE QU'EST UNE INTERACTION. La ligne « Interactions avec Octave /
                mois » donne un nombre et rien d'autre ; le lecteur qui hésite
                se demande si remplir sa cave l'entame. La réponse est non, et
                elle vaut mieux que le nombre lui-même.

                NOTE DE BAS DE TABLEAU : hors de la grille, en petit, estompée.
                La mettre dans une cellule en ferait une caractéristique de plus
                à comparer, alors qu'elle vaut pour les quatre colonnes.

                Texte lu depuis `INTERACTION_NOTE` (`lib/plans.ts`), le même que
                sous chaque carte de prix : une seule promesse, une seule
                rédaction. */}
            <p className="mt-4 text-[12.5px] leading-snug text-foreground-faint">
              {t(INTERACTION_NOTE.fr, INTERACTION_NOTE.en)}
            </p>
          </FadeInOnScroll>

          {/* ── AGIR SANS REMONTER (v3, 2026-08-14) ────────────────────────
              Le manque le plus couteux de l'ancienne page : on comparait, puis
              il fallait remonter deux ecrans pour acheter. */}
          <FadeInOnScroll delay={0.16}>
            <div className="mt-10 text-center">
              <a
                href={buildSignupUrl('tarifs-comparatif', { lang: locale })}
                onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'tarifs-comparatif' })}
              >
                <Button variant="cta" size="lg">
                  {t(TRIAL_CTA.fr, TRIAL_CTA.en)}
                  <ArrowRight size={16} strokeWidth={1.75} />
                </Button>
              </a>
              <p className="mt-4 text-[13px] tracking-wide text-foreground-faint">
                {t(`Essai gratuit, ${TRIAL_SHORT.fr} · Sans carte`, `Free trial, ${TRIAL_SHORT.en} · No card required`)}
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ── S4 · LA REASSURANCE, remontee vers le jour ────────────────────
          Elle quitte la nuit : c'est le moment ou l'on rassure, donc celui ou
          la page doit s'eclaircir. Les quatre preuves et « iPhone et web »
          sont inchangees. */}
      <section
        className="mouvement-jour relative px-6 pb-14 pt-16 lg:pb-16"
        style={{ background: 'linear-gradient(180deg, var(--color-background) 0%, #2a1d13 8%, var(--color-papier-2) 36%, var(--color-papier) 100%)' }}
      >
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {REASSURANCE.map((r, i) => {
            const [title, body] = locale === 'fr' ? r.fr : r.en;
            const Icon = r.icon;
            return (
              <FadeInOnScroll key={i} delay={Math.min(i * 0.06, 0.24)}>
                <div className="h-full rounded-xl border border-encre/10 bg-[#fdfaf3]/70 p-5">
                  <Icon size={20} strokeWidth={1.6} className="mb-3 text-or-jour" aria-hidden />
                  <h3 className="font-[family-name:var(--font-display)] text-[17px] italic text-encre">{title}</h3>
                  <p className="text-muted-foreground text-[13px] leading-relaxed mt-1">{body}</p>
                </div>
              </FadeInOnScroll>
            );
          })}
        </div>
      </section>

      {/* LIEN VERS /octave, comprendre la puissance d'Octave au moment du choix */}
      <section className="mouvement-jour relative px-6 pb-8">
        <FadeInOnScroll>
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-5 rounded-2xl border border-or-jour/25 bg-[#fdfaf3]/70 p-7 text-center sm:flex-row sm:p-8 sm:text-left">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-xl italic text-encre">
                {t('Pas encore convaincu ?', 'Not convinced yet?')}
              </h3>
              <p className="mt-1 text-[15px] text-encre-2">
                {t(
                  'Voyez Octave à l’œuvre, et pourquoi ce n’est pas un assistant générique.',
                  'See Octave at work, and why it isn’t a generic assistant.',
                )}
              </p>
            </div>
            <LocaleLink href="/sommelier-ia" className="shrink-0">
              <Button variant="secondary" size="lg" className="!border-encre/25 !bg-transparent !text-encre hover:!bg-encre/5 hover:!border-encre/35">
                {t('Voir ce qu’Octave peut faire', 'See what Octave can do')}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </LocaleLink>
          </div>
        </FadeInOnScroll>
      </section>

      {/* ── S4 · « Comment ca fonctionne » et « Pourquoi les amateurs
          choisissent » RETIREES comme sections autonomes (v3, 2026-08-14).
          Elles racontaient, en 400 px chacune, ce que /fonctions raconte mieux
          et en entier ; sur une page de decision elles ralentissaient la
          conversion. Leur information utile tient desormais en une phrase et
          un lien. La section « Plateformes » (une seule ligne) rejoint la
          reassurance plus haut. */}
      <section className="mouvement-jour relative px-6 pb-14 lg:pb-16">
        <FadeInOnScroll>
          <p className="mx-auto max-w-[56ch] text-center text-[15.5px] leading-relaxed text-encre-2 md:text-[16.5px]">
            {t(
              'Octave vous accompagne au magasin, au restaurant, devant votre repas et dans votre cave. ',
              'Octave is with you in the store, at the restaurant, in front of your meal and in your cellar. ',
            )}
            <LocaleLink href="/fonctions" className="text-bordeaux-jour underline underline-offset-4 hover:text-or-jour">
              {t('Voir tout ce qu\u2019il fait', 'See everything he does')}
            </LocaleLink>
          </p>
        </FadeInOnScroll>
      </section>

      {/* FAQ (réutilise la section existante) */}
      <SectionFaq ton="jour" />

      {/* ══ S6 · LA CLOTURE — RETOUR AU JOUR ═══════════════════════════
          Le mouvement signature v3, comme /apogee : la nuit porte la
          comparaison et le choix, l'ivoire porte la resolution. */}
      <section
        className="mouvement-jour relative px-6 py-16 text-center lg:py-20"
        style={{ background: 'linear-gradient(180deg, #150f0c 0%, #2a1d13 7%, var(--color-papier-2) 30%, var(--color-papier) 100%)' }}
      >
        <FadeInOnScroll>
          <h2
            className="mx-auto max-w-[22ch] text-balance font-[family-name:var(--font-display)] font-medium italic leading-[1.16] tracking-[-0.02em] text-encre"
            style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}
          >
            {t('Votre sommelier vous attend.', 'Your sommelier is waiting.')}
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-[16px] leading-relaxed text-encre-2 md:text-[17px]">
            {t(`${TRIAL_SHORT.fr} pour rencontrer Octave. Aucune carte requise.`, `${TRIAL_SHORT.en} to meet Octave. No card required.`)}
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={buildSignupUrl('tarifs-final', { lang: locale })}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'tarifs-final' })}
            >
              {/* `primary` (bordeaux) et non `cta` (or) : sur l'ivoire, l'or
                  manque de contraste. Destination et libelle inchanges. */}
              <Button variant="primary" size="lg">
                {t(TRIAL_CTA.fr, TRIAL_CTA.en)}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>
          </div>
          <div className="mx-auto mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[14px]">
            <LocaleLink href="/fonctions" className="inline-flex items-center gap-1.5 font-medium text-bordeaux-jour transition-colors hover:text-or-jour">
              {t('Tout ce que fait Octave', 'Everything Octave does')}
              <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </LocaleLink>
            <LocaleLink href="/sommelier-ia" className="inline-flex items-center gap-1.5 font-medium text-bordeaux-jour transition-colors hover:text-or-jour">
              {t('Comment il vous connait', 'How he knows you')}
              <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </LocaleLink>
            <LocaleLink href="/notre-maison" className="inline-flex items-center gap-1.5 font-medium text-bordeaux-jour transition-colors hover:text-or-jour">
              {t('Notre histoire', 'Our story')}
              <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </LocaleLink>
          </div>
        </FadeInOnScroll>
      </section>
    </main>
  );
}
