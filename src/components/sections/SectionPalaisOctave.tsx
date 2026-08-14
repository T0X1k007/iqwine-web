'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import { useLocale } from '@/lib/i18n';

/**
 * SECTION 5, « IL APPREND QUI VOUS ÊTES », priorité visuelle de la phase de
 * finition (Eric, 2026-08-13). Headline verrouillée : option A.
 *
 * L'ACCORDAGE, émotionnel : les signaux sont des SOUVENIRS accumulés (une
 * bouteille aimée, une région, un accord réussi…) qui affleurent un à un ;
 * la ligne d'accord CHERCHE son chemin, irrégulière à gauche, elle s'apaise
 * à mesure que les souvenirs apparaissent, et se stabilise en entrant dans
 * le panneau. Le panneau est la CONSÉQUENCE, pas le héros : liste calme à
 * filets, plus de rangées encadrées façon interface.
 *
 * Animation : framer-motion, une seule séquence au scroll (tracé de la ligne
 * ~2,2 s + souvenirs en cascade + panneau en dernier). Coupée sous
 * prefers-reduced-motion ; AVANT montage JS, l'état FINAL complet est rendu
 * (fail-visible). Aucun cliché IA, aucune particule.
 *
 * Vérité produit : dégustations notées (→ « aimé »), accords mémorisés,
 * préférences dérivées cépages/régions/styles. Rien d'inventé.
 */

/** Les souvenirs, vocabulaire réel (dégustations, régions, styles, accords). */
const SOUVENIRS: { fr: string; en: string; x: string; y: string; r: number; o: number }[] = [
  { fr: 'Pinot noir', en: 'Pinot noir', x: '4%', y: '12%', r: -6, o: 0.85 },
  { fr: 'Un Chablis, aimé', en: 'A Chablis you loved', x: '36%', y: '3%', r: 4, o: 0.6 },
  { fr: 'Bourgogne', en: 'Burgundy', x: '15%', y: '42%', r: -3, o: 0.75 },
  { fr: 'Corps léger', en: 'Light-bodied', x: '52%', y: '32%', r: 7, o: 0.5 },
  { fr: 'Un accord réussi', en: 'A pairing that worked', x: '3%', y: '72%', r: 5, o: 0.55 },
  { fr: 'Tanins souples', en: 'Supple tannins', x: '35%', y: '63%', r: -5, o: 0.8 },
  { fr: 'Acidité vive', en: 'Bright acidity', x: '57%', y: '78%', r: 3, o: 0.45 },
];

const ACCORDES: { fr: string; en: string }[] = [
  { fr: 'Pinot noir', en: 'Pinot noir' },
  { fr: 'Bourgogne', en: 'Burgundy' },
  { fr: 'Acidité vive', en: 'Bright acidity' },
  { fr: 'Tanins souples', en: 'Supple tannins' },
];

/** La ligne qui cherche, amplitude décroissante, puis le calme. */
const TRACE_ACCORDAGE =
  'M0,30 C38,30 52,4 92,7 C132,10 148,56 194,52 C240,48 254,12 300,15 C346,18 360,45 410,42 C460,39 500,33.5 560,31.5 C700,29.8 850,30 1000,30';

