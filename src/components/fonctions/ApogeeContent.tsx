'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import FilAriane from '@/components/ui/FilAriane';
import LocaleLink from '@/components/ui/LocaleLink';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import Button from '@/components/ui/Button';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { TRIAL_SHORT } from '@/lib/trial';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { ArrowRight } from 'lucide-react';

/**
 * /apogee — « Vous l'avez gardée dix ans. Vous l'avez ouverte un an trop
 * tard. » (conception validée avec ajustements, Eric 2026-08-14). Dernier
 * pilier hérité refondu ; URLs et slugs INCHANGÉS (/apogee ↔
 * /en/drinking-window), donc aucune redirection et aucune autorité perdue.
 *
 * ── L'EXCEPTION VISUELLE, VALIDÉE ───────────────────────────────────────
 * Seule page Fonction qui S'OUVRE dans la nuit, et le seul mouvement du site
 * qui va de la nuit vers le jour : regret (S1) → compréhension (S2) →
 * maîtrise (S3) → sérénité (S4, transition) → plein jour (S5). Les autres
 * pages font l'inverse. Le sujet le justifie : le temps, la cave, le regret.
 *
 * ── VÉRITÉ PRODUIT, VÉRIFIÉE AU CODE DE L'APPLICATION (2026-08-14) ──────
 * Eric a demandé de contrôler la promesse « il vous prévient UNE SEULE
 * FOIS » avant de l'écrire. Lecture de cellier-vin :
 *   · `lib/notifications/detect.ts` — la déduplication porte sur le triplet
 *     (user, bouteille, type de règle) sur une fenêtre de 60 jours
 *     (DEDUPE_WINDOW_DAYS), et TROIS types peuvent concerner la même
 *     bouteille au fil de sa vie (approaching_peak, at_peak,
 *     window_closing). « Une seule fois » serait donc FAUX.
 *   · Ce qui est vrai, et qui est ce que la page dit : le push est une
 *     SYNTHÈSE par utilisateur, « jamais un par bouteille » (detect.ts), et
 *     `lib/notifications/comm-budget.ts` impose AU PLUS une communication
 *     relationnelle par fenêtre glissante de 7 jours.
 * D'où la formulation de repli d'Eric, retenue telle quelle en S4 : « sans
 * transformer votre cave en source de notifications ». Aucune promesse
 * comportementale non garantie.
 *
 * ── Protection du produit (règle corrigée) ──────────────────────────────
 * PREUVE PRODUIT = OUI : deux captures STATIQUES réelles en S3 et une
 * bouteille détourée en S4. DOCUMENTATION DU WORKFLOW = NON : aucune
 * séquence, aucune navigation, aucune mécanique expliquée. La courbe du
 * temps est une animation CONCEPTUELLE (un tracé qui monte et redescend),
 * elle ne rejoue aucun parcours.
 *
 * Garde-fou éditorial conservé mot pour mot : « Un repère, jamais une
 * certitude : une bouteille reste vivante. »
 *
 * Photos APO-01 (S1, le regret) et APO-02 (S4, la veille sereine) : exclusives,
 * fournies par Eric le 2026-08-14 et converties par le pipeline habituel
 * (AVIF q55 + WebP q76 en 800/1400, JPEG q80 progressif en repli). Leurs deux
 * températures de lumière opposées PORTENT l'arc de la page.
 */

/** Les trois moments, en langage humain — jamais un pourcentage. */
const ETATS: { fr: string; en: string; position: number }[] = [
  { fr: 'Trop jeune', en: 'Too young', position: 14 },
  { fr: 'À son sommet', en: 'At its peak', position: 50 },
  { fr: 'À boire sans tarder', en: 'Drink without delay', position: 86 },
];

/** La courbe du temps : elle monte, s'ouvre, redescend. Purement graphique. */
const COURBE = 'M0,86 C110,84 180,70 250,42 C310,18 350,12 420,12 C490,12 540,26 600,52 C650,74 690,84 720,88';

