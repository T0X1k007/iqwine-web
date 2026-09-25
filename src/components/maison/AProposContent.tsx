'use client';

import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import FilAriane from '@/components/ui/FilAriane';
import LigneAccord from '@/components/ui/LigneAccord';
import LocaleLink from '@/components/ui/LocaleLink';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import { useLocale } from '@/lib/i18n';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * /notre-maison — NOTRE HISTOIRE (refonte éditoriale du 2026-09-25).
 *
 * ── Ce que la page raconte désormais ──────────────────────────────────────
 * Décision d'Eric (2026-09-25) : iQWine est l'idée de Mégane. Elle en est la
 * FONDATRICE et dirige le produit et la marque ; Eric l'accompagne, direction
 * et mise en œuvre techniques ; c'est un projet familial. La page précédente
 * ouvrait sur le récit d'Eric à la première personne (« j'ai commencé à
 * collectionner… ») et le légendait « fondateur » : ce récit est retiré, il
 * faisait d'Eric l'origine du concept. Textes : brief « Refonte Notre
 * histoire » d'Eric, repris mot pour mot en français.
 *
 * ── La hiérarchie EST le message ──────────────────────────────────────────
 *   1. L'IDÉE (ivoire) : le titre pose l'origine (« Une idée de Mégane »),
 *      puis le portrait de Mégane, PREMIER visage de la page, texte à gauche
 *      et photo à droite, « Fondatrice d'iQWine » en clair.
 *   2. LA TECHNIQUE (ivoire, le miroir) : Eric, photo à gauche et texte à
 *      droite, direction & mise en œuvre techniques.
 *   3. UNE HISTOIRE DE FAMILLE : la complémentarité père-fille, sans jamais
 *      faire de l'origine un 50/50, puis la coda « ce sommelier, il fallait
 *      le créer », réécrite sans attribuer l'idée à Eric.
 *   4. NOTRE VISION (le « nous ») : deux plaisirs, choisir et partager.
 *   5. NOS RACINES (nuit brève) : la signature Québec et un lien vers Octave.
 *
 * ── Contrainte corporative ────────────────────────────────────────────────
 * iQWine inc. N'EXISTE PAS : le projet est porté par Groupe Medtech Inc.
 * Jamais « présidente », « CEO » ni « iQWine inc. » ici : Mégane est
 * « Fondatrice d'iQWine », le projet et la marque, pas une société.
 *
 * Règles de voix : aucun tiret cadratin, aucune mécanique produit, aucun CV.
 * La photo de Mégane passe en tête : c'est elle qui charge en priorité.
 */

type T = (fr: string, en: string) => string;
type Paragraphe = { fr: string; en: string; fort?: boolean };

/** Mégane, fondatrice. Texte du brief d'Eric (2026-09-25), mot pour mot. */
const MEGANE: Paragraphe[] = [
  {
    fr: 'Mégane est la fondatrice d’iQWine. C’est elle qui a imaginé le concept à l’origine du projet : un sommelier personnel capable d’apprendre à connaître chaque personne pour l’aider à choisir ses vins selon ses propres goûts.',
    en: 'Mégane is the founder of iQWine. She imagined the concept behind the project: a personal sommelier able to get to know each person and help them choose wines according to their own taste.',
    fort: true,
  },
  {
    fr: 'Passionnée par le design, la création et l’expérience utilisateur, Mégane voulait rendre le monde du vin plus simple, plus personnel et moins intimidant. De cette vision est né iQWine, puis Octave, son sommelier virtuel.',
    en: 'Passionate about design, creation and user experience, Mégane wanted to make the world of wine simpler, more personal and less intimidating. From that vision came iQWine, and then Octave, its virtual sommelier.',
  },
  {
    fr: 'Depuis les débuts du projet, elle définit la vision du produit, l’expérience recherchée et les fonctionnalités qu’elle souhaite offrir aux utilisateurs. Les commentaires des bêta-testeurs viennent enrichir cette réflexion et l’aident à déterminer comment iQWine doit évoluer.',
    en: 'Since the project began, she has defined the product vision, the experience it should offer and the features she wants to bring to users. Feedback from beta testers enriches that thinking and helps her decide how iQWine should evolve.',
  },
  {
    fr: 'Mégane a également construit l’univers de la marque et pilote sa création, son contenu, ses vidéos, sa publicité et ses communications.',
    en: 'Mégane also built the world of the brand and leads its creative work, content, videos, advertising and communications.',
  },
  {
    fr: 'De l’idée initiale à l’expérience proposée aujourd’hui, elle porte la vision d’iQWine et en dirige l’évolution.',
    en: 'From the first idea to the experience offered today, she carries the vision of iQWine and leads its evolution.',
    fort: true,
  },
];

