'use client';

import { createContext, useCallback, useContext, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  alternatePath,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from '@/lib/locale';

export type { Locale };

/**
 * LA LANGUE VIENT DE L'URL — ce fichier ne la décide plus (GO d'Eric, MFP-09).
 *
 * ── Ce qu'il faisait, et pourquoi c'était intenable ───────────────────────
 * Il lisait `localStorage` après le montage et basculait la page. Donc :
 * un robot ne voyait jamais que le français ; deux langues cohabitaient sous
 * une même URL ; et sans JavaScript, l'anglais n'existait pas.
 *
 * ── Ce qu'il fait maintenant ──────────────────────────────────────────────
 * Il REÇOIT la langue, décidée par le segment d'URL et rendue au serveur. Le
 * contexte demeure — les trente-sept fichiers qui appellent `useLocale()` et
 * `t(fr, en)` fonctionnent sans changement — mais sa source a changé de camp.
 *
 * `setLocale` ne bascule plus un état : il NAVIGUE vers l'équivalent exact de
 * la page courante dans l'autre langue. C'est la seule façon de garantir qu'on
 * ne présente jamais deux langues sous une même URL.
 *
 * Le cookie n'est plus la source de vérité : il ne sert qu'à mémoriser un choix
 * MANUEL, que le middleware relit lors de la redirection depuis la racine. Il
 * ne peut jamais contredire le chemin.
 */

interface I18nContextValue {
  locale: Locale;
  /** Navigue vers la même page dans l'autre langue, et mémorise le choix. */
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'fr',
  setLocale: () => {},
});

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = useCallback(
    (cible: Locale) => {
      if (cible === locale) return;
      // Le choix manuel PRÉVAUT et se mémorise (exigence n°2). `SameSite=Lax`
      // suffit : ce cookie n'est lu que sur une navigation de premier niveau.
      if (typeof document !== 'undefined') {
        document.cookie = `${LOCALE_COOKIE}=${cible}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
      }
      // L'équivalent EXACT, jamais l'accueil : changer de langue ne doit pas
      // faire perdre sa page.
      router.push(alternatePath(pathname ?? '/', cible));
    },
    [locale, pathname, router],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>{children}</I18nContext.Provider>
  );
}

export function useLocale() {
  return useContext(I18nContext);
}
