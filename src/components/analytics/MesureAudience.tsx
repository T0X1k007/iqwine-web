import { CF_BEACON_SRC, jetonCloudflareAnalytics } from '@/lib/mesure';

/**
 * Balise Cloudflare Web Analytics, installation manuelle (audit 2026-11-06,
 * M-01). Rendue SEULEMENT si `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN` est posé au
 * build avec un jeton valide ; sinon ce composant ne rend rien, et
 * `next.config.ts` n'ajoute aucune origine à la CSP (même interrupteur, lu par
 * `ajoutsCspMesure`).
 *
 * Installation manuelle plutôt qu'automatique : la balise est versionnée,
 * vérifiable en local, et ne dépend pas d'une injection en bordure que l'on
 * ne voit pas dans le dépôt. Le jour de l'allumage, l'injection automatique
 * doit être désactivée pour iqwine.ai dans la console Cloudflare, sinon la
 * page serait comptée deux fois.
 */
export default function MesureAudience() {
  const jeton = jetonCloudflareAnalytics();
  if (!jeton) return null;
  return (
    <script
      defer
      src={CF_BEACON_SRC}
      data-cf-beacon={JSON.stringify({ token: jeton })}
    />
  );
}
