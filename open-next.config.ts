import { defineCloudflareConfig } from '@opennextjs/cloudflare';

/**
 * Configuration OpenNext pour Cloudflare Workers — délibérément MINIMALE.
 *
 * ── Pourquoi aucun cache incrémental n'est déclaré ────────────────────────
 * L'adaptateur permet de brancher KV ou R2 pour l'ISR. Ce site n'en a pas
 * besoin : toutes ses pages sont prérendues à la construction
 * (`generateStaticParams` sur la langue), et la seule route dynamique est
 * `/api/indexnow-key`, qui ne doit JAMAIS être mise en cache.
 *
 * Déclarer un cache dont on n'a pas l'usage ajouterait une ressource à créer,
 * à surveiller et à payer, pour ne rien accélérer.
 */
export default defineCloudflareConfig();
