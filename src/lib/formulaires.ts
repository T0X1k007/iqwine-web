/**
 * LES PORTES D'ENTRÉE DES FORMULAIRES PUBLICS, et l'adresse qu'elles inscrivent
 * sur la demande.
 *
 * ── Pourquoi une table et non un champ libre ──────────────────────────────
 * `/api/contact` transmet un `sourceUrl` à l'application, qui le persiste sur
 * le `ContactRequest` et l'affiche dans le Super Admin (« Depuis : … »). Ce
 * champ était jusqu'ici une constante écrite dans la route, `iqwine.ai/contact`,
 * parce qu'il n'existait qu'un formulaire. Il en existe deux depuis la page
 * Support, et l'administration doit pouvoir dire par quelle porte la demande
 * est entrée.
 *
 * Accepter la valeur telle qu'envoyée par le client aurait été le raccourci.
 * C'est un champ que quelqu'un lit ensuite dans une console d'administration :
 * un visiteur anonyme n'a aucune raison de pouvoir y écrire ce qu'il veut. Le
 * client envoie donc un MOT de cette table, et le serveur en dérive l'adresse.
 * Un mot inconnu retombe sur `contact`, jamais sur la valeur reçue.
 *
 * ── Ce que ce n'est PAS ───────────────────────────────────────────────────
 * Ce n'est pas la provenance au sens de l'application : celle-là est
 * `ContactSource` (`SITE` / `APP`) dans `cellier-vin`, et elle reste la
 * distinction structurante. Cette table-ci affine une seule de ces deux
 * valeurs, `SITE`, sans en inventer une troisième.
 */

/** Une porte → l'adresse inscrite sur la demande. */
export const PAGES_FORMULAIRE = {
  contact: 'iqwine.ai/contact',
  support: 'iqwine.ai/support',
} as const;

export type PageFormulaire = keyof typeof PAGES_FORMULAIRE;

/** La porte par défaut : celle qui existait seule avant la page Support. */
export const PAGE_FORMULAIRE_DEFAUT: PageFormulaire = 'contact';

/** Vrai si la valeur reçue est une porte connue. Rien d'autre n'est accepté. */
export function estPageFormulaire(valeur: unknown): valeur is PageFormulaire {
  return typeof valeur === 'string' && valeur in PAGES_FORMULAIRE;
}

/** L'adresse à inscrire sur la demande, pour une porte donnée. */
export function sourceUrlDeLaPage(valeur: unknown): string {
  return PAGES_FORMULAIRE[estPageFormulaire(valeur) ? valeur : PAGE_FORMULAIRE_DEFAUT];
}
