'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useLocale } from '@/lib/i18n';
import { getNavLinks, getProductLinks, getHero, buildSignupUrl, APP_LOGIN_URL } from '@/lib/constants';
import Button from '@/components/ui/Button';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

export default function Navbar() {
  const { locale } = useLocale();
  const navLinks = getNavLinks(locale);
  const productLinks = getProductLinks(locale);
  const hero = getHero(locale);
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={scrolled ? { backgroundColor: 'rgba(15, 10, 8, 0.88)' } : undefined}
      className={`fixed top-0 left-0 right-0 z-50 pt-safe transition-[background-color,backdrop-filter] duration-[280ms] ease-[cubic-bezier(.32,.72,0,1)] ${
        scrolled
          ? 'backdrop-blur-[20px] backdrop-saturate-150 border-b border-border'
          : ''
      }`}
    >
      <nav className="max-w-[1440px] mx-auto px-6 lg:px-8 flex items-center justify-between h-20 md:h-28">
        {/* Logo lockup — image officielle + wordmark + tagline */}
        <Link href="/" aria-label="Accueil iQWine" className="flex items-center gap-3">
          <Logo size={60} className="md:hidden" />
          <Logo size={80} className="hidden md:block" />
          <span className="flex flex-col">
            <span className="font-[family-name:var(--font-display)] text-[26px] md:text-[38px] font-semibold tracking-tight leading-none">
              <span className="text-foreground/85">iQ</span>
              <span className="text-or">Wine</span>
            </span>
            <span className="font-[family-name:var(--font-display)] italic text-[13px] md:text-[15px] text-foreground/85 leading-tight mt-1">
              {hero.tagline}
            </span>
          </span>
        </Link>

        {/* Desktop nav — mono eyebrow style */}
        <div className="hidden md:flex items-center gap-8">
          {/* Produit — dropdown vers les pages dédiées */}
          <div className="relative group">
            <button
              type="button"
              className="font-mono text-[11px] font-medium tracking-[0.28em] uppercase text-white hover:text-or transition-colors duration-[140ms] ease-[cubic-bezier(.32,.72,0,1)] inline-flex items-center gap-1.5"
            >
              {t('Produit', 'Product')}
              <ChevronDown
                size={12}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:rotate-180"
                aria-hidden
              />
            </button>
            <div className="absolute left-0 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
              <div className="min-w-[220px] rounded-xl border border-border bg-background/95 backdrop-blur-[14px] p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
                {productLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block rounded-lg px-3 py-2.5 text-[13px] text-white/90 hover:text-or hover:bg-white/5 transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] font-medium tracking-[0.28em] uppercase text-white hover:text-or transition-colors duration-[140ms] ease-[cubic-bezier(.32,.72,0,1)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop right: toggle + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageToggle />
          <a
            href={APP_LOGIN_URL}
            className="font-mono text-[11px] font-medium tracking-[0.28em] uppercase text-white/70 hover:text-or transition-colors duration-[140ms] ease-[cubic-bezier(.32,.72,0,1)]"
          >
            {t('Se connecter', 'Log in')}
          </a>
          <a
            href={buildSignupUrl('nav', { lang: locale })}
            onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'nav' })}
          >
            <Button variant="or" size="sm">{hero.ctaPrimary}</Button>
          </a>
        </div>

        {/* Mobile hamburger + CTA « Essai » compact toujours visible (hors menu) */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageToggle />
          <a
            href={buildSignupUrl('nav_mobile_bar', { lang: locale })}
            onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'nav_mobile_bar' })}
          >
            <Button variant="or" size="sm">{t('Essai', 'Free trial')}</Button>
          </a>
          <button
            className="text-foreground p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={22} strokeWidth={1.5} />
            ) : (
              <Menu size={22} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-[14px] border-b border-border px-6 pb-5">
          <div className="flex flex-col gap-1">
            {/* Produit — pages dédiées */}
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-foreground-faint pt-2 pb-1">
              {t('Produit', 'Product')}
            </p>
            {productLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-[11px] font-medium tracking-[0.28em] uppercase text-white hover:text-or transition-colors py-3 border-b border-border"
              >
                {l.label}
              </Link>
            ))}
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-foreground-faint pt-4 pb-1">
              {t('Explorer', 'Explore')}
            </p>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[11px] font-medium tracking-[0.28em] uppercase text-white hover:text-or transition-colors py-3 border-b border-border last:border-b-0"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={buildSignupUrl('nav_mobile', { lang: locale })}
              onClick={() => {
                track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'nav_mobile' });
                setMobileOpen(false);
              }}
              className="mt-3"
            >
              <Button variant="or" size="md" className="w-full">
                {hero.ctaPrimary}
              </Button>
            </a>
            <a
              href={APP_LOGIN_URL}
              onClick={() => setMobileOpen(false)}
              className="mt-3 text-center font-mono text-[11px] font-medium tracking-[0.28em] uppercase text-white/70 hover:text-or transition-colors py-2"
            >
              {t('Se connecter', 'Log in')}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
