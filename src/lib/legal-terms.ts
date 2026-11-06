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

/**
 * LA DATE D'EFFET, DITE DANS LA LANGUE DE LA PAGE (2026-11-06).
 *
 * Le canonique ne porte qu'une date, en français (« 25 septembre 2026 »), et
 * l'app l'affiche telle quelle même en anglais. Sur /en/privacy et /en/terms,
 * « In effect on 25 septembre 2026 » mêlait deux langues dans la ligne même
 * qui date le contrat. On la REFORMULE en anglais, sans la recalculer : même
 * jour, même mois, même année, lus dans la chaîne canonique. Une date que ce
 * lecteur ne reconnaît pas fait échouer la construction plutôt que d'afficher
 * une date inventée.
 */
const MOIS_EN: Record<string, string> = {
  janvier: 'January', février: 'February', mars: 'March', avril: 'April',
  mai: 'May', juin: 'June', juillet: 'July', août: 'August',
  septembre: 'September', octobre: 'October', novembre: 'November', décembre: 'December',
};
function dateEnAnglais(dateFr: string): string {
  const m = dateFr.match(/^(\d{1,2})(?:er)? (\p{L}+) (\d{4})$/u);
  const mois = m ? MOIS_EN[m[2].toLowerCase()] : undefined;
  if (!m || !mois) throw new Error(`Date d'effet canonique illisible : « ${dateFr} »`);
  return `${mois} ${Number(m[1])}, ${m[3]}`;
}

const VALEURS: Record<string, string> = {
  legalName: legal.entity.legalName,
  jurisdiction: legal.entity.jurisdiction,
  city: legal.entity.city,
  email: legal.contact.email,
  phone: legal.contact.phone,
  address: legal.contact.address,
  days: String(TRIAL_DAYS),
  recos: String(TRIAL_RECOS),
};

/** Remplace les paramètres ICU `{nom}` d'un texte canonique. */
function interpoler(brut: string, langue: LangueLegale, cle: string): string {
  return brut.replace(/\{(\w+)\}/g, (_tout, nom: string) => {
    if (nom === 'date') {
      return langue === 'en' ? dateEnAnglais(legal.effectiveDate) : legal.effectiveDate;
    }
    const valeur = VALEURS[nom];
    if (valeur === undefined) throw new Error(`Paramètre légal inconnu : {${nom}} (clé ${cle})`);
    return valeur;
  });
}

/** Une clé des Conditions d'utilisation (`Legal.terms.*` du canonique). */
export function texteLegal(langue: LangueLegale, cle: string): string {
  const brut = (legal.terms as Record<LangueLegale, Record<string, string>>)[langue][cle];
  if (brut === undefined) throw new Error(`Clé légale absente du généré : ${cle}`);
  return interpoler(brut, langue, cle);
}

/**
 * Une clé de la Politique de confidentialité (`Legal.privacy.*` du
 * canonique), synchronisée depuis le 2026-11-06 par le même script que les
 * Conditions. Même interpolation, mêmes garde-fous.
 */
export function textePolitique(langue: LangueLegale, cle: string): string {
  const brut = (legal.privacy as Record<LangueLegale, Record<string, string>>)[langue][cle];
  if (brut === undefined) throw new Error(`Clé de Politique absente du généré : ${cle}`);
  return interpoler(brut, langue, cle);
}

/** Bandeau des pages légales EN : la version française fait foi. */
export const NOTICE_EN = legal.enNotice;
