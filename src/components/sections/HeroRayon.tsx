'use client';

import Button from '@/components/ui/Button';
import LigneAccord from '@/components/ui/LigneAccord';
import BadgesPlateformes from '@/components/ui/BadgesPlateformes';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl, APP_STORE_URL, CTA_VERS_STORE } from '@/lib/constants';
import { TRIAL_SHORT } from '@/lib/trial';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * HERO « LE RAYON », Mouvement 1 de la refonte v3 « À l'unisson »
 * (décision d'Eric, 2026-08-12 : Hero 1 validé).
 *
 * ── ZÉRO JavaScript requis (leçon du 2026-08-12) ─────────────────────────
 * Première version : texte animé en framer-motion (SSR à opacité 0, révélé à
 * l'hydratation). Via Tailscale, le JS ne s'est pas exécuté chez Eric → hero
 * SANS AUCUN TEXTE. Le premier écran du site n'a pas le droit de dépendre d'un
 * script : le texte est statique, et la « mise au point » de la bouteille
 * focale est une animation PUR CSS (`.mise-au-point`, cf. globals.css) qui
 * joue avec ou sans JS, et se coupe sous prefers-reduced-motion.
 *
 * ── La hiérarchie, voulue et non négociable ───────────────────────────────
 * 1. La formule (H1, immense, UNIQUEMENT ici, jamais répétée ailleurs) ;
 * 2. le descripteur (sous-titre sobre) ;
 * 3. la signature d'Octave (italique or, petite, en pied de hero).
 *
 * ── Le visuel ─────────────────────────────────────────────────────────────
 * La scène finale est la photographie RAYON-01 (brief F du concept). En
 * attendant la production, `SceneRayon` compose un rayon PROVISOIRE avec les
 * huit bouteilles détourées du dépôt, la photo remplacera la scène sans
 * toucher au layout (même conteneur, même overlay).
 *
 * ── CTA à bascule, et pourquoi elle reste au repos ────────────────────────
 * iOS 1.0 est publiée depuis le 2026-08-28, mais le CTA ne bascule PAS vers
 * « Télécharger iQWine » : le trafic est majoritairement sur ordinateur, où
 * l'App Store est un cul-de-sac, et Android n'est pas sortie. La bascule vit
 * dans `CTA_VERS_STORE` (constants.ts), documentée, prête à être activée d'un
 * booléen. La disponibilité mobile, elle, se dit sous le CTA : les badges.
 */

/** Rangées du rayon provisoire, ordres figés (stabilité SSR, zéro Math.random). */
const RANGEE_FOND = [
  'guigal', 'trimbach', 'masciarelli', 'gimonnet', 'pio-cesare', 'ragotiere', 'william-fevre', 'guigal', 'castello-ama',
];
const RANGEE_MILIEU = [
  'william-fevre', 'castello-ama', 'ragotiere', 'guigal', 'gimonnet', 'trimbach', 'pio-cesare', 'masciarelli',
];
const RANGEE_AVANT = ['pio-cesare', 'gimonnet', 'trimbach', 'castello-ama', 'masciarelli', 'ragotiere', 'guigal'];

/** Micro-variations par index (vie du rayon, déterministe). */
const DECALAGES = [0, 3, 1, 4, 0, 2, 5, 1, 3];

function Rangee({
  noms,
  hauteur,
  flou,
  opacite,
  focale,
}: {
  noms: string[];
  hauteur: number;
  flou: number;
  opacite: number;
  /** Index de la bouteille NETTE (mise au point CSS), absent = rangée entière floue. */
  focale?: number;
}) {
  return (
    <div className="flex items-end justify-center gap-[clamp(10px,1.4vw,22px)]">
      {noms.map((nom, i) => {
        const nette = focale === i;
        return (
          <div key={`${nom}-${i}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- décor provisoire, WebP léger, dimensions fixées par la hauteur */}
            <img
              src={`/photos/wines/${nom}.webp`}
              alt=""
              width={1000}
              height={1500}
              loading={nette ? 'eager' : 'lazy'}
              decoding="async"
              className={`w-auto select-none ${nette ? 'mise-au-point' : ''}`}
              style={{
                height: nette ? hauteur * 1.06 : hauteur,
                filter: nette ? undefined : `blur(${flou}px) saturate(0.92)`,
                opacity: nette ? undefined : opacite,
                transform: `translateY(${DECALAGES[i % DECALAGES.length]}px)`,
              }}
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Le rayon provisoire, étagères chaudes, profondeur de champ, une bouteille
 * nette. Sera remplacé par la photographie RAYON-01 (même conteneur).
 */
function SceneRayon() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Chaleur de boutique en fin de journée */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, #f6efe0 0%, #f1e4c9 38%, #e7d3ac 74%, #ddc397 100%)',
        }}
      />
      {/* Nappe de lumière chaude, en haut à droite */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 45% at 74% 12%, rgba(255, 244, 214, 0.85), transparent 70%)',
        }}
      />

      {/* Les trois étagères, décalées vers la droite, le texte vit à gauche.
          ── Ancrage VERTICALEMENT CENTRÉ (Eric, 2026-08-14) ────────────────
          Elles étaient posées à `top-[6%]`, donc collées en haut : leur
          hauteur est fixe (~564 px), si bien que sur un grand écran le bas du
          hero se vidait (377 px de blanc mesurés à 1200 px de haut). Centrées
          avec un léger biais vers le haut, elles suivent le texte et
          remplissent la composition, sans qu'aucune bouteille ne change. */}
      <div className="absolute right-[-6%] top-1/2 w-[78%] min-w-[680px] -translate-y-[54%] space-y-2 md:right-[-2%] md:w-[62%]">
        <Rangee noms={RANGEE_FOND} hauteur={128} flou={7} opacite={0.55} />
        <div className="h-[9px] rounded-sm bg-[rgba(90,58,30,0.20)] shadow-[0_5px_14px_rgba(60,38,18,0.18)]" />
        <Rangee noms={RANGEE_MILIEU} hauteur={158} flou={5} opacite={0.68} />
        <div className="h-[10px] rounded-sm bg-[rgba(90,58,30,0.24)] shadow-[0_6px_18px_rgba(60,38,18,0.22)]" />
        <Rangee noms={RANGEE_AVANT} hauteur={196} flou={3.5} opacite={0.8} focale={3} />
        <div className="h-[11px] rounded-sm bg-[rgba(90,58,30,0.26)] shadow-[0_8px_22px_rgba(60,38,18,0.24)]" />
      </div>

      {/* Vignette basse + voile ivoire vers la colonne de texte */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, var(--color-papier) 0%, rgba(247, 241, 230, 0.94) 30%, rgba(247, 241, 230, 0.55) 52%, rgba(247, 241, 230, 0.08) 78%, rgba(247, 241, 230, 0.02) 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[38%]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, var(--color-papier) 88%)',
        }}
      />
    </div>
  );
}

export default function HeroRayon() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const ctaLabel = CTA_VERS_STORE
    ? t('Télécharger iQWine', 'Download iQWine')
    : t('Rencontrer Octave', 'Meet Octave');
  const ctaHref = CTA_VERS_STORE ? APP_STORE_URL : buildSignupUrl('hero', { lang: locale });

  return (
    <section
      id="hero"
      className="mouvement-jour relative flex min-h-[100svh] flex-col"
      style={{ paddingTop: 'var(--nav-h)' }}
    >
      <SceneRayon />

      <div className="relative z-[1] mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 pb-16 pt-10 lg:px-8">
        {/* `my-auto` centre le bloc de texte dans l'espace qui reste AU-DESSUS
            de la signature. Le `justify-center` du parent ne pouvait rien : le
            `mt-auto` de la signature absorbait déjà tout l'espace libre, et le
            titre restait collé sous la barre quelle que soit la hauteur
            d'écran (168 px, mesuré à 800, 1000 et 1200 px de haut). */}
        <div className="my-auto max-w-[760px]">
          <h1
            className="font-[family-name:var(--font-display)] font-medium leading-[1.04] tracking-[-0.025em] text-encre"
            style={{ fontSize: 'clamp(40px, 6.2vw, 84px)' }}
          >
            {t('Vous ne cherchez plus un bon vin.', "You're no longer looking for a good wine.")}
            <br />
            <span className="text-bordeaux-jour">
              {t('Vous cherchez ', "You're looking for ")}
              <em>{t('le vôtre.', 'yours.')}</em>
            </span>
          </h1>

          <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-encre-2 md:text-[19px]">
            {t(
              'Votre sommelier IA qui apprend vos goûts.',
              'Your AI sommelier that learns your taste.',
            )}{' '}
            {t(
              'En magasin, au restaurant, devant votre cave.',
              'In the store, at the restaurant, in front of your cellar.',
            )}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <a
              href={ctaHref}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'hero' })}
            >
              <Button variant="primary" size="lg">{ctaLabel}</Button>
            </a>
            <a
              href="#question"
              className="text-[15px] font-medium text-encre-2 underline decoration-encre-3/50 underline-offset-4 transition-colors hover:text-bordeaux-jour"
            >
              {t('Voir comment ça marche', 'See how it works')}
            </a>
          </div>

          <p className="mt-5 text-[13px] tracking-wide text-encre-3">
            {t(
              `Essai gratuit, ${TRIAL_SHORT.fr} · Sans carte`,
              `Free trial, ${TRIAL_SHORT.en} · No card required`,
            )}
          </p>

          {/* La preuve mobile, après la promesse d'essai : on entre par le
              web, on repart avec l'app. */}
          <BadgesPlateformes ton="jour" source="hero" className="mt-6" />
        </div>

        {/* La signature, troisième niveau, en pied de hero, avec le premier
            fragment de la ligne d'accord. Discrète : on la remarque en partant. */}
        <div className="mt-auto pt-16">
          <LigneAccord variante="fragment" ton="jour" className="w-[200px]" />
          <p className="mt-2 font-[family-name:var(--font-display)] text-[17px] italic text-or-jour md:text-[18px]">
            {t('Octave. À l’unisson de vos goûts.', 'Octave. In tune with your taste.')}
          </p>
        </div>
      </div>
    </section>
  );
}
