'use client';

import LocaleLink from '@/components/ui/LocaleLink';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useLocale } from '@/lib/i18n';
import { splitLocalePath } from '@/lib/locale';
import { getNavLinks, getFonctionsLinks, getHero, buildSignupUrl, APP_LOGIN_URL } from '@/lib/constants';
import Button from '@/components/ui/Button';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * L'état de la barre (fond, peau jour/nuit, masquage) doit être posé AVANT
 * la première peinture. Avec `useEffect` il l'était après : une page déjà
 * défilée (remontage Fast Refresh, restauration de scroll au rechargement,
 * arrivée sur une ancre) affichait une barre TRANSPARENTE le temps d'une
 * frame, et le contenu se lisait par-dessus le logo. Constaté par Eric sur
 * /notre-maison le 2026-08-14. `useEffect` côté serveur, où la mise en page
 * n'existe pas et où React avertirait.
 */
const useEffetAvantPeinture = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function Navbar() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const navLinks = getNavLinks(locale);
  const fonctionsLinks = getFonctionsLinks(locale);
  const hero = getHero(locale);
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  // REFONTE V3, navbar CONTEXTUELLE (Eric, 2026-08-13). La barre lit la
  // section qu'elle SURVOLE : ivoire au-dessus des sections `mouvement-jour`,
  // peau sombre partout ailleurs, sur TOUTES les routes (home, hub, futures
  // pages Fonction ; les pages héritées, sans sections jour, restent sombres).
  // L'état INITIAL (avant tout scroll) vient de la route : les pages qui
  // s'ouvrent sur l'ivoire démarrent claires, les autres sombres, pas de
  // flash au premier rendu. La détection vit ensuite dans le rAF du scroll.
  const { rest: cheminCanonique } = splitLocalePath(pathname ?? '/');
  // Routes qui S'OUVRENT sur l'ivoire (avant le premier scroll).
  // `/apogee` et `/tarifs` n'y figurent PAS : elles s'OUVRENT dans la nuit
  // (le regret pour l'une, la concentration du choix pour l'autre) avant de
  // remonter vers l'ivoire ; la barre doit donc y démarrer sombre et basculer
  // au défilement, ce dont se charge la peau contextuelle.
  // Ajoutées à la passe claire du 2026-08-14 : /le-film (entrée ivoire),
  // /contact, /beta et les deux pages légales, désormais entièrement claires.
  const ROUTES_JOUR = ['/', '/fonctions', '/choisir-un-vin', '/cellier-intelligent', '/accord-mets-vins', '/sommelier-ia', '/carte-des-vins', '/notre-maison', '/le-film', '/contact', '/beta', '/conditions', '/confidentialite'];
  const jourInitial = ROUTES_JOUR.includes(cheminCanonique);
  const [surNuit, setSurNuit] = useState(!jourInitial);
  const jour = !surNuit;
  const lien = jour
    ? 'text-encre hover:text-bordeaux-jour'
    : 'text-white hover:text-or';
  const [scrolled, setScrolled] = useState(false);
  // Navbar directionnelle : visible en haut, se masque au scroll vers le bas,
  // réapparaît au scroll vers le haut (comportement validé, type Invintory).
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastYRef = useRef(0);

  useEffetAvantPeinture(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    lastYRef.current = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      // Seuil bas (12 px) : au-delà de 50 px, la barre restait TRANSPARENTE
      // alors que le contenu défilait déjà dessous, et on lisait le contenu
      // à travers la navbar (vu sur /notre-maison le 2026-08-14).
      setScrolled(y > 12);
      // prefers-reduced-motion : on ne masque jamais (aucun mouvement imposé).
      if (!reduced) {
        if (y > lastYRef.current && y > 120) setHidden(true); // scroll down
        else if (y < lastYRef.current) setHidden(false); // scroll up
      }
      lastYRef.current = y;
      // Peau contextuelle : quelle section vit sous la barre ? Ivoire si elle
      // porte `mouvement-jour`, nuit sinon. Le point de lecture est au 2/3 de
      // la hauteur de barre. Si AUCUNE section ne couvre la bande (pages sans
      // sections balisées), on ne touche pas à l'état, l'initial par route
      // fait foi.
      {
        const bande = (window.innerWidth >= 768 ? 128 : 96) * 0.66;
        let trouve = false;
        let nuit = false;
        document.querySelectorAll('main > section').forEach((s) => {
          const r = s.getBoundingClientRect();
          if (r.top <= bande && r.bottom > bande) {
            trouve = true;
            // `data-nav-delai` : une section sombre qui S'OUVRE sur une bande
            // claire (crépuscule de la résolution) ne bascule la barre en nuit
            // qu'une fois cette bande passée, jamais de barre sombre posée
            // sur de l'ivoire.
            const delai = Number(s.getAttribute('data-nav-delai') || 0);
            const sombre = !s.classList.contains('mouvement-jour');
            nuit = sombre && r.top <= bande - delai;
          }
        });
        if (trouve) setSurNuit(nuit);
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    // État INITIAL calculé au montage, sans quoi une page ouverte déjà
    // défilée (ancre, restauration de scroll) garde une navbar transparente
    // posée sur le contenu jusqu'au premier évènement de scroll (vu le
    // 2026-08-12 sur la refonte v3).
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        backgroundColor: jour
          ? scrolled
            ? 'rgba(247, 241, 230, 0.92)'
            : 'var(--color-papier)'
          : scrolled
            ? 'rgba(15, 10, 8, 0.88)'
            : 'var(--color-background)',
        transform:
          hidden && !mobileOpen ? 'translateY(-100%)' : 'translateY(0)',
        // Animation douce et fiable (inline = transition-property garantie).
        transition:
          'transform 550ms cubic-bezier(0.22, 1, 0.36, 1), background-color 320ms ease, backdrop-filter 320ms ease',
        willChange: 'transform',
      }}
      className={`fixed top-0 left-0 right-0 z-50 pt-safe ${
        scrolled
          ? `backdrop-blur-[20px] backdrop-saturate-150 border-b ${jour ? 'border-encre/10' : 'border-border'}`
          : ''
      }`}
    >
      <nav className="max-w-[1440px] mx-auto px-6 lg:px-8 flex items-center justify-between h-20 lg:h-28">
        {/* Logo lockup, image officielle + wordmark + tagline */}
        {/* `aria-label` RETIRÉ, il nuisait au lieu d'aider.
         *
         * Le lien contient déjà son texte : « iQWine » et sa signature. Poser
         * `aria-label="Accueil iQWine"` REMPLACE ce texte par une chaîne qui ne
         * le contient pas, Lighthouse le signale en
         * `label-content-name-mismatch`, et la conséquence est concrète : une
         * personne qui pilote au contrôle vocal dit ce qu'elle VOIT
         * (« iQWine »), et rien ne se passe, parce que le nom accessible est
         * « Accueil iQWine ».
         *
         * Sans attribut, le nom accessible redevient le texte visible. */}
        <LocaleLink href="/" className="flex items-center gap-3">
          <Logo size={60} className="lg:hidden" />
          <Logo size={80} className="hidden lg:block" />
          <span className="flex flex-col">
            <span className="font-[family-name:var(--font-display)] text-[26px] md:text-[38px] font-semibold tracking-tight leading-none">
              <span className={`transition-colors duration-300 ${jour ? 'text-encre/85' : 'text-foreground/85'}`}>iQ</span>
              <span className={`transition-colors duration-300 ${jour ? 'text-or-jour' : 'text-or'}`}>Wine</span>
            </span>
            <span
              className={`font-[family-name:var(--font-display)] italic text-[13px] md:text-[15px] leading-tight mt-1 transition-colors duration-300 ${jour ? 'text-encre-2' : 'text-foreground/85'}`}
            >
              {hero.tagline}
            </span>
          </span>
        </LocaleLink>

        {/* Desktop nav, Octave · Fonctions ▾ · Tarifs (architecture validée
            2026-08-13 : Octave = qui il est, Fonctions = ce qu'il fait,
            Tarifs = comment commencer). */}
        <div className="hidden lg:flex items-center gap-8">
          <LocaleLink
            href={navLinks[0].href}
            className={`font-body text-[11px] font-medium tracking-[0.28em] uppercase ${lien} transition-colors duration-[140ms] ease-[cubic-bezier(.32,.72,0,1)]`}
          >
            {navLinks[0].label}
          </LocaleLink>
          {/* Fonctions, des moments, jamais des modules */}
          <div className="relative group">
            <button
              type="button"
              className={`font-body text-[11px] font-medium tracking-[0.28em] uppercase ${lien} transition-colors duration-[140ms] ease-[cubic-bezier(.32,.72,0,1)] inline-flex items-center gap-1.5`}
            >
              {t('Fonctions', 'Features')}
              <ChevronDown
                size={12}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:rotate-180"
                aria-hidden
              />
            </button>
            <div className="absolute left-0 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
              <div
                className={`min-w-[290px] rounded-xl border backdrop-blur-[14px] p-1.5 ${
                  jour
                    ? 'border-encre/10 bg-papier/95 shadow-[0_24px_60px_-24px_rgba(60,38,18,0.35)]'
                    : 'border-border bg-background/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]'
                }`}
              >
                {fonctionsLinks.map((l) => (
                  <LocaleLink
                    key={l.href}
                    href={l.href}
                    className={`block rounded-lg px-3 py-2 transition-colors ${
                      jour ? 'hover:bg-encre/5' : 'hover:bg-white/5'
                    }`}
                  >
                    <span
                      className={`block text-[13.5px] font-medium ${jour ? 'text-encre/90' : 'text-white/90'}`}
                    >
                      {l.label}
                    </span>
                    <span
                      className={`block font-[family-name:var(--font-display)] italic text-[12.5px] leading-snug ${
                        jour ? 'text-encre-3' : 'text-foreground-faint'
                      }`}
                    >
                      {l.sous}
                    </span>
                  </LocaleLink>
                ))}
              </div>
            </div>
          </div>
          {/* TOUS les liens restants, jamais un index codé en dur : quand
              « Notre histoire » est entré dans la barre (2026-08-14), le
              rendu s'arrêtait à navLinks[1] et TARIFS disparaissait du
              desktop en silence. Le menu mobile, lui, les mappait déjà tous. */}
          {navLinks.slice(1).map((l) => (
            <LocaleLink
              key={l.href}
              href={l.href}
              className={`font-body text-[11px] font-medium tracking-[0.28em] uppercase ${lien} transition-colors duration-[140ms] ease-[cubic-bezier(.32,.72,0,1)]`}
            >
              {l.label}
            </LocaleLink>
          ))}
        </div>

        {/* Desktop right: toggle + CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageToggle />
          <a
            href={APP_LOGIN_URL}
            className={`font-body text-[11px] font-medium tracking-[0.28em] uppercase transition-colors duration-[140ms] ease-[cubic-bezier(.32,.72,0,1)] ${
              jour ? 'text-encre-2 hover:text-bordeaux-jour' : 'text-white/70 hover:text-or'
            }`}
          >
            {t('Se connecter', 'Log in')}
          </a>
          <a
            href={buildSignupUrl('nav', { lang: locale })}
            onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'nav' })}
          >
            <Button variant={jour ? 'primary' : 'or'} size="sm">{hero.ctaPrimary}</Button>
          </a>
        </div>

        {/* Mobile hamburger + CTA « Essai » compact toujours visible (hors menu) */}
        <div className="lg:hidden flex items-center gap-2">
          <LanguageToggle />
          <a
            href={buildSignupUrl('nav_mobile_bar', { lang: locale })}
            onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'nav_mobile_bar' })}
          >
            <Button variant={jour ? 'primary' : 'or'} size="sm">{t('Essai', 'Free trial')}</Button>
          </a>
          <button
            className={`p-2 ${jour ? 'text-encre' : 'text-foreground'}`}
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
        <div
          className={`lg:hidden backdrop-blur-[14px] border-b px-6 pb-5 ${
            jour ? 'bg-papier/95 border-encre/10' : 'bg-background/95 border-border'
          }`}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <LocaleLink
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`font-body text-[11px] font-medium tracking-[0.28em] uppercase ${lien} transition-colors py-3 border-b ${jour ? 'border-encre/10' : 'border-border'}`}
              >
                {link.label}
              </LocaleLink>
            ))}
            <p
              className={`font-body text-[10px] tracking-[0.28em] uppercase pt-4 pb-1 ${jour ? 'text-encre-3' : 'text-foreground-faint'}`}
            >
              {t('Fonctions', 'Features')}
            </p>
            {fonctionsLinks.map((l) => (
              <LocaleLink
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`py-2.5 border-b last:border-b-0 ${jour ? 'border-encre/10' : 'border-border'}`}
              >
                <span className={`block text-[13.5px] font-medium ${jour ? 'text-encre/90' : 'text-white/90'}`}>
                  {l.label}
                </span>
                <span
                  className={`block font-[family-name:var(--font-display)] italic text-[12px] leading-snug ${jour ? 'text-encre-3' : 'text-foreground-faint'}`}
                >
                  {l.sous}
                </span>
              </LocaleLink>
            ))}
            <a
              href={buildSignupUrl('nav_mobile', { lang: locale })}
              onClick={() => {
                track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'nav_mobile' });
                setMobileOpen(false);
              }}
              className="mt-3"
            >
              <Button variant={jour ? 'primary' : 'or'} size="md" className="w-full">
                {hero.ctaPrimary}
              </Button>
            </a>
            <a
              href={APP_LOGIN_URL}
              onClick={() => setMobileOpen(false)}
              className={`mt-3 text-center font-body text-[11px] font-medium tracking-[0.28em] uppercase transition-colors py-2 ${
                jour ? 'text-encre-2 hover:text-bordeaux-jour' : 'text-white/70 hover:text-or'
              }`}
            >
              {t('Se connecter', 'Log in')}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
