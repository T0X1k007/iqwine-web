'use client';

import { useLocale } from '@/lib/i18n';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * BADGES DE PLATEFORMES, « et c'est déjà sur votre téléphone »
 * (décision d'Eric, 2026-08-28, iOS 1.0 publiée).
 *
 * ── Ce que ces badges NE sont pas ─────────────────────────────────────────
 * Ils ne remplacent pas le CTA. Le bouton principal du hero et de la
 * résolution continue de mener à l'essai, pour tout le monde : la majorité du
 * trafic est sur ordinateur, et Android n'est pas publiée. Les badges DISENT
 * la disponibilité mobile, ils ne détournent pas l'entonnoir (cf. la bascule
 * `CTA_VERS_STORE`, documentée dans `constants.ts`).
 *
 * ── Pourquoi Apple a son badge officiel et Android non ────────────────────
 * Apple : l'artwork officiel, servi depuis `public/badges/`, en QUATRE
 * déclinaisons — deux langues × deux tons. Apple impose le badge noir sur
 * fond clair et le badge blanc sur fond sombre ; c'est exactement la raison
 * d'être de la prop `ton` (le hero est ivoire, la résolution est nuit).
 *
 * Android : PAS le badge Google Play. Ses conditions d'usage le réservent aux
 * applications effectivement présentes sur le Play Store, et son artwork dit
 * littéralement « Disponible sur » — ce serait faux aujourd'hui. On dessine
 * donc son JUMEAU : même hauteur, même rayon de coin, même partition
 * typographique (une ligne de service en petites capitales, un nom en gros),
 * même police sans empattement que le badge Apple. Côte à côte, ils forment
 * une paire ; mais l'un est plein (il mène quelque part) et l'autre est
 * seulement cerné (il annonce). La différence de traitement EST le message.
 *
 * ── Le jour où Android sort ───────────────────────────────────────────────
 * Poser `PLAY_STORE_URL` dans `constants.ts` : la plaque devient un lien et
 * change de libellé toute seule. Rien à toucher ici.
 */

/**
 * Le robot Android, tracé maison (dôme + deux antennes + deux yeux évidés
 * par `fillRule="evenodd"`). Dessiné plutôt qu'importé : aucune dépendance
 * d'icônes de marque, et il hérite de `currentColor` comme les autres
 * marques du site (cf. `brand-icons.tsx`).
 */
function RobotAndroid({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="shrink-0">
      {/* Les antennes, ancrées SUR l'arc (x = 7.4 et 16.6, donc y = 9.3). */}
      <path
        d="M7.4 9.3 5.5 5.9M16.6 9.3l1.9-3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Le dôme est un DEMI-CERCLE exact (rx = ry = 9) : deux fois plus large
          que haut, la proportion du robot. Une ellipse plus plate le change en
          insecte — c'était le premier essai. */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3 17a9 9 0 0 1 18 0Z M8.7 11.6a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Z M15.3 11.6a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Z"
      />
    </svg>
  );
}

/**
 * Les deux tons. `fichier` choisit la déclinaison Apple imposée par le fond ;
 * les autres clés habillent le jumeau Android avec les jetons du même monde
 * (encre sur ivoire, foreground sur nuit).
 */
const TONS = {
  jour: {
    fichier: 'noir',
    bordure: 'border-encre-3/45',
    fond: 'bg-encre/[0.025]',
    petit: 'text-encre-3',
    grand: 'text-encre-2',
  },
  nuit: {
    fichier: 'blanc',
    bordure: 'border-foreground/25',
    fond: 'bg-foreground/[0.045]',
    petit: 'text-foreground-faint',
    grand: 'text-muted-foreground',
  },
} as const;

export default function BadgesPlateformes({
  ton,
  source,
  className = '',
}: {
  /** Le fond sur lequel la paire est posée. Décide la déclinaison Apple. */
  ton: 'jour' | 'nuit';
  /** Emplacement, propagé à l'analytique (`app_store_click`). */
  source: string;
  className?: string;
}) {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const s = TONS[ton];

  const androidPublie = PLAY_STORE_URL !== null;
  /**
   * La ligne de service, tenue COURTE à dessein : « Bientôt disponible sur »
   * poussait la plaque à ~170 px contre 139 px pour le badge Apple, et la
   * paire boitait. Sans le « sur », les deux plaques font la même largeur —
   * et « Bientôt disponible / Android » se lit exactement pareil. La phrase
   * entière reste dite aux lecteurs d'écran par l'`aria-label`.
   */
  const androidService = androidPublie
    ? t('Disponible sur', 'Available on')
    : t('Bientôt disponible', 'Coming soon');
  const androidLabel = androidPublie
    ? t('Disponible sur Android', 'Available on Android')
    : t('Bientôt disponible sur Android', 'Coming soon to Android');

  /* Le jumeau. Rendu une fois, servi soit nu (annonce), soit dans un lien. */
  const plaqueAndroid = (
    <span
      role="img"
      aria-label={androidLabel}
      className={`inline-flex h-11 min-w-[139px] select-none items-center justify-center gap-2 rounded-[10px] border px-3 ${s.bordure} ${s.fond}`}
    >
      <span className={s.petit}>
        <RobotAndroid size={22} />
      </span>
      <span aria-hidden className="flex flex-col items-start leading-none">
        <span
          className={`text-[7.5px] font-medium uppercase tracking-[0.09em] ${s.petit}`}
        >
          {androidService}
        </span>
        <span className={`mt-[3px] text-[15px] font-semibold tracking-[-0.01em] ${s.grand}`}>
          Android
        </span>
      </span>
    </span>
  );

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Apple, plein : il mène quelque part. */}
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener"
        onClick={() => track(ANALYTICS_EVENTS.APP_STORE_CLICK, { source })}
        className="inline-block rounded-[10px] transition-opacity duration-[140ms] hover:opacity-80"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- artwork officiel Apple, SVG servi tel quel (aucune conversion AVIF/WebP à faire) */}
        <img
          src={`/badges/app-store-${locale}-${s.fichier}.svg`}
          alt={t("Télécharger dans l'App Store", 'Download on the App Store')}
          width={139}
          height={44}
          className="block h-11 w-auto"
        />
      </a>

      {/* Android, cerné : il annonce. Non cliquable tant que PLAY_STORE_URL
          est `null` — et l'information « bientôt » est PORTÉE PAR LE TEXTE,
          donc lue par les lecteurs d'écran comme par les yeux. */}
      {androidPublie ? (
        <a
          href={PLAY_STORE_URL as string}
          target="_blank"
          rel="noopener"
          className="inline-block rounded-[10px] transition-opacity duration-[140ms] hover:opacity-80"
        >
          {plaqueAndroid}
        </a>
      ) : (
        <span className="inline-block cursor-default">{plaqueAndroid}</span>
      )}
    </div>
  );
}