export default function ApogeeContent() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const reduced = useReducedMotion();

  // Fail-visible : le serveur rend l'état FINAL ; l'animation ne s'arme
  // qu'une fois montée côté client.
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);
  const anime = monte && !reduced;

  return (
    <main>
      {/* ══ S1 · LE REGRET — nuit d'emblée ══════════════════════════════ */}
      <section
        className="relative overflow-hidden text-foreground"
        style={{ background: '#150f0c', paddingTop: 'var(--nav-h)' }}
      >
        <div className="mx-auto max-w-[1440px] px-6 pb-12 pt-8 lg:px-8 lg:pb-16 lg:pt-10">
          <FilAriane
            ton="nuit"
            elements={[
              { label: t('Accueil', 'Home'), href: '/' },
              { label: t('Fonctions', 'Features'), href: '/fonctions' },
              { label: t('L’apogée', 'The drinking window') },
            ]}
          />
          {/* Composition maîtrisée : texte ET photo, jamais de surimpression
              (Eric, 2026-08-14 : l'émotion vient de la scène). Mobile : le
              texte d'abord, la photo ensuite. */}
          <div className="mt-9 grid items-center gap-10 lg:grid-cols-[0.52fr_0.48fr] lg:gap-14">
            <div>
              <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or">
                {t('Le bon moment', 'The right moment')}
              </p>
              <h1
                className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(32px, 4.8vw, 58px)' }}
              >
                {t('Vous l’avez gardée dix ans.', 'You kept it ten years.')}
                <br />
                <span className="text-or">
                  {t('Vous l’avez ouverte un an trop tard.', 'You opened it a year too late.')}
                </span>
              </h1>
              <p className="mt-5 max-w-[46ch] text-[16.5px] leading-relaxed text-muted-foreground md:text-[17.5px]">
                {t(
                  'Ça n’arrive qu’une fois. Mais on s’en souvient longtemps.',
                  'It only happens once. But you remember it for a long time.',
                )}
              </p>
            </div>
            {/* APO-01 (photo d'Eric, 2026-08-14) : le verre encore à moitié
                plein sur la table desservie, la bouteille déjà ouverte
                derrière, une seule source chaude. Le regret, sans pathos. */}
            <FadeInOnScroll delay={0.1}>
              <figure className="overflow-hidden rounded-[18px] border border-or/15 shadow-[0_34px_80px_-30px_rgba(0,0,0,0.9)]">
                <picture>
                  <source type="image/avif" srcSet="/photos/lifestyle/apogee-regret-800.avif 800w, /photos/lifestyle/apogee-regret-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 46vw" />
                  <source type="image/webp" srcSet="/photos/lifestyle/apogee-regret-800.webp 800w, /photos/lifestyle/apogee-regret-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 46vw" />
                  <img
                    src="/photos/lifestyle/apogee-regret.jpg"
                    alt={t(
                      'Une table desservie en fin de soirée : un verre de vin rouge encore à moitié plein, la bouteille ouverte derrière, à la lueur d’une bougie.',
                      'A cleared table at the end of the evening: a glass of red wine still half full, the opened bottle behind it, in candlelight.',
                    )}
                    width={1536}
                    height={1024}
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

      {/* ══ S2 · CE QUE LE TEMPS FAIT — nuit ════════════════════════════ */}
      <section id="le-temps" className="relative overflow-hidden text-foreground" style={{ background: '#150f0c' }}>
        <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-[720px] text-center">
            <FadeInOnScroll>
              <h2
                className="font-[family-name:var(--font-display)] font-medium leading-[1.12] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(28px, 4.2vw, 48px)' }}
              >
                {t('Un vin ne s’éteint pas d’un coup. ', 'A wine doesn’t switch off. ')}
                <span className="text-or">
                  {t('Il monte, il s’ouvre, il redescend.', 'It rises, it opens, it fades.')}
                </span>
              </h2>
            </FadeInOnScroll>
          </div>

          {/* LA COURBE DU TEMPS — animation conceptuelle : un tracé qui monte
              et redescend, avec la fenêtre qui s'éclaire. Aucun workflow,
              aucune navigation, aucun champ. Coupée sous reduced-motion ;
              avant montage, l'état FINAL est rendu. */}
          <div className="relative mx-auto mt-12 max-w-[760px]">
            <svg viewBox="0 0 720 100" preserveAspectRatio="none" aria-hidden className="block h-[120px] w-full sm:h-[140px]">
              {/* La fenêtre de dégustation, la zone qui compte. Bords FONDUS :
                  un rectangle net se lisait comme un artefact d'interface. */}
              <defs>
                <linearGradient id="fenetre-apogee" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="var(--color-or)" stopOpacity="0" />
                  <stop offset="45%" stopColor="var(--color-or)" stopOpacity="0.1" />
                  <stop offset="55%" stopColor="var(--color-or)" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="var(--color-or)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect x="215" y="0" width="320" height="100" fill="url(#fenetre-apogee)" />
              {anime ? (
                <motion.path
                  d={COURBE}
                  fill="none"
                  stroke="var(--color-or)"
                  strokeWidth="1.4"
                  opacity="0.75"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: '0px 0px -18% 0px' }}
                  transition={{ duration: 2, ease: [0.32, 0.72, 0.16, 1] }}
                />
              ) : (
                <path
                  d={COURBE}
                  fill="none"
                  stroke="var(--color-or)"
                  strokeWidth="1.4"
                  opacity="0.75"
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {ETATS.map((e, i) => (
                <FadeInOnScroll key={e.fr} delay={0.2 + i * 0.12}>
                  <p
                    className={`text-center font-[family-name:var(--font-display)] text-[15px] italic leading-snug sm:text-[17px] ${
                      i === 1 ? 'text-or' : 'text-muted-foreground'
                    }`}
                  >
                    {t(e.fr, e.en)}
                  </p>
                </FadeInOnScroll>
              ))}
            </div>
          </div>

          {/* LE GARDE-FOU PRODUIT, mot pour mot. */}
          <FadeInOnScroll delay={0.2}>
            <p className="mx-auto mt-11 max-w-[44ch] text-center font-[family-name:var(--font-display)] text-[18px] italic leading-snug text-foreground md:text-[20px]">
              {t(
                'Un repère, jamais une certitude : une bouteille reste vivante.',
                'A guide, never a guarantee: a bottle stays alive.',
              )}
            </p>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ══ S3 · LA PREUVE — nuit, cœur produit ═════════════════════════ */}
      <section id="preuve" className="relative overflow-hidden text-foreground" style={{ background: '#150f0c' }}>
        <div className="mx-auto max-w-[1440px] px-6 pb-14 lg:px-8 lg:pb-16">
          <div className="mx-auto max-w-[760px] text-center">
            <FadeInOnScroll>
              <h2
                className="font-[family-name:var(--font-display)] font-medium leading-[1.12] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(26px, 3.8vw, 44px)' }}
              >
                {t('Chaque bouteille vous dit ', 'Every bottle tells you ')}
                <span className="text-or">{t('où elle en est.', 'where it stands.')}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">
                {t(
                  'Le verdict en clair, la fenêtre en années, sur toute votre cave. Pas un pourcentage à interpréter.',
                  'The verdict in plain words, the window in years, across your whole cellar. Not a percentage to interpret.',
                )}
              </p>
            </FadeInOnScroll>
          </div>

          {/* DEUX preuves STATIQUES réelles, côte à côte — jamais une
              séquence. À gauche l'apogée dans la cave (recadrage DÉDIÉ aux
              cartouches et à leurs bornes, distinct de l'usage de la même
              capture sur /choisir-un-vin) ; à droite une fiche de vin réelle. */}
          <div className="mx-auto mt-10 grid max-w-[900px] items-start gap-8 sm:grid-cols-2 lg:gap-12">
            <FadeInOnScroll>
              <figure>
                <div className="overflow-hidden rounded-[16px] border border-or/20 shadow-[0_34px_80px_-30px_rgba(0,0,0,0.9)]">
                  <picture>
                    <source type="image/avif" srcSet="/screenshots/07-apogee-cave.avif" />
                    <source type="image/webp" srcSet="/screenshots/07-apogee-cave.webp" />
                    <img
                      src="/screenshots/07-apogee-cave.png"
                      alt={t(
                        'Écran réel : deux bouteilles de la cave, chacune avec sa mention d’apogée et ses années de fenêtre.',
                        'Real screen: two bottles from the cellar, each with its peak marker and window years.',
                      )}
                      width={585}
                      height={762}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full"
                    />
                  </picture>
                </div>
                <figcaption className="mt-3 text-center text-[13px] leading-snug text-foreground-faint">
                  {t(
                    'L’apogée, bouteille par bouteille, dans votre cave.',
                    'The window, bottle by bottle, in your cellar.',
                  )}
                </figcaption>
              </figure>
            </FadeInOnScroll>
            <FadeInOnScroll delay={0.12}>
              <figure>
                <div className="mx-auto w-[min(230px,78%)] overflow-hidden rounded-[18px] border border-or/20 shadow-[0_34px_80px_-30px_rgba(0,0,0,0.9)]">
                  <picture>
                    <source type="image/avif" srcSet="/screenshots/01-fiche-vin.avif" />
                    <source type="image/webp" srcSet="/screenshots/01-fiche-vin.webp" />
                    <img
                      src="/screenshots/01-fiche-vin.png"
                      alt={t(
                        'Fiche réelle d’un Brunello di Montalcino 2010 dans l’application iQWine.',
                        'Real wine sheet for a 2010 Brunello di Montalcino in the iQWine app.',
                      )}
                      width={640}
                      height={1380}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full"
                    />
                  </picture>
                </div>
                <figcaption className="mt-3 text-center text-[13px] leading-snug text-foreground-faint">
                  {t(
                    'Et derrière chacune, une bouteille que vous possédez vraiment.',
                    'And behind each one, a bottle you actually own.',
                  )}
                </figcaption>
              </figure>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ══ S4 · IL VOUS PRÉVIENT — la remontée vers le jour ════════════ */}
      <section
        id="veille"
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #150f0c 0%, #2a1d13 8%, var(--color-papier-2) 34%, var(--color-papier) 100%)',
        }}
      >
        <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-[1040px] items-center gap-10 lg:grid-cols-[0.54fr_0.46fr] lg:gap-14">
            <div>
              <FadeInOnScroll>
                <h2
                  className="font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em] text-encre"
                  style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}
                >
                  {t('Vous n’avez plus à y penser. ', 'You no longer have to think about it. ')}
                  <span className="text-bordeaux-jour">{t('Lui, si.', 'He does.')}</span>
                </h2>
                {/* Formulation de repli d'Eric, retenue APRÈS vérification au
                    code : la garantie « une seule fois » n'existe pas (dédupe
                    60 jours × 3 types d'évènement), mais la synthèse par
                    utilisateur et le budget de communication, eux, existent. */}
                <p className="mt-4 max-w-[50ch] text-[16px] leading-relaxed text-encre-2 md:text-[17px]">
                  {t(
                    'Quand une grande bouteille approche de sa limite, il vous le dit au bon moment, sans transformer votre cave en source de notifications.',
                    'When a great bottle nears its limit, he tells you at the right moment, without turning your cellar into a source of notifications.',
                  )}
                </p>
              </FadeInOnScroll>
              <FadeInOnScroll delay={0.12}>
                {/* La carte de résultat, dessinée dans la matière du site,
                    avec une VRAIE bouteille du dépôt (Pio Cesare, déjà
                    l'héroïne de l'apogée sur l'accueil : casting cohérent). */}
                <figure className="mt-7 max-w-[430px] rounded-[16px] border border-or-jour/30 bg-[#fdfaf3] p-5 shadow-[0_24px_60px_-32px_rgba(36,27,20,0.35)]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-encre-3">
                      <OctaveAnneau size={15} className="text-or-jour" />
                      Octave
                    </span>
                    <span className="rounded-full bg-or-jour/12 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.16em] text-or-jour">
                      {t('À son sommet', 'At its peak')}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element -- bouteille détourée du dépôt, WebP léger */}
                    <img
                      src="/photos/wines/pio-cesare.webp"
                      alt=""
                      width={1000}
                      height={1500}
                      loading="lazy"
                      decoding="async"
                      className="h-[104px] w-auto drop-shadow-[0_10px_18px_rgba(60,38,18,0.28)] sm:h-[112px]"
                      draggable={false}
                    />
                    <div className="min-w-0">
                      <p className="font-[family-name:var(--font-display)] text-[19px] font-semibold leading-tight text-encre sm:text-[20px]">
                        Barolo <span className="text-or-jour">2016</span>
                      </p>
                      <p className="mt-0.5 text-[13px] text-encre-2">Pio Cesare · Piémont</p>
                      <p className="mt-2.5 text-[13.5px] leading-snug text-encre-2">
                        {t(
                          'À boire d’ici 2027. C’est maintenant qu’elle est au mieux.',
                          'Drink by 2027. Now is when it’s at its best.',
                        )}
                      </p>
                    </div>
                  </div>
                </figure>
              </FadeInOnScroll>
            </div>
            {/* APO-02 (photo d'Eric, 2026-08-14) : la main qui sort la
                bouteille de sa case, geste sûr, lumière plus claire qu'en S1.
                C'est la photo qui accompagne la remontée vers l'ivoire. */}
            <FadeInOnScroll delay={0.1}>
              <figure className="mx-auto w-full max-w-[400px] overflow-hidden rounded-[18px] shadow-[0_30px_70px_-32px_rgba(60,38,18,0.5)]">
                <picture>
                  <source type="image/avif" srcSet="/photos/lifestyle/apogee-veille-800.avif 800w, /photos/lifestyle/apogee-veille-1400.avif 1400w" sizes="(max-width: 1024px) 100vw, 400px" />
                  <source type="image/webp" srcSet="/photos/lifestyle/apogee-veille-800.webp 800w, /photos/lifestyle/apogee-veille-1400.webp 1400w" sizes="(max-width: 1024px) 100vw, 400px" />
                  <img
                    src="/photos/lifestyle/apogee-veille.jpg"
                    alt={t(
                      'Une main sort une bouteille de sa case dans une cave en bois, d’un geste calme et sûr.',
                      'A hand draws a bottle from its slot in a wooden cellar rack, with a calm, certain gesture.',
                    )}
                    width={1122}
                    height={1402}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full"
                  />
                </picture>
              </figure>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ══ S5 · LA RÉSOLUTION — plein jour ═════════════════════════════ */}
      <section className="mouvement-jour relative">
        <div className="mx-auto max-w-[1440px] px-6 pb-14 text-center lg:px-8 lg:pb-16">
          <FadeInOnScroll>
            <p
              className="mx-auto max-w-[34ch] text-balance font-[family-name:var(--font-display)] font-medium italic leading-[1.2] text-encre"
              style={{ fontSize: 'clamp(26px, 3.8vw, 42px)' }}
            >
              {t('Une grande bouteille n’attend pas.', 'A great bottle doesn’t wait.')}
              <br />
              <span className="text-bordeaux-jour">
                {t('Désormais, vous saurez quand l’ouvrir.', 'Now you’ll know when to open it.')}
              </span>
            </p>
            <div className="mt-7">
              <a
                href={buildSignupUrl('apogee', { lang: locale })}
                onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'apogee' })}
              >
                <Button variant="primary" size="lg">{t('Rencontrer Octave', 'Meet Octave')}</Button>
              </a>
              <p className="mt-4 text-[13px] tracking-wide text-encre-3">
                {t(`Essai gratuit, ${TRIAL_SHORT.fr} · Sans carte`, `Free trial, ${TRIAL_SHORT.en} · No card required`)}
              </p>
            </div>
            <div className="mx-auto mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[14px]">
              <LocaleLink
                href="/cellier-intelligent"
                className="inline-flex items-center gap-1.5 font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
              >
                {t('Votre cave, sue par cœur', 'Your cellar, known by heart')}
                <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </LocaleLink>
              <LocaleLink
                href="/choisir-un-vin"
                className="inline-flex items-center gap-1.5 font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
              >
                {t('Choisir un vin', 'Choosing a wine')}
                <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </LocaleLink>
              <LocaleLink
                href="/accord-mets-vins"
                className="inline-flex items-center gap-1.5 font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
              >
                {t('Les accords mets-vins', 'Wine pairing')}
                <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </LocaleLink>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </main>
  );
}
