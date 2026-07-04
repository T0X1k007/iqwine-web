import type { MetadataRoute } from 'next';

/**
 * robots.txt — tout indexable sauf l'API. Pointe vers le sitemap. Domaine =
 * metadataBase (canonique non-www iqwine.ca).
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
