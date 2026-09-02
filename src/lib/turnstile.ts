/**
 * CLOUDFLARE TURNSTILE — la preuve d'humanité du formulaire public.
 *
 * ── Pourquoi il manquait, et ce qu'il ferme ───────────────────────────────
 * `/api/contact` avait trois gardes, et aucune ne coûte quoi que ce soit à un
 * robot qui parle HTTP directement :
 *
 *   · le pot de miel (`website`) — un champ caché qu'un script qui poste du
 *     JSON ne remplit jamais, donc ne déclenche jamais ;
 *   · le plafond mémoire de 5/heure par IP — la route dit elle-même qu'il se
 *     réinitialise à chaque instance Vercel : un ralentisseur, pas une porte ;
 *   · le plafond Redis de l'application, en aval — le seul vrai, mais il
 *     compte par IP, et un parc d'adresses le contourne par construction.
 *
 * Aucune ne demande au demandeur de PROUVER qu'il est humain. Turnstile le
 * fait, sans énigme à résoudre dans le cas normal.
 *
 * ── Fail-open tant qu'aucun secret n'est posé ─────────────────────────────
 * L'application, elle, est fail-CLOSED en production (`lib/auth/turnstile.ts`),
 * et elle a raison : sans clé, son formulaire d'inscription enverrait des
 * courriels à des inconnus. Ici le choix est INVERSE, et délibéré : ce module
 * arrive sur un formulaire DÉJÀ en ligne. Refuser sans secret configuré
 * casserait la page de contact à la seconde du déploiement, avant qu'aucune
 * clé n'existe. Tant que `TURNSTILE_SECRET_KEY` est absente, on se comporte
 * exactement comme avant.
 *
 * Le prix de ce choix est le mode de panne que l'application documente : une
 * variable jamais posée = une protection SILENCIEUSEMENT morte. D'où le
 * journal d'avertissement à chaque requête non protégée en production, pour
 * que l'absence se voie dans les journaux Vercel au lieu de se deviner.
 *
 * Une fois les deux variables posées, la garde devient stricte : plus de
 * jeton valide, plus d'envoi.
 *
 * Doc : https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const VERIFY_TIMEOUT_MS = 4000;

/**
 * La clé PUBLIQUE du widget, figée au BUILD — et c'est le bon choix ICI.
 *
 * ── Pourquoi pas une lecture au runtime, comme dans l'application ─────────
 * `lib/config/turnstile.ts` de `cellier-vin` lit sa clé au runtime, et son
 * commentaire explique pourquoi : là-bas l'artefact est construit UNE fois
 * puis exécuté par le staging ET par la production. Une clé figée y ferait
 * hériter le staging de la clé de production, le widget ne se résoudrait pas
 * sur un hôte non déclaré chez Cloudflare, et le bouton resterait gris.
 *
 * Ce site n'a pas cette contrainte : Vercel RECONSTRUIT pour chaque
 * environnement, et la promotion en production reconstruit avec les variables
 * de Production. Chaque artefact porte donc déjà la clé de son propre hôte.
 *
 * Et une lecture au runtime serait ici pire qu'inutile : `/contact` et `/beta`
 * sont pré-rendues statiquement. Une variable non préfixée y serait lue au
 * moment du build de toute façon, mais SANS être inlinée dans le bundle — la
 * page partirait sans widget, silencieusement. C'est exactement la panne
 * observée en vérifiant ce module : garde armée côté serveur, aucun widget
 * côté page, donc un formulaire impossible à soumettre.
 *
 * D'où le préfixe `NEXT_PUBLIC_`, qui garantit l'inlining. La clé est publique
 * par nature — elle part dans le HTML —, le préfixe ne divulgue rien.
 */
export function turnstileSiteKey(): string {
  return (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '').trim();
}

/** Vrai quand le secret est posé : c'est ce qui ARME la garde côté serveur. */
export function turnstileArme(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}

interface ReponseSiteverify {
  success: boolean;
  'error-codes'?: string[];
  hostname?: string;
}

/**
 * Vérifie un jeton auprès de Cloudflare.
 *
 * @returns `true` si la requête peut passer — soit le jeton est valide, soit
 *          la garde n'est pas armée (aucun secret configuré).
 */
export async function verifierTurnstile(
  token: string | null | undefined,
  ip?: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[turnstile] TURNSTILE_SECRET_KEY absente — le formulaire de contact accepte sans preuve d’humanité',
      );
    }
    return true;
  }
  if (!token) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
  try {
    const form = new URLSearchParams();
    form.append('secret', secret);
    form.append('response', token);
    if (ip && ip !== 'unknown') form.append('remoteip', ip);

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error('[turnstile] siteverify a répondu', res.status);
      return false;
    }
    const data = (await res.json()) as ReponseSiteverify;
    if (!data.success) {
      console.warn('[turnstile] jeton refusé', { codes: data['error-codes'] });
    }
    return data.success === true;
  } catch (err) {
    // Cloudflare injoignable ou trop lent. On REFUSE : la garde est armée,
    // donc quelqu'un a décidé que ce formulaire devait être protégé. Laisser
    // passer sur panne réseau offrirait exactement la fenêtre qu'un robot
    // cherche, et l'échec est visible côté demandeur, donc réparable.
    console.error('[turnstile] vérification impossible', {
      erreur: err instanceof Error ? err.message : String(err),
    });
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
