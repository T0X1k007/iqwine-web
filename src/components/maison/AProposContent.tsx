'use client';

import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import FilAriane from '@/components/ui/FilAriane';
import LigneAccord from '@/components/ui/LigneAccord';
import LocaleLink from '@/components/ui/LocaleLink';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import { useLocale } from '@/lib/i18n';
import { ArrowRight } from 'lucide-react';

/**
 * /notre-maison — À PROPOS DE NOUS (checkpoint stratégique, GO d'Eric
 * 2026-08-14). Remplace l'ancienne page de marque, qui portait l'ANCIEN
 * positionnement (« On ne voulait pas gérer une cave ») et aurait fait
 * doublon. URLs conservées : /notre-maison ↔ /en/our-story (le slug anglais
 * dit déjà ce que la page est devenue), zéro redirection, zéro risque SEO.
 *
 * Quatre sections, la narration approuvée regroupée :
 *   1. L'IDÉE (ivoire) : la question d'ouverture, en pleine largeur.
 *   2. L'HISTOIRE (ivoire) : le récit du fondateur + LA photo (la grande,
 *      dans la cave, verre à la main) au moment « Puis la cave a grandi »,
 *      avec la bio courte en légende ; le « je » vit ici.
 *   3. NOTRE VISION (le « nous ») : deux plaisirs, choisir et partager.
 *   4. NOS RACINES (nuit brève, respiration maximale) : la signature Québec,
 *      la fermeture, et un seul lien discret vers Octave.
 *
 * Règles respectées : aucune mécanique produit expliquée, aucun CV, aucun
 * tiret cadratin. UNE SEULE photo du fondateur (décision d'Eric,
 * 2026-08-14 : deux portraits alourdissaient la page) ; le portrait sobre
 * bio-portrait reste dans public/photos/lifestyle/ mais n'est plus monté. Les photos de VISION viendront enrichir les deux blocs
 * sans changer leur structure (emplacements prêts, cf. commentaires).
 */

type T = (fr: string, en: string) => string;

/** Le récit, en paragraphes web. Texte approuvé, aucune phrase réécrite. */
const RECIT: { fr: string; en: string; grand?: boolean }[] = [
  {
    fr: 'Entrepreneur québécois en technologie depuis toujours et épicurien assumé, j’ai commencé à collectionner le vin avec une idée assez simple : laisser le temps travailler pour moi, afin d’avoir la bonne bouteille au bon moment.',
    en: 'A Québec technology entrepreneur from the start and a self-confessed epicurean, I began collecting wine with a fairly simple idea: let time work for me, so the right bottle would be there at the right moment.',
  },
  { fr: 'Puis la cave a grandi.', en: 'Then the cellar grew.', grand: true },
  {
    fr: 'Avec elle sont venues les questions. Quel vin ouvrir ce soir ? Lequel garder encore quelques années ? Qu’est-ce qui accompagnerait vraiment ce plat ? Et surtout, quelles bouteilles risquaient de passer leur apogée pendant que j’attendais une meilleure occasion ?',
    en: 'And with it came the questions. Which wine should I open tonight? Which one should I keep a few more years? What would truly go with this dish? And above all, which bottles were at risk of sliding past their peak while I waited for a better occasion?',
  },
  {
    fr: 'J’ai commencé à étudier le vieillissement, la maturité, la conservation et les accords. Puis quelque chose d’inattendu s’est produit : mes proches ont commencé à se tourner vers moi pour choisir leurs vins.',
    en: 'I started studying ageing, maturity, cellaring and pairings. Then something unexpected happened: the people around me began turning to me to choose their wines.',
  },
];

const RECIT_SUITE: { fr: string; en: string }[] = [
  {
    fr: 'Pas simplement pour associer un plat à un vin. Pas simplement pour gérer des bouteilles. Mais pour apprendre, se souvenir et affiner ses conseils au fil du temps.',
    en: 'Not simply to match a dish with a wine. Not simply to manage bottles. But to learn, to remember, and to refine his advice over time.',
  },
  {
    fr: 'Parce qu’au fond, ma passion pour le vin n’a jamais été une histoire de collection. C’est une histoire de moments, de découvertes et de gens avec qui on les partage.',
    en: 'Because in the end, my passion for wine was never about collecting. It is about moments, discoveries, and the people we share them with.',
  },
];

