# Cloudflare — ce qui a été mesuré, et pourquoi on n'a pas migré

> **Décision d'Eric, 2026-08-03, en fin de journée** : le site marketing reste
> hébergé chez **Vercel**. Cloudflare passe **devant**, en proxy, pour le WAF,
> le cache et l'analytique. Aucun changement d'hébergeur.
>
> Cette décision annule celle du matin (« option (b) — Cloudflare remplace
> Vercel »). Ce document existe pour qu'on ne refasse pas le chemin.

## Le fait qui a tout tranché

**Le plan Workers gratuit coupe une requête à 10 millisecondes de temps
processeur.** Un rendu serveur Next en consomme couramment vingt à cent.

Ce n'est pas un réglage : c'est un plafond. Le seul moyen de le lever est le
plan payant, à 5 USD par mois **au niveau du compte entier**.

### Ce que ça donnait, mesuré sur un vrai Worker déployé

```
  actif statique (binding ASSETS) ..... 200 en 0,07 s
  robots.txt (prérendu) ............... 200
  toute route qui EXÉCUTE du code ..... aucune réponse, délai de 25 s
  le MÊME code, runtime workerd LOCAL . 200 partout
```

La dégradation était progressive, et c'est ce qui rend le piège vicieux : les
135 contrôles de routage sont **passés** dix minutes après le déploiement, puis
tout s'est éteint. Cloudflare tolère un dépassement occasionnel ; il cesse de le
faire quand il devient systématique.

**Une validation trop courte aurait conclu que ça marchait.**

## Ce que j'avais mesuré avant, et qui répondait à la mauvaise question

| Mesure | Verdict |
| ------ | ------- |
| Taille du Worker compressé | **2 436 KiB sur 3 072** — 21 % de marge, ça tenait |
| Taille du plus gros actif | 5,17 Mio sur 25 permis — ça tenait |
| Nombre de fichiers | 119 sur 20 000 — ça tenait |
| **Temps processeur** | **10 ms — ça ne tenait pas** |

La taille était la contrainte évidente, celle qu'on pense à vérifier. Le temps
processeur était la vraie, et elle ne se voit qu'en exécutant. Je ne l'ai
découverte qu'en déployant — après avoir annoncé « on atterrit sur le plan
gratuit », ce qui était vrai et hors sujet.

## L'arbitrage, tel qu'il se pose

```
CE QUE « TOUT CHEZ CLOUDFLARE » APPORTERAIT
  un fournisseur de moins — une facture, un tableau de bord
  cohérence avec les 3 autres sites déjà sur Cloudflare Pages
  moins de dépendance envers Vercel, qui édite Next

CE QUE ÇA COÛTERAIT
  5 USD/mois
  un adaptateur (OpenNext) entre Next et Cloudflare : une couche de plus,
  qui suit les versions de Next avec un décalage — on est sur Next 16,
  récent. Symptôme vécu : marche en local, tombe une fois déployé.

CE QUE « CLOUDFLARE DEVANT VERCEL » DONNE DÉJÀ
  WAF, protection DDoS, plafonnement de débit
  règles de cache au bord
  analytique et journaux
  la même posture de sécurité que app.iqwine.ai
  coût zéro · une heure · réversible en décochant le nuage orange
```

À 549 visiteurs quotidiens, le site n'approche aucune limite de Vercel. La
quasi-totalité du bénéfice attendu s'obtient **sans déménager**.

## Ce que la journée a livré, et qui ne dépendait pas de Cloudflare

Tout ceci est **en production sur Vercel**, vérifié en ligne :

- les slugs anglais (`/en/pricing`, `/en/our-story`, …) et neuf redirections
  permanentes depuis les anciennes adresses, en un saut ;
- `x-default` qui déclarait une négociation de langue **qui n'avait pas lieu** ;
- `og:url`, **absent de toutes les pages** — Next ne le déduit pas du canonical ;
- 7 800 Ko d'images devenus **304 Ko** en AVIF, sans différence perceptible ;
- trois adresses de l'ancien domaine oubliées dans le code ;
- le vérificateur de routage passé de 62 à **135 contrôles**.

L'empaquetage Workers, lui, a été retiré : adaptateur, `wrangler.jsonc`,
`open-next.config.ts`, garde de taille. Le reste — `sharp`, la génération
d'images, `unoptimized: true` — **reste**, parce qu'il vaut indépendamment de
l'hébergeur.

## Si la question se rouvre un jour

Les deux conditions qui la rendraient raisonnable :

1. **le trafic ou la facture Vercel deviennent significatifs** — le plan payant
   Cloudflare à 5 USD serait alors une économie, pas une dépense ;
