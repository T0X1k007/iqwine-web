import type { MetadataRoute } from 'next';

/**
 * robots.txt — tout indexable sauf l'API. Pointe vers le sitemap. Domaine =
 * metadataBase (canonique = www.iqwine.ca (l'hôte reellement servi ; l'apex 307-redirige vers www, cote hebergeur)).
 */
const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.iqwine.ca';

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
