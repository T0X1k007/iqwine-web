'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { APP_SIGNUP_URL } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * CTA sticky — MOBILE uniquement (md:hidden). Apparaît après le hero,
 * dismissible, barre fine en bas, ne masque jamais le contenu (le main reçoit
 * un padding-bottom via la classe globale n/a — ici barre compacte + safe-area).
 * Discret : une ligne, fermable. Réapparaît au prochain chargement (pas de
 * persistance intrusive).
 */
export default function StickyCTA() {
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Après le hero (~90dvh) → on révèle.
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const show = visible && !dismissed;
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="md:hidden fixed inset-x-0 bottom-0 z-40 pb-safe"
          initial={reduced ? false : { y: 64 }}
          animate={{ y: 0 }}
          exit={reduced ? { opacity: 0 } : { y: 64 }}
          transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="mx-3 mb-3 flex items-center gap-3 rounded-pill border border-or/30 bg-overlay/95 backdrop-blur-[14px] pl-4 pr-2 py-2 shadow-[var(--shadow-lg)]">
            <span className="iq-small text-foreground-dim flex-1 truncate">
              {t('Sans engagement.', 'No commitment.')}
            </span>
            <a
              href={APP_SIGNUP_URL}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'sticky' })}
              className="rounded-pill bg-or text-background font-medium text-[14px] px-4 py-2 active:scale-[0.98] transition-transform"
            >
              {t('Essai gratuit 14 jours', 'Free Trial 14 Days')}
            </a>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label={t('Fermer', 'Dismiss')}
              className="p-2 text-foreground-faint hover:text-foreground"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
