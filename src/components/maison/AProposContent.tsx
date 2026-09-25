'use client';

import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import FilAriane from '@/components/ui/FilAriane';
import LigneAccord from '@/components/ui/LigneAccord';
import LocaleLink from '@/components/ui/LocaleLink';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import { useLocale } from '@/lib/i18n';
import { ArrowRight } from 'lucide-react';

/**
 * /notre-maison, NOTRE HISTOIRE.
 *
 * ── Le ressort de la page : une question, une réponse ─────────────────────
 * La question d'ouverture est posée par MÉGANE (« et si mon père pouvait… »)
 * et le récit qui suit est la réponse d'ÉRIC (« ma cave grandissait… quand
 * Mégane m'a parlé de son idée »). Deux voix, dans cet ordre.
 *
 * ── Ce que la structure doit prouver ──────────────────────────────────────
 * Mégane est la FONDATRICE, et l'idée vient d'elle. Son visage, sa question
 * et son titre tiennent le PREMIER écran ; Éric vient ensuite et son récit
 * dit lui-même d'où vient l'idée. iQWine inc. n'existe pas : jamais
 * « présidente », jamais « CEO ».
 *
 * ── LA MISE EN PAGE (refonte du 2026-09-25) ───────────────────────────────
 * Eric : « on dirait juste au centre de la page, et ça fait tout nu ». La
 * page empilait dix blocs centrés étroits au milieu de 1440 px.
 *
 * Trois décisions la redressent :
 *
 *   1. UNE PERSONNE = UN MOUVEMENT. Le récit d'Éric et sa biographie étaient
 *      deux blocs séparés, et les deux portraits vivaient dans un diptyque
 *      qui les écrasait en colonnes maigres. Chaque personne a désormais son
 *      mouvement plein : photo, voix, biographie ensemble. Mégane d'abord.
 *   2. LA PHOTO TIENT LA COLONNE, EN COLLANT. Pendant que le texte défile,
 *      le portrait reste à l'écran : la moitié de page n'est jamais vide,
 *      ce qui est exactement le défaut à corriger. Photo à droite chez
 *      Mégane, à gauche chez Éric : le vis-à-vis fait lire la paire comme
 *      voulue, alors que les deux photos viennent de la même cave.
 *   3. TROIS TEXTURES DE FOND. Ivoire, ivoire soutenu pour la section
 *      famille, nuit pour la signature. Une bande de couleur va de bord à
 *      bord, donc plus rien n'a l'air nu, et le seul bloc resté centré, la
 *      grande citation, se lit comme un accent voulu.
 *
 * Conteneur 1200 px au lieu de 1060, corps à 1.75 d'interligne, et la
 * question descend sous le H1 dans l'échelle : elle lui faisait concurrence.
 *
 * ── Deux pièges, vérifiés le 2026-09-25 ───────────────────────────────────
 * · `FadeInOnScroll` anime en `transform` avec `will-change`, ce qui crée un
 *   bloc conteneur et CASSE `position: sticky` chez ses descendants. Les
 *   figures collantes ne doivent donc jamais être enveloppées dedans, et
 *   aucune section à collant ne porte `overflow-x-clip`.
 * · `bio-cave-1400.*` mesure en réalité 1023 px. Le `srcSet` doit annoncer sa
 *   VRAIE largeur, sinon le navigateur le choisit pour un grand affichage et
 *   rend un agrandissement flou.
 *
 * Textes repris mot pour mot des documents finaux d'Eric.
 */

type T = (fr: string, en: string) => string;
type Bilingue = { fr: string; en: string };

