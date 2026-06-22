'use client';

import { useLocale } from '@/lib/i18n';

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label={locale === 'fr' ? 'Langue' : 'Language'}
      className="flex items-center rounded-md border border-border overflow-hidden font-mono text-[11px] font-medium tracking-[0.16em]"
    >
      <button
        type="button"
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        aria-label={locale === 'fr' ? 'Passer en anglais' : 'Switch to English'}
        className={`px-2.5 py-1.5 transition-colors duration-[140ms] ease-[cubic-bezier(.2,.8,.2,1)] cursor-pointer ${
          locale === 'en'
            ? 'bg-or text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale('fr')}
        aria-pressed={locale === 'fr'}
        aria-label={locale === 'fr' ? 'Switch to French' : 'Passer en français'}
        className={`px-2.5 py-1.5 transition-colors duration-[140ms] ease-[cubic-bezier(.2,.8,.2,1)] cursor-pointer ${
          locale === 'fr'
            ? 'bg-or text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        FR
      </button>
    </div>
  );
}