export default function AProposContent() {
  const { locale } = useLocale();
  const t: T = (fr, en) => (locale === 'fr' ? fr : en);

  return (
    <main>
      {/* ══ 1 · L'IDÉE ET L'HISTOIRE (ivoire) ══════════════════════════ */}
      {/* Les deux mouvements ne font plus qu'une section : le titre coiffe le
          diptyque, et le portrait remonte au niveau de la question au lieu de
          laisser un vide à sa droite (Eric, 2026-08-14 : « comble le vide,
          plus symétrique, plus organique »). Le portrait n'entre PAS dans la
          bande du titre, il commence exactement où la question commence. */}
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
          {/* Le titre, en bandeau pleine largeur au-dessus des deux colonnes. */}
          <div className="mt-10 lg:mt-12">
            <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
              {t('Notre histoire', 'Our story')}
            </p>
            <h1
              className="mt-3 text-balance font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
              style={{ fontSize: 'clamp(31px, 3.75vw, 50px)' }}
            >
              {t('Octave est né d’une ', 'Octave was born from a ')}
              <span className="text-bordeaux-jour">{t('question toute simple', 'simple question')}</span>
            </h1>
          </div>

          {/* Le diptyque, calé en HAUT : à gauche la question puis le récit,
              à droite le portrait. Les deux colonnes démarrent sur la même
              ligne et se terminent presque ensemble. */}
          <div className="mt-9 grid items-start gap-10 lg:mt-11 lg:grid-cols-[0.56fr_0.44fr] lg:gap-14">
            <div>
              <p
                className="font-[family-name:var(--font-display)] italic leading-[1.34] text-encre"
                style={{ fontSize: 'clamp(20px, 2.6vw, 31px)' }}
              >
                {t(
                  '« Et si je pouvais, à tout moment, choisir une bouteille parfaitement dans mes goûts, l’ouvrir au bon moment et la partager autour du bon repas ? »',
                  '“What if, at any moment, I could choose a bottle perfectly suited to my taste, open it at just the right time, and share it over the right meal?”',
                )}
              </p>
              <div className="mt-9 lg:mt-11">
                {RECIT.map((par) =>
                  par.grand ? (
                    <FadeInOnScroll key={par.fr}>
                      <p
                        className="my-6 font-[family-name:var(--font-display)] italic leading-snug text-bordeaux-jour"
                        style={{ fontSize: 'clamp(22px, 2.8vw, 30px)' }}
                      >
                        {t(par.fr, par.en)}
                      </p>
                    </FadeInOnScroll>
                  ) : (
                    <FadeInOnScroll key={par.fr}>
                      <p className="mb-5 text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]">
                        {t(par.fr, par.en)}
                      </p>
                    </FadeInOnScroll>
                  ),
                )}
              </div>
            </div>

            {/* LA photo du fondateur (Eric, 2026-08-14 : une seule, la grande
                dans la cave, verre à la main). Posée au moment « Puis la cave
                a grandi » : elle porte à la fois la personne et la passion,
                et la bio courte l'accompagne en légende. */}
            <FadeInOnScroll delay={0.1}>
              <figure>
                <div className="mx-auto max-w-[400px] overflow-hidden rounded-[18px] shadow-[0_30px_70px_-32px_rgba(60,38,18,0.5)]">
                  <picture>
                    <source type="image/avif" srcSet="/photos/lifestyle/bio-cave-800.avif 800w, /photos/lifestyle/bio-cave-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 44vw" />
                    <source type="image/webp" srcSet="/photos/lifestyle/bio-cave-800.webp 800w, /photos/lifestyle/bio-cave-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 44vw" />
                    <img
                      src="/photos/lifestyle/bio-cave.jpg"
                      alt={t(
                        'Éric Bigras, fondateur d’iQWine, dans sa cave, un verre de vin à la main.',
                        'Éric Bigras, founder of iQWine, in his cellar, a glass of wine in hand.',
                      )}
                      width={1200}
                      height={1803}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="h-auto w-full"
                    />
                  </picture>
                </div>
                <figcaption className="mx-auto mt-4 max-w-[400px] border-l-2 border-or-jour/40 pl-4">
                  <p className="font-[family-name:var(--font-display)] text-[18px] italic text-encre">
                    {t('Éric Bigras, fondateur d’iQWine', 'Éric Bigras, Founder of iQWine')}
                  </p>
                  <p className="mt-1 max-w-[40ch] text-[13.5px] leading-snug text-encre-3">
                    {t(
                      'Entrepreneur québécois en technologie, passionné de vin, de musique et d’innovation.',
                      'Québec technology entrepreneur, passionate about wine, music and innovation.',
                    )}
                  </p>
                </figcaption>
              </figure>
            </FadeInOnScroll>
          </div>

          {/* Le déclic, puis la naissance d'Octave. */}
          <div className="mx-auto mt-10 max-w-[62ch] text-center lg:mt-14">
            <FadeInOnScroll>
              <p className="text-[16px] leading-relaxed text-encre-2 md:text-[17px]">
                {t(
                  'À force de chercher les bonnes réponses pour moi et pour les autres, l’idée est devenue évidente :',
                  'Searching for the right answers, for myself and for others, made one thing obvious:',
                )}
              </p>
              <p
                className="mt-5 font-[family-name:var(--font-display)] font-medium italic leading-snug text-encre"
                style={{ fontSize: 'clamp(26px, 3.8vw, 44px)' }}
              >
                {t('ce sommelier, il fallait le créer.', 'this sommelier had to be created.')}
              </p>
              <p className="mt-7 inline-flex items-center gap-2.5 font-[family-name:var(--font-display)] text-[21px] italic text-or-jour sm:text-[24px]">
                <OctaveAnneau size={18} className="text-or-jour" />
                {t('C’est ainsi qu’est né Octave.', 'That is how Octave was born.')}
              </p>
            </FadeInOnScroll>
            <div className="mt-8 space-y-5 text-left">
              {RECIT_SUITE.map((par) => (
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

      {/* ══ 3 · NOTRE VISION (ivoire, le « nous ») ══════════════════════ */}
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
                <p
                  className="mt-4 font-[family-name:var(--font-display)] font-medium leading-[1.16] tracking-[-0.02em] text-encre"
                  style={{ fontSize: 'clamp(24px, 3.4vw, 40px)' }}
                >
                  {t(
                    'Le vin est fait pour être découvert, partagé et surtout apprécié. Notre vision est d’en amplifier le plaisir, simplement.',
                    'Wine is meant to be discovered, shared and, above all, enjoyed. Our vision is to amplify that pleasure, simply.',
                  )}
                </p>
              </div>
            </FadeInOnScroll>

            {/* Les deux plaisirs. Emplacements VISION-01 et VISION-02 prêts :
                une <figure> viendra coiffer chaque bloc quand les photos
                existeront, sans toucher à la grille ni aux textes. */}
            <div className="mt-11 grid gap-8 lg:grid-cols-2 lg:gap-12">
              <FadeInOnScroll>
                <article className="h-full rounded-[18px] border border-encre/8 bg-[#fdfaf3] p-7 lg:p-8">
                  <h2 className="font-[family-name:var(--font-display)] text-[24px] font-medium leading-snug text-encre sm:text-[28px]">
                    {t('Le plaisir de choisir juste', 'The pleasure of choosing well')}
                  </h2>
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
                  <h2 className="font-[family-name:var(--font-display)] text-[24px] font-medium leading-snug text-encre sm:text-[28px]">
                    {t('Le plaisir de partager', 'The pleasure of sharing')}
                  </h2>
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

      {/* ══ 4 · NOS RACINES (nuit brève, la signature) ══════════════════ */}
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
