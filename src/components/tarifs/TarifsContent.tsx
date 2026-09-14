'use client';

import LocaleLink from '@/components/ui/LocaleLink';
import OctaveWordmark from '@/components/octave/OctaveWordmark';
import {
  ArrowRight,
  ShieldCheck,
  Infinity as InfinityIcon,
  Lock,
  XCircle,
  Smartphone,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import Pricing from '@/components/sections/Pricing';
import SectionFaq from '@/components/sections/SectionFaq';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import {
  GRILLE,
  formatPriceCad,
  planLabel,
  CONSEILS_NOTE,
  COMMON_BASE_NOTE,
} from '@/lib/plans';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import {
  SIGNUP_SUB,
  SIGNUP_CTA,
  TRIAL_ON_SIGNUP_FULL,
  FREE_NO_END,
} from '@/lib/trial';

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
  /**
   * ── LA PREUVE QUI MANQUAIT : LA PERMANENCE DU GRATUIT (2026-09-14) ──────
   *
   * Cette tuile s'intitulait « Essai gratuit », sans objet nommé, et énonçait
   * la double barrière. Trois défauts :
   *
   * 1. Un essai sans objet se rapporte à « iQWine » en général, donc aussi au
   *    forfait Gratuit vu deux écrans plus haut — elle ENTRETENAIT la
   *    confusion qu'elle semblait lever.
   * 2. C'était la seule tuile de la rangée à porter une durée, dans le même
   *    cadre et à la même taille que les quatre autres preuves : l'essai y
   *    avait exactement le rang d'une offre.
   * 3. Elle suit immédiatement le CTA du comparatif, qui dit désormais la
   *    séquence en entier. Répéter la même phrase à 200 px d'intervalle ne
   *    convainc pas davantage, ça se lit comme un remplissage.
   *
   * Elle porte donc l'AUTRE moitié, celle qu'aucune preuve de cette rangée ne
   * portait : le forfait Gratuit ne se termine pas. C'est la seule affirmation
   * de la page qui ait besoin d'être répétée hors de la grille, parce que
   * c'est celle que le visiteur arrive en croyant fausse.
   */
  {
    icon: InfinityIcon,
    fr: [
      TRIAL_ON_SIGNUP_FULL.fr,
      'Offert à l’inscription, sans carte. Ensuite, vous restez sur le forfait Gratuit à 0 $, sans date de fin.',
    ],
    en: [
      TRIAL_ON_SIGNUP_FULL.en,
      'Included when you sign up, no card. Afterwards you stay on the Free plan at $0, with no end date.',
    ],
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
    fr: ['iPhone, Android et web', 'Votre cave vous suit, partout.'],
    en: ['iPhone, Android and web', 'Your cellar follows you, everywhere.'],
  },
];

/**
 * ── CE QUE CE COMPARATIF NE FAIT PLUS, ET POURQUOI (Eric, 2026-09-13) ──────
 *
 * Il portait six lignes de fonctionnalités. Quatre étaient cochées sur TOUTES
 * les colonnes (palais, Restaurant, disponibilité locale, carnet), et les deux
 * dernières ne l'étaient que sur les paliers à plusieurs places — c'est-à-dire
 * qu'elles redisaient la ligne « Utilisateurs inclus » située quatre rangs plus
 * haut.
 *
 * Un audit du code applicatif a tranché la question de fond : AUCUNE
 * fonctionnalité n'est réservée à un forfait. Restaurant, magasin, dégustations,
 * accords, scan, notes et souvenirs sont ouverts à tous, Gratuit compris. Quatre
 * éléments seulement varient — la taille de la cave, le nombre de conseils,
 * le nombre d'utilisateurs, et les palais distincts qui découlent du nombre
 * d'utilisateurs. Le tableau ne garde donc que ce qui varie, et ce que tout le
 * monde a se dit UNE fois, en toutes lettres, au-dessus (`COMMON_BASE_NOTE`).
 *
 * ⚠️ `renderCompareCell` ET SES TROIS NIVEAUX D'INTENSITÉ ONT ÉTÉ SUPPRIMÉS,
 * DÉLIBÉRÉMENT. Ce mécanisme — trois pastilles dorées de plus en plus pleines —
 * permettait de représenter un bénéfice qui « s'enrichit avec le plan » sans
 * qu'aucun chiffre ne l'étaye. C'est par ce chemin exact que de faux
 * différenciateurs sont revenus DEUX fois (« Profil de goût qui s'affine »,
 * P22/R3 ; « Priorité à Octave », P21A Lot D), et la garde CI du dépôt
 * applicatif interdit désormais ces deux promesses par leur nom.
 *
 * NE PAS LE RÉTABLIR. Une ligne qui ne peut pas s'écrire avec un nombre lu dans
 * `plans.ts` n'a pas sa place dans ce tableau : elle appartient au socle commun,
 * ou elle n'est pas vraie.
 */

