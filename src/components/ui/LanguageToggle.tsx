'use client';

import { useLocale } from '@/lib/i18n';

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center rounded-md border border-border overflow-hidden font-mono text-[11px] font-medium tracking-[0.16em]">
      <button
        onClick={() => setLocale('en')}
        className={`px-2.5 py-1.5 transition-colors duration-[140ms] ease-[cubic-bezier(.2,.8,.2,1)] cursor-pointer ${
          locale === 'en'
            ? 'bg-or text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('fr')}
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
