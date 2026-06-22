'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * ShareButton — geste de partage RÉEL, sans fausse promesse.
 *
 * On partage le SITE marketing (pas le signup) : une invitation à découvrir
 * Octave, « comme on tend un verre ». AUCUN crédit / parrainage annoncé —
 * ça n'existe pas côté app. Web Share natif (mobile) sinon fallback copie.
 *
 * SSR-safe : tout accès à `navigator.*` se fait dans le handler onClick,
 * jamais au rendu.
 */

const SHARE_URL = 'https://www.iqwine.ca/?src=share';

type LabelPair = Record<Locale, string>;

interface ShareButtonProps {
  source?: string;
  label?: LabelPair;
}

export default function ShareButton({
  source = 'cercle',
  label,
}: ShareButtonProps) {
  const { locale } = useLocale();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const defaultLabel: LabelPair = {
    fr: 'Partager iQWine',
    en: 'Share iQWine',
  };
  const resolved = label ?? defaultLabel;
  const buttonLabel = resolved[locale];
  const copiedLabel = locale === 'fr' ? 'Lien copié' : 'Link copied';

  const shareText =
    locale === 'fr'
      ? 'iQWine — la cave qui se souvient de ce que vous aimez.'
      : 'iQWine — the cellar that remembers what you love.';

  const flagCopied = () => {
    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2400);
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'iQWine',
          text: shareText,
          url: SHARE_URL,
        });
        track(ANALYTICS_EVENTS.SHARE_CLICK, { method: 'native', source });
        return;
      } catch {
        // Annulation utilisateur ou indisponibilité : on retombe sur la copie.
      }
    }

    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(SHARE_URL);
        flagCopied();
        track(ANALYTICS_EVENTS.SHARE_CLICK, { method: 'copy', source });
      }
    } catch {
      // Copie indisponible (permissions) — best-effort, on ne casse jamais l'UI.
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleShare}
      aria-live="polite"
      aria-label={copied ? copiedLabel : buttonLabel}
    >
      {copied ? (
        <Check className="h-4 w-4 text-or" aria-hidden />
      ) : (
        <Share2 className="h-4 w-4 text-or/80" aria-hidden />
      )}
      <span>{copied ? copiedLabel : buttonLabel}</span>
    </Button>
  );
}
