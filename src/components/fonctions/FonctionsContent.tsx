'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import FilAriane from '@/components/ui/FilAriane';
import LigneAccord from '@/components/ui/LigneAccord';
import LocaleLink from '@/components/ui/LocaleLink';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import Button from '@/components/ui/Button';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { TRIAL_SHORT } from '@/lib/trial';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { ArrowRight } from 'lucide-react';

// Le film de marque, asset conservé, à sa place légitime sur le hub.
const SectionFilm = dynamic(() => import('@/components/sections/SectionFilm'));

/**
 * LE HUB /fonctions, « Une journée avec Octave » (validé Eric, 2026-08-13).
 *
 * PAS une seconde homepage : compréhension + orientation + preuve +
 * distribution. Cinq MOMENTS humains, chacun ouvre sur SA question, et le
 * fil invisible : Octave garde la mémoire du même palais à travers tous.
 * Jamais « le bon vin » : le bon vin POUR VOUS.
 *
 * Liens d'approfondissement : activés page par page à mesure qu'elles
 * naissent (ordre L), aujourd'hui seule /apogee existe ; les entrées du menu
 * Fonctions atterrissent sur les moments (#magasin, #restaurant, #repas,
 * #cellier) en attendant leurs pages. Aucun « bientôt » nulle part.
 */

type Moment = {
  id: string;
  lieu: { fr: string; en: string };
  question: { fr: string; en: string };
  ligne: { fr: string; en: string };
  photo?: { src: string; alt: { fr: string; en: string }; position?: string };
  nuit?: boolean;
  lien?: { href: string; label: { fr: string; en: string } };
};

const MOMENTS: Moment[] = [
  {
    id: 'magasin',
    lieu: { fr: 'En magasin', en: 'In the store' },
    question: { fr: 'Quelle bouteille choisir ?', en: 'Which bottle should I pick?' },
    ligne: {
      fr: 'Devant des centaines d’étiquettes, Octave met en évidence celles qui correspondent à votre palais, et à votre budget.',
      en: 'In front of hundreds of labels, Octave highlights the ones that match your palate, and your budget.',
    },
    photo: {
      src: 'hub-comparaison',
      alt: {
        fr: 'Deux bouteilles comparées à deux mains devant le rayon d’un point de vente de vins.',
        en: 'Two bottles weighed in two hands in front of a wine store shelf.',
      },
      position: '50% 45%',
    },
    lien: { href: '/choisir-un-vin', label: { fr: 'Approfondir le choix d’un vin', en: 'Explore choosing a wine' } },
  },
  {
    id: 'restaurant',
    lieu: { fr: 'Au restaurant', en: 'At the restaurant' },
    question: { fr: 'Qu’est-ce que je prends sur cette carte ?', en: 'What do I order from this list?' },
    ligne: {
      fr: 'Photographiez la carte : Octave la lit, et deux ou trois vins ressortent, avec le pourquoi, en une phrase.',
      en: 'Photograph the list: Octave reads it, and two or three wines stand out, with the why, in one sentence.',
    },
    photo: {
      src: 'hub-carte-remise',
      alt: {
        fr: 'La carte des vins, remise au convive dans un restaurant le soir.',
        en: 'The wine list, handed to a guest in a restaurant at night.',
      },
      position: '50% 45%',
    },
    lien: { href: '/carte-des-vins', label: { fr: 'Approfondir la carte des vins', en: 'Explore the wine list' } },
  },
  {
    id: 'repas',
    lieu: { fr: 'À table', en: 'At the table' },
    question: { fr: 'Quel vin avec ce repas ?', en: 'Which wine with this meal?' },
    ligne: {
      fr: 'Photographiez le plat : Octave comprend ce que vous allez manger et choisit, dans votre cave d’abord, à la case près.',
      en: 'Photograph the dish: Octave understands what you’re about to eat and chooses, from your cellar first, down to the slot.',
    },
    photo: {
      src: 'hub-table-verre-vide',
      alt: {
        fr: 'La table du souper, le service en cours, et un verre à vin encore vide.',
        en: 'The dinner table being served, with a wine glass still empty.',
      },
      // Le verre VIDE au centre du recadrage : c'est lui, l'histoire.
      position: '47% 62%',
    },
    lien: { href: '/accord-mets-vins', label: { fr: 'Approfondir les accords', en: 'Explore pairing' } },
  },
  {
    id: 'cellier',
    lieu: { fr: 'À la cave', en: 'In the cellar' },
    question: { fr: 'Qu’est-ce que j’ai dans ma cave ?', en: 'What do I have in my cellar?' },
    ligne: {
      fr: 'Chaque bouteille entre en un geste, photo, code-barres, reçu, puis votre cave se souvient de tout : emplacement, valeur, histoire.',
      en: 'Every bottle gets in with one gesture, photo, barcode, receipt, then your cellar remembers everything: location, value, history.',
    },
    nuit: true,
    lien: { href: '/cellier-intelligent', label: { fr: 'Approfondir le cellier', en: 'Explore the cellar' } },
  },
  {
    id: 'apogee',
    lieu: { fr: 'Le bon moment', en: 'The right moment' },
    question: { fr: 'Qu’est-ce que je devrais ouvrir maintenant ?', en: 'What should I open right now?' },
    ligne: {
      fr: 'Chaque millésime a sa fenêtre, calculée jusqu’au format. Octave vous aide à ne pas la manquer, sans jamais harceler.',
      en: 'Every vintage has its window, computed down to the format. Octave helps you not to miss it, without ever nagging.',
    },
    nuit: true,
    lien: { href: '/apogee', label: { fr: 'Approfondir l’apogée', en: 'Explore the peak window' } },
  },
];

