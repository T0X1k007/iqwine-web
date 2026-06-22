'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { APP_SIGNUP_URL } from '@/lib/constants';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * CTA sticky — MOBILE uniquement (md:hidden). Apparaît après le hero,
 * barre fine en bas, ne masque jamais le contenu.
 *
 * Non-jetable : pas de fermeture permanente. Le bouton ne fait que replier la
 * barre en une pastille discrète (chevron) qui reste tappable et redéploie le
 * CTA d'un toucher. Aucun état de session persisté → le CTA reste toujours
 * atteignable.
 */
export default function StickyCTA() {
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Après le hero (~90dvh) → on révèle.
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="md:hidden fixed inset-x-0 bottom-0 z-40 pb-safe"
          initial={reduced ? false : { y: 64 }}
          animate={{ y: 0 }}
          exit={reduced ? { opacity: 0 } : { y: 64 }}
          transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
        >
          {collapsed ? (
            <div className="mb-3 flex justify-end px-3">
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                aria-label={t('Afficher l’essai gratuit', 'Show free trial')}
                aria-expanded={false}
                className="flex items-center gap-1.5 rounded-pill border border-or/30 bg-overlay/95 backdrop-blur-[14px] pl-3 pr-2.5 py-2 shadow-[var(--shadow-lg)] active:scale-[0.98] transition-transform"
              >
                <span className="iq-small text-or font-medium">{t('Essai', 'Trial')}</span>
                <ChevronUp size={16} strokeWidth={2} className="text-or" />
              </button>
            </div>
          ) : (
            <div className="mx-3 mb-3 flex items-center gap-3 rounded-pill border border-or/30 bg-overlay/95 backdrop-blur-[14px] pl-4 pr-2 py-2 shadow-[var(--shadow-lg)]">
              <span className="iq-small text-foreground-dim flex-1 truncate">
                {t('Sachez quoi ouvrir ce soir.', 'Know what to open tonight.')}
              </span>
              <a
                href={APP_SIGNUP_URL}
                onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'sticky' })}
                className="rounded-pill bg-or text-background font-medium text-[14px] px-4 py-2 active:scale-[0.98] transition-transform"
              >
                {t('Essai gratuit', 'Free trial')}
              </a>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label={t('Réduire', 'Collapse')}
                aria-expanded
                className="p-2 text-foreground-faint hover:text-foreground"
              >
                <ChevronDown size={16} strokeWidth={2} />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
