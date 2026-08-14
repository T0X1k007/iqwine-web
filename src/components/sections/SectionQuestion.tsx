'use client';

import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import LocaleLink from '@/components/ui/LocaleLink';
import LigneAccord from '@/components/ui/LigneAccord';
import { useLocale } from '@/lib/i18n';
import { Play } from 'lucide-react';

/**
 * MOUVEMENT 2, « LA QUESTION » (refonte v3 « À l'unisson »).
 *
 * Révisions des 2026-08-12/13 (retours d'Eric) :
 * 1. L'HUMAIN, un assemblage de DEUX photos fournies par Eric, légèrement
 *    superposées : l'homme au mur de bouteilles (arrière, miroité pour rester
 *    visible à droite) et le couple perdu dans la carte (devant, débordant à
 *    gauche). Provenance : sources-photos/README.md.
 * 2. LA HAUTEUR, composition horizontale : titre pleine largeur, puis récit à
 *    gauche / assemblage à droite. La typographie ne rétrécit pas ; c'est
 *    l'espace vertical qui se resserre. Sur un desktop standard, titre →
 *    situations → chute → « Voir le film » se lisent d'un seul geste.
 *
 * Le principe retenu pour tout le site : le texte raconte, la photographie
 * fait ressentir, l'interface prouve. Ici : texte + photo, aucun écran.
 */