2. **le site redevient purement statique** — plus de middleware de négociation
   de langue, plus de routes serveur. Cloudflare Pages le sert alors
   gratuitement, comme il sert déjà `iqforge-web-learn`, migré depuis Vercel le
   2026-07-01 en export statique.

Aujourd'hui, ni l'une ni l'autre.

## 2026-11-07 : la question est rouverte, et la condition 2 est remplie

**Pourquoi rouvrir.** Les règles de Vercel réservent Hobby à un usage
« non commercial et personnel » ; tout usage commercial exige Pro (20 $ US par
mois), qu'Éric refuse. iQWine vend des abonnements : Hobby ne convient pas.

**Ce qui a changé depuis août.** Toutes les pages sont prérendues. La tentative
d'août faisait tourner le serveur Next entier dans le Worker (OpenNext). Cette
fois, le site est un **export statique** servi comme fichiers, sans exécuter de
code. Le Worker ne fait plus que ce que faisait le middleware, en une fraction de
milliseconde :

| Requête | Qui répond |
| --- | --- |
| page, image, `robots.txt`, `sitemap.xml`, `llms.txt` | fichier statique, **sans** Worker |
| ancien slug anglais, `/recevoir`, `/recherche` | `_redirects` (308), **sans** Worker |
| `/`, `/tarifs`, `/octave` (sans langue) | Worker : logique de `src/middleware.ts` |
| `POST /api/contact` | Worker : `lib/relais-contact` (partagé avec Vercel) |
| `/<clé>.txt` | Worker : clé IndexNow (publique) |
| le reste | page 404, statut 404 |

**Vérifié en local (`wrangler dev`)** :
- `verifier-routage.mjs` : 210/210, comme le build Vercel ;
- en-têtes de sécurité, types (`image/png` pour les images de partage, `text/markdown` pour `llms.txt`), page 404 et clé IndexNow identiques ;
- `<head>`, canonical, hreflang et liens identiques à la production.

Un seul écart : une barre oblique finale (`/fr/tarifs/`) reçoit un 307 du service de fichiers, au lieu d'un 308. Une règle de redirection de zone à 308 le corrige au moment de la bascule.

**Fichiers.**
- `scripts/construire-cloudflare.mjs` (`npm run build:cloudflare`) ;
- `cloudflare/worker.ts`, `wrangler.jsonc` ;
- `src/lib/regles-de-bord.ts` : CSP et redirections, une seule source pour les deux hébergements ;
- `src/lib/relais-contact.ts` ;
- `.env.production` : clé Turnstile **publique** seulement.

Le build Vercel est inchangé (210/210, chaîne qualité verte).

**Coût** : 0 $. Plan Workers gratuit : fichiers statiques illimités, 100 000 appels de Worker par jour, et le Worker n'est appelé que pour les cas ci-dessus.

### Bascule et retour arrière

