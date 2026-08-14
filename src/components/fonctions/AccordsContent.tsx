'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import FilAriane from '@/components/ui/FilAriane';
import LigneAccord from '@/components/ui/LigneAccord';
import LocaleLink from '@/components/ui/LocaleLink';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import Button from '@/components/ui/Button';
import DemoControlPanel from '@/components/demo/DemoControlPanel';
import DemoPhone from '@/components/demo/DemoPhone';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { getDemoCards, type DemoMeal, type DemoSource } from '@/lib/demoData';
import { TRIAL_SHORT } from '@/lib/trial';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { ArrowRight, MapPin } from 'lucide-react';

/**
 * /accord-mets-vins — « Le plat est prêt. Maintenant, quelle bouteille ? »
 * (conception validée avec correction S1, photos d'Eric, 2026-08-13).
 *
 * S1 le MOMENT (jamais les règles) → S2 le geste (la chaîne exacte : repas →
 * photo → Octave comprend → croise le palais → cave d'abord → dit quoi
 * ouvrir → sait dire non) → S3 la preuve JOUABLE (la démo interactive,
 * climax produit, chrome jour + écrans d'app réels) → S4 recevoir (nuit
 * courte, l'ancien /recevoir absorbé) → S5 l'action (Rencontrer Octave).
 *
 * Vérité produit : photo du plat → accord réel · sources Cave / Près de
 * vous / Les deux réelles · « il sait dire non » réel · menu accordé
 * service par service réel · emplacement par case réel.
 */