export default function SectionQuestion() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const mesures = [
    {
      lieu: t('En magasin', 'In the store'),
      ligne: t('Deux cents bouteilles devant vous.', 'Two hundred bottles in front of you.'),
    },
    {
      lieu: t('Au restaurant', 'At the restaurant'),
      ligne: t('Une longue carte, parfois dans une autre langue.', 'A long list, sometimes in another language.'),
    },
    {
      lieu: t('Chez vous', 'At home'),
      ligne: t('Votre propre cave, et un repas qui attend.', 'Your own cellar, and a meal waiting.'),
    },
  ];

  return (
    <section id="question" className="mouvement-jour relative">
      {/* Transition depuis le hero : une inflexion de la ligne d'accord. */}
      <div className="mx-auto w-[min(480px,72%)]">
        <LigneAccord variante="inflexion" ton="jour" />
      </div>

      <div className="mx-auto max-w-[1440px] px-6 py-12 sm:py-14 lg:px-8 lg:py-16">
        {/* Le titre, pleine largeur, la grande typographie reste grande. */}
        <FadeInOnScroll>
          <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
            {t('La question', 'The question')}
          </p>
          <h2
            className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em] text-encre"
            style={{ fontSize: 'clamp(30px, 4.4vw, 54px)' }}
          >
            {t('Il y a de bons vins partout.', 'There is good wine everywhere.')}{' '}
            <span className="block text-bordeaux-jour sm:inline lg:block">
              {t('Lequel est le vôtre ?', 'Which one is yours?')}
            </span>
          </h2>
        </FadeInOnScroll>

        <div className="mt-9 grid items-stretch gap-9 lg:mt-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          {/* L'ASSEMBLAGE (photos d'Eric, 2026-08-12), le même embarras
              raconté deux fois : l'homme au mur de bouteilles (ARRIÈRE) et le
              couple perdu dans la carte (DEVANT), légèrement superposés, les
              deux scènes lisibles. Sur desktop le bloc est ABSOLU dans sa
              colonne : c'est le récit (gauche) qui dicte la hauteur. */}
          <FadeInOnScroll className="relative lg:order-2 lg:min-h-full" delay={0.08}>
            {/* Sur desktop, l'assemblage REMONTE au-dessus de sa colonne
                (top négatif) : il occupe le vide à droite du titre et se
                centre optiquement dans la section (Eric, 2026-08-13). */}
            <div className="relative aspect-[10/9] lg:absolute lg:bottom-2 lg:left-0 lg:right-0 lg:top-[-96px] lg:aspect-auto">
              <figure className="absolute right-0 top-0 w-[88%] overflow-hidden rounded-[18px] shadow-[0_24px_60px_-30px_rgba(60,38,18,0.45)]">
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/photos/lifestyle/rayon-choix-bouteille-800.avif 800w, /photos/lifestyle/rayon-choix-bouteille-1400.avif 1400w"
                    sizes="(max-width: 1024px) 86vw, 38vw"
                  />
                  <source
                    type="image/webp"
                    srcSet="/photos/lifestyle/rayon-choix-bouteille-800.webp 800w, /photos/lifestyle/rayon-choix-bouteille-1400.webp 1400w"
                    sizes="(max-width: 1024px) 86vw, 38vw"
                  />
                  {/* Miroir horizontal (scaleX(-1)) : l'homme passe à DROITE du
                      cadre, hors de la zone recouverte par la carte du couple ,
                      il doit rester visible (Eric, 2026-08-13). Aucun texte
                      lisible dans l'image, le miroir est indolore. */}
                  <img
                    src="/photos/lifestyle/rayon-choix-bouteille.jpg"
                    alt={t(
                      'Dans un point de vente de vins, un homme hésite devant un mur de bouteilles.',
                      'In a wine store, a man hesitates in front of a wall of bottles.',
                    )}
                    width={1200}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full -scale-x-100"
                  />
                </picture>
              </figure>
              {/* La carte du couple : GRANDE, et qui grandit vers la GAUCHE
                  seulement (débord dans la gouttière), son bord droit ne doit
                  jamais recouvrir l'homme du fond, validé visible. */}
              <figure className="absolute bottom-0 left-[-6%] w-[60%] overflow-hidden rounded-[14px] border-[5px] border-papier shadow-[0_34px_80px_-30px_rgba(36,27,20,0.55)] lg:bottom-auto lg:left-[-24%] lg:top-[30%] lg:w-[78%]">
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/photos/lifestyle/restaurant-choix-carte-800.avif 800w, /photos/lifestyle/restaurant-choix-carte-1400.avif 1400w"
                    sizes="(max-width: 1024px) 64vw, 28vw"
                  />
                  <source
                    type="image/webp"
                    srcSet="/photos/lifestyle/restaurant-choix-carte-800.webp 800w, /photos/lifestyle/restaurant-choix-carte-1400.webp 1400w"
                    sizes="(max-width: 1024px) 64vw, 28vw"
                  />
                  <img
                    src="/photos/lifestyle/restaurant-choix-carte.jpg"
                    alt={t(
                      'Au restaurant, un couple parcourt une longue carte des vins.',
                      'At a restaurant, a couple pores over a long wine list.',
                    )}
                    width={1200}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full"
                  />
                </picture>
              </figure>
            </div>
          </FadeInOnScroll>

          {/* Le récit, les trois situations, la chute, le film. */}
          <div className="flex flex-col lg:order-1">
            <div className="border-t border-encre/10">
              {mesures.map((m, i) => (
                <FadeInOnScroll key={m.lieu} delay={0.06 * i}>
                  <div className="flex flex-col gap-1 border-b border-encre/10 py-4 sm:flex-row sm:items-baseline sm:gap-7">
                    <span className="w-[140px] shrink-0 text-[11.5px] font-medium uppercase tracking-[0.22em] text-encre-3">
                      {m.lieu}
                    </span>
                    <span className="text-[16.5px] text-encre-2 md:text-[18px]">{m.ligne}</span>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>

            <FadeInOnScroll delay={0.16}>
              <p
                className="mt-8 max-w-[30ch] font-[family-name:var(--font-display)] font-medium italic leading-[1.22] text-encre"
                style={{ fontSize: 'clamp(23px, 2.9vw, 35px)' }}
              >
                {t('La question n’est jamais « lequel est le meilleur ? »', 'The question is never “which one is best?”')}{' '}
                <span className="text-bordeaux-jour">
                  {t('C’est : lequel vais-je aimer, moi ?', 'It’s: which one will I love?')}
                </span>
              </p>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.22}>
              <LocaleLink
                href="/le-film"
                className="mt-8 inline-flex items-center gap-2.5 self-start rounded-full border border-encre/15 bg-papier-2 px-5 py-2.5 text-[13.5px] font-medium text-encre-2 transition-colors hover:border-bordeaux-jour/40 hover:text-bordeaux-jour"
              >
                <Play size={13} strokeWidth={2} aria-hidden />
                {t('Voir le film, une minute', 'Watch the film, one minute')}
              </LocaleLink>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
