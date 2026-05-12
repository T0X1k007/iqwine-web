'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useLocale } from '@/lib/i18n';
import { getNavLinks, getHero } from '@/lib/constants';
import Button from '@/components/ui/Button';
import LanguageToggle from '@/components/ui/LanguageToggle';

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
      className={`fixed top-0 left-0 right-0 z-50 pt-safe transition-colors duration-[240ms] ease-[cubic-bezier(.32,.72,0,1)] ${
        scrolled
          ? 'bg-background/75 backdrop-blur-[20px] backdrop-saturate-150 border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-[1440px] mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo lockup — image officielle + wordmark */}
        <a href="#" className="flex items-center gap-2.5">
          <Logo size={28} />
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight leading-none">
            <span className="text-foreground">iQ</span>
            <span className="text-or">Wine</span>
          </span>
        </a>

        {/* Desktop nav — mono eyebrow style */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] font-medium tracking-[0.28em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-[140ms] ease-[cubic-bezier(.32,.72,0,1)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop right: toggle + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <a href="#beta">
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
                className="font-mono text-[11px] font-medium tracking-[0.28em] uppercase text-muted-foreground hover:text-foreground transition-colors py-3 border-b border-border last:border-b-0"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href="#beta" onClick={() => setMobileOpen(false)} className="mt-3">
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