export default function AccordsContent() {
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [meal, setMeal] = useState<DemoMeal>('lasagne');
  const [source, setSource] = useState<DemoSource>('both');
  const cards = getDemoCards(meal, source);

  // MOBILE (micro-passe responsive, Eric 2026-08-13) : quand « Les deux »
  // produit deux résultats, l'écran étroit n'en montre qu'UN à la fois,
  // choisi par une bascule discrète — la démo reste entièrement jouable,
  // jamais deux téléphones empilés. Desktop : inchangé, côte à côte.
  const [vueMobile, setVueMobile] = useState<'cave' | 'saq'>('cave');
  const carteMobile =
    cards.length > 1 ? cards.find((c) => c.source === vueMobile) ?? cards[0] : cards[0];

  return (
    <main>
      {/* ══ S1 · LE MOMENT (ivoire) ═════════════════════════════════════ */}
      <section className="mouvement-jour relative" style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-8 lg:px-8 lg:pb-14 lg:pt-10">
          <FilAriane
            elements={[
              { label: t('Accueil', 'Home'), href: '/' },
              { label: t('Fonctions', 'Features'), href: '/fonctions' },
              { label: t('Accords mets-vins', 'Wine pairing') },
            ]}
          />
          <div className="mt-9 grid items-center gap-10 lg:grid-cols-[0.54fr_0.46fr] lg:gap-14">
            <div>
              <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
                {t('Accords mets et vins', 'Wine pairing')}
              </p>
              <h1
                className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(34px, 5vw, 60px)' }}
              >
                {t('Le plat est prêt.', 'The meal is ready.')}
                <br />
                <span className="text-bordeaux-jour">{t('Maintenant, quelle bouteille ?', 'Now, which bottle?')}</span>
              </h1>
              <p className="mt-5 max-w-[54ch] text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]">
                {t(
                  'Ça sent bon, on passe à table, tout est prêt, sauf la décision du vin. Vous savez ce que vous allez manger ; reste à savoir ce que vous allez ouvrir. Et les règles d’accord qu’on ne retient jamais n’aident pas.',
                  'It smells wonderful, everyone’s sitting down, everything is ready, except the wine decision. You know what you’re about to eat; what you’ll open is another story. And the pairing rules nobody remembers don’t help.',
                )}
              </p>
            </div>
            <FadeInOnScroll delay={0.1}>
              <figure className="overflow-hidden rounded-[18px] shadow-[0_30px_70px_-32px_rgba(60,38,18,0.5)]">
                <picture>
                  <source type="image/avif" srcSet="/photos/lifestyle/accord-moment-800.avif 800w, /photos/lifestyle/accord-moment-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 44vw" />
                  <source type="image/webp" srcSet="/photos/lifestyle/accord-moment-800.webp 800w, /photos/lifestyle/accord-moment-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 44vw" />
                  <img
                    src="/photos/lifestyle/accord-moment.jpg"
                    alt={t('Un plat fumant porté vers la table dressée, où le vin manque encore.', 'A steaming dish carried to the set table, where the wine is still missing.')}
                    width={1200}
                    height={800}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="h-auto w-full"
                  />
                </picture>
              </figure>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ══ S2 · LE GESTE (ivoire) ══════════════════════════════════════ */}
      <section className="mouvement-jour relative">
        <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-[1060px]">
            <FadeInOnScroll>
              <h2
                className="max-w-[24ch] font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}
              >
                {t('Photographiez le plat. ', 'Photograph the dish. ')}
                <span className="text-bordeaux-jour">{t('Octave fait le reste.', 'Octave does the rest.')}</span>
              </h2>
              <p className="mt-4 max-w-[58ch] text-[15.5px] leading-relaxed text-encre-2">
                {t(
                  'Il comprend ce que vous allez manger, croise avec votre palais, regarde votre cave d’abord, et vous dit quoi ouvrir. Et si rien ne convient vraiment, il le dit.',
                  'He understands what you’re about to eat, weighs it against your palate, looks at your cellar first, and tells you what to open. And if nothing truly fits, he says so.',
                )}
              </p>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.1}>
              <div className="relative mt-8">
                <figure className="overflow-hidden rounded-[18px] shadow-[0_30px_70px_-32px_rgba(60,38,18,0.5)]">
                  <picture>
                    <source type="image/avif" srcSet="/photos/lifestyle/accord-geste-800.avif 800w, /photos/lifestyle/accord-geste-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 74vw" />
                    <source type="image/webp" srcSet="/photos/lifestyle/accord-geste-800.webp 800w, /photos/lifestyle/accord-geste-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 74vw" />
                    <img
                      src="/photos/lifestyle/accord-geste.jpg"
                      alt={t('Vue plongeante : une main photographie l’assiette dressée avec son téléphone.', 'Overhead view: a hand photographs the plated dish with a phone.')}
                      width={1200}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full"
                    />
                  </picture>
                </figure>
                {/* La carte d'accord : sur desktop, posée dans l'espace négatif
                    prévu par la photo ; sur mobile elle COULE sous l'image avec
                    un léger chevauchement — l'assiette et le geste restent
                    entièrement lisibles (micro-passe responsive). */}
                <FadeInOnScroll
                  delay={0.2}
                  className="relative z-[1] mx-4 -mt-12 sm:absolute sm:bottom-6 sm:right-6 sm:mx-0 sm:mt-0 sm:w-[min(340px,60%)]"
                >
                  <div className="rounded-[16px] border border-encre/10 bg-[#fdfaf3]/97 p-4 shadow-[0_30px_70px_-24px_rgba(36,27,20,0.6)] sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
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
                        src="/photos/wines/guigal.webp"
                        alt=""
                        width={1000}
                        height={1500}
                        loading="lazy"
                        decoding="async"
                        className="h-[84px] w-auto drop-shadow-[0_10px_18px_rgba(60,38,18,0.28)]"
                        draggable={false}
                      />
                      <div className="min-w-0">
                        <p className="font-[family-name:var(--font-display)] text-[17px] font-semibold leading-tight text-encre">
                          Côtes-du-Rhône <span className="text-or-jour">2021</span>
                        </p>
                        <p className="mt-0.5 text-[12.5px] text-encre-2">E. Guigal · Rhône</p>
                        <p className="mt-1.5 text-[12.5px] leading-snug text-encre-2">
                          {t('« Le jus de cuisson appelle sa syrah poivrée. »', '“The pan juices call for its peppery syrah.”')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-or-jour/30 bg-or-jour/[0.08] px-3.5 py-2.5">
                      <MapPin size={14} strokeWidth={1.8} className="shrink-0 text-or-jour" aria-hidden />
                      <span className="text-[12px] leading-snug text-encre">
                        <strong className="font-semibold">{t('Déjà chez vous', 'Already at home')}</strong>
                        {' · '}
                        {t('Cellier, rangée 2, case 5', 'Cellar, row 2, slot 5')}
                      </span>
                    </div>
                  </div>
                </FadeInOnScroll>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ══ S3 · LA PREUVE JOUABLE (ivoire, climax produit) ═════════════ */}
      <section id="demo" className="mouvement-jour relative scroll-mt-28">
        <div className="mx-auto w-full max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
          <FadeInOnScroll>
            <div className="mb-9 text-center">
              <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
                {t('Essayez, là, maintenant', 'Try it, right now')}
              </p>
              <h2
                className="mt-3 font-[family-name:var(--font-display)] font-medium italic leading-[1.1] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(30px, 4.4vw, 52px)' }}
              >
                {t('Que mangez-vous ce soir ?', 'What are you eating tonight?')}
              </h2>
              <p className="mx-auto mt-4 max-w-[56ch] text-[15.5px] leading-relaxed text-encre-2">
                {t(
                  'Choisissez un plat, puis la source. Octave répond comme un sommelier : votre cave, une bouteille disponible près de vous, ou les deux.',
                  'Pick a dish, then a source. Octave answers like a sommelier: your cellar, a bottle available near you, or both.',
                )}
              </p>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.1}>
            <DemoControlPanel
              ton="jour"
              meal={meal}
              source={source}
              onMeal={(m) => {
                setMeal(m);
                track(ANALYTICS_EVENTS.DEMO_MEAL_SELECT, { meal: m });
              }}
              onSource={(s) => {
                setSource(s);
                track(ANALYTICS_EVENTS.DEMO_SOURCE_TOGGLE, { source: s });
              }}
            />
          </FadeInOnScroll>

          {/* Les écrans d'app (thème sombre réel) posés sur l'ivoire : la
              preuve contraste, elle ne se fond pas dans le décor. */}
          {/* DESKTOP — inchangé : les résultats côte à côte. */}
          <div className="relative mt-10 hidden min-h-[600px] lg:block">
            <div className="flex flex-row items-start justify-center gap-16">
              <AnimatePresence mode="popLayout" initial={false}>
                {cards.map((card) => (
                  <motion.div
                    key={`${meal}-${card.source}`}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, y: 16, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.97 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: 'transform' }}
                    className="w-full max-w-[350px]"
                  >
                    <DemoPhone card={card} locale={locale} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* MOBILE — UN résultat à la fois, bascule discrète quand il y en a deux. */}
          <div className="relative mt-8 lg:hidden">
            {cards.length > 1 && (
              <div
                role="tablist"
                aria-label={t('Résultat affiché', 'Displayed result')}
                className="mx-auto mb-6 flex w-fit gap-1 rounded-full border border-encre/10 bg-papier-2 p-1"
              >
                {([
                  { id: 'cave' as const, fr: 'Votre cave', en: 'Your cellar' },
                  { id: 'saq' as const, fr: 'Près de vous', en: 'Near you' },
                ]).map((v) => {
                  const on = vueMobile === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setVueMobile(v.id)}
                      className={`relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-[140ms] ${
                        on ? 'text-on-gold' : 'text-encre-2'
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="accords-vue-mobile"
                          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                          className="absolute inset-0 rounded-full bg-or"
                          aria-hidden
                        />
                      )}
                      <span className="relative z-10">{t(v.fr, v.en)}</span>
                    </button>
                  );
                })}
              </div>
            )}
            <div className="flex justify-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={`${meal}-${carteMobile.source}-mobile`}
                  initial={reduced ? false : { opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: 'transform' }}
                  className="w-full max-w-[350px]"
                >
                  <DemoPhone card={carteMobile} locale={locale} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ══ S4 · RECEVOIR — la nuit, courte ═════════════════════════════ */}
      <section
        id="recevoir"
        data-nav-delai="90"
        className="relative overflow-hidden text-foreground"
        style={{
          background:
            'linear-gradient(180deg, var(--color-papier) 0%, #2a1d13 6%, #150f0c 16%, #150f0c 100%)',
        }}
      >
        <div className="relative mx-auto w-[min(480px,72%)] pt-10">
          <LigneAccord variante="inflexion" ton="nuit" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-6 py-10 lg:px-8 lg:py-14">
          <div className="mx-auto grid max-w-[1060px] items-center gap-10 lg:grid-cols-[0.46fr_0.54fr] lg:gap-14">
            <FadeInOnScroll>
              <figure className="overflow-hidden rounded-[18px] border border-or/15 shadow-[0_34px_80px_-30px_rgba(0,0,0,0.9)]">
                <picture>
                  <source type="image/avif" srcSet="/photos/lifestyle/accord-recevoir-800.avif 800w, /photos/lifestyle/accord-recevoir-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 40vw" />
                  <source type="image/webp" srcSet="/photos/lifestyle/accord-recevoir-800.webp 800w, /photos/lifestyle/accord-recevoir-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 40vw" />
                  <img
                    src="/photos/lifestyle/accord-recevoir.jpg"
                    alt={t('Une table de réception aux bougies, deux vins ouverts, les invités en arrière-plan.', 'A candlelit hosting table, two wines open, guests in the background.')}
                    width={1200}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full"
                  />
                </picture>
              </figure>
            </FadeInOnScroll>
            <div>
              <FadeInOnScroll>
                <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or">
                  {t('Recevoir', 'Hosting')}
                </p>
                <h2
                  className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.12] tracking-[-0.02em]"
                  style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}
                >
                  {t('Chaque repas, ', 'Every meal, ')}
                  <span className="text-or">{t('son fil de vins.', 'its thread of wines.')}</span>
                </h2>
                <p className="mt-4 max-w-[50ch] text-[15.5px] leading-relaxed text-muted-foreground">
                  {t(
                    'Des invités, un repas qui compte, plusieurs services : Octave compose la séquence de toute la soirée, l’entrée, le plat, le fromage, chaque vin au bon moment, comme un sommelier le ferait. Vous servez avec assurance.',
                    'Guests, a meal that matters, several courses: Octave composes the whole evening’s sequence, the starter, the main, the cheese, each wine at the right moment, the way a sommelier would. You pour with confidence.',
                  )}
                </p>
              </FadeInOnScroll>
              <FadeInOnScroll delay={0.12}>
                <figure className="mt-6 rounded-[16px] border border-or/25 bg-[#241a12]/95 px-5 py-4">
                  <blockquote className="font-[family-name:var(--font-display)] text-[16.5px] italic leading-snug text-foreground sm:text-[18px]">
                    {t(
                      '« Le Chablis ouvre, le Côtes-du-Rhône porte le plat, et gardez le Montepulciano pour le fromage. »',
                      '“The Chablis opens, the Côtes-du-Rhône carries the main, and keep the Montepulciano for the cheese.”',
                    )}
                  </blockquote>
                  <figcaption className="mt-2.5 inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.22em] text-or">
                    <OctaveAnneau size={14} className="text-or" />
                    Octave
                  </figcaption>
                </figure>
              </FadeInOnScroll>
              <FadeInOnScroll delay={0.18}>
                <LocaleLink
                  href="/cellier-intelligent"
                  className="mt-6 inline-flex items-center gap-2 text-[14.5px] font-medium text-or transition-colors hover:text-or-soft"
                >
                  {t('Et chaque bouteille sort de votre cave au bon moment', 'And every bottle leaves your cellar at the right moment')}
                  <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
                </LocaleLink>
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ══ S5 · L'ACTION — retour au jour ══════════════════════════════ */}
      <section className="mouvement-jour relative">
        <div className="mx-auto max-w-[1440px] px-6 py-14 text-center lg:px-8 lg:py-16">
          <FadeInOnScroll>
            <p
              className="mx-auto max-w-[26ch] font-[family-name:var(--font-display)] font-medium italic leading-[1.2] text-encre"
              style={{ fontSize: 'clamp(26px, 3.8vw, 42px)' }}
            >
              {t('Le prochain repas est déjà accordé.', 'Your next meal is already paired.')}
            </p>
            <div className="mt-7">
              <a
                href={buildSignupUrl('accords', { lang: locale })}
                onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'accords' })}
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
