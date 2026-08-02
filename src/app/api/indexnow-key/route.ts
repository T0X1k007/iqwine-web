/**
 * IndexNow — le fichier de clé, servi seulement s'il y a une clé (MFP-09 lot C).
 *
 * ── Ce que fait IndexNow, et ce qu'il ne fait pas ─────────────────────────
 * Il PRÉVIENT Bing (et Yandex, Seznam) qu'une URL a changé, au lieu d'attendre
 * un passage de robot. Il n'améliore pas un classement : il raccourcit le délai
 * entre « publié » et « connu ». Pour un site qui change peu, le bénéfice est
 * modeste — c'est pour cela qu'il est ici et non au centre du dispositif.
 *
 * ── Pourquoi la clé vient de l'environnement ──────────────────────────────
 * Elle est PUBLIQUE par conception : le protocole exige qu'elle soit servie en
 * clair, c'est ainsi qu'on prouve qu'on contrôle le domaine. Mais elle n'est
 * pas pour autant arbitraire — la générer ici, en douce, laisserait dans le
 * dépôt un artefact que personne n'aurait décidé et dont personne ne saurait
 * s'il est encore le bon. Eric la pose, ou elle n'existe pas.
 *
 * Sans `INDEXNOW_KEY`, la route répond 404 : un fichier de clé vide ferait
 * échouer la vérification en donnant l'impression du contraire.
 */

export const dynamic = 'force-dynamic';

export function GET(request: Request): Response {
  const key = process.env.INDEXNOW_KEY;
  if (!key || key.length < 8) {
    return new Response('IndexNow non configuré', { status: 404 });
  }

  // ── LA CLÉ N'EST SERVIE QU'À SON PROPRE NOM DE FICHIER ──────────────────
  //
  // La réécriture (`next.config.ts`) mappe `/<quelquechose>.txt` ici. Sans ce
  // contrôle, `/nimportequoi.txt` révélerait la clé — et le protocole repose
  // entièrement sur le fait que seul le propriétaire du domaine sait à QUELLE
  // adresse elle se trouve.
  //
  // Le paramètre est absent quand la route est appelée en direct
  // (`/api/indexnow-key`) : on tolère ce chemin, il ne sert qu'au diagnostic
  // et n'expose rien de plus que la réécriture correcte.
  const demandee = new URL(request.url).searchParams.get('k');
  if (demandee !== null && demandee !== key) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(key, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      // La clé doit rester stable et lisible par le moteur ; un cache long est
      // souhaitable, et sans risque puisqu'elle est publique.
      'cache-control': 'public, max-age=86400',
    },
  });
}
