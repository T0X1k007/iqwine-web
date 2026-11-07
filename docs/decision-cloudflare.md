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
5. **Retour arrière** : supprimer la route. Vercel reprend aussitôt la main, son déploiement n'est pas touché. Le projet Vercel n'est supprimé qu'après validation.

### État réel au 2026-11-07 (après-midi)

- **Worker `iqwine-web` créé** par Workers Builds, sur la liaison GitHub déjà existante du compte : aucune nouvelle autorisation GitHub.
  - Branche de production : `hebergement/cloudflare`. Construction : `pnpm run build:cloudflare`. Déploiement : `npx wrangler deploy`. Préversions de branches désactivées.
  - Jeton de construction créé par Cloudflare (« iqwine-web build token ») : il reste chez Cloudflare.
- **Secret `TURNSTILE_SECRET_KEY` posé** sur le Worker par l'API Cloudflare, depuis le widget existant `iqwine-site-public` (domaine `iqwine.ai`, le même que sur Vercel). La valeur n'a jamais transité par le terminal, un journal ou la conversation. Contrôle : un jeton invalide reçoit 403 « Vérification anti-robot échouée », comme sur Vercel.
- **Validation sur `iqwine-web.eric-fe8.workers.dev`** :
  - `verifier-routage.mjs` : 210/210, comme `https://iqwine.ai` ;
  - les 38 URL du sitemap : même statut, titre, H1, meta, canonical, hreflang, JSON-LD et en-têtes de sécurité. Seul écart : l'empreinte `?…` des URL d'image de partage ;
  - barre oblique finale : 308 dans le Worker, comme Vercel (`run_worker_first: ["/*", "!/_next/*"]` : le Worker passe avant les fichiers, sauf `/_next`). Aucune règle de zone n'est donc nécessaire. Formulaire : 403 sur jeton invalide, le secret est bien lu.
- **Budget** : 0 $ (Workers Free ; les fichiers statiques ne comptent pas comme requêtes du Worker ; Workers Builds dans le quota gratuit).
- **Constat hors migration** : Cloudflare Web Analytics est en installation automatique sur toute la zone `iqwine.ai` depuis le 2026-07-05 (balise injectée dans le HTML servi aux navigateurs, `app.` et staging compris). Cela contredit « collecte éteinte » ; à arbitrer par Éric, rien n'a été changé.

**Reste pour basculer** : la route `iqwine.ai/*` vers le Worker (geste d'Éric : les modifications de zone en production sont refusées par le filtre de sécurité de la session de DATA). Après la bascule : `workers_dev: false` sur la branche, déploiement `pnpm run deploy:cloudflare` (IndexNow après chaque déploiement réussi), contrôle complet sur `https://iqwine.ai`.

