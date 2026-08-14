'use client';

import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import LigneAccord from '@/components/ui/LigneAccord';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import LocaleLink from '@/components/ui/LocaleLink';
import { useLocale } from '@/lib/i18n';
import { MapPin } from 'lucide-react';

/**
 * SECTION 4, « OÙ QUE LE CHOIX ARRIVE » (architecture 6 sections, Eric
 * 2026-08-13). FUSION des anciens mouvements Restaurant + Plat en UN diptyque
 * nocturne compact : la même intelligence qui aide devant deux cents
 * bouteilles (section 3) accompagne quand la carte arrive (4A) et quand le
 * repas est prêt (4B). Aucun des deux volets n'est un chapitre, ce sont deux
 * moments d'une même idée.
 *
 * Vérité produit (vérifiée) : scan de carte des vins = réel ; photo du plat →
 * accord = réel ; choix de source Cave/Magasin/Les deux = réel
 * (SourceChooserSheet) ; emplacement par case = réel. Vins réels du dépôt.
 *
 * Photo du volet Repas : PROVISOIRE (assiette Unsplash), remplacée par la
 * scène générée d'Eric (« tout est prêt, il ne manque que le vin »), même
 * conteneur. La fin de section tend la main à la section 5 : « Et à chaque
 * choix, Octave apprend. »
 */

const CARTE: { region: string; nom: string; prix: string; palais?: boolean }[] = [
  { region: 'Champagne', nom: 'Cuis 1er Cru · Gimonnet', prix: '96' },
  { region: 'Bourgogne', nom: 'Chablis · William Fèvre', prix: '78', palais: true },
  { region: 'Vallée du Rhône', nom: 'Côtes-du-Rhône · Guigal', prix: '52', palais: true },
  { region: 'Piémont', nom: 'Barolo · Pio Cesare', prix: '120' },
];

