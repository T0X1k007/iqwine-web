import legal from './legal-terms.generated.json';
import { TRIAL_DAYS, TRIAL_RECOS } from './trial';

/**
 * Accès au texte légal canonique (généré depuis cellier-vin par
 * scripts/synchroniser-legal.mjs). Les placeholders ICU du canonique sont
 * interpolés ICI depuis les sources uniques du site — jamais recopiés en dur,
 * pour que le contrat affiché décrive toujours le comportement réel :
 * l'essai vient de lib/trial.ts, l'identité et les coordonnées du généré
 * (lui-même tiré de lib/mail/identite.ts du canonique).
 */

export type LangueLegale = 'fr' | 'en';

const VALEURS: Record<string, string> = {
  legalName: legal.entity.legalName,
  jurisdiction: legal.entity.jurisdiction,
  email: legal.contact.email,
  phone: legal.contact.phone,
  address: legal.contact.address,
  days: String(TRIAL_DAYS),
  recos: String(TRIAL_RECOS),
  date: legal.effectiveDate,
};

export function texteLegal(langue: LangueLegale, cle: string): string {
  const brut = (legal.terms as Record<LangueLegale, Record<string, string>>)[langue][cle];
  if (brut === undefined) throw new Error(`Clé légale absente du généré : ${cle}`);
  return brut.replace(/\{(\w+)\}/g, (_tout, nom: string) => {
    const valeur = VALEURS[nom];
    if (valeur === undefined) throw new Error(`Paramètre légal inconnu : {${nom}} (clé ${cle})`);
    return valeur;
  });
}

/** Bandeau des pages légales EN : la version française fait foi. */
export const NOTICE_EN = legal.enNotice;