/** Eric, direction & mise en œuvre techniques. Texte du brief, mot pour mot. */
const ERIC: Paragraphe[] = [
  {
    fr: 'Le rôle d’Éric est de transformer la vision produit et les fonctionnalités définies pour iQWine en une plateforme fonctionnelle, fiable et évolutive.',
    en: 'Éric’s role is to turn the product vision and the features defined for iQWine into a platform that works, that is reliable, and that can grow.',
    fort: true,
  },
  {
    fr: 'Entrepreneur et passionné de technologie, Éric accompagne Mégane dans la réalisation technique du projet. À partir des besoins et fonctionnalités recherchés, il les traduit en instructions techniques pour les outils de développement et supervise leur intégration dans la plateforme.',
    en: 'An entrepreneur with a passion for technology, Éric supports Mégane in building the project technically. Starting from the needs and features sought, he translates them into technical instructions for the development tools and oversees their integration into the platform.',
  },
  {
    fr: 'Il assure également les tests, le débogage, les correctifs et la maintenance technique nécessaires à l’évolution d’iQWine.',
    en: 'He also handles the testing, debugging, fixes and technical maintenance that iQWine needs to keep evolving.',
  },
  {
    fr: 'Son expérience entrepreneuriale et technologique lui permet de faire le pont entre une idée produit et sa réalisation concrète.',
    en: 'His experience in business and technology lets him bridge the gap between a product idea and its concrete realisation.',
  },
  {
    fr: 'Mégane imagine et dirige le produit. Éric veille à ce que cette vision puisse prendre vie techniquement.',
    en: 'Mégane imagines and leads the product. Éric makes sure that vision can come to life, technically.',
    fort: true,
  },
];

/** La famille, puis la naissance d'Octave. Texte du brief, mot pour mot. */
const FAMILLE: { fr: string; en: string }[] = [
  {
    fr: 'Mégane porte la vision du produit, l’expérience utilisateur et l’univers de la marque. Éric apporte son expérience entrepreneuriale et technologique pour transformer cette vision en une plateforme fonctionnelle et évolutive.',
    en: 'Mégane carries the product vision, the user experience and the world of the brand. Éric brings his experience in business and technology to turn that vision into a platform that works and keeps evolving.',
  },
  {
    fr: 'Deux générations, deux expertises complémentaires, réunies autour d’une même ambition : rendre le vin plus simple à comprendre, plus personnel et surtout plus agréable à découvrir.',
    en: 'Two generations, two complementary kinds of expertise, brought together by one ambition: to make wine simpler to understand, more personal and, above all, more enjoyable to discover.',
  },
];

const OCTAVE: { fr: string; en: string }[] = [
  {
    fr: 'Octave est né de la volonté de créer un sommelier différent : personnel, accessible et capable d’apprendre les goûts de chacun au fil du temps.',
    en: 'Octave was born from the wish to create a different kind of sommelier: personal, approachable, and able to learn each person’s taste over time.',
  },
  {
    fr: 'Cette vision guide le développement d’iQWine depuis ses débuts : utiliser la technologie non pas pour compliquer le vin, mais pour le rendre plus humain, plus intuitif et plus personnel.',
    en: 'That vision has guided the development of iQWine from the start: using technology not to complicate wine, but to make it more human, more intuitive and more personal.',
  },
];

/** Un récit en paragraphes web ; les paragraphes « forts » ouvrent et ferment. */
function Recit({ paragraphes, t }: { paragraphes: Paragraphe[]; t: T }) {
  return (
    <div className="mt-7 lg:mt-8">
      {paragraphes.map((par) => (
        <FadeInOnScroll key={par.fr}>
          <p
            className={`mb-5 text-[16.5px] leading-relaxed md:text-[17.5px] ${
              par.fort ? 'font-medium text-encre' : 'text-encre-2'
            }`}
          >
            {t(par.fr, par.en)}
          </p>
        </FadeInOnScroll>
      ))}
    </div>
  );
}

/** L'identification d'un portrait : le rôle en capitales, puis le titre éditorial. */
function Identite({
  nom,
  role,
  domaine,
  titre,
}: {
  nom: string;
  role: string;
  domaine: string;
  titre: ReactNode;
}) {
  return (
    <div>
      <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
        {nom} <span aria-hidden>·</span> <span className="text-bordeaux-jour">{role}</span>
      </p>
      <h2
        className="mt-3 text-balance font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em] text-encre"
        style={{ fontSize: 'clamp(26px, 3vw, 38px)' }}
      >
        {titre}
      </h2>
      <p className="mt-2 font-[family-name:var(--font-display)] text-[17px] italic text-encre-3 sm:text-[19px]">
        {domaine}
      </p>
    </div>
  );
}

