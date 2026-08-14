'use client';

import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import LigneAccord from '@/components/ui/LigneAccord';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import { useLocale } from '@/lib/i18n';

/**
 * MOUVEMENT 4, « AU RESTAURANT », la PREMIÈRE NUIT. Version compacte
 * (retours d'Eric, 2026-08-13) :
 *
 * 1. ~1 écran : la longueur de la carte est RACONTÉE (« … et 74 autres »),
 *    jamais matérialisée par du scroll. Six lignes suffisent, deux émergent,
 *    les autres s'estompent : Octave transforme la complexité en simplicité.
 * 2. L'émotion du dîner : une bande d'ambiance photographique en fond (le bar,
 *    les lampes, le soir, extraite de la photo du restaurant SANS le couple,
 *    déjà vu au mouvement 2) + la lueur de bougie sur la table.
 * 3. La résolution arrive vite : la voix d'Octave et la chute vivent À CÔTÉ de
 *    la carte, pas dessous.
 *
 * Vérité produit : photographier une carte des vins → lecture + mise en
 * évidence = capacité réelle. Vins réels du dépôt. Aucun score inventé.
 */

const CARTE: { region: string; nom: string; prix: string; palais?: boolean }[] = [
  { region: 'Champagne', nom: 'Cuis 1er Cru · Pierre Gimonnet', prix: '96' },
  { region: 'Bourgogne', nom: 'Chablis · William Fèvre', prix: '78', palais: true },
  { region: 'Loire', nom: 'Muscadet · La Ragotière', prix: '44' },
  { region: 'Alsace', nom: 'Riesling · Trimbach', prix: '58' },
  { region: 'Vallée du Rhône', nom: 'Côtes-du-Rhône · E. Guigal', prix: '52', palais: true },
  { region: 'Piémont', nom: 'Barolo · Pio Cesare', prix: '120' },
];

export default function SectionRestaurant() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <section
      id="restaurant"
      className="relative overflow-hidden text-foreground"
      style={{
        background: 'linear-gradient(180deg, #1c130d 0%, #150f0c 60%)',
      }}
    >
      {/* L'ambiance du dîner, le bar et les lampes du soir, fondus dans la
          nuit. La scène humaine sans re-montrer le couple du mouvement 2. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[52%]">
        <picture>
          <source type="image/avif" srcSet="/photos/lifestyle/restaurant-ambiance-1400.avif" />
          <source type="image/webp" srcSet="/photos/lifestyle/restaurant-ambiance-1400.webp" />
          
          <img
            src="/photos/lifestyle/restaurant-ambiance.jpg"
            alt=""
            width={1200}
            height={281}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover opacity-[0.34]"
            style={{
              objectPosition: '50% 40%',
              maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9), transparent 92%)',
              WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9), transparent 92%)',
            }}
            draggable={false}
          />
        </picture>
        {/* Lueur de bougie sur la table */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(46% 60% at 50% 100%, rgba(217, 182, 103, 0.10), transparent 70%)',
          }}
        />
      </div>

      {/* La ligne d'accord passe en NUIT. */}
      <div className="relative mx-auto w-[min(480px,72%)] pt-2">
        <LigneAccord variante="inflexion" ton="nuit" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 py-12 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[680px] text-center">
          <FadeInOnScroll>
            <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or">
              {t('Mouvement · Au restaurant', 'Movement · At the restaurant')}
            </p>
            <h2
              className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(30px, 4.4vw, 52px)' }}
            >
              {t('Votre sommelier est déjà à table.', 'Your sommelier is already at the table.')}
            </h2>
          </FadeInOnScroll>
        </div>

        <div className="mx-auto mt-9 grid max-w-[1060px] items-center gap-9 lg:grid-cols-[0.94fr_1.06fr] lg:gap-14">
          {/* La carte, six lignes, deux qui émergent, et la longueur RACONTÉE. */}
          <FadeInOnScroll>
            <div className="rotate-[-0.6deg] rounded-[14px] bg-[#f4ecdb] px-5 py-6 text-encre shadow-[0_50px_120px_-40px_rgba(0,0,0,0.85)] sm:px-7">
              <p className="text-center font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase tracking-[0.34em] text-encre-2">
                {t('Les vins', 'Wine list')}
              </p>
              <div className="mx-auto mt-2 h-px w-14 bg-encre/20" />
              <ul className="mt-4 space-y-0.5">
                {CARTE.map((v) => (
                  <li
                    key={v.nom}
                    className={`flex items-baseline gap-2.5 rounded-md px-2.5 py-1.5 ${
                      v.palais ? 'bg-or-jour/10' : 'opacity-[0.48]'
                    }`}
                    style={v.palais ? { boxShadow: 'inset 2px 0 0 var(--color-or-deep)' } : undefined}
                  >
                    <span className="min-w-0">
                      <span className="block text-[9.5px] font-medium uppercase tracking-[0.18em] text-encre-3">
                        {v.region}
                      </span>
                      <span className="block truncate font-[family-name:var(--font-display)] text-[16px] font-medium leading-snug sm:text-[17px]">
                        {v.nom}
                      </span>
                    </span>
                    <span className="mx-1 hidden flex-1 border-b border-dotted border-encre/25 sm:block" />
                    <span className="tabular shrink-0 text-[13px] text-encre-2">{v.prix}&nbsp;$</span>
                    {v.palais && (
                      <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-or-jour/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-or-jour sm:inline-flex">
                        <OctaveAnneau size={10} className="text-or-jour" />
                        {t('Pour vous', 'For you')}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-3 px-2.5 font-[family-name:var(--font-display)] text-[15px] italic text-encre-3">
                {t('… et 74 autres.', '… and 74 more.')}
              </p>
            </div>
          </FadeInOnScroll>

          {/* La résolution, tout de suite, à côté. */}
          <div>
            <FadeInOnScroll delay={0.1}>
              <p className="max-w-[46ch] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">
                {t(
                  'La carte arrive, longue, parfois dans une autre langue. Photographiez-la : Octave la lit, et deux ou trois vins ressortent. Pour votre palais, pas pour la moyenne.',
                  'The list arrives, long, sometimes in another language. Photograph it: Octave reads it, and two or three wines stand out. For your palate, not for the average.',
                )}
              </p>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.18}>
              <figure className="mt-6 rounded-[16px] border border-or/25 bg-[#241a12]/95 px-5 py-4 shadow-[0_34px_80px_-24px_rgba(0,0,0,0.85)]">
                <blockquote className="font-[family-name:var(--font-display)] text-[17px] italic leading-snug text-foreground sm:text-[18px]">
                  {t(
                    '« Le Chablis de William Fèvre, la minéralité que votre palais réclame avec les huîtres. »',
                    '“The William Fèvre Chablis, the minerality your palate craves with oysters.”',
                  )}
                </blockquote>
                <figcaption className="mt-2.5 inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.22em] text-or">
                  <OctaveAnneau size={14} className="text-or" />
                  Octave
                </figcaption>
              </figure>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.24}>
              <p className="mt-7 max-w-[34ch] font-[family-name:var(--font-display)] text-[20px] italic leading-snug text-foreground-dim sm:text-[22px]">
                {t(
                  'Vous n’avez plus besoin de comprendre la carte. Octave la comprend pour vous.',
                  'You no longer need to understand the list. Octave understands it for you.',
                )}
              </p>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
