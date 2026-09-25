'use client';

import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import FilAriane from '@/components/ui/FilAriane';
import LigneAccord from '@/components/ui/LigneAccord';
import LocaleLink from '@/components/ui/LocaleLink';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import { useLocale } from '@/lib/i18n';
import { ArrowRight } from 'lucide-react';

/**
 * /notre-maison, NOTRE HISTOIRE (textes finaux d'Eric, 2026-09-25).
 *
 * ── Le ressort de la page : une question, une réponse ─────────────────────
 * La question d'ouverture est posée par MÉGANE (« et si mon père pouvait… »)
 * et le récit qui suit est la réponse d'ÉRIC (« ma cave grandissait… quand
 * Mégane m'a parlé de son idée »). Deux voix, dans cet ordre : c'est ce qui
 * rend la page humaine plutôt que corporative, et c'est ce que la mise en
 * page donne à voir. La question est donc attribuée à Mégane sous le texte,
 * et le récit porte un surtitre « Éric raconte » : sans ces deux marqueurs,
 * un lecteur attribue tout au même « je » et l'origine se brouille.
 *
 * ── Ce que la structure doit prouver ──────────────────────────────────────
 * Mégane est la FONDATRICE, et l'idée vient d'elle. La page le dit trois
 * fois, à trois endroits qu'on ne peut pas manquer : l'attribution de la
 * question, « quand Mégane m'a parlé de son idée » dans le récit, et son
 * titre sous sa photo. Elle est à gauche du diptyque, donc lue en premier.
 * iQWine inc. n'existe pas : jamais « présidente », jamais « CEO ».
 *
 * ── Les mouvements ────────────────────────────────────────────────────────
 *   1. LA QUESTION (ivoire) : plein cadre, une seule phrase, signée Mégane.
 *   2. ÉRIC RACONTE (ivoire) : colonne étroite, la paragraphe pivot (« quand
 *      Mégane m'a parlé de son idée ») ressort en encre pleine.
 *   3. LE DIPTYQUE (ivoire) : les deux portraits côte à côte, même cadrage,
 *      Mégane à gauche. Le nom sous la photo EST la légende du document, on
 *      ne répète pas la même identité deux fois dans le même bloc.
 *   4. UNE HISTOIRE DE FAMILLE : la ligne « on n'est pas toujours d'accord »
 *      devient la citation en grand, c'est la phrase la plus humaine du lot.
 *   5. OCTAVE : la coda, l'anneau, puis les deux phrases de fermeture.
 *   6. NOTRE VISION, puis NOS RACINES : inchangés.
 *
 * Textes repris mot pour mot du document final, à une exception près, signalée
 * à Eric : le tiret de « du premier coup — et c'est souvent là » est devenu
 * une virgule (règle de voix, aucun tiret en pause).
 */

type T = (fr: string, en: string) => string;
type Paragraphe = { fr: string; en: string; pivot?: boolean };

/** Le récit d'Éric, à sa voix. `pivot` : le moment où l'idée de Mégane entre. */
const RECIT: Paragraphe[] = [
  {
    fr: 'À la maison, le vin faisait déjà partie des plaisirs qu’on aimait partager. De mon côté, ma cave grandissait depuis plusieurs années, avec toutes les questions qui viennent avec elle : quel vin ouvrir ce soir ? Lequel garder encore ? Qu’est-ce qui accompagnerait vraiment ce plat ? Et quelles bouteilles risquaient de passer leur apogée pendant qu’on attendait une meilleure occasion ?',
    en: 'At home, wine was already part of the pleasures we liked to share. On my side, my cellar had been growing for several years, with all the questions that come with it: which wine should we open tonight? Which one should we keep a little longer? What would truly go with this dish? And which bottles were at risk of sliding past their peak while we waited for a better occasion?',
  },
  {
    fr: 'J’ai commencé à étudier le vieillissement, la maturité, la conservation et les accords. Puis quelque chose d’inattendu s’est produit : mes proches ont commencé à se tourner vers moi pour choisir leurs vins.',
    en: 'I started studying ageing, maturity, cellaring and pairings. Then something unexpected happened: the people around me began turning to me to choose their wines.',
  },
  {
    fr: 'Quand Mégane m’a parlé de son idée, elle rejoignait naturellement toutes ces questions que je me posais déjà comme amateur de vin.',
    en: 'When Mégane told me about her idea, it met, quite naturally, every question I was already asking myself as a wine lover.',
    pivot: true,
  },
  {
    fr: 'Entrepreneur québécois en technologie depuis toujours, j’ai eu envie de l’accompagner dans cette aventure. Depuis, je partage avec elle les échanges, les essais, les commentaires des premiers utilisateurs et surtout le plaisir de vivre cette aventure ensemble.',
    en: 'A Québec technology entrepreneur from the start, I wanted to join her on this adventure. Since then, I have shared with her the conversations, the attempts, the feedback of the first users and, above all, the pleasure of living this adventure together.',
  },
];

