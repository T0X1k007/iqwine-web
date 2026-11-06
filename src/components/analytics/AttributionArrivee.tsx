'use client';

import { useEffect } from 'react';
import { APP_SIGNUP_URL } from '@/lib/constants';
import {
  appliquerAttribution,
  attributionAConserver,
  estLienInscription,
  lireAttributionArrivee,
  relireAttribution,
} from '@/lib/attribution';

/**
 * ── GARDER LA SOURCE D'ARRIVÉE JUSQU'AU CTA D'ESSAI (audit 2026-11-06, M-03) ──
 *
 * 1. À l'atterrissage : lit l'UTM d'arrivée, ou à défaut le DOMAINE du
 *    référent, et le garde dans `sessionStorage`.
 * 2. Au clic sur un lien d'inscription : remplace le repli
 *    `utm_source=marketing` par cette source, juste avant la navigation.
 *
 * ── Pourquoi `sessionStorage`, et pas un témoin ──────────────────────────
 * La valeur n'a pas à voyager vers un serveur à chaque requête : elle n'est
 * utile qu'au moment du clic, côté navigateur, et part ensuite dans l'URL du
 * lien. `sessionStorage` reste dans l'onglet, n'est jamais envoyé, et
 * disparaît à sa fermeture. Ce qui y est gardé : une source de campagne ou un
 * nom de domaine, bornés comme dans l'app ; aucun identifiant, aucune donnée
 * qui distingue une personne d'une autre.
 *
 * ── Pourquoi au clic, et pas au rendu ─────────────────────────────────────
 * Les liens sont rendus côté serveur, sans connaître le visiteur. Les
 * réécrire au rendu client créerait un écart d'hydratation ; les réécrire au
 * clic (phase de capture, avant la navigation) touche tous les CTA, présents
 * et futurs, sans modifier leurs 27 appelants. Le clic du milieu et le menu
 * contextuel (« ouvrir dans un nouvel onglet ») sont couverts.
 *
 * Toujours actif : il ne collecte rien et n'envoie rien ailleurs que dans le
 * lien d'inscription que le visiteur choisit lui-même de suivre.
 */
const CLE = 'iqwine.attribution';

function lireStockee() {
  try {
    return relireAttribution(window.sessionStorage.getItem(CLE));
  } catch {
    return null; // stockage bloqué (navigation privée stricte) : repli
  }
}

export default function AttributionArrivee() {
  useEffect(() => {
    const arrivee = lireAttributionArrivee(
      window.location.search,
      document.referrer,
      window.location.hostname,
    );
    const aGarder = attributionAConserver(arrivee, lireStockee());
    if (aGarder) {
      try {
        window.sessionStorage.setItem(CLE, JSON.stringify(aGarder));
      } catch {
        /* best-effort : sans stockage, le repli `marketing` s'applique */
      }
    }

    const reecrire = (e: Event) => {
      const cible = e.target;
      if (!(cible instanceof Element)) return;
      const lien = cible.closest('a[href]');
      if (!(lien instanceof HTMLAnchorElement)) return;
      if (!estLienInscription(lien.href, APP_SIGNUP_URL)) return;
      const attribution = lireStockee();
      if (!attribution) return;
      try {
        lien.href = appliquerAttribution(new URL(lien.href), attribution).toString();
      } catch {
        /* lien laissé tel quel */
      }
    };

    const options = { capture: true } as const;
    document.addEventListener('click', reecrire, options);
    document.addEventListener('auxclick', reecrire, options);
    document.addEventListener('contextmenu', reecrire, options);
    return () => {
      document.removeEventListener('click', reecrire, options);
      document.removeEventListener('auxclick', reecrire, options);
      document.removeEventListener('contextmenu', reecrire, options);
    };
  }, []);

  return null;
}
