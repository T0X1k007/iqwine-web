/**
 * Métadonnées légales du site marketing — MIROIR de cellier-vin
 * (lib/legal/legal-meta.ts). Garder synchrone avec l'application : la marque
 * est « iQWine », la raison sociale « Groupe Medtech Inc. » n'apparaît que là
 * où la loi exige d'identifier la partie contractante / le responsable des
 * renseignements (Conditions, Politique de confidentialité).
 *
 * NOTE : si les politiques canoniques de l'app changent (LEGAL_VERSION),
 * répercuter ici. Source unique côté app ; ce fichier reste un miroir.
 */
export const LEGAL_EFFECTIVE_DATE = '9 juin 2026';

export const LEGAL_ENTITY = {
  brand: 'iQWine',
  legalName: 'Groupe Medtech Inc.',
  jurisdiction: 'Québec, Canada',
  city: 'Blainville (Québec), Canada',
} as const;