export default function SectionPalaisOctave() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const reduced = useReducedMotion();

  // Fail-visible : le serveur rend l'état FINAL ; l'animation ne s'arme
  // qu'une fois montée côté client (même philosophie que FadeInOnScroll).
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);
  const anime = monte && !reduced;

  return (
    <section id="palais" className="mouvement-jour relative">
      <div className="mx-auto max-w-[1440px] px-6 py-14 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[760px] text-center">
          <FadeInOnScroll>
            <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
              {t('Votre palais', 'Your palate')}
            </p>
            <h2
              className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.14] tracking-[-0.02em] text-encre"
              style={{ fontSize: 'clamp(30px, 4.4vw, 54px)' }}
            >
              {t('Chaque bouteille lui apprend', 'Every bottle teaches him')}
              <br />
              <span className="text-bordeaux-jour">
                {t('un peu plus qui vous êtes.', 'a little more about who you are.')}
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-[56ch] text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]">
              {t(
                'Chaque dégustation notée, chaque choix, chaque retour affine son idée de votre palais. Pour passer de « est-ce un bon vin ? » à « est-ce un bon vin pour vous ? »',
                'Every rated tasting, every choice, every reaction sharpens his sense of your palate. To go from “is this a good wine?” to “is this a good wine for you?”',
              )}
            </p>
          </FadeInOnScroll>
        </div>

        {/* L'ACCORDAGE, les souvenirs affleurent, la ligne cherche, tout
            s'accorde. Une seule séquence, déclenchée à l'entrée au viewport. */}
        <div className="relative mx-auto mt-12 max-w-[1060px]">
          <svg
            viewBox="0 0 1000 60"
            preserveAspectRatio="none"
            aria-hidden
            className="absolute left-0 right-0 top-1/2 hidden h-[60px] -translate-y-1/2 lg:block"
          >
            {anime ? (
              <motion.path
                d={TRACE_ACCORDAGE}
                fill="none"
                stroke="var(--color-or-jour)"
                strokeWidth="1"
                opacity="0.5"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '0px 0px -18% 0px' }}
                transition={{ duration: 2.2, ease: [0.32, 0.72, 0.16, 1] }}
              />
            ) : (
              <path
                d={TRACE_ACCORDAGE}
                fill="none"
                stroke="var(--color-or-jour)"
                strokeWidth="1"
                opacity="0.5"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
            {/* Les souvenirs épars */}
            <div className="relative mx-auto h-[240px] w-full max-w-[520px] sm:h-[260px]">
              {SOUVENIRS.map((s) => {
                const contenu = (
                  <span className="rounded-full border border-encre/12 bg-papier-2 px-3.5 py-1.5 font-[family-name:var(--font-display)] text-[15px] italic text-encre-2 sm:text-[16px]">
                    {t(s.fr, s.en)}
                  </span>
                );
                if (!anime) {
                  return (
                    <span
                      key={s.fr}
                      className="absolute"
                      style={{ left: s.x, top: s.y, transform: `rotate(${s.r}deg)`, opacity: s.o }}
                    >
                      {contenu}
                    </span>
                  );
                }
                // Chaque souvenir affleure quand la ligne le traverse :
                // le délai suit sa position horizontale.
                const delai = 0.2 + (parseFloat(s.x) / 100) * 1.8;
                return (
                  <motion.span
                    key={s.fr}
                    className="absolute"
                    style={{ left: s.x, top: s.y, rotate: s.r }}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    whileInView={{ opacity: s.o, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '0px 0px -18% 0px' }}
                    transition={{ delay: delai, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {contenu}
                  </motion.span>
                );
              })}
            </div>

            {/* Le panneau, la CONSÉQUENCE : l'écran réel, en liste calme. */}
            <motion.div
              className="relative mx-auto w-full max-w-[330px] rounded-[18px] border border-encre/8 bg-[#fdfaf3]/95 p-6 shadow-[0_24px_60px_-32px_rgba(36,27,20,0.35)]"
              {...(anime
                ? {
                    initial: { opacity: 0, y: 14 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: '0px 0px -18% 0px' },
                    transition: { delay: 1.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                  }
                : {})}
            >
              <div className="flex items-center gap-2.5">
                <OctaveAnneau size={18} className="text-or-jour" />
                <p className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-encre-3">
                  {t('Ce qu’Octave a compris de vous', 'What Octave has understood about you')}
                </p>
              </div>
              <ul className="mt-3 divide-y divide-encre/8">
                {ACCORDES.map((mot) => (
                  <li key={mot.fr} className="flex items-center gap-3 py-2.5">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-or-jour" aria-hidden />
                    <span className="font-[family-name:var(--font-display)] text-[17px] font-medium text-encre">
                      {t(mot.fr, mot.en)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3.5 text-[12.5px] leading-snug text-encre-3">
                {t(
                  'Nourri par vos dégustations, jamais par une moyenne.',
                  'Fed by your tastings, never by an average.',
                )}
              </p>
            </motion.div>
          </div>
        </div>

        <FadeInOnScroll delay={0.1}>
          <p className="mx-auto mt-11 max-w-[52ch] text-center text-[14.5px] leading-relaxed text-encre-3">
            {t(
              // Correction produit (Eric, 2026-08-13) : la promesse est la
              // COHÉRENCE expliquée, jamais l'immuabilité — Octave peut changer
              // d'avis quand il apprend, pas au hasard.
              'Et parce que ses choix sont calculés, jamais improvisés, chaque conseil peut s’expliquer. Un sommelier ne change pas d’avis au hasard.',
              'And because his choices are computed, never improvised, every recommendation can be explained. A sommelier doesn’t change his mind at random.',
            )}
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