export default function SectionChoixPartout() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <section
      id="restaurant"
      className="relative overflow-hidden text-foreground"
      style={{ background: 'linear-gradient(180deg, #1c130d 0%, #150f0c 55%)' }}
    >
      <div className="relative mx-auto w-[min(480px,72%)] pt-2">
        <LigneAccord variante="inflexion" ton="nuit" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 py-12 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[760px] text-center">
          <FadeInOnScroll>
            <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or">
              {t('Au restaurant · Devant le repas', 'At the restaurant · At the table')}
            </p>
            <h2
              className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(30px, 4.4vw, 52px)' }}
            >
              {t('Où que le choix arrive, ', 'Wherever the choice arrives, ')}
              <span className="text-or">{t('Octave est là.', 'Octave is there.')}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[56ch] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">
              {t(
                'La même intelligence qui vous guide devant deux cents bouteilles vous suit à table, et jusqu’à votre cuisine.',
                'The same intelligence that guides you through two hundred bottles follows you to the table, and into your kitchen.',
              )}
            </p>
          </FadeInOnScroll>
        </div>

        <div className="mx-auto mt-10 grid max-w-[1160px] items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {/* ── 4A, AU RESTAURANT ─────────────────────────────────────── */}
          <FadeInOnScroll>
            <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-or/15 bg-[#1d140e]">
              {/* L'ambiance du soir, le bar, les lampes (sans le couple). */}
              <div className="relative h-[130px] shrink-0">
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
                    className="h-full w-full object-cover opacity-[0.5]"
                    style={{ objectPosition: '50% 42%' }}
                    draggable={false}
                  />
                </picture>
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, transparent 30%, #1d140e 100%)' }}
                />
                <p className="absolute bottom-3 left-6 font-[family-name:var(--font-display)] text-[21px] italic text-foreground sm:text-[23px]">
                  {t('Votre sommelier est déjà à table.', 'Your sommelier is already at the table.')}
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                  {t(
                    'La carte arrive, longue, parfois dans une autre langue. Photographiez-la : deux ou trois vins ressortent. Pour votre palais, pas pour la moyenne.',
                    'The list arrives, long, sometimes in another language. Photograph it: two or three wines stand out. For your palate, not for the average.',
                  )}
                </p>

                {/* La carte, en artefact compact, la longueur est racontée. */}
                <div className="rounded-[12px] bg-[#f4ecdb] px-4 py-4 text-encre">
                  <ul className="space-y-0.5">
                    {CARTE.map((v) => (
                      <li
                        key={v.nom}
                        className={`flex items-baseline gap-2.5 rounded-md px-2 py-1 ${
                          v.palais ? 'bg-or-jour/10' : 'opacity-[0.45]'
                        }`}
                        style={v.palais ? { boxShadow: 'inset 2px 0 0 var(--color-or-deep)' } : undefined}
                      >
                        <span className="min-w-0">
                          <span className="block text-[9px] font-medium uppercase tracking-[0.18em] text-encre-3">
                            {v.region}
                          </span>
                          <span className="block truncate font-[family-name:var(--font-display)] text-[15.5px] font-medium leading-snug">
                            {v.nom}
                          </span>
                        </span>
                        <span className="mx-1 hidden flex-1 border-b border-dotted border-encre/25 sm:block" />
                        <span className="tabular shrink-0 text-[12.5px] text-encre-2">{v.prix}&nbsp;$</span>
                        {v.palais && (
                          <span className="hidden shrink-0 items-center gap-1 rounded-full bg-or-jour/15 px-2 py-0.5 text-[8.5px] font-medium uppercase tracking-[0.14em] text-or-jour sm:inline-flex">
                            <OctaveAnneau size={9} className="text-or-jour" />
                            {t('Pour vous', 'For you')}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 px-2 font-[family-name:var(--font-display)] text-[13.5px] italic text-encre-3">
                    {t('… et 74 autres.', '… and 74 more.')}
                  </p>
                </div>

                <p className="mt-auto font-[family-name:var(--font-display)] text-[15.5px] italic leading-snug text-foreground-dim">
                  {t(
                    '« Le Chablis, la minéralité que votre palais réclame avec les huîtres. »',
                    '“The Chablis, the minerality your palate craves with oysters.”',
                  )}{' '}
                  <span className="inline-flex translate-y-[2px] items-center gap-1.5 whitespace-nowrap text-[10.5px] not-italic uppercase tracking-[0.2em] text-or">
                    <OctaveAnneau size={12} className="text-or" /> Octave
                  </span>
                </p>
              </div>
            </article>
          </FadeInOnScroll>

          {/* ── 4B, DEVANT LE REPAS ───────────────────────────────────── */}
          <FadeInOnScroll delay={0.1}>
            <article id="plat" className="flex h-full flex-col overflow-hidden rounded-[20px] border border-or/15 bg-[#1d140e]">
              {/* REPAS-01 (photo d'Eric, 2026-08-14) : le plat posé sur une table
                  de MAISON, verres encore vides, aucune bouteille dans le cadre
                  (c'est la question que la section pose). Remplace une image de
                  banque qui portait la marque visible d'un restaurant tiers et
                  dont la scène doublonnait avec le volet restaurant. */}
              <div className="relative h-[130px] shrink-0">
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/photos/lifestyle/repas-maison-800.avif 800w, /photos/lifestyle/repas-maison-1400.avif 1400w"
                    sizes="(max-width: 1024px) 100vw, 46vw"
                  />
                  <source
                    type="image/webp"
                    srcSet="/photos/lifestyle/repas-maison-800.webp 800w, /photos/lifestyle/repas-maison-1400.webp 1400w"
                    sizes="(max-width: 1024px) 100vw, 46vw"
                  />
                  <img
                    src="/photos/lifestyle/repas-maison.jpg"
                    alt={t(
                      'Un plat fumant posé à deux mains sur une table de maison dressée, les verres à vin encore vides.',
                      'A steaming dish set down with both hands on a laid home table, the wine glasses still empty.',
                    )}
                    // Dimensions RÉELLES du fichier (1024 × 1536) : déclarer
                    // l'ancien 1200 × 1800 aurait faussé le ratio réservé et
                    // rouvert le CLS que tout le pipeline cherche à éviter.
                    width={1024}
                    height={1536}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: '50% 50%' }}
                  />
                </picture>
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, transparent 30%, #1d140e 100%)' }}
                />
                <p className="absolute bottom-3 left-6 font-[family-name:var(--font-display)] text-[21px] italic text-foreground sm:text-[23px]">
                  {t('Le repas est prêt. La bonne bouteille aussi.', 'The meal is ready. So is the right bottle.')}
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                  {t(
                    'Photographiez votre plat : Octave regarde ce que vous allez manger, et choisit parmi vos bouteilles, ou près de vous.',
                    'Photograph your dish: Octave looks at what you’re about to eat, and chooses from your bottles, or near you.',
                  )}
                </p>

                {/* La preuve : l'accord, et la bouteille qui EXISTE chez vous. */}
                <div className="rounded-[12px] border border-encre/10 bg-[#fdfaf3] p-4 text-encre">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.2em] text-encre-3">
                      <OctaveAnneau size={14} className="text-or-jour" />
                      {t('Accord trouvé', 'Pairing found')}
                    </span>
                    <span className="rounded-full bg-or-jour/12 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-or-jour">
                      {t('Dans votre cave', 'From your cellar')}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element -- bouteille détourée du dépôt */}
                    <img
                      src="/photos/wines/masciarelli.webp"
                      alt=""
                      width={1000}
                      height={1500}
                      loading="lazy"
                      decoding="async"
                      className="h-[84px] w-auto drop-shadow-[0_10px_18px_rgba(60,38,18,0.28)]"
                      draggable={false}
                    />
                    <div className="min-w-0">
                      <p className="font-[family-name:var(--font-display)] text-[17.5px] font-semibold leading-tight">
                        Montepulciano <span className="text-or-jour">d’Abruzzo</span>
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-encre-2">Masciarelli · Abruzzes</p>
                      <p className="mt-1.5 text-[12.5px] leading-snug text-encre-2">
                        {t(
                          '« La tomate confite appelle son fruit noir. »',
                          '“Slow-cooked tomato calls for its dark fruit.”',
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-or-jour/30 bg-or-jour/[0.08] px-3.5 py-2.5">
                    <MapPin size={15} strokeWidth={1.8} className="shrink-0 text-or-jour" aria-hidden />
                    <span className="text-[12.5px] leading-snug">
                      <strong className="font-semibold">{t('Déjà chez vous', 'Already at home')}</strong>
                      {' · '}
                      {t('Cellier, rangée 2, case 5', 'Cellar, row 2, slot 5')}
                    </span>
                  </div>
                </div>

                <p className="mt-auto flex flex-wrap items-baseline gap-x-4 gap-y-1 font-[family-name:var(--font-display)] text-[15.5px] italic text-foreground-dim">
                  {t('Vous montrez. Octave comprend.', 'You show. Octave understands.')}
                  {/* Maillage narratif (activé à la naissance de la page). */}
                  <LocaleLink
                    href="/accord-mets-vins"
                    className="not-italic font-body text-[13px] font-medium text-or transition-colors hover:text-or-soft"
                  >
                    {t('Découvrir les accords →', 'Explore pairing →')}
                  </LocaleLink>
                </p>
              </div>
            </article>
          </FadeInOnScroll>
        </div>

        {/* Le pont vers la section 5, l'apprentissage. */}
        <FadeInOnScroll delay={0.1}>
          <p className="mx-auto mt-10 max-w-[40ch] text-center font-[family-name:var(--font-display)] text-[20px] italic leading-snug text-foreground-dim sm:text-[22px]">
            {t('Et à chaque choix, Octave vous apprend un peu mieux.', 'And with every choice, Octave learns you a little better.')}
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