/** La légende sous une photo : le nom et le rôle, puis le domaine. */
function Legende({ titre, domaine }: { titre: string; domaine: string }) {
  return (
    <figcaption className="mx-auto mt-4 max-w-[400px] border-l-2 border-or-jour/40 pl-4">
      <p className="font-[family-name:var(--font-display)] text-[18px] italic text-encre">{titre}</p>
      <p className="mt-1 max-w-[40ch] text-[13.5px] leading-snug text-encre-3">{domaine}</p>
    </figcaption>
  );
}

export default function AProposContent() {
  const { locale } = useLocale();
  const t: T = (fr, en) => (locale === 'fr' ? fr : en);

  return (
    <main>
      {/* ══ 1 · L'IDÉE, PUIS MÉGANE (ivoire) ═══════════════════════════ */}
      {/* Le titre pose l'origine en une ligne, l'introduction la raconte en
          une phrase, et le premier portrait est celui de la fondatrice. */}
      <section
        className="mouvement-jour relative"
        id="histoire"
        style={{ paddingTop: 'var(--nav-h)' }}
      >
        <div className="mx-auto max-w-[1060px] px-6 pb-12 pt-8 lg:pb-16 lg:pt-10">
          <FilAriane
            elements={[
              { label: t('Accueil', 'Home'), href: '/' },
              { label: t('Notre histoire', 'Our story') },
            ]}
          />
          <div className="mt-10 lg:mt-12">
            <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
              {t('Notre histoire', 'Our story')}
            </p>
            <h1
              className="mt-3 text-balance font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
              style={{ fontSize: 'clamp(31px, 3.75vw, 50px)' }}
            >
              {t('Une idée de Mégane, devenue ', 'Mégane’s idea, grown into ')}
              <span className="text-bordeaux-jour">{t('une aventure à deux', 'an adventure for two')}</span>
            </h1>
            <p
              className="mt-6 max-w-[46ch] font-[family-name:var(--font-display)] italic leading-[1.4] text-encre"
              style={{ fontSize: 'clamp(19px, 2.2vw, 26px)' }}
            >
              {t(
                'iQWine est né d’une idée de Mégane Bigras : créer un sommelier personnel capable d’apprendre réellement à connaître chaque personne pour l’aider à choisir ses vins selon ses propres goûts.',
                'iQWine was born from an idea by Mégane Bigras: to create a personal sommelier able to truly get to know each person and help them choose wines according to their own taste.',
              )}
            </p>
          </div>

          {/* Le portrait de Mégane : texte à gauche, photo à droite, les deux
              colonnes calées en haut. */}
          <div
            className="mt-12 grid items-start gap-10 lg:mt-16 lg:grid-cols-[0.56fr_0.44fr] lg:gap-14"
            id="megane"
          >
            <div>
              <Identite
                nom="Mégane Bigras"
                role={t('Fondatrice d’iQWine', 'Founder of iQWine')}
                domaine={t('Vision produit, création & croissance', 'Product vision, creation & growth')}
                titre={
                  <>
                    {t('L’idée derrière ', 'The idea behind ')}
                    <span className="text-bordeaux-jour">iQWine</span>
                  </>
                }
              />
              <Recit paragraphes={MEGANE} t={t} />
            </div>

            {/* Sur mobile, la photo de Mégane passe AVANT son texte : elle
                est le premier visage de la page, dès l'introduction. */}
            <FadeInOnScroll delay={0.1} className="order-first lg:order-none">
              <figure>
                <div className="mx-auto max-w-[400px] overflow-hidden rounded-[18px] shadow-[0_30px_70px_-32px_rgba(60,38,18,0.5)]">
                  <picture>
                    {/* La source fait 1086 px de large : pas de variante 1400,
                        on ne sur-échantillonne jamais (règle de generer-images). */}
                    <source type="image/avif" srcSet="/photos/lifestyle/megane-800.avif 800w, /photos/lifestyle/megane-1086.avif 1086w" sizes="(max-width: 1024px) 100vw, 44vw" />
                    <source type="image/webp" srcSet="/photos/lifestyle/megane-800.webp 800w, /photos/lifestyle/megane-1086.webp 1086w" sizes="(max-width: 1024px) 100vw, 44vw" />
                    <img
                      src="/photos/lifestyle/megane.jpg"
                      alt={t(
                        'Mégane Bigras, fondatrice d’iQWine, souriante dans une cave à vin.',
                        'Mégane Bigras, founder of iQWine, smiling in a wine cellar.',
                      )}
                      width={1086}
                      height={1448}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="h-auto w-full"
                    />
                  </picture>
                </div>
                <Legende
                  titre={t('Mégane Bigras, fondatrice d’iQWine', 'Mégane Bigras, Founder of iQWine')}
                  domaine={t('Vision produit, création & croissance', 'Product vision, creation & growth')}
                />
              </figure>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ══ 2 · ÉRIC, LA TECHNIQUE (ivoire, le miroir) ═══════════════════ */}
      {/* Même grille, colonnes INVERSÉES : photo à gauche, texte à droite. Le
          portrait est premier dans le DOM, sur mobile la photo précède le
          texte, comme pour Mégane au-dessus. */}
      <section className="mouvement-jour relative" id="eric">
        <div className="mx-auto w-[min(480px,72%)]">
          <LigneAccord ton="jour" />
        </div>
        <div className="mx-auto max-w-[1060px] px-6 py-12 lg:py-16">
          <div className="grid items-start gap-10 lg:grid-cols-[0.44fr_0.56fr] lg:gap-14">
            <FadeInOnScroll delay={0.1}>
              <figure>
                <div className="mx-auto max-w-[400px] overflow-hidden rounded-[18px] shadow-[0_30px_70px_-32px_rgba(60,38,18,0.5)]">
                  <picture>
                    <source type="image/avif" srcSet="/photos/lifestyle/bio-cave-800.avif 800w, /photos/lifestyle/bio-cave-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 44vw" />
                    <source type="image/webp" srcSet="/photos/lifestyle/bio-cave-800.webp 800w, /photos/lifestyle/bio-cave-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 44vw" />
                    <img
                      src="/photos/lifestyle/bio-cave.jpg"
                      alt={t(
                        'Éric Bigras dans une cave à vin, un verre de vin à la main.',
                        'Éric Bigras in a wine cellar, a glass of wine in hand.',
                      )}
                      width={1200}
                      height={1803}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full"
                    />
                  </picture>
                </div>
                <Legende
                  titre={t(
                    'Éric Bigras, direction & mise en œuvre technique',
                    'Éric Bigras, Technical Direction & Implementation',
                  )}
                  domaine={t(
                    'Technologie, intégration & évolution de la plateforme',
                    'Technology, integration & platform evolution',
                  )}
                />
              </figure>
            </FadeInOnScroll>

            <div>
              <Identite
                nom="Éric Bigras"
                role={t('Direction & mise en œuvre technique', 'Technical direction & implementation')}
                domaine={t(
                  'Technologie, intégration & évolution de la plateforme',
                  'Technology, integration & platform evolution',
                )}
                titre={
                  <>
                    {t('Donner vie techniquement ', 'Bringing the vision ')}
                    <span className="text-bordeaux-jour">{t('à la vision', 'to life, technically')}</span>
                  </>
                }
              />
              <Recit paragraphes={ERIC} t={t} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3 · UNE HISTOIRE DE FAMILLE, PUIS OCTAVE ═════════════════════ */}
      {/* La complémentarité, centrée : elle vient APRÈS les deux portraits et
          ne rejoue pas l'origine, qui appartient à Mégane. La coda « ce
          sommelier, il fallait le créer » garde son émotion, sans « je ». */}
      <section className="mouvement-jour relative" id="famille">
        <div className="mx-auto w-[min(480px,72%)]">
          <LigneAccord ton="jour" />
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
                {t('Une vision, ', 'One vision, ')}
                <span className="text-bordeaux-jour">{t('deux expertises', 'two kinds of expertise')}</span>
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
            {FAMILLE.map((par) => (
              <FadeInOnScroll key={par.fr}>
                <p className="text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]">{t(par.fr, par.en)}</p>
              </FadeInOnScroll>
            ))}
          </div>

          <div className="mx-auto mt-14 max-w-[62ch] text-center lg:mt-20">
            <FadeInOnScroll>
              <p className="inline-flex items-center gap-2.5 font-[family-name:var(--font-display)] text-[21px] italic text-or-jour sm:text-[24px]">
                <OctaveAnneau size={18} className="text-or-jour" />
                Octave
              </p>
              <p
                className="mt-4 font-[family-name:var(--font-display)] font-medium italic leading-snug text-encre"
                style={{ fontSize: 'clamp(26px, 3.8vw, 44px)' }}
              >
                {t('Ce sommelier, il fallait le créer.', 'This sommelier had to be created.')}
              </p>
            </FadeInOnScroll>
            <div className="mt-8 space-y-5 text-left">
              {OCTAVE.map((par) => (
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