/**
 * LA CONVERGENCE (micro-passe hub, Eric 2026-08-13) : cinq traces, une par
 * moment de la journée, qui cherchent puis convergent en une seule ligne,
 * résolue à l'horizontale sous l'anneau d'Octave. Plusieurs situations,
 * plusieurs questions, un seul palais appris, une seule mémoire. Même
 * grammaire que la ligne d'accord, aucun diagramme. Fail-visible : état
 * final statique avant montage et sous prefers-reduced-motion.
 */
const TRACES_CONVERGENCE = [
  'M0,10 C90,10 150,16 230,34 C310,52 360,58 430,60',
  'M0,35 C90,35 160,40 240,48 C320,56 370,59 430,60',
  'M0,60 C120,60 260,60 430,60',
  'M0,85 C90,85 160,80 240,72 C320,64 370,61 430,60',
  'M0,110 C90,110 150,104 230,86 C310,68 360,62 430,60',
];

function ConvergenceMemoire() {
  const reduced = useReducedMotion();
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);
  const anime = monte && !reduced;

  return (
    <div className="relative mx-auto mb-7 w-[min(560px,92%)]" aria-hidden>
      <svg viewBox="0 0 720 120" className="block h-[92px] w-full" preserveAspectRatio="none">
        {TRACES_CONVERGENCE.map((d, i) =>
          anime ? (
            <motion.path
              key={d}
              d={d}
              fill="none"
              stroke="var(--color-or-jour)"
              strokeWidth="1"
              opacity="0.4"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '0px 0px -14% 0px' }}
              transition={{ delay: 0.12 * i, duration: 1.3, ease: [0.32, 0.72, 0.16, 1] }}
            />
          ) : (
            <path key={d} d={d} fill="none" stroke="var(--color-or-jour)" strokeWidth="1" opacity="0.4" vectorEffect="non-scaling-stroke" />
          ),
        )}
        {/* La ligne résolue, après la convergence */}
        {anime ? (
          <motion.path
            d="M430,60 L720,60"
            fill="none"
            stroke="var(--color-or-jour)"
            strokeWidth="1.2"
            opacity="0.65"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '0px 0px -14% 0px' }}
            transition={{ delay: 1.45, duration: 0.9, ease: [0.32, 0.72, 0.16, 1] }}
          />
        ) : (
          <path d="M430,60 L720,60" fill="none" stroke="var(--color-or-jour)" strokeWidth="1.2" opacity="0.65" vectorEffect="non-scaling-stroke" />
        )}
      </svg>
      {/* L'anneau, posé au point de convergence */}
      <motion.span
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${(430 / 720) * 100}%` }}
        {...(anime
          ? {
              initial: { opacity: 0, scale: 0.85 },
              whileInView: { opacity: 1, scale: 1 },
              viewport: { once: true, margin: '0px 0px -14% 0px' },
              transition: { delay: 1.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            }
          : {})}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-papier shadow-[0_6px_20px_-6px_rgba(60,38,18,0.35)]">
          <OctaveAnneau size={22} className="text-or-jour" />
        </span>
      </motion.span>
    </div>
  );
}

function VignettePhoto({ moment, t }: { moment: Moment; t: (fr: string, en: string) => string }) {
  if (!moment.photo) return null;
  const base = `/photos/lifestyle/${moment.photo.src}`;
  return (
    <figure className="h-[190px] w-full overflow-hidden rounded-[16px] shadow-[0_26px_60px_-28px_rgba(60,38,18,0.5)] sm:h-[224px]">
      <picture>
        <source type="image/avif" srcSet={`${base}-800.avif 800w, ${base}-1400.avif 1400w`} sizes="(max-width: 1024px) 100vw, 38vw" />
        <source type="image/webp" srcSet={`${base}-800.webp 800w, ${base}-1400.webp 1400w`} sizes="(max-width: 1024px) 100vw, 38vw" />
        <img
          src={`${base}.jpg`}
          alt={t(moment.photo.alt.fr, moment.photo.alt.en)}
          width={1200}
          height={800}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition: moment.photo.position }}
        />
      </picture>
    </figure>
  );
}

export default function FonctionsContent() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const jours = MOMENTS.filter((m) => !m.nuit);
  const nuits = MOMENTS.filter((m) => m.nuit);

  return (
    <main>
      {/* ── Ouverture (jour) ────────────────────────────────────────────── */}
      <section className="mouvement-jour relative" style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="mx-auto max-w-[1440px] px-6 pb-4 pt-8 lg:px-8 lg:pt-10">
          <FilAriane elements={[{ label: t('Accueil', 'Home'), href: '/' }, { label: t('Fonctions', 'Features') }]} />
          <div className="mt-9 max-w-[1160px]">
            <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
              {t('Une journée avec Octave', 'A day with Octave')}
            </p>
            {/* Le titre prend la LARGEUR (Eric, 2026-08-14) : le retour à la
                ligne forcé le tassait sur un tiers de la page et laissait un
                grand vide à sa droite, alors que rien ne vient l'occuper. */}
            <h1
              className="mt-3 text-balance font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
              style={{ fontSize: 'clamp(34px, 4.6vw, 60px)' }}
            >
              {t('Un sommelier qui n’a qu’un seul client : ', 'A sommelier with only one client: ')}
              <span className="text-bordeaux-jour">{t('vous.', 'you.')}</span>
            </h1>
            <p className="mt-5 max-w-[58ch] text-[16.5px] leading-relaxed text-encre-2 md:text-[18px]">
              {t(
                'Au magasin, au restaurant, devant votre assiette ou votre cave, Octave vous aide à faire le bon choix, selon vos goûts.',
                'In the store, at the restaurant, in front of your plate or your cellar, Octave helps you make the right choice, for your taste.',
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── Les moments de jour ─────────────────────────────────────────── */}
      <section className="mouvement-jour relative">
        <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-[1060px]">
            {jours.map((m, i) => (
              <FadeInOnScroll key={m.id} delay={0.05 * i}>
                <article
                  id={m.id}
                  className="grid scroll-mt-[140px] items-center gap-6 border-t border-encre/10 py-7 lg:grid-cols-[0.48fr_0.52fr] lg:gap-12"
                >
                  <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                    <VignettePhoto moment={m} t={t} />
                  </div>
                  <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-encre-3">
                      {t(m.lieu.fr, m.lieu.en)}
                    </p>
                    <h2 className="mt-2 font-[family-name:var(--font-display)] text-[26px] font-medium italic leading-snug text-encre sm:text-[32px]">
                      {t('« ', '“')}
                      {t(m.question.fr, m.question.en)}
                      {t(' »', '”')}
                    </h2>
                    <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-encre-2 md:text-[16px]">
                      {t(m.ligne.fr, m.ligne.en)}
                    </p>
                    {m.lien && (
                      <LocaleLink
                        href={m.lien.href}
                        className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
                      >
                        {t(m.lien.label.fr, m.lien.label.en)}
                        <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
                      </LocaleLink>
                    )}
                  </div>
                </article>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── La nuit de la cave (cellier + apogée) ───────────────────────── */}
      <section
        className="relative overflow-hidden text-foreground"
        style={{ background: 'linear-gradient(180deg, #1c130d 0%, #150f0c 60%)' }}
      >
        <div className="relative mx-auto w-[min(480px,72%)] pt-2">
          <LigneAccord variante="inflexion" ton="nuit" />
        </div>
        <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-[1060px]">
            {nuits.map((m) => (
              <FadeInOnScroll key={m.id}>
                <article
                  id={m.id}
                  className="grid scroll-mt-[140px] items-center gap-6 border-t border-white/10 py-7 first:border-t-0 lg:grid-cols-[0.48fr_0.52fr] lg:gap-12"
                >
                  <div>
                    {m.id === 'cellier' ? (
                      /* La preuve : le cellier visuel réel, posé dans la nuit. */
                      <figure className="overflow-hidden rounded-[14px] border border-or/20 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]">
                        <picture>
                          <source type="image/avif" srcSet="/screenshots/08-cellier-desktop-1487.avif 1487w" sizes="(max-width: 1024px) 100vw, 30vw" />
                          <source type="image/webp" srcSet="/screenshots/08-cellier-desktop-1487.webp 1487w" sizes="(max-width: 1024px) 100vw, 30vw" />
                          <img
                            src="/screenshots/08-cellier-desktop.png"
                            alt={t('Le cellier visuel d’iQWine, sections, rangées et cases.', 'iQWine’s visual cellar, sections, rows and slots.')}
                            width={1487}
                            height={758}
                            loading="lazy"
                            decoding="async"
                            className="h-auto w-full"
                          />
                        </picture>
                      </figure>
                    ) : (
                      /* L'apogée : le Brunello à moitié tiré de sa case (photo
                         d'Eric, exclusive au hub) + la courbe du temps en
                         SUPERPOSITION web, jamais incrustée dans la photo. */
                      <figure className="relative h-[190px] overflow-hidden rounded-[16px] border border-or/15 sm:h-[224px]">
                        <picture>
                          <source type="image/avif" srcSet="/photos/lifestyle/hub-brunello-cave-800.avif 800w, /photos/lifestyle/hub-brunello-cave-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 30vw" />
                          <source type="image/webp" srcSet="/photos/lifestyle/hub-brunello-cave-800.webp 800w, /photos/lifestyle/hub-brunello-cave-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 30vw" />
                          <img
                            src="/photos/lifestyle/hub-brunello-cave.jpg"
                            alt={t(
                              'Une bouteille de Brunello di Montalcino à moitié tirée de sa case, dans une cave.',
                              'A bottle of Brunello di Montalcino half-pulled from its slot in a cellar.',
                            )}
                            width={1200}
                            height={800}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                            style={{ objectPosition: '50% 45%' }}
                          />
                        </picture>
                        <div
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-[46px]"
                          style={{ background: 'linear-gradient(180deg, transparent, rgba(16, 11, 8, 0.75))' }}
                        />
                        <svg viewBox="0 0 300 40" aria-hidden className="absolute bottom-1.5 left-[10%] h-[36px] w-[80%]">
                          <path d="M0,36 C70,34 110,26 150,16 C185,8 215,6 250,7 C270,8 285,12 300,16" fill="none" stroke="var(--color-or)" strokeWidth="1" opacity="0.7" vectorEffect="non-scaling-stroke" />
                          <circle cx="250" cy="7" r="3" fill="var(--color-or)" />
                        </svg>
                      </figure>
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground-faint">
                      {t(m.lieu.fr, m.lieu.en)}
                    </p>
                    <h2 className="mt-2 font-[family-name:var(--font-display)] text-[26px] font-medium italic leading-snug text-foreground sm:text-[32px]">
                      {t('« ', '“')}
                      {t(m.question.fr, m.question.en)}
                      {t(' »', '”')}
                    </h2>
                    <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground md:text-[15.5px]">
                      {t(m.ligne.fr, m.ligne.en)}
                    </p>
                    {m.lien && (
                      <LocaleLink
                        href={m.lien.href}
                        className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-or transition-colors hover:text-or-soft"
                      >
                        {t(m.lien.label.fr, m.lien.label.en)}
                        <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
                      </LocaleLink>
                    )}
                  </div>
                </article>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Le fil : la mémoire (jour) ──────────────────────────────────── */}
      <section className="mouvement-jour relative">
        <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-8 lg:py-16">
          <FadeInOnScroll>
            <div className="mx-auto max-w-[720px] text-center">
              <ConvergenceMemoire />
              <h2
                className="mt-4 font-[family-name:var(--font-display)] font-medium leading-[1.14] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(26px, 3.6vw, 42px)' }}
              >
                {t('Cinq questions différentes.', 'Five different questions.')}
                <br />
                <span className="text-bordeaux-jour">{t('Une seule mémoire : la vôtre.', 'One memory: yours.')}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-[54ch] text-[15.5px] leading-relaxed text-encre-2">
                {t(
                  'D’un moment à l’autre, Octave retrouve le même palais, le vôtre. C’est ce qui transforme cinq fonctions en un seul sommelier.',
                  'From one moment to the next, Octave finds the same palate, yours. That’s what turns five features into one sommelier.',
                )}
              </p>
              <LocaleLink
                href="/sommelier-ia"
                className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-medium text-bordeaux-jour underline decoration-bordeaux-jour/40 underline-offset-4 transition-colors hover:decoration-bordeaux-jour"
              >
                {t('Comment Octave apprend', 'How Octave learns')}
                <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
              </LocaleLink>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ── Le film (nuit, asset conservé) ─────────────────────────────── */}
      <SectionFilm />

      {/* ── CTA calme (jour) ────────────────────────────────────────────── */}
      <section className="mouvement-jour relative">
        <div className="mx-auto max-w-[1440px] px-6 py-14 text-center lg:px-8 lg:py-16">
          <FadeInOnScroll>
            <p
              className="mx-auto max-w-[30ch] font-[family-name:var(--font-display)] font-medium italic leading-[1.2] text-encre"
              style={{ fontSize: 'clamp(24px, 3.4vw, 38px)' }}
            >
              {t('La prochaine bouteille se choisit à deux.', 'The next bottle is a choice for two.')}
            </p>
            <div className="mt-7">
              <a
                href={buildSignupUrl('fonctions', { lang: locale })}
                onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'fonctions' })}
              >
                <Button variant="primary" size="lg">{t('Rencontrer Octave', 'Meet Octave')}</Button>
              </a>
              <p className="mt-4 text-[13px] tracking-wide text-encre-3">
                {t(`Essai gratuit, ${TRIAL_SHORT.fr} · Sans carte`, `Free trial, ${TRIAL_SHORT.en} · No card required`)}
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </main>
  );
}