1. Workers Builds (Git), dépôt `iqwine-web` :
   - branche de production `production` ;
   - construction : `npm run build:cloudflare` ;
   - déploiement : `npm run deploy:cloudflare` (wrangler, puis IndexNow ; un échec d'IndexNow rend la construction rouge sans toucher au site déjà déployé) ;
   - les autres branches donnent des préversions.
2. Secret du Worker `TURNSTILE_SECRET_KEY`. Sans lui, le Worker **refuse** le formulaire (503) plutôt que de l'ouvrir aux robots.
3. Route du Worker `iqwine.ai/*`, avec l'enregistrement DNS actuel inchangé, puis règle de redirection de zone pour la barre oblique finale.
4. Contrôle : `verifier-routage.mjs https://iqwine.ai`, en-têtes, formulaire.
5. **Retour arrière** (procédure de bascule, caduque : Vercel est supprimé depuis le 2026-11-08) : supprimer la route rendait la main à Vercel. Retour arrière en vigueur : voir « Autonomie vis-à-vis de Vercel ».

### État réel au 2026-11-07 (après-midi)

- **Worker `iqwine-web` créé** par Workers Builds, sur la liaison GitHub déjà existante du compte : aucune nouvelle autorisation GitHub.
  - Branche de production : `hebergement/cloudflare`. Construction : `pnpm run build:cloudflare`. Déploiement : `npx wrangler deploy`. Préversions de branches désactivées.
  - Jeton de construction créé par Cloudflare (« iqwine-web build token ») : il reste chez Cloudflare.
- **Secret `TURNSTILE_SECRET_KEY` posé** sur le Worker par l'API Cloudflare, depuis le widget existant `iqwine-site-public` (domaine `iqwine.ai`, le même que sur Vercel). La valeur n'a jamais transité par le terminal, un journal ou la conversation. Contrôle : un jeton invalide reçoit 403 « Vérification anti-robot échouée », comme sur Vercel. Parcours valide prouvé le 2026-11-07 : essai contrôlé « ESSAI TECHNIQUE DATA » (adresse `support@iqwine.ca`, message marqué « à ignorer »), case cochée par Éric, réponse « Merci, message reçu. » sur `iqwine.ai/fr/contact` servi par le Worker.
- **Validation sur `iqwine-web.eric-fe8.workers.dev`** :
  - `verifier-routage.mjs` : 210/210, comme `https://iqwine.ai` ;
  - les 38 URL du sitemap : même statut, titre, H1, meta, canonical, hreflang, JSON-LD et en-têtes de sécurité. Seul écart : l'empreinte `?…` des URL d'image de partage ;
  - barre oblique finale : 308 dans le Worker, comme Vercel (`run_worker_first: ["/*", "!/_next/*"]` : le Worker passe avant les fichiers, sauf `/_next`). Aucune règle de zone n'est donc nécessaire. Formulaire : 403 sur jeton invalide, le secret est bien lu.
- **Budget** : 0 $ (Workers Free ; les fichiers statiques ne comptent pas comme requêtes du Worker ; Workers Builds dans le quota gratuit).
- **Constat hors migration** : Cloudflare Web Analytics est en installation automatique sur toute la zone `iqwine.ai` depuis le 2026-07-05 (balise injectée dans le HTML servi aux navigateurs, `app.` et staging compris). Cela contredit « collecte éteinte » ; à arbitrer par Éric, rien n'a été changé.

### Bascule faite le 2026-11-07

- **Route `iqwine.ai/*`** vers le Worker `iqwine-web`, mode **fail open** : si le Worker échoue ou dépasse ses limites, la requête passe à l'origine Vercel, toujours en place. DNS inchangé ; `app.`, `staging.` et `www.` ne passent pas par le Worker.
- Contrôlé sur `https://iqwine.ai` juste après : plus d'en-tête `x-vercel-id`, `verifier-routage.mjs` 210/210, les 38 URL du sitemap en 200 avec leur canonical, formulaire armé (403 sur jeton invalide), GPTBot, ClaudeBot et CCBot toujours en 403.
- `workers_dev` et `preview_urls` refermés.
- **Déploiement désormais** : `git push origin main:production`, comme avant. Workers Builds construit la branche `production` (`pnpm run build:cloudflare`) puis lance `pnpm run deploy:cloudflare` : wrangler, puis IndexNow sur les URL canoniques. Un échec d'IndexNow rend le build rouge sans toucher au site déjà déployé. Vercel construit la même branche et reste l'origine de secours.
- **Retour arrière** : supprimer la route ne rend plus la main à personne (Vercel supprimé le 2026-11-08) ; revenir à une version Cloudflare précédente, voir « Autonomie vis-à-vis de Vercel ».
- **Point de fragilité connu** : `next/font/google` télécharge les polices à chaque build ; le téléchargement a échoué 3 fois le 2026-11-07 (Vercel, Cloudflare, local), chaque fois réussi en relançant. Un build raté ne déploie rien. Correctif possible : héberger les deux polices dans le dépôt (`next/font/local`).

### Autonomie vis-à-vis de Vercel (2026-11-07, fin de journée)

- **Fail open, vérifié** : selon la documentation Cloudflare (« Workers limits », section *Daily requests*) et le champ d'API `request_limit_fail_open`, ce mode ne couvre **que** le dépassement du quota gratuit de 100 000 requêtes par jour (erreur 1027). Il ne couvre ni une exception du Worker (1101) ni un dépassement de temps processeur (1102). La phrase « si le Worker échoue, Vercel prend le relais » écrite plus haut était donc fausse.
- **Route passée en fail closed** : Vercel ne reçoit plus aucune requête de `iqwine.ai`. Un dépassement de quota donnerait l'erreur 1027 au lieu de la page servie par Vercel ; à notre trafic, ce quota est très loin.
- **Redirections reprises par Cloudflare** (règles de redirection, forfait gratuit), à la place de Vercel :
  - `www.iqwine.ai` vers `https://iqwine.ai` + chemin, 308, requête conservée ;
  - `http://iqwine.ai` vers `https://`, 308. Lacune trouvée au passage : depuis la bascule, le Worker répondait 200 en `http`.
  - Zone `iqwine.ca` : règle `iqwine.ca` et `www.iqwine.ca` vers `https://iqwine.ai` + chemin, 308, active depuis le 2026-11-07 : les deux enregistrements sont passés en « Proxied » (geste fait par DATA dans le tableau de bord, sur autorisation explicite d'Éric). Vérifié : 308 vers `iqwine.ai` avec chemin et requête conservés, en http comme en https, `server: cloudflare`, sans `x-vercel-id`.
- **Vercel retiré le 2026-11-08**, à la demande d'Éric : projet `iqwine-web` supprimé, domaines `iqwine.ai` et `iqwine.ca` retirés de l'équipe Vercel (le projet `iqforge-web` et ses domaines n'ont pas été touchés). Vérifié juste après : 7 adresses (apex, `www`, `http`, `iqwine.ca`, `www.iqwine.ca`) servies ou redirigées par Cloudflare, routage 210/210, 38/38 URL du sitemap en 200 avec la bonne canonique.
- **Retour arrière en vigueur : une version Cloudflare précédente**, plus jamais Vercel. Workers & Pages › `iqwine-web` › Deployments liste chaque version publiée (le 2026-11-08 : `f4d6a8d2` active, `deb0d89a` juste avant, puis les versions du 7 novembre) ; « Rollback » sur une version la remet à 100 % du trafic, code et fichiers statiques compris, sans rebuild. Équivalent en ligne de commande : `npx wrangler@4 rollback <version>` (jeton API requis). Un push suivant sur `production` redéploie par-dessus : corriger ensuite dans `main` et republier. Les règles de redirection et le DNS ne font pas partie d'une version : ils se corrigent dans la zone.
- **DNS sans origine (2026-11-08)** : les trois enregistrements qui visaient Vercel sont remplacés par des cibles « sans origine », proxifiées, la configuration que Cloudflare documente quand un Worker ou une règle de redirection répond à tout :
  - `iqwine.ai` : CNAME vers Vercel → `AAAA 100::` (servi par la route du Worker `iqwine.ai/*`, fail closed) ;
  - `www.iqwine.ca` : CNAME vers Vercel → `AAAA 100::` (règle de redirection vers `iqwine.ai`) ;
  - `iqwine.ca` : `A 216.198.79.1` (Vercel) → `A 192.0.2.1` (règle de redirection vers `iqwine.ai`) ;
  - `www.iqwine.ai` reste `CNAME iqwine.ai`, proxifié (règle de redirection vers l'apex).
  Proxifiés, ces enregistrements publient les adresses de Cloudflare ; `100::` et `192.0.2.1` ne sont que des origines nominales, jamais contactées.
- **Sans interruption, et pourquoi c'était la seule façon acceptable** : changer le type d'un enregistrement (CNAME → AAAA) le supprime et le recrée. Fait en deux gestes, le nom resterait un instant sans A ni AAAA ; un résolveur qui interrogerait à cet instant garderait cette absence en cache jusqu'à 1 800 s (RFC 2308 : le minimum du SOA de la zone, `1800`, relevé par `dig SOA iqwine.ai`). Le tableau de bord fait ce remplacement en **un seul** appel `POST …/dns_records/batch`, que Cloudflare exécute en une transaction (vérifié dans les requêtes réseau du navigateur) ; le A de `iqwine.ca` n'a changé que de contenu (`PATCH`). Preuve : une sonde a interrogé le serveur faisant autorité (`marek.ns.cloudflare.com`) et le site toutes les 2 s, de 16:15:36 à 16:21:58 UTC (150 passages couvrant les trois changements) : 0 réponse vide, 0 erreur (200 sur l'apex, 308 sur `iqwine.ca` et `www.iqwine.ca` à chaque passage). Ensuite : routage 210/210, redirections `www`, `http`, `iqwine.ca` et `www.iqwine.ca` en 308, clé IndexNow 200 ; `app.`, `mos.`, `staging.` et `app.iqwine.ca` non touchés.
- **Migration close le 2026-11-08.** Aucune dépendance à Vercel. Le suivi d'indexation Google est un chantier distinct (validation lancée le 2026-11-08 pour les 14 doublons ; accueil neutre conservé par décision d'Éric).
- **Polices** : hébergées dans le dépôt depuis `fdf66b0` (`public/polices/`, licences OFL jointes). Le build ne télécharge plus rien chez Google.
- **IndexNow, réponse réelle lue dans les journaux de build** : 2026-11-07 14:14 UTC et 14:54 UTC, « → 38 URL pour iqwine.ai », puis « ✓ IndexNow : 200 — accepté ».

