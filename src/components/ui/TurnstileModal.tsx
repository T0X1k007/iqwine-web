'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Loader2 } from 'lucide-react';

// Cloudflare Turnstile is loaded via a script tag. The widget exposes
// `window.turnstile` once ready. We render it inside this modal and
// forward the token (or an error) via callbacks.
//
// https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/

interface TurnstileWindow extends Window {
  turnstile?: {
    render: (
      container: string | HTMLElement,
      params: {
        sitekey: string;
        theme?: 'light' | 'dark' | 'auto';
        callback?: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
        language?: string;
      }
    ) => string;
    reset: (widgetId?: string) => void;
    remove: (widgetId?: string) => void;
  };
}

declare const window: TurnstileWindow;

const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';
const TURNSTILE_SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function ensureTurnstileScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'));
    if (window.turnstile) return resolve();
    if (document.getElementById(TURNSTILE_SCRIPT_ID)) {
      // Script already loading, poll for window.turnstile
      const start = Date.now();
      const poll = setInterval(() => {
        if (window.turnstile) {
          clearInterval(poll);
          resolve();
        } else if (Date.now() - start > 10000) {
          clearInterval(poll);
          reject(new Error('turnstile load timeout'));
        }
      }, 100);
      return;
    }
    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const start = Date.now();
      const poll = setInterval(() => {
        if (window.turnstile) {
          clearInterval(poll);
          resolve();
        } else if (Date.now() - start > 10000) {
          clearInterval(poll);
          reject(new Error('turnstile ready timeout'));
        }
      }, 50);
    };
    script.onerror = () => reject(new Error('turnstile script error'));
    document.head.appendChild(script);
  });
}

interface TurnstileModalProps {
  open: boolean;
  siteKey: string;
  locale: 'en' | 'fr';
  title: string;
  description: string;
  loadingText: string;
  errorText: string;
  cancelText: string;
  onVerified: (token: string) => void;
  onClose: () => void;
}

export default function TurnstileModal({
  open,
  siteKey,
  locale,
  title,
  description,
  loadingText,
  errorText,
  cancelText,
  onVerified,
  onClose,
}: TurnstileModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  // Render / unmount widget when modal opens/closes
  useEffect(() => {
    if (!open || !siteKey || !containerRef.current) return;

    let cancelled = false;
    setLoading(true);
    setErrored(false);

    ensureTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: 'dark',
            language: locale,
            callback: (token: string) => {
              if (!cancelled) onVerified(token);
            },
            'error-callback': () => {
              if (!cancelled) setErrored(true);
            },
            'expired-callback': () => {
              if (!cancelled && widgetIdRef.current && window.turnstile) {
                window.turnstile.reset(widgetIdRef.current);
              }
            },
          });
          setLoading(false);
        } catch {
          if (!cancelled) {
            setErrored(true);
            setLoading(false);
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrored(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* noop */
        }
        widgetIdRef.current = null;
      }
    };
  }, [open, siteKey, locale, onVerified]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="turnstile-modal-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-lg p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-foreground transition-colors duration-[140ms]"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="text-center mb-6">
          <div className="iq-eyebrow mb-3">Turnstile</div>
          <h3
            id="turnstile-modal-title"
            className="iq-h4 mb-2"
          >
            {title}
          </h3>
          <p className="iq-small text-foreground-dim">
            {description}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 min-h-[80px] justify-center">
          {loading && !errored && (
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
              <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
              {loadingText}
            </div>
          )}

          {/* Turnstile widget mounts here */}
          <div ref={containerRef} className={errored ? 'hidden' : ''} />

          {errored && (
            <p className="font-mono text-[11px] tracking-wide text-danger text-center">
              {errorText}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-[140ms]"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
