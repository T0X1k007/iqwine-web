/**
 * Source partagée des témoignages réels d'iQWine / Octave.
 *
 * Trois vraies personnes. Aucune mention « exemple » côté public.
 *
 * ✅ CONSENTEMENT OBTENU (2026-06-22) — formulations FR/EN confirmées mot à mot
 * avec André, François et Cédric. Approuvées pour diffusion publique/campagne.
 *
 * Consommée par :
 *  - SectionConfiance (home) — affiche les trois premiers (grille md:grid-cols-3)
 *  - OctaveContent (/octave) — alimente le TestimonialRotator (mappe nom + ville → who)
 */

export type Testimonial = {
  quoteFr: string;
  quoteEn: string;
  name: string;
  city: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quoteFr: 'Tellement plus simple de choisir une bouteille à la SAQ pour un souper.',
    quoteEn: 'So much easier to pick a bottle at the SAQ for a dinner.',
    name: 'André',
    city: 'Terrebonne, Québec',
  },
  {
    quoteFr:
      'Octave connaît mes goûts de plus en plus, si simple d’accorder vin et repas.',
    quoteEn:
      'Octave knows my taste more and more — pairing wine and food is so simple.',
    name: 'François',
    city: 'Saint-Jérôme, Québec',
  },
  {
    quoteFr:
      'Le scan de la carte des vins au resto, accordé à mes goûts et à mon plat : j’adore !',
    quoteEn:
      'Scanning the wine list at a restaurant, matched to my taste and my dish — I love it!',
    name: 'Cédric',
    city: 'Boisbriand, Québec',
  },
];
