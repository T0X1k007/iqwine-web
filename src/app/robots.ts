import type { MetadataRoute } from 'next';

/**
 * robots.txt — tout indexable sauf l'API. Pointe vers le sitemap.
 *
 * ── Le domaine, et pourquoi ce repli a changé (2026-08-02) ────────────────
 * Le canonique est désormais **l'apex `iqwine.ai`**. Le commentaire précédent
 * décrivait l'inverse — « l'apex 307-redirige vers www » — ce qui n'est plus
 * vrai depuis la bascule : c'est `www.` qui redirige vers l'apex, et
 * `iqwine.ca` (avec et sans `www.`) redirige vers `iqwine.ai`.
 *
 * Le repli comptait donc doublement faux : mauvais domaine ET mauvais hôte.
 * Il ne se voit pas tant que `NEXT_PUBLIC_SITE_URL` est posée sur Vercel — et
 * c'est précisément le mode de panne à craindre : le jour où elle manque, ce
 * fichier annoncerait aux moteurs un `Host:` et un `Sitemap:` sur un domaine
 * mort, sans qu'aucun build n'échoue.
 */
const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://iqwine.ai';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