/** Colonnes du comparatif : Gratuit · Standard · Premium, l'ordre de la grille. */
const COMPARE_COLUMNS = GRILLE;

export default function TarifsContent() {
  const { locale } = useLocale();
  const t: T = (fr, en) => (locale === 'fr' ? fr : en);

  /**
   * LES QUATRE LIGNES QUI DIFFÈRENT VRAIMENT, toutes lues dans `plans.ts`.
   *
   * Les conseils passent juste sous le prix : depuis que le Gratuit monte à
   * 100 bouteilles, l'écart de cave avec le Standard n'est plus que d'un facteur
   * deux, et ce n'est plus lui qui décide d'un achat. Ce qui le décide, c'est
   * 2 conseils par mois contre 50.
   *
   * Aucune ligne ne peut être ajoutée ici sans un nombre qui vienne de la SOT :
   * c'est la règle qui empêche les faux différenciateurs de revenir.
   */
  const numericRows: { label: string; hint?: string; cells: string[] }[] = [
    {
      label: t('Prix par mois', 'Price per month'),
      // Le symbole se place selon la langue : « 14,95 $ » en français, « $14.95 »
      // en anglais. La colonne à zéro rendait déjà « $0 » côté anglais, face à
      // des « 14.95 $ » restés à la française — trois cellules, deux
      // conventions, sur la ligne la plus lue du tableau.
      cells: COMPARE_COLUMNS.map((p) => {
        const montant = formatPriceCad(p.priceMonthlyCents, locale);
        return p.priceMonthlyCents === 0
          ? t('0 $', '$0')
          : t(`${montant} $`, `$${montant}`);
      }),
    },
    {
      label: t('Conseils personnalisés d’Octave / mois', 'Octave’s personalized advice / mo'),
      hint: t(
        'Le vrai écart entre les forfaits : la fréquence à laquelle vous demandez conseil.',
        'The real gap between plans: how often you ask for advice.',
      ),
      cells: COMPARE_COLUMNS.map((p) => p.monthlyRecommendations.toString()),
    },
    {
      /**
       * MFP-09, le plafond de bouteilles, enfin visible.
       *
       * Il est appliqué par l'application depuis toujours et n'apparaissait
       * NULLE PART sur le site : un collectionneur de 400 bouteilles pouvait
       * souscrire Standard et heurter un mur à 200, après avoir importé sa
       * cave.
       */
      label: t('Bouteilles au cellier', 'Bottles in the cellar'),
      cells: COMPARE_COLUMNS.map((p) =>
        p.maxBottles < 0
          ? t('Illimité', 'Unlimited')
          : p.maxBottles.toLocaleString(locale === 'en' ? 'en-CA' : 'fr-CA'),
      ),
    },
    {
      /**
       * LES PALAIS DISTINCTS SE DISENT ICI, et pas sur une ligne à eux.
       *
       * Ils DÉCOULENT du nombre d'utilisateurs : côté application, le palais est
       * strictement personnel (`palateProfile` par `userId`), et le verrou du
       * partage est purement numérique — une invitation est refusée dès que le
       * forfait n'inclut qu'une place. Une ligne « Chacun son palais » séparée
       * redirait donc exactement cette ligne-ci, un rang plus bas.
       */
      label: t('Utilisateurs inclus', 'Users included'),
      hint: t(
        'Chacun son palais : les goûts ne se mélangent jamais.',
        'Each their own palate: tastes never blend.',
      ),
      cells: COMPARE_COLUMNS.map((p) => p.includedUsers.toString()),
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
          {/* ── LA MARQUE DANS LE H1, LA CLARTÉ DANS LE SOUS-TITRE ──────────
              (Eric, 2026-09-14 — arbitrage explicite)

              Ce H1 a été remplacé une itération durant par « Commencez
              gratuitement. Découvrez tout iQWine. » L'argument était qu'une
              page de DÉCISION doit dire ce qu'on obtient plutôt que jouer une
              signature. Eric a tranché contre, en connaissance de cet
              argument : « Trouvez votre ◯ctave » est un moment de marque
              distinctif, et il ne sera pas troqué contre un titre SaaS
              générique.

              ⚠️ CE QUE CETTE DÉCISION IMPOSE À LA SUITE : le H1 n'explique
              rien, donc TOUTE la charge d'explication tombe sur le paragraphe
              qui suit. Il est le seul texte au-dessus de la ligne de flottaison
              à dire comment le produit fonctionne. Ne l'abrégez pas, ne le
              coupez pas en deux, ne lui retirez aucun de ses trois temps
              (inscription gratuite → Standard 14 jours → puis le choix) sans
              les replacer ailleurs au-dessus de la grille. */}
          <h1
            className="font-[family-name:var(--font-display)] font-medium italic leading-[1.08] tracking-[-0.02em] text-foreground"
            style={{ fontSize: 'clamp(34px, 5vw, 58px)' }}
          >
            {t('Trouvez votre ', 'Find your ')}
            <OctaveWordmark italic />.
          </h1>
          {/* Corps RELEVÉ (17,5 → 19 px) et mesure élargie : ce paragraphe a
              changé de fonction le jour où le H1 est redevenu une signature.
              Il n'accompagne plus un titre explicatif, il porte seul
              l'explication — au corps d'un texte d'accompagnement, sous un H1
              de 58 px, il se lisait comme une note de bas de hero. */}
          <p className="mx-auto mt-4 max-w-[58ch] text-balance text-[17.5px] leading-relaxed text-foreground/85 sm:mt-5 md:text-[19px]">
            {t(SIGNUP_SUB.fr, SIGNUP_SUB.en)}
          </p>
          <div className="mt-6 flex justify-center sm:mt-7">
            <a
              /**
               * ⚠️ AUCUN `plan` SUR LA PORTE D'ENTRÉE. Le voir réapparaître
               * ici serait un bogue de VÉRITÉ : l'application ne concède les
               * 14 jours de Standard que par le parcours par défaut. Un
               * `?plan=` explicite pose `trialDays: 0`, et le titre au-dessus
               * deviendrait faux au clic. Voir `Pricing.tsx`, même garde.
               */
              href={buildSignupUrl('tarifs-hero', { lang: locale })}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'tarifs-hero' })}
            >
              <Button variant="cta" size="lg">
                {t(SIGNUP_CTA.fr, SIGNUP_CTA.en)}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>
          </div>
          {/* La seule objection qui reste après le sous-titre. Elle tient en
              trois mots et ne mérite pas davantage de place. */}
          <p className="mt-3 text-[13.5px] text-foreground-faint">
            {t('Sans carte de crédit.', 'No credit card.')}
          </p>
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
              {/* Le titre disait « Plus vous lui en confiez, mieux il vous
                  connaît » : joli, et faux au sens strict — le palais s'apprend
                  IDENTIQUEMENT sur les trois forfaits. Ce qui change est la
                  fréquence, la place et le nombre de palais. Le titre le dit
                  maintenant, et le tableau ne montre plus que cela. */}
              <h2 className="iq-h1 italic max-w-2xl mx-auto">
                {t(
                  'Le même Octave dans les trois. Ce qui change, c’est combien vous lui parlez.',
                  'The same Octave in all three. What changes is how much you talk to him.',
                )}
              </h2>
              <p className="mx-auto mt-6 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">
                {t(COMMON_BASE_NOTE.fr, COMMON_BASE_NOTE.en)}
              </p>
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
                        {planLabel(p.id, locale)}
                        {/* Deux micro-étiquettes symétriques, sous deux
                            en-têtes voisins, qui disent deux choses opposées :
                            l'une recommande, l'autre garantit la durée. Le
                            tableau comparait quatre lignes de nombres et pas
                            une ligne de TEMPS — c'est pourtant la seule
                            dimension sur laquelle le visiteur se trompait. */}
                        {/* « Recommandé », jamais « Populaire ». Eric a
                            explicitement écarté la preuve sociale (« Le choix
                            de la majorité ») au profit de la recommandation
                            assumée, le 2026-09-13. Le tableau disait pourtant
                            « Populaire » pendant que la carte, quatre cents
                            pixels plus haut, disait « Recommandé » : deux mots
                            pour une seule désignation, sur un même écran. */}
                        {p.highlight && (
                          <span className="block font-body not-italic text-[9px] tracking-[0.14em] uppercase text-or/70">
                            {t('Recommandé', 'Recommended')}
                          </span>
                        )}
                        {p.id === 'gratuit' && (
                          <span className="block font-body not-italic text-[9px] tracking-[0.14em] uppercase text-foreground-faint">
                            {t(FREE_NO_END.fr, FREE_NO_END.en)}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {numericRows.map((row, i) => (
                    <tr key={`n${i}`} className="border-b border-white/5 last:border-0">
                      <td className="p-4">
                        <span className="block text-[14px] text-muted-foreground">{row.label}</span>
                        {row.hint && (
                          <span className="mt-0.5 block text-[12px] leading-snug text-foreground-faint/70">
                            {row.hint}
                          </span>
                        )}
                      </td>
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
                </tbody>
              </table>
            </div>

            {/* CE QU'EST UN CONSEIL. La ligne « Conseils personnalisés
                d'Octave » donne un nombre et rien d'autre ; le lecteur qui hésite
                se demande si remplir sa cave l'entame. La réponse est non, et
                elle vaut mieux que le nombre lui-même.

                NOTE DE BAS DE TABLEAU : hors de la grille, en petit, estompée.
                La mettre dans une cellule en ferait une caractéristique de plus
                à comparer, alors qu'elle vaut pour les quatre colonnes.

                Texte lu depuis `CONSEILS_NOTE` (`lib/plans.ts`), le même que
                sous chaque carte de prix : une seule promesse, une seule
                rédaction. */}
            <p className="mt-4 text-[12.5px] leading-snug text-foreground-faint">
              {t(CONSEILS_NOTE.fr, CONSEILS_NOTE.en)}
            </p>
          </FadeInOnScroll>

          {/* ── AGIR SANS REMONTER (v3, 2026-08-14) ────────────────────────
              Le manque le plus couteux de l'ancienne page : on comparait, puis
              il fallait remonter deux ecrans pour acheter. */}
          <FadeInOnScroll delay={0.16}>
            <div className="mt-10 text-center">
              <a
                // Porte par défaut, sans `plan` : voir la garde du hero.
                href={buildSignupUrl('tarifs-comparatif', { lang: locale })}
                onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'tarifs-comparatif' })}
              >
                <Button variant="cta" size="lg">
                  {t(SIGNUP_CTA.fr, SIGNUP_CTA.en)}
                  <ArrowRight size={16} strokeWidth={1.75} />
                </Button>
              </a>
              {/* Ce CTA suit un tableau dont la PREMIÈRE colonne s'intitule
                  « Gratuit » : sa ligne de réassurance disait « Essai gratuit,
                  14 jours ou 12 conseils · Sans carte », juste sous elle. Elle
                  dit désormais la sortie, qui est la seule information dont on
                  ait besoin à cet endroit — on vient de comparer, il reste à
                  savoir ce qu'on risque. */}
              <p className="mt-4 text-[13px] leading-relaxed tracking-wide text-foreground-faint">
                {t(
                  `${TRIAL_ON_SIGNUP_FULL.fr}, sans carte. Ensuite, vous choisissez.`,
                  `${TRIAL_ON_SIGNUP_FULL.en}, no card. Then you choose.`,
                )}
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ── S4 · LA REASSURANCE, remontee vers le jour ────────────────────
          Elle quitte la nuit : c'est le moment ou l'on rassure, donc celui ou
          la page doit s'eclaircir. Les quatre preuves et « iPhone, Android
          et web » sont inchangees. */}
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
          {/* La clôture répète la séquence ENTIÈRE, et pas seulement l'essai :
              c'est le dernier écran, celui qu'on lit en ayant oublié le haut
              de page. Elle disait « 14 jours ou 12 conseils pour rencontrer
              Octave », ce qui laissait le visiteur sur un compte à rebours
              comme dernière impression. */}
          <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-relaxed text-encre-2 md:text-[17px]">
            {t(SIGNUP_SUB.fr, SIGNUP_SUB.en)}
          </p>
          <div className="mt-8 flex justify-center">
            <a
              // Porte par défaut, sans `plan` : voir la garde du hero.
              href={buildSignupUrl('tarifs-final', { lang: locale })}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'tarifs-final' })}
            >
              {/* `primary` (bordeaux) et non `cta` (or) : sur l'ivoire, l'or
                  manque de contraste. */}
              <Button variant="primary" size="lg">
                {t(SIGNUP_CTA.fr, SIGNUP_CTA.en)}
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
