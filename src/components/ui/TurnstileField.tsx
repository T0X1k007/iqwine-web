'use client';

import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import Script from 'next/script';

/**
 * Widget Cloudflare Turnstile du site iqwine.ai.
 *
 * Miroir volontairement RÉDUIT de `components/auth/TurnstileField.tsx` de
 * l'application : le site n'a qu'un thème (clair), pas de `next-intl`, et un
 * seul formulaire à protéger. En copier la version complète importerait un
 * sélecteur de thème et une machinerie i18n pour rien.
 *
 * Deux leçons de l'application sont en revanche reprises telles quelles, parce
 * qu'elles ont chacune coûté un incident :
 *
 *   · la clé arrive en PROP, jamais par `process.env` — une clé figée au build
 *     ne se résout pas sur un hôte non déclaré chez Cloudflare, et le bouton
 *     d'envoi reste gris pour toujours sans que rien ne l'explique ;
 *   · la place du widget est RÉSERVÉE avant son montage, sinon la page saute
 *     au moment où l'iframe apparaît.
 *
 * Sans clé de site, le composant ne rend RIEN et ne charge aucun script : le
 * formulaire se comporte exactement comme avant son arrivée.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible' | 'invisible';
        },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export interface TurnstileFieldHandle {
  /** Rejoue le défi. Un jeton est à USAGE UNIQUE : après un envoi refusé, le
   *  garder rendrait la seconde tentative impossible à valider. */
  reset: () => void;
}

interface TurnstileFieldProps {
  /** Clé publique lue au runtime par la coquille serveur. `''` = inactif. */
  siteKey: string;
  /** Reçoit le jeton courant, `''` quand il est absent, expiré ou en erreur. */
  onToken: (token: string) => void;
}

const TurnstileField = forwardRef<TurnstileFieldHandle, TurnstileFieldProps>(
  function TurnstileField({ siteKey, onToken }, ref) {
    const [monte, setMonte] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<string | null>(null);
    // `onToken` vit dans une ref : le widget n'est rendu QU'UNE fois, et une
    // fonction recréée à chaque rendu du parent ne doit pas le remonter.
    const onTokenRef = useRef(onToken);
    onTokenRef.current = onToken;

    const monter = useCallback(() => {
      if (!siteKey || !window.turnstile || !containerRef.current) return;
      if (widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'light',
        // `normal` rend une iframe de 300 px fixes, plus étroite que les champs
        // du formulaire ; `flexible` épouse la colonne.
        size: 'flexible',
        callback: (token) => onTokenRef.current(token),
        'expired-callback': () => onTokenRef.current(''),
        'error-callback': () => onTokenRef.current(''),
      });
      setMonte(true);
    }, [siteKey]);

    // Le script peut déjà être chargé (navigation client depuis une autre
    // page) : `onLoad` ne se rejoue alors pas.
    useEffect(() => {
      if (window.turnstile) monter();
    }, [monter]);

    useImperativeHandle(ref, () => ({
      reset() {
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
          onTokenRef.current('');
        }
      },
    }));

    if (!siteKey) return null;

    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={monter}
        />
        {/* Hauteur réservée tant que l'iframe n'est pas là : 72 px est la
            hauteur rendue en `flexible`. Sans elle, la page saute au montage. */}
        <div ref={containerRef} className={monte ? undefined : 'h-[72px]'} />
      </>
    );
  },
);

export default TurnstileField;