/** Les deux portraits. L'ordre du tableau EST l'ordre de lecture. */
const PORTRAITS = [
  {
    cle: 'megane',
    photo: {
      base: '/photos/lifestyle/megane',
      largeur: 1086,
      hauteur: 1448,
      variantes: '800w, 1086w',
      premiere: true,
    },
    nom: 'Mégane Bigras',
    role: { fr: 'Fondatrice d’iQWine', en: 'Founder of iQWine' },
    domaine: { fr: 'Création & croissance', en: 'Creation & growth' },
    alt: {
      fr: 'Mégane Bigras, fondatrice d’iQWine, souriante dans une cave à vin.',
      en: 'Mégane Bigras, founder of iQWine, smiling in a wine cellar.',
    },
    paragraphes: [
      {
        fr: 'Passionnée par le design, la création et l’expérience utilisateur, Mégane apporte à iQWine le regard d’une nouvelle génération d’amateurs de vin.',
        en: 'Passionate about design, creation and user experience, Mégane brings iQWine the eye of a new generation of wine lovers.',
      },
      {
        fr: 'Elle façonne l’expérience, l’univers de la marque et son contenu, tout en restant à l’écoute des utilisateurs pour faire évoluer iQWine de façon simple, personnelle et intuitive.',
        en: 'She shapes the experience, the world of the brand and its content, while staying close to users so iQWine evolves in a way that is simple, personal and intuitive.',
      },
      {
        fr: 'Son objectif : rendre le vin plus accessible, moins intimidant et surtout plus agréable à découvrir.',
        en: 'Her goal: to make wine more approachable, less intimidating and, above all, more enjoyable to discover.',
      },
    ],
  },
  {
    cle: 'eric',
    photo: {
      base: '/photos/lifestyle/bio-cave',
      largeur: 1023,
      hauteur: 1537,
      variantes: '800w, 1400w',
      premiere: false,
    },
    nom: 'Éric Bigras',
    role: { fr: 'Entrepreneur & passionné de technologie', en: 'Entrepreneur & technology enthusiast' },
    domaine: {
      fr: 'Entrepreneuriat, technologie & passion du vin',
      en: 'Entrepreneurship, technology & a passion for wine',
    },
    alt: {
      fr: 'Éric Bigras dans une cave à vin, un verre de vin à la main.',
      en: 'Éric Bigras in a wine cellar, a glass of wine in hand.',
    },
    paragraphes: [
      {
        fr: 'Entrepreneur québécois en technologie depuis toujours et épicurien assumé, Éric collectionne le vin depuis plusieurs années avec une idée assez simple : avoir la bonne bouteille au bon moment.',
        en: 'A Québec technology entrepreneur from the start and a self-confessed epicurean, Éric has been collecting wine for several years with a fairly simple idea: to have the right bottle at the right moment.',
      },
      {
        fr: 'Son expérience entrepreneuriale et son intérêt pour les nouvelles technologies lui permettent aujourd’hui d’accompagner Mégane dans son aventure avec iQWine.',
        en: 'His experience in business and his interest in new technologies now let him support Mégane on her adventure with iQWine.',
      },
      {
        fr: 'Pour lui, iQWine est surtout devenu une aventure père-fille où se rencontrent technologie, entrepreneuriat et plaisir du vin.',
        en: 'For him, iQWine has above all become a father-daughter adventure where technology, entrepreneurship and the pleasure of wine meet.',
      },
    ],
  },
] as const;

const FAMILLE_AVANT: { fr: string; en: string }[] = [
  {
    fr: 'Deux générations, deux regards différents et beaucoup de discussions autour d’une même idée. Mégane apporte sa créativité, sa vision et son instinct pour l’expérience. Éric apporte son expérience entrepreneuriale, sa curiosité technologique et sa passion du vin.',
    en: 'Two generations, two different points of view and a great many conversations around one idea. Mégane brings her creativity, her vision and her instinct for experience. Éric brings his experience in business, his curiosity for technology and his passion for wine.',
  },
];

