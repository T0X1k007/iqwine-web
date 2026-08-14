'use client';

import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import Button from '@/components/ui/Button';
import LocaleLink from '@/components/ui/LocaleLink';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { ArrowRight } from 'lucide-react';

/**
 * MOUVEMENT 3, « DEVANT LE RAYON », refonte v3 « À l'unisson ».
 *
 * Révision du 2026-08-13 (Eric) : composition INVERSÉE par rapport au
 * mouvement 2, l'assemblage photo à GAUCHE, le récit à DROITE. L'assemblage
 * superpose la photo de la cliente au téléphone dans le point de vente
 * (ARRIÈRE-PLAN, fournie par Eric) et la carte Compagnon d'achat dessinée
 * (DEVANT, le thème clair de l'app, la preuve). Le budget est un critère réel
 * du parcours (SommelierSearch.budgetMin/Max), copy vérifié dans le code.
 */

/** La carte de preuve, le Compagnon d'achat, thème clair, dessiné. */
function CartePreuve() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <div className="rounded-[18px] border border-encre/10 bg-[#fdfaf3] p-4 shadow-[0_34px_80px_-30px_rgba(36,27,20,0.55)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-encre-3">
          <OctaveAnneau size={16} className="text-or-jour" />
          {t('Compagnon d’achat', 'Shopping companion')}
        </span>
        <span className="rounded-full bg-or-jour/12 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.16em] text-or-jour">
          {t('Pour votre palais', 'For your palate')}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- bouteille détourée du dépôt, WebP léger */}
        <img
          src="/photos/wines/trimbach.webp"
          alt=""
          width={1000}
          height={1500}
          loading="lazy"
          decoding="async"
          className="h-[104px] w-auto drop-shadow-[0_10px_18px_rgba(60,38,18,0.28)] sm:h-[118px] lg:h-[96px]"
          draggable={false}
        />
        <div className="min-w-0">
          <p className="font-[family-name:var(--font-display)] text-[20px] font-semibold leading-tight text-encre sm:text-[21px]">
            Riesling <span className="text-or-jour">2022</span>
          </p>
          <p className="mt-0.5 text-[13px] text-encre-2">Trimbach · Alsace</p>
          <p className="mt-3 text-[13px] leading-snug text-encre-2 sm:text-[13.5px]">
            {t(
              '« Votre palais aime l’acidité nette, celle-ci en est le manuel. »',
              '“Your palate loves crisp acidity, this one is its handbook.”',
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-encre/8 bg-papier px-3.5 py-2.5">
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-or-jour/60 motion-reduce:hidden" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-or-jour" />
        </span>
        <span className="text-[12.5px] text-encre-2">
          {t('Disponible près de vous · en tablette', 'Available near you · in stock')}
        </span>
      </div>
    </div>
  );
}

export default function SectionRayonMagasin() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <section id="rayon" className="mouvement-jour relative">
      <div className="mx-auto max-w-[1440px] px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-stretch gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          {/* L'ASSEMBLAGE, à GAUCHE, la cliente au téléphone dans le point de
              vente (arrière-plan), la carte Compagnon d'achat par-dessus.
              Absolu sur desktop : le récit (droite) dicte la hauteur. */}
          <FadeInOnScroll className="relative lg:order-1 lg:min-h-full" delay={0.08}>
            <div className="relative aspect-[10/9] lg:absolute lg:inset-0 lg:aspect-auto">
              <figure className="absolute left-0 top-0 w-full overflow-hidden rounded-[18px] shadow-[0_24px_60px_-30px_rgba(60,38,18,0.45)]">
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/photos/lifestyle/magasin-choix-telephone-800.avif 800w, /photos/lifestyle/magasin-choix-telephone-1400.avif 1400w"
                    sizes="(max-width: 1024px) 100vw, 44vw"
                  />
                  <source
                    type="image/webp"
                    srcSet="/photos/lifestyle/magasin-choix-telephone-800.webp 800w, /photos/lifestyle/magasin-choix-telephone-1400.webp 1400w"
                    sizes="(max-width: 1024px) 100vw, 44vw"
                  />
                  <img
                    src="/photos/lifestyle/magasin-choix-telephone.jpg"
                    alt={t(
                      'Dans un point de vente de vins, une cliente consulte les suggestions d’Octave sur son téléphone.',
                      'In a wine store, a customer checks Octave’s suggestions on her phone.',
                    )}
                    width={1200}
                    height={675}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full"
                  />
                </picture>
              </figure>
              {/* La preuve, par-dessus, ancrée bas-DROITE (jamais sur le
                  téléphone de la cliente, qui est le sujet), léger débord vers
                  la gouttière. */}
              <div className="absolute bottom-0 right-[-3%] w-[64%] sm:w-[52%] lg:right-[-4%] lg:w-[40%]">
                <CartePreuve />
              </div>
            </div>
          </FadeInOnScroll>

          {/* Le récit, à DROITE */}
          <div className="lg:order-2">
            <FadeInOnScroll>
              <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
                {t('Mouvement · En magasin', 'Movement · In the store')}
              </p>
              <h2
                className="mt-4 font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(30px, 4.4vw, 54px)' }}
              >
                {t('Des centaines de bouteilles.', 'Hundreds of bottles.')}
                <br />
                <span className="text-bordeaux-jour">
                  {t('Une qui vous ressemble.', 'One that’s truly you.')}
                </span>
              </h2>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.1}>
              <p className="mt-6 max-w-[52ch] text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]">
                {t(
                  'Dans un point de vente pris en charge, montrez une bouteille à Octave, ou demandez-lui par où commencer. Il connaît votre palais, les disponibilités près de vous, et votre budget.',
                  'In a supported store, show Octave a bottle, or ask him where to start. He knows your palate, what’s available near you, and your budget.',
                )}
              </p>
              <p className="mt-4 max-w-[44ch] font-[family-name:var(--font-display)] text-[19px] italic text-encre md:text-[21px]">
                {t(
                  'Et il sait dire non : si une bouteille n’est pas pour vous, il le dit.',
                  'And he knows how to say no: if a bottle isn’t for you, he says so.',
                )}
              </p>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a
                  href={buildSignupUrl('rayon', { lang: locale })}
                  onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'rayon' })}
                >
                  <Button variant="primary" size="md">
                    {t('Rencontrer Octave', 'Meet Octave')}
                  </Button>
                </a>
                {/* La sortie vers la page Fonction (née le 2026-08-14) : le
                    mouvement séduit, la page approfondit. */}
                <LocaleLink
                  href="/choisir-un-vin"
                  className="inline-flex items-center gap-1.5 text-[14.5px] font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
                >
                  {t('Approfondir le choix d’un vin', 'Explore choosing a wine')}
                  <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
                </LocaleLink>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
