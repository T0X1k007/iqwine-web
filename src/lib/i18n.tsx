'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Locale = 'en' | 'fr';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  setLocale: () => {},
});

const LOCALE_STORAGE_KEY = 'iqwine:locale';

export function I18nProvider({ children }: { children: ReactNode }) {
  // Défaut 'fr' au render initial → SSR déterministe (pas d'accès navigateur).
  const [locale, setLocale] = useState<Locale>('fr');

  // Relit le choix persisté après le mount (jamais au render initial → SSR-safe).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored === 'fr' || stored === 'en') {
        setLocale(stored);
      }
    } catch {
      // localStorage indisponible (mode privé, quota) → on garde le défaut.
    }
  }, []);

  // Maintient <html lang> + persiste, à chaque changement de locale (a11y/SEO).
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      } catch {
        // Échec d'écriture non bloquant.
      }
    }
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLocale() {
  return useContext(I18nContext);
}
