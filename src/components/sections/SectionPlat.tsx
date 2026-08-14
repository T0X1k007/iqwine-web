'use client';

import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import LigneAccord from '@/components/ui/LigneAccord';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import { useLocale } from '@/lib/i18n';
import { MapPin } from 'lucide-react';

/**
 * MOUVEMENT 5, « LE PLAT », retour au jour, nouveau rythme.
 *
 * Mise en scène (feu vert d'Eric, 2026-08-13) : le HÉROS visuel est le plat
 * lui-même, une large bande photographique gastronomique, titre centré
 * au-dessus, et la carte d'accord d'Octave posée sur le bord de l'image.
 * Ni démonstration technique du scan, ni téléphone : le moment.
 *
 * Vérité produit : photographier un plat → proposition d'accord = capacité
 * réelle (« Montrez-lui » + accord mets-vins, cœur du produit). L'accord
 * proposé vient de VOTRE cave, avec son emplacement réel (section/rangée/
 * case = fonctionnalité livrée). Le lien final mène à la démo interactive
 * réelle plus bas dans la page.
 *
 * Photo PROVISOIRE (Unsplash, marque « LEO » sur l'assiette, cf.
 * public/photos/lifestyle/README.md) : sera remplacée par la génération
 * d'Eric, même conteneur.
 */

export default function SectionPlat() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <section id="plat" className="mouvement-jour relative">
      {/* Retour au jour : l'inflexion repasse en or patiné. */}
      <div className="mx-auto w-[min(480px,72%)]">
        <LigneAccord variante="inflexion" ton="jour" />
      </div>

      <div className="mx-auto max-w-[1440px] px-6 py-12 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[720px] text-center">
          <FadeInOnScroll>
            <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
              {t('Mouvement · Le plat', 'Movement · The dish')}
            </p>
            <h2
              className="mt-4 font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
              style={{ fontSize: 'clamp(30px, 4.4vw, 54px)' }}
            >
              {t('Le repas est prêt. ', 'The meal is ready. ')}
              <span className="text-bordeaux-jour">
                {t('La bonne bouteille aussi.', 'So is the right bottle.')}
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-[50ch] text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]">
              {t(
                'Photographiez votre plat. Octave regarde ce que vous allez manger, et choisit parmi vos bouteilles, ou parmi celles disponibles près de vous.',
                'Photograph your dish. Octave looks at what you’re about to eat, and chooses from your bottles, or from those available near you.',
              )}
            </p>
          </FadeInOnScroll>
        </div>

        {/* La bande gastronomique, le plat en héros, l'accord posé dessus.
            Hauteur FIXE et compacte : le mouvement tient en ~un écran. */}
        <div className="relative mt-9 pb-16 sm:pb-14 lg:mt-10">
          <FadeInOnScroll>
            <figure className="overflow-hidden rounded-[20px] shadow-[0_40px_100px_-40px_rgba(60,38,18,0.55)]">
              <picture>
                <source
                  type="image/avif"
                  srcSet="/photos/lifestyle/plat-accord-pates-800.avif 800w, /photos/lifestyle/plat-accord-pates-1400.avif 1400w"
                  sizes="(max-width: 1024px) 100vw, 92vw"
                />
                <source
                  type="image/webp"
                  srcSet="/photos/lifestyle/plat-accord-pates-800.webp 800w, /photos/lifestyle/plat-accord-pates-1400.webp 1400w"
                  sizes="(max-width: 1024px) 100vw, 92vw"
                />
                <img
                  src="/photos/lifestyle/plat-accord-pates.jpg"
                  alt={t(
                    'Un plat de pâtes généreux servi sur une table chaleureuse.',
                    'A generous pasta dish served on a warm table.',
                  )}
                  width={1200}
                  height={1800}
                  loading="lazy"
                  decoding="async"
                  className="h-[300px] w-full object-cover sm:h-[400px]"
                  style={{ objectPosition: '50% 48%' }}
                />
              </picture>
            </figure>
          </FadeInOnScroll>

          {/* L'accord d'Octave, depuis VOTRE cave, avec son emplacement. */}
          <FadeInOnScroll delay={0.16}>
            <div className="absolute bottom-0 right-[4%] w-[min(400px,92%)] rounded-[18px] border border-encre/10 bg-[#fdfaf3] p-5 shadow-[0_34px_80px_-30px_rgba(36,27,20,0.55)] sm:right-[5%]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-encre-3">
                  <OctaveAnneau size={16} className="text-or-jour" />
                  {t('Accord trouvé', 'Pairing found')}
                </span>
                <span className="rounded-full bg-or-jour/12 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.16em] text-or-jour">
                  {t('Dans votre cave', 'From your cellar')}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element -- bouteille détourée du dépôt, WebP léger */}
                <img
                  src="/photos/wines/masciarelli.webp"
                  alt=""
                  width={1000}
                  height={1500}
                  loading="lazy"
                  decoding="async"
                  className="h-[96px] w-auto drop-shadow-[0_10px_18px_rgba(60,38,18,0.28)]"
                  draggable={false}
                />
                <div className="min-w-0">
                  <p className="font-[family-name:var(--font-display)] text-[19px] font-semibold leading-tight text-encre">
                    Montepulciano <span className="text-or-jour">d’Abruzzo</span>
                  </p>
                  <p className="mt-0.5 text-[13px] text-encre-2">Masciarelli · Abruzzes</p>
                  <p className="mt-2 text-[13px] leading-snug text-encre-2">
                    {t(
                      '« La tomate confite appelle son fruit noir et sa souplesse. »',
                      '“Slow-cooked tomato calls for its dark fruit and supple body.”',
                    )}
                  </p>
                </div>
              </div>
              {/* LA connexion : l'accord n'est pas théorique, la bouteille
                  existe, chez vous, à une case précise. C'est la magie à
                  mettre en avant (Eric, 2026-08-13). */}
              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-or-jour/30 bg-or-jour/[0.08] px-3.5 py-3">
                <MapPin size={16} strokeWidth={1.8} className="shrink-0 text-or-jour" aria-hidden />
                <span className="text-[13px] leading-snug text-encre">
                  <strong className="font-semibold">{t('Déjà chez vous', 'Already at home')}</strong>
                  {' · '}
                  {t('Cellier, rangée 2, case 5', 'Cellar, row 2, slot 5')}
                </span>
              </div>
            </div>
          </FadeInOnScroll>
        </div>

        <FadeInOnScroll delay={0.1}>
          <div className="mt-4 flex flex-wrap items-baseline justify-center gap-x-5 gap-y-2 text-center">
            <p className="font-[family-name:var(--font-display)] text-[19px] italic text-encre-2 sm:text-[21px]">
              {t('Vous montrez. Octave comprend.', 'You show. Octave understands.')}
            </p>
            <a
              href="#demo"
              className="text-[14px] font-medium text-bordeaux-jour underline decoration-bordeaux-jour/40 underline-offset-4 transition-colors hover:decoration-bordeaux-jour"
            >
              {t('Essayez avec un plat', 'Try it with a dish')}
            </a>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
