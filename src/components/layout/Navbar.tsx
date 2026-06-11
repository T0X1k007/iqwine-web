'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useLocale } from '@/lib/i18n';
import { getNavLinks, getHero, APP_SIGNUP_URL } from '@/lib/constants';
import Button from '@/components/ui/Button';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

export default function Navbar() {
  const { locale } = useLocale();
  const navLinks = getNavLinks(locale);
  const hero = getHero(locale);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={
        scrolled
          ? { backgroundColor: 'rgba(15, 10, 8, 0.88)' }
          : undefined
      }
      className={`fixed top-0 left-0 right-0 z-50 pt-safe transition-colors duration-[240ms] ease-[cubic-bezier(.32,.72,0,1)] ${
        scrolled
          ? 'backdrop-blur-[20px] backdrop-saturate-150 border-b border-border'
          : ''
      }`}
    >
      <nav className="max-w-[1440px] mx-auto px-6 lg:px-8 flex items-center justify-between h-20 md:h-28">
        {/* Logo lockup — image officielle + wordmark + tagline */}
        <a href="#" className="flex items-center gap-3">
          <Logo size={60} className="md:hidden" />
          <Logo size={80} className="hidden md:block" />
          <span className="flex flex-col">
            <span className="font-[family-name:var(--font-display)] text-[26px] md:text-[38px] font-semibold tracking-tight leading-none text-or">
              iQWine
            </span>
            <span className="font-[family-name:var(--font-display)] italic text-[13px] md:text-[15px] text-foreground/85 leading-tight mt-1">
              {hero.tagline}
            </span>
          </span>
        </a>

        {/* Desktop nav — mono eyebrow style */}
        <div className="hidden md:flex items-center gap-8">
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
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <a
            href={APP_SIGNUP_URL}
            onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'nav' })}
          >
            <Button variant="or" size="sm">{hero.ctaPrimary}</Button>
          </a>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <LanguageToggle />
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
              href={APP_SIGNUP_URL}
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
          </div>
        </div>
      )}
    </header>
  );
}
