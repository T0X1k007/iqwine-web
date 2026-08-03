import type { Metadata } from 'next';
import { BCP47, absoluteUrl, alternatesFor, isLocale, type Locale } from '@/lib/locale';

/**
 * MÉTADONNÉES DE PAGE — une par langue, canonical et hreflang compris.
 *
 * ── Le défaut que ce module ferme ─────────────────────────────────────────
 * Chaque page exportait un `metadata` figé, avec un `canonical: '/tarifs'`
 * écrit en dur. Après le passage aux URL par langue, la page anglaise
 * `/en/tarifs` déclarait donc `https://www.iqwine.ca/tarifs` comme canonique —
 * c'est-à-dire une URL qui redirige, et qui sert du français.
 *
 * Un canonical faux n'affiche rien de faux : la page est parfaite à l'œil.
 * Mais il dit au moteur « la vraie version est ailleurs », et la version
 * anglaise disparaît de l'index en désignant elle-même sa remplaçante. C'est la
 * façon la plus discrète de rendre invisible un contenu qu'on vient de créer.
 *
 * ── Ce que ce constructeur garantit ───────────────────────────────────────
 * Titre, description et Open Graph dans la langue servie ; canonical vers SA
 * propre URL ; `hreflang` vers les deux variantes ; `x-default` vers le
 * français. Tout dérive du couple (chemin, langue) — rien n'est répété.
 */

export interface TexteLocalise {
  title: string;
  description: string;
  /** Titre Open Graph si différent du titre de page. */
  ogTitle?: string;
  /** Description Open Graph si différente. */
  ogDescription?: string;
}

/**
 * Construit les métadonnées d'une page, pour une langue donnée.
 *
 * `rest` est le chemin NU (`/tarifs`), jamais le chemin localisé : c'est
 * `alternatesFor` qui compose, en un seul endroit, les trois URL qu'il faut
 * déclarer.
 */
export function pageMetadata(
  rest: string,
  locale: string,
  textes: Record<Locale, TexteLocalise>,
): Metadata {
  // Une langue inconnue ne rend rien : le layout répond déjà 404, et fabriquer
  // des métadonnées pour une page qui n'existera pas serait décrire un fantôme.
  if (!isLocale(locale)) return {};

  const t = textes[locale];
  return {
    title: t.title,
    description: t.description,
    alternates: alternatesFor(rest, locale),
    openGraph: {
      title: t.ogTitle ?? t.title,
      description: t.ogDescription ?? t.description,
      /**
       * `og:url` — absent jusqu'ici, et Next ne le déduit PAS du canonical.
       *
       * Vérifié en production le 2026-08-03 : les pages émettaient `og:title`,
       * `og:description`, `og:locale` et `og:type`, mais aucun `og:url`. Deux
       * conséquences, discrètes parce qu'un partage « marche » quand même :
       *
       *   · les plateformes qui dédoublonnent par `og:url` traitaient deux
       *     partages de la même page comme deux objets distincts, chacun
       *     accumulant ses propres compteurs ;
       *   · un lien partagé avec des paramètres de campagne (`?utm_…`) était
       *     pris pour l'adresse de la page, faute d'une adresse déclarée.
       *
       * Il porte la version LOCALISÉE, donc le slug traduit : la carte de
       * partage d'une page anglaise annonce `/en/pricing`, pas `/en/tarifs`.
       */
      url: absoluteUrl(rest, locale),
      locale: BCP47[locale],
      type: 'website',
      siteName: 'iQWine',
      /**
       * `images` — absent jusqu'au 2026-08-03, et c'est ce silence qui coûtait.
       *
       * `src/app/[locale]/opengraph-image.tsx` produit bien une image, et les
       * deux pages d'accueil l'affichaient. Mais dès qu'une page déclare son
       * propre objet `openGraph`, Next cesse d'y joindre l'image du segment
       * parent. Toutes les pages construites par cet assistant — c'est-à-dire
       * TOUTES sauf les accueils — annonçaient donc `summary_large_image`,
       * une carte conçue autour d'une grande image, sans aucune image.
       *
       * Mesuré en production : `/fr`, `/en` avaient `og:image` ; `/fr/tarifs`,
       * `/en/pricing`, `/fr/notre-maison`, `/en/our-story`, `/fr/sommelier-ia`,
       * `/en/ai-sommelier`, `/fr/contact` n'en avaient pas.
       *
       * Le défaut ne casse rien : le lien partagé fonctionne, il est seulement
       * NU. Sur Messenger, LinkedIn, iMessage ou Slack, la page de tarifs — le
       * lien le plus partagé d'un site commercial — arrivait sans visuel.
       *
       * On pointe la route localisée SANS son empreinte de cache (`?hash`) :
       * vérifié le 2026-08-03, `/fr/opengraph-image` et `/en/opengraph-image`
       * rendent 200 et 120 Ko de PNG. L'empreinte est un cache-buster que Next
       * ajoute lui-même quand il compose la balise ; l'écrire ici la figerait
       * au build courant et servirait une image périmée au suivant.
       */
      images: [absoluteUrl('/opengraph-image', locale)],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.ogTitle ?? t.title,
      description: t.ogDescription ?? t.description,
      // Même raison, même correctif : `summary_large_image` sans image est une
      // promesse que la carte ne peut pas tenir.
      images: [absoluteUrl('/twitter-image', locale)],
    },
  };
}

/** La signature que Next attend pour `generateMetadata` sur une page localisée. */
export type ParamsLocale = { params: Promise<{ locale: string }> };
