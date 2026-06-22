'use client';

/**
 * Analytics provider-agnostique. Pousse chaque événement dans window.dataLayer
 * (GTM) ET appelle window.gtag si présent (GA4 via @next/third-parties).
 * No-op sûr si aucun provider n'est branché (aucune erreur, aucun réseau).
 *
 * Aucune PII. Les noms d'événements sont stables (cf. tableau dans la PR).
 */

export const ANALYTICS_EVENTS = {
  SIGNUP_CLICK: 'signup_click', // tout CTA menant à app/signup (prop: source)
  DEMO_MEAL_SELECT: 'demo_meal_select', // prop: meal
  DEMO_SOURCE_TOGGLE: 'demo_source_toggle', // prop: source
  SCROLL_DEPTH: 'scroll_depth', // prop: percent (25/50/75/100)
  COMPARISON_VIEW: 'comparison_view', // section comparatif vue
  PLAN_SELECTED: 'plan_selected', // CTA d'une carte de plan (props: plan, period)
  BILLING_PERIOD_TOGGLE: 'billing_period_toggle', // bascule mensuel/annuel (prop: period)
  CONTACT_SUBMITTED: 'contact_submitted', // formulaire contact envoyé (prop: category)
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

type Props = Record<string, string | number | boolean | undefined>;

interface GtagWindow extends Window {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
}

export function track(event: AnalyticsEvent, props: Props = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as GtagWindow;
  try {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event, ...props });
    if (typeof w.gtag === 'function') {
      w.gtag('event', event, props);
    }
  } catch {
    /* analytics best-effort — ne jamais casser l'UI */
  }
}