const OCTAVE_SUITE: { fr: string; en: string }[] = [
  {
    fr: 'Pas simplement pour associer un plat à un vin. Pas simplement pour gérer des bouteilles. Mais pour apprendre, se souvenir et affiner ses conseils au fil du temps.',
    en: 'Not simply to match a dish with a wine. Not simply to manage bottles. But to learn, to remember, and to refine his advice over time.',
  },
  {
    fr: 'Parce qu’au fond, notre passion pour le vin n’est pas une histoire de collection. C’est une histoire de moments, de découvertes et de gens avec qui on les partage.',
    en: 'Because in the end, our passion for wine is not about collecting. It is about moments, discoveries, and the people we share them with.',
  },
];

export default function AProposContent() {
  const { locale } = useLocale();
  const t: T = (fr, en) => (locale === 'fr' ? fr : en);

  return (
    <main>
      {/* ══ 1 · LA QUESTION (ivoire, plein cadre) ═══════════════════════ */}
      {/* Une seule phrase à l'écran, signée. Le guillemet d'or, très pâle et
          derrière le texte, donne la profondeur sans ajouter d'élément : la
          page s'ouvre sur une voix, pas sur une mise en page. */}
      <section
        className="mouvement-jour relative"
        id="histoire"
        style={{ paddingTop: 'var(--nav-h)' }}
      >
        <div className="mx-auto max-w-[1060px] px-6 pb-16 pt-8 lg:pb-24 lg:pt-10">
          <FilAriane
            elements={[
              { label: t('Accueil', 'Home'), href: '/' },
              { label: t('Notre histoire', 'Our story') },
            ]}
          />
          <div className="mt-12 text-center lg:mt-16">
            <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
              {t('Notre histoire', 'Our story')}
            </p>
            <h1
              className="mx-auto mt-4 max-w-[20ch] text-balance font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
              style={{ fontSize: 'clamp(31px, 3.75vw, 50px)' }}
            >
              {t('Octave est né d’une ', 'Octave was born from a ')}
              <span className="text-bordeaux-jour">{t('question toute simple', 'simple question')}</span>
            </h1>

            <FadeInOnScroll>
              <figure className="mt-14 lg:mt-20">
                <span
                  aria-hidden
                  className="mx-auto block select-none font-[family-name:var(--font-display)] leading-[0.5] text-or-jour/35"
                  style={{ fontSize: 'clamp(46px, 5vw, 68px)' }}
                >
                  {t('«', '“')}
                </span>
                <blockquote
                  className="mx-auto mt-7 max-w-[min(660px,92%)] font-[family-name:var(--font-display)] italic leading-[1.32] text-encre"
                  style={{ fontSize: 'clamp(23px, 3.1vw, 38px)' }}
                >
                  {t(
                    'Et si mon père pouvait, à tout moment, choisir une bouteille parfaitement dans ses goûts, l’ouvrir au bon moment et la partager autour du bon repas, sans même avoir à y réfléchir ?',
                    'What if my father could, at any moment, choose a bottle perfectly suited to his taste, open it at just the right time and share it over the right meal, without even having to think about it?',
                  )}
                </blockquote>
                <figcaption className="mt-9 flex flex-col items-center gap-3">
                  <span aria-hidden className="h-px w-12 bg-or-jour/50" />
                  <span className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-encre-3">
                    Mégane Bigras <span className="text-or-jour">·</span>{' '}
                    {t('Fondatrice d’iQWine', 'Founder of iQWine')}
                  </span>
                </figcaption>
              </figure>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ══ 2 · ÉRIC RACONTE (ivoire, colonne étroite) ══════════════════ */}
      {/* La réponse à la question. Colonne de lecture, pas de photo : les
          visages arrivent au mouvement suivant, et le texte porte seul. */}
      <section className="mouvement-jour relative" id="recit">
        <div className="mx-auto w-[min(480px,72%)]">
          <LigneAccord ton="jour" />
        </div>
        <div className="mx-auto max-w-[1060px] px-6 py-12 lg:py-16">
          <div className="mx-auto max-w-[62ch]">
            <FadeInOnScroll>
              <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
                {t('Éric raconte', 'In Éric’s words')}
              </p>
            </FadeInOnScroll>
            <div className="mt-7">
              {RECIT.map((par) => (
                <FadeInOnScroll key={par.fr}>
                  <p
                    className={
                      par.pivot
                        ? 'my-8 border-l-2 border-or-jour/45 pl-6 font-[family-name:var(--font-display)] italic leading-[1.35] text-encre'
                        : 'mb-6 text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]'
                    }
                    style={par.pivot ? { fontSize: 'clamp(20px, 2.3vw, 27px)' } : undefined}
                  >
                    {t(par.fr, par.en)}
                  </p>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3 · LE DIPTYQUE (ivoire) ════════════════════════════════════ */}
      {/* Les deux portraits côte à côte, MÊME cadrage 4/5 : deux personnes
          d'égale présence, lues de gauche à droite, Mégane d'abord. Le nom
          sous la photo sert de légende ET d'identification, une seule fois. */}
      <section className="mouvement-jour relative" id="portraits">
        <div className="mx-auto w-[min(480px,72%)]">
          <LigneAccord ton="jour" />
        </div>
        <div className="mx-auto max-w-[1060px] px-6 py-12 lg:py-16">
          <div className="grid gap-12 md:grid-cols-2 md:gap-10 lg:gap-14">
            {PORTRAITS.map((p, i) => (
              <FadeInOnScroll key={p.cle} delay={i * 0.08}>
                <article className="flex h-full flex-col">
                  <figure>
                    <div className="mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[18px] shadow-[0_30px_70px_-32px_rgba(60,38,18,0.5)]">
                      <picture>
                        <source
                          type="image/avif"
                          srcSet={p.photo.variantes
                            .split(', ')
                            .map((v) => `${p.photo.base}-${v.replace('w', '')}.avif ${v}`)
                            .join(', ')}
                          sizes="(max-width: 768px) 100vw, 46vw"
                        />
                        <source
                          type="image/webp"
                          srcSet={p.photo.variantes
                            .split(', ')
                            .map((v) => `${p.photo.base}-${v.replace('w', '')}.webp ${v}`)
                            .join(', ')}
                          sizes="(max-width: 768px) 100vw, 46vw"
                        />
                        <img
                          src={`${p.photo.base}.jpg`}
                          alt={t(p.alt.fr, p.alt.en)}
                          width={p.photo.largeur}
                          height={p.photo.hauteur}
                          loading={p.photo.premiere ? 'eager' : 'lazy'}
                          fetchPriority={p.photo.premiere ? 'high' : undefined}
                          decoding="async"
                          className="h-full w-full object-cover object-[center_22%]"
                        />
                      </picture>
                    </div>
                    <figcaption className="mx-auto mt-6 max-w-[420px]">
                      <h2 className="font-[family-name:var(--font-display)] text-[25px] font-medium leading-tight text-encre sm:text-[28px]">
                        {p.nom}
                      </h2>
                      <p className="mt-2 text-[11.5px] font-medium uppercase tracking-[0.2em] text-bordeaux-jour">
                        {t(p.role.fr, p.role.en)}
                      </p>
                      <p className="mt-2 font-[family-name:var(--font-display)] text-[16.5px] italic text-encre-3">
                        {t(p.domaine.fr, p.domaine.en)}
                      </p>
                    </figcaption>
                  </figure>
                  <div className="mx-auto mt-7 max-w-[420px]">
                    {p.paragraphes.map((par) => (
                      <p key={par.fr} className="mb-5 text-[16px] leading-relaxed text-encre-2 md:text-[16.5px]">
                        {t(par.fr, par.en)}
                      </p>
                    ))}
                  </div>
                </article>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4 · UNE HISTOIRE DE FAMILLE (ivoire) ════════════════════════ */}
      {/* La citation « on n'est pas toujours d'accord » est la phrase la plus
          humaine de la page : elle sort du paragraphe et prend le centre. */}
      <section className="mouvement-jour relative" id="famille">
        <div className="mx-auto w-[min(480px,72%)]">
          <LigneAccord variante="inflexion" ton="jour" />
        </div>
        <div className="mx-auto max-w-[1060px] px-6 py-12 lg:py-16">
          <FadeInOnScroll>
            <div className="mx-auto max-w-[720px] text-center">
              <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
                {t('Une histoire de famille', 'A family story')}
              </p>
              <h2
                className="mt-3 text-balance font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(28px, 3.4vw, 44px)' }}
              >
                {t('Une aventure qui se construit ', 'An adventure we are building ')}
                <span className="text-bordeaux-jour">{t('à deux', 'together')}</span>
              </h2>
              <p
                className="mt-7 font-[family-name:var(--font-display)] italic leading-[1.34] text-encre"
                style={{ fontSize: 'clamp(20px, 2.4vw, 28px)' }}
              >
                {t('iQWine est aussi une histoire de famille.', 'iQWine is also a family story.')}
              </p>
            </div>
          </FadeInOnScroll>

          <div className="mx-auto mt-8 max-w-[60ch] space-y-5">
            {FAMILLE_AVANT.map((par) => (
              <FadeInOnScroll key={par.fr}>
                <p className="text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]">{t(par.fr, par.en)}</p>
              </FadeInOnScroll>
            ))}
          </div>

          <FadeInOnScroll>
            <blockquote className="mx-auto mt-12 max-w-[min(680px,90%)] text-center lg:mt-16">
              <span aria-hidden className="mx-auto mb-7 block h-px w-12 bg-or-jour/50" />
              <p
                className="font-[family-name:var(--font-display)] font-medium italic leading-[1.24] text-bordeaux-jour"
                style={{ fontSize: 'clamp(24px, 3.3vw, 40px)' }}
              >
                {t(
                  'Deux générations, deux regards et une même passion pour transformer une belle idée en une expérience à partager avec les autres.',
                  'Two generations, two points of view and one shared passion: turning a beautiful idea into an experience to share with others.',
                )}
              </p>
              <span aria-hidden className="mx-auto mt-7 block h-px w-12 bg-or-jour/50" />
            </blockquote>
          </FadeInOnScroll>

          <FadeInOnScroll>
            <p className="mx-auto mt-12 max-w-[60ch] text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px] lg:mt-16">
              {t(
                'Au fil du temps, ce qui n’était qu’une idée au départ est devenu une belle aventure que nous avons le plaisir de partager.',
                'Over time, what was only an idea at first became a beautiful adventure we have the pleasure of sharing.',
              )}
            </p>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ══ 5 · OCTAVE, LA CODA (ivoire) ════════════════════════════════ */}
      <section className="mouvement-jour relative" id="octave">
        <div className="mx-auto w-[min(480px,72%)]">
          <LigneAccord ton="jour" />
        </div>
        <div className="mx-auto max-w-[1060px] px-6 py-12 lg:py-16">
          <div className="mx-auto max-w-[62ch] text-center">
            <FadeInOnScroll>
              <p
                className="mx-auto max-w-[min(620px,92%)] text-balance font-[family-name:var(--font-display)] font-medium italic leading-snug text-encre"
                style={{ fontSize: 'clamp(26px, 3.8vw, 44px)' }}
              >
                {t('Ce sommelier, il fallait lui donner vie.', 'This sommelier had to be brought to life.')}
              </p>
              <p className="mt-7 inline-flex items-center gap-2.5 font-[family-name:var(--font-display)] text-[21px] italic text-or-jour sm:text-[24px]">
                <OctaveAnneau size={18} className="text-or-jour" />
                {t('C’est ainsi qu’Octave a commencé à prendre forme.', 'That is how Octave began to take shape.')}
              </p>
            </FadeInOnScroll>
            <div className="mt-9 space-y-5 text-left">
              {OCTAVE_SUITE.map((par) => (
                <FadeInOnScroll key={par.fr}>
                  <p className="mx-auto max-w-[56ch] text-[16px] leading-relaxed text-encre-2 md:text-[17px]">
                    {t(par.fr, par.en)}
                  </p>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4 · NOTRE VISION (ivoire, le « nous ») ══════════════════════ */}
      <section className="mouvement-jour relative" id="vision">
        <div className="mx-auto w-[min(480px,72%)]">
          <LigneAccord variante="inflexion" ton="jour" />
        </div>
        <div className="mx-auto max-w-[1060px] px-6 py-12 lg:py-16">
          <div>
            <FadeInOnScroll>
              <div className="mx-auto max-w-[720px] text-center">
                <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
                  {t('Notre vision', 'Our vision')}
                </p>
                <h2
                  className="mt-4 font-[family-name:var(--font-display)] font-medium leading-[1.16] tracking-[-0.02em] text-encre"
                  style={{ fontSize: 'clamp(24px, 3.4vw, 40px)' }}
                >
                  {t(
                    'Le vin est fait pour être découvert, partagé et surtout apprécié. Notre vision est d’en amplifier le plaisir, simplement.',
                    'Wine is meant to be discovered, shared and, above all, enjoyed. Our vision is to amplify that pleasure, simply.',
                  )}
                </h2>
              </div>
            </FadeInOnScroll>

            {/* Les deux plaisirs. Emplacements VISION-01 et VISION-02 prêts :
                une <figure> viendra coiffer chaque bloc quand les photos
                existeront, sans toucher à la grille ni aux textes. */}
            <div className="mt-11 grid gap-8 lg:grid-cols-2 lg:gap-12">
              <FadeInOnScroll>
                <article className="h-full rounded-[18px] border border-encre/8 bg-[#fdfaf3] p-7 lg:p-8">
                  <h3 className="font-[family-name:var(--font-display)] text-[24px] font-medium leading-snug text-encre sm:text-[28px]">
                    {t('Le plaisir de choisir juste', 'The pleasure of choosing well')}
                  </h3>
                  <p className="mt-4 text-[15.5px] leading-relaxed text-encre-2">
                    {t(
                      'Notre vision est simple, permettre à chaque amateur de vin de trouver plus facilement la bouteille qui lui ressemble.',
                      'Our vision is simple: to help every wine lover find, more easily, the bottle that feels like their own.',
                    )}
                  </p>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-encre-2">
                    {t(
                      'Moins d’hésitation, moins de complexité, simplement le plaisir de choisir selon ses goûts et de découvrir, bouteille après bouteille, ce qui nous fait vraiment aimer le vin.',
                      'Less hesitation, less complexity, simply the pleasure of choosing by taste and discovering, bottle after bottle, what truly makes us love wine.',
                    )}
                  </p>
                </article>
              </FadeInOnScroll>

              <FadeInOnScroll delay={0.08}>
                <article className="h-full rounded-[18px] border border-encre/8 bg-[#fdfaf3] p-7 lg:p-8">
                  <h3 className="font-[family-name:var(--font-display)] text-[24px] font-medium leading-snug text-encre sm:text-[28px]">
                    {t('Le plaisir de partager', 'The pleasure of sharing')}
                  </h3>
                  <p className="mt-4 text-[15.5px] leading-relaxed text-encre-2">
                    {t(
                      'Le vin prend une autre dimension autour d’une table. Nous voulons rendre naturel le plaisir d’accorder le bon vin au bon repas, selon vos goûts, sans avoir à en maîtriser toute la complexité.',
                      'Wine takes on another dimension around a table. We want to make it natural to pair the right wine with the right meal, according to each person’s taste, without having to master all its complexity.',
                    )}
                  </p>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-encre-2">
                    {t(
                      'Retrouver chez soi un peu de cette magie des grands accords gastronomiques, entouré des gens qui comptent, une bouteille, un repas, un moment à la fois.',
                      'To bring home a little of the magic of great gastronomic pairings, surrounded by the people who matter, one bottle, one meal, one moment at a time.',
                    )}
                  </p>
                </article>
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 5 · NOS RACINES (nuit brève, la signature) ══════════════════ */}
      <section
        id="racines"
        data-nav-delai="90"
        className="relative overflow-hidden text-foreground"
        style={{
          background:
            'linear-gradient(180deg, var(--color-papier) 0%, #2a1d13 8%, #150f0c 22%, #150f0c 100%)',
        }}
      >
        <div className="relative mx-auto max-w-[1440px] px-6 pb-20 pt-24 text-center lg:px-8 lg:pb-24 lg:pt-32">
          <FadeInOnScroll>
            <div className="mx-auto h-px w-[min(360px,60%)] bg-or/50" />
            <p
              className="mx-auto mt-10 max-w-[24ch] font-[family-name:var(--font-display)] font-medium leading-[1.22]"
              style={{ fontSize: 'clamp(26px, 3.8vw, 44px)' }}
            >
              {t('Conçu au Québec.', 'Designed in Québec.')}
              <br />
              <span className="text-or">
                {t(
                  'Pour ceux qui savent qu’une bouteille, c’est bien plus qu’un vin.',
                  'For those who know a bottle is so much more than wine.',
                )}
              </span>
            </p>
            <p className="mt-10 font-[family-name:var(--font-display)] text-[18px] italic text-foreground-dim sm:text-[20px]">
              {t('Une recommandation à la fois.', 'One recommendation at a time.')}
            </p>
            <LocaleLink
              href="/sommelier-ia"
              className="mt-9 inline-flex items-center gap-2 text-[13.5px] font-medium text-or transition-colors hover:text-or-soft"
            >
              {t('Rencontrer Octave', 'Meet Octave')}
              <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </LocaleLink>
          </FadeInOnScroll>
        </div>
      </section>
    </main>
  );
}
