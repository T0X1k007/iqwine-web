import type { MetadataRoute } from 'next';

/**
 * Web App Manifest — installable PWA + bookmark icon source.
 *
 * Quand l'utilisateur :
 *  - épingle l'onglet → utilise `icons` (Chrome, Edge, Brave)
 *  - "Add to Home Screen" iOS → utilise `apple-icon.png` (auto-detect Next.js)
 *  - bookmark dans la barre des tâches → utilise `icons[].src` adapté à la taille
 *  - installe la PWA Android/Desktop → utilise `name`, `theme_color`, `icons`
 *
 * theme_color = noir-cave brand (matches navbar transparente au top).
 * background_color = même couleur pour cohérence splash screen sans flash.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'iQWine — L\'intelligence privée de votre cave',
    short_name: 'iQWine',
    description:
      'Le sommelier privé des collectionneurs modernes. Cellier vivant, mémoire de dégustation, mode Tonight.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0A08',
    theme_color: '#0F0A08',
    orientation: 'portrait',
    lang: 'fr-CA',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