/** Le récit d'Éric, à sa voix. `pivot` : le moment où l'idée de Mégane entre. */
const RECIT: (Bilingue & { pivot?: boolean })[] = [
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

/**
 * Les deux personnes. `variantes` porte le nom de fichier ET la largeur RÉELLE
 * du fichier : `bio-cave-1400` n'a jamais fait 1400 px.
 */
type Personne = {
  nom: string;
  role: Bilingue;
  domaine: Bilingue;
  alt: Bilingue;
  photo: {
    base: string;
    largeur: number;
    hauteur: number;
    cadrage: string;
    variantes: { fichier: string; largeur: number }[];
  };
  paragraphes: Bilingue[];
};

const MEGANE: Personne = {
  nom: 'Mégane Bigras',
  role: { fr: 'Fondatrice d’iQWine', en: 'Founder of iQWine' },
  domaine: { fr: 'Création & croissance', en: 'Creation & growth' },
  alt: {
    fr: 'Mégane Bigras, fondatrice d’iQWine, souriante dans une cave à vin.',
    en: 'Mégane Bigras, founder of iQWine, smiling in a wine cellar.',
  },
  photo: {
    base: '/photos/lifestyle/megane',
    largeur: 1086,
    hauteur: 1448,
    cadrage: 'object-[50%_18%]',
    variantes: [
      { fichier: '800', largeur: 800 },
      { fichier: '1086', largeur: 1086 },
    ],
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
};

const ERIC: Personne = {
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
  photo: {
    base: '/photos/lifestyle/bio-cave',
    largeur: 1023,
    hauteur: 1537,
    cadrage: 'object-[50%_20%]',
    variantes: [
      { fichier: '800', largeur: 800 },
      // Le fichier s'appelle « 1400 » mais mesure 1023 px : on annonce 1023.
      { fichier: '1400', largeur: 1023 },
    ],
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
};

const OCTAVE_SUITE: Bilingue[] = [
  {
    fr: 'Pas simplement pour associer un plat à un vin. Pas simplement pour gérer des bouteilles. Mais pour apprendre, se souvenir et affiner ses conseils au fil du temps.',
    en: 'Not simply to match a dish with a wine. Not simply to manage bottles. But to learn, to remember, and to refine his advice over time.',
  },
  {
    fr: 'Parce qu’au fond, notre passion pour le vin n’est pas une histoire de collection. C’est une histoire de moments, de découvertes et de gens avec qui on les partage.',
    en: 'Because in the end, our passion for wine is not about collecting. It is about moments, discoveries, and the people we share them with.',
  },
];

const VISION: { titre: Bilingue; paragraphes: Bilingue[] }[] = [
  {
    titre: { fr: 'Le plaisir de choisir juste', en: 'The pleasure of choosing well' },
    paragraphes: [
      {
        fr: 'Notre vision est simple, permettre à chaque amateur de vin de trouver plus facilement la bouteille qui lui ressemble.',
        en: 'Our vision is simple: to help every wine lover find, more easily, the bottle that feels like their own.',
      },
      {
        fr: 'Moins d’hésitation, moins de complexité, simplement le plaisir de choisir selon ses goûts et de découvrir, bouteille après bouteille, ce qui nous fait vraiment aimer le vin.',
        en: 'Less hesitation, less complexity, simply the pleasure of choosing by taste and discovering, bottle after bottle, what truly makes us love wine.',
      },
    ],
  },
  {
    titre: { fr: 'Le plaisir de partager', en: 'The pleasure of sharing' },
    paragraphes: [
      {
        fr: 'Le vin prend une autre dimension autour d’une table. Nous voulons rendre naturel le plaisir d’accorder le bon vin au bon repas, selon vos goûts, sans avoir à en maîtriser toute la complexité.',
        en: 'Wine takes on another dimension around a table. We want to make it natural to pair the right wine with the right meal, according to each person’s taste, without having to master all its complexity.',
      },
      {
        fr: 'Retrouver chez soi un peu de cette magie des grands accords gastronomiques, entouré des gens qui comptent, une bouteille, un repas, un moment à la fois.',
        en: 'To bring home a little of the magic of great gastronomic pairings, surrounded by the people who matter, one bottle, one meal, one moment at a time.',
      },
    ],
  },
];

/** Le conteneur de tous les mouvements. 1200 px, respiration large. */
const CADRE = 'mx-auto max-w-[1200px] px-5 lg:px-8';
const CORPS = 'text-[16.5px] leading-[1.75] text-encre-2 md:text-[17.5px]';
const SURTITRE = 'text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour';
/** Le rythme vertical d'un mouvement, ample et proportionnel. */
const RYTHME = { paddingTop: 'clamp(72px, 9vw, 120px)', paddingBottom: 'clamp(72px, 9vw, 120px)' };

function Filet({ className = '' }: { className?: string }) {
  return <span aria-hidden className={`block h-px w-12 bg-or-jour/45 ${className}`} />;
}

/**
 * La photo d'un portrait. JAMAIS enveloppée dans FadeInOnScroll : son
 * `transform` casserait le collant.
 */
function Portrait({ personne, t, premiere }: { personne: Personne; t: T; premiere: boolean }) {
  const { photo } = personne;
  const srcset = (ext: string) =>
    photo.variantes.map((v) => `${photo.base}-${v.fichier}.${ext} ${v.largeur}w`).join(', ');
  return (
    <figure className="lg:sticky lg:top-[calc(var(--nav-h)+32px)] lg:self-start">
      <div className="aspect-[3/4] w-full max-w-[460px] overflow-hidden rounded-[20px] shadow-[0_40px_90px_-40px_rgba(60,38,18,0.55)] lg:max-w-none">
        <picture>
          <source type="image/avif" srcSet={srcset('avif')} sizes="(max-width: 1023px) 100vw, 42vw" />
          <source type="image/webp" srcSet={srcset('webp')} sizes="(max-width: 1023px) 100vw, 42vw" />
          <img
            src={`${photo.base}.jpg`}
            alt={t(personne.alt.fr, personne.alt.en)}
            width={photo.largeur}
            height={photo.hauteur}
            loading={premiere ? 'eager' : 'lazy'}
            fetchPriority={premiere ? 'high' : undefined}
            decoding="async"
            className={`h-full w-full object-cover ${photo.cadrage}`}
          />
        </picture>
      </div>
    </figure>
  );
}

/** Le nom, le rôle et la biographie d'une personne. */
function Identite({ personne, t }: { personne: Personne; t: T }) {
  return (
    <div className="border-t border-encre/10" style={{ marginTop: 'clamp(36px, 4.5vw, 60px)', paddingTop: 'clamp(28px, 3.5vw, 44px)' }}>
      <h2
        className="font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em] text-encre"
        style={{ fontSize: 'clamp(24px, 2.4vw, 30px)' }}
      >
        {personne.nom}
      </h2>
      <p className="mt-2.5 text-[11.5px] font-medium uppercase tracking-[0.2em] text-bordeaux-jour">
        {t(personne.role.fr, personne.role.en)}
      </p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-[17px] italic text-encre-3">
        {t(personne.domaine.fr, personne.domaine.en)}
      </p>
      <div className="mt-7 max-w-[62ch] space-y-5">
        {personne.paragraphes.map((par) => (
          <p key={par.fr} className={CORPS}>
            {t(par.fr, par.en)}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AProposContent() {
  const { locale } = useLocale();
  const t: T = (fr, en) => (locale === 'fr' ? fr : en);

  return (
    <main>
      {/* ══ 1 · MÉGANE : la question, le visage, la fondatrice ═══════════ */}
      {/* Son portrait tient la colonne de droite en collant pendant que sa
          question puis sa biographie défilent à gauche. « Fondatrice » est
          donc établi dans le premier écran, à côté de son visage. */}
      <section className="mouvement-jour relative" style={{ paddingTop: 'var(--nav-h)' }} id="histoire">
        <div className={CADRE} style={{ paddingTop: 32, paddingBottom: 'clamp(72px, 9vw, 120px)' }}>
          <FilAriane
            elements={[
              { label: t('Accueil', 'Home'), href: '/' },
              { label: t('Notre histoire', 'Our story') },
            ]}
          />
          <div
            className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.56fr)_minmax(0,0.44fr)] lg:gap-x-12 xl:gap-x-16"
            style={{ marginTop: 'clamp(40px, 6vw, 72px)' }}
          >
            {/* Colonne de texte */}
            <div className="order-last lg:order-first">
              <p className={SURTITRE}>{t('Notre histoire', 'Our story')}</p>
              <h1
                className="mt-5 max-w-[13ch] text-balance pb-1 font-[family-name:var(--font-display)] font-medium leading-[1.05] tracking-[-0.025em] text-encre"
                style={{ fontSize: 'clamp(34px, 4.8vw, 64px)' }}
              >
                {t('Octave est né d’une ', 'Octave was born from a ')}
                <span className="text-bordeaux-jour">{t('question toute simple', 'simple question')}</span>
              </h1>

              <div style={{ marginTop: 'clamp(32px, 4vw, 52px)' }}>
                <Filet />
                <blockquote
                  className="mt-6 max-w-[30ch] font-[family-name:var(--font-display)] italic leading-[1.38] text-encre"
                  style={{ fontSize: 'clamp(20px, 2.1vw, 28px)' }}
                >
                  {t(
                    'Et si mon père pouvait, à tout moment, choisir une bouteille parfaitement dans ses goûts, l’ouvrir au bon moment et la partager autour du bon repas, sans même avoir à y réfléchir ?',
                    'What if my father could, at any moment, choose a bottle perfectly suited to his taste, open it at just the right time and share it over the right meal, without even having to think about it?',
                  )}
                </blockquote>
                <p className="mt-6 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-encre-3">
                  <span aria-hidden className="h-px w-6 bg-or-jour/60" />
                  Mégane Bigras <span className="text-or-jour">·</span>{' '}
                  {t('Fondatrice d’iQWine', 'Founder of iQWine')}
                </p>
              </div>

              <Identite personne={MEGANE} t={t} />
            </div>

            {/* Le portrait, collant. Hors FadeInOnScroll, voir l'en-tête. */}
            <Portrait personne={MEGANE} t={t} premiere />
          </div>
        </div>
      </section>

      {/* ══ 2 · ÉRIC : le miroir, photo à gauche ═════════════════════════ */}
      <section className="mouvement-jour relative" id="eric">
        <div className="mx-auto w-[min(480px,72%)]">
          <LigneAccord ton="jour" />
        </div>
        <div className={CADRE} style={RYTHME}>
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:gap-x-12 xl:gap-x-16">
            {/* Première dans le DOM : sur mobile la photo précède le texte. */}
            <Portrait personne={ERIC} t={t} premiere={false} />

            <div>
              {/* Le surtitre devient le titre du mouvement : c'est un libellé
                  de voix, aucun mot n'est ajouté au récit d'Eric. */}
              <h2
                className="font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(26px, 3vw, 38px)' }}
              >
                {t('Éric raconte', 'In Éric’s words')}
              </h2>
              <div className="mt-8 max-w-[62ch]">
                {RECIT.map((par) => (
                  <FadeInOnScroll key={par.fr}>
                    <p
                      className={
                        par.pivot
                          ? 'my-9 border-l-2 border-or-jour/45 pl-5 font-[family-name:var(--font-display)] italic leading-[1.4] text-encre lg:pl-6'
                          : `mb-6 ${CORPS}`
                      }
                      style={par.pivot ? { fontSize: 'clamp(19px, 1.9vw, 25px)' } : undefined}
                    >
                      {t(par.fr, par.en)}
                    </p>
                  </FadeInOnScroll>
                ))}
              </div>
              <Identite personne={ERIC} t={t} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3 · UNE HISTOIRE DE FAMILLE (bande ivoire soutenu) ═══════════ */}
      {/* La couleur va de bord à bord : plus rien n'a l'air nu, et la grande
          citation devient le seul bloc centré de la page, donc un accent. */}
      <section
        className="mouvement-jour relative"
        id="famille"
        style={{ background: 'var(--color-papier-2)' }}
      >
        <div className={CADRE} style={RYTHME}>
          <div className="grid gap-10 lg:grid-cols-[minmax(260px,0.42fr)_minmax(0,0.58fr)] lg:gap-x-14">
            <div className="lg:self-start">
              <p className={SURTITRE}>{t('Une histoire de famille', 'A family story')}</p>
              <h2
                className="mt-5 max-w-[15ch] text-balance font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(28px, 3.4vw, 44px)' }}
              >
                {t('Une aventure qui se construit ', 'An adventure we are building ')}
                <span className="text-bordeaux-jour">{t('à deux', 'together')}</span>
              </h2>
              <p
                className="mt-6 max-w-[24ch] font-[family-name:var(--font-display)] italic leading-[1.35] text-encre-2"
                style={{ fontSize: 'clamp(18px, 1.9vw, 24px)' }}
              >
                {t('iQWine est aussi une histoire de famille.', 'iQWine is also a family story.')}
              </p>
            </div>

            <FadeInOnScroll>
              <p className={`max-w-[60ch] ${CORPS}`}>
                {t(
                  'Deux générations, deux regards différents et beaucoup de discussions autour d’une même idée. Mégane apporte sa créativité, sa vision et son instinct pour l’expérience. Éric apporte son expérience entrepreneuriale, sa curiosité technologique et sa passion du vin.',
                  'Two generations, two different points of view and a great many conversations around one idea. Mégane brings her creativity, her vision and her instinct for experience. Éric brings his experience in business, his curiosity for technology and his passion for wine.',
                )}
              </p>
            </FadeInOnScroll>
          </div>

          <FadeInOnScroll>
            <blockquote
              className="mx-auto max-w-[900px] text-center"
              style={{ marginTop: 'clamp(56px, 7vw, 96px)' }}
            >
              <span aria-hidden className="mx-auto block h-px w-12 bg-or-jour/55" style={{ marginBottom: 'clamp(28px, 3vw, 40px)' }} />
              <p
                className="text-balance font-[family-name:var(--font-display)] font-medium italic leading-[1.22] text-bordeaux-jour"
                style={{ fontSize: 'clamp(26px, 3.6vw, 46px)' }}
              >
                {t(
                  'Deux générations, deux regards et une même passion pour transformer une belle idée en une expérience à partager avec les autres.',
                  'Two generations, two points of view and one shared passion: turning a beautiful idea into an experience to share with others.',
                )}
              </p>
              <span aria-hidden className="mx-auto block h-px w-12 bg-or-jour/55" style={{ marginTop: 'clamp(28px, 3vw, 40px)' }} />
            </blockquote>
          </FadeInOnScroll>

          {/* La clôture retombe sous la colonne de droite et referme le bloc. */}
          <FadeInOnScroll>
            <p
              className={`max-w-[54ch] lg:ml-[38%] ${CORPS}`}
              style={{ marginTop: 'clamp(56px, 7vw, 88px)' }}
            >
              {t(
                'Au fil du temps, ce qui n’était qu’une idée au départ est devenu une belle aventure que nous avons le plaisir de partager.',
                'Over time, what was only an idea at first became a beautiful adventure we have the pleasure of sharing.',
              )}
            </p>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ══ 4 · LA CODA OCTAVE ══════════════════════════════════════════ */}
      <section className="mouvement-jour relative" id="octave">
        <div className={CADRE} style={{ paddingTop: 'clamp(80px, 10vw, 140px)', paddingBottom: 'clamp(80px, 10vw, 140px)' }}>
          <div className="mx-auto max-w-[820px] text-center">
            <FadeInOnScroll>
              <p
                className="mx-auto max-w-[16ch] text-balance font-[family-name:var(--font-display)] font-medium italic leading-[1.12] text-encre"
                style={{ fontSize: 'clamp(30px, 4.4vw, 56px)' }}
              >
                {t('Ce sommelier, il fallait lui donner vie.', 'This sommelier had to be brought to life.')}
              </p>
              <p
                className="mt-9 inline-flex items-center gap-3 font-[family-name:var(--font-display)] italic text-or-jour"
                style={{ fontSize: 'clamp(19px, 1.9vw, 24px)' }}
              >
                <OctaveAnneau size={20} className="text-or-jour" />
                {t('C’est ainsi qu’Octave a commencé à prendre forme.', 'That is how Octave began to take shape.')}
              </p>
            </FadeInOnScroll>
            {/* Deux colonnes : la coda ne redevient pas une pile verticale. */}
            <div className="mt-12 grid gap-10 text-left md:grid-cols-2">
              {OCTAVE_SUITE.map((par) => (
                <FadeInOnScroll key={par.fr}>
                  <p className={CORPS}>{t(par.fr, par.en)}</p>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 5 · NOTRE VISION : l'énoncé à gauche, les deux plaisirs à droite */}
      <section className="mouvement-jour relative" id="vision">
        <div className="mx-auto w-[min(480px,72%)]">
          <LigneAccord variante="inflexion" ton="jour" />
        </div>
        <div className={CADRE} style={RYTHME}>
          <div className="grid gap-10 lg:grid-cols-[minmax(260px,0.4fr)_minmax(0,0.6fr)] lg:gap-x-14">
            {/* Collant, et hors FadeInOnScroll pour que le collant tienne. */}
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+32px)] lg:self-start">
              <p className={SURTITRE}>{t('Notre vision', 'Our vision')}</p>
              <Filet className="mt-5" />
              <h2
                className="mt-6 max-w-[19ch] font-[family-name:var(--font-display)] font-medium leading-[1.14] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(26px, 3.2vw, 44px)' }}
              >
                {t(
                  'Le vin est fait pour être découvert, partagé et surtout apprécié. Notre vision est d’en amplifier le plaisir, simplement.',
                  'Wine is meant to be discovered, shared and, above all, enjoyed. Our vision is to amplify that pleasure, simply.',
                )}
              </h2>
            </div>

            {/* Côte à côte en tablette, empilées au-delà : deux cartes pleines
                dans une colonne de 600 px ont enfin de la présence. */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {VISION.map((carte, i) => (
                <FadeInOnScroll key={carte.titre.fr} delay={i * 0.08}>
                  <article
                    className="h-full rounded-[20px] border border-encre/8 bg-[#fdfaf3]"
                    style={{ padding: 'clamp(26px, 3vw, 40px)' }}
                  >
                    <h3
                      className="font-[family-name:var(--font-display)] font-medium leading-snug text-encre"
                      style={{ fontSize: 'clamp(22px, 2.2vw, 28px)' }}
                    >
                      {t(carte.titre.fr, carte.titre.en)}
                    </h3>
                    <div className="mt-4 space-y-3">
                      {carte.paragraphes.map((par) => (
                        <p key={par.fr} className="text-[15.5px] leading-[1.7] text-encre-2">
                          {t(par.fr, par.en)}
                        </p>
                      ))}
                    </div>
                  </article>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 6 · NOS RACINES (nuit brève, la signature) ═══════════════════ */}
      <section
        id="racines"
        data-nav-delai="90"
        className="relative overflow-hidden text-foreground"
        style={{
          background:
            'linear-gradient(180deg, var(--color-papier) 0%, #2a1d13 8%, #150f0c 22%, #150f0c 100%)',
        }}
      >
        <div className="relative mx-auto max-w-[1440px] px-6 pb-24 pt-28 text-center lg:px-8 lg:pb-28 lg:pt-36">
          <FadeInOnScroll>
            <div className="mx-auto h-px w-[min(360px,60%)] bg-or/50" />
            <p
              className="mx-auto mt-10 max-w-[22ch] font-[family-name:var(--font-display)] font-medium leading-[1.2]"
              style={{ fontSize: 'clamp(28px, 4vw, 50px)' }}
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
            <p className="mt-12 font-[family-name:var(--font-display)] text-[18px] italic text-foreground-dim sm:text-[20px]">
              {t('Une recommandation à la fois.', 'One recommendation at a time.')}
            </p>
            <LocaleLink
              href="/sommelier-ia"
              className="mt-10 inline-flex items-center gap-2 text-[13.5px] font-medium text-or transition-colors hover:text-or-soft"
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
