import legal from './legal-terms.generated.json';

/**
 * Métadonnées légales du site — DÉRIVÉES de cellier-vin, plus jamais copiées.
 *
 * Ce fichier était un « miroir » recopié à la main, et il avait dérivé :
 * date d'effet « 9 juin 2026 » ici contre « 8 août 2026 » dans l'application,
 * et une deuxième copie manuscrite du nom légal (audit du 2026-08-14). Tout
 * vient désormais de `legal-terms.generated.json`, produit par
 * `npm run legal:synchroniser` depuis le dépôt canonique ; la dérive est
 * détectée par `npm run legal:verifier` (chaîne qualité d'avant-déploiement).
 */
export const LEGAL_VERSION = legal.legalVersion;
export const LEGAL_EFFECTIVE_DATE = legal.effectiveDate;

export const LEGAL_ENTITY = legal.entity;
