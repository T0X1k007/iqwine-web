# Runbook — bascule du site marketing vers Cloudflare Workers

> Décision d'Eric, 2026-08-03 : **option (b)**, Cloudflare remplace Vercel comme
> hébergeur du site marketing. L'hébergement de l'application iQWine n'est PAS
> concerné.

## Ce que la compatibilité dit — vérifié, pas supposé

| Point | Verdict |
| ----- | ------- |
| `@opennextjs/cloudflare` × Next 16 | ✅ « All minor and patch versions of Next.js 16 … are supported » |
| Middleware | ✅ le nôtre n'a aucun `runtime` déclaré → Edge. (Le Node Middleware de 15.2+ n'est PAS supporté) |
| Route handlers (3) | ✅ aucune API Node |
| `node:fs` / `node:path` | ✅ **éliminés du dépôt** le 2026-08-03 (polices Open Graph embarquées) |
| ISR | ✅ supporté — non utilisé ici, tout est statique |
| Optimisation d'images | ⚠️ exige **Cloudflare Images**, produit facturé → voir ci-dessous |

## La décision sur les images

Quatre images passent par l'optimiseur :

```
  /logo-iqwine.png                      45 Ko
  /screenshots/04-carnet.png           240 Ko
  /screenshots/06-recherche-hors-cave  171 Ko
  /screenshots/08-cellier-desktop.png 1091 Ko   ← celle qui compte
```

**Pré-optimiser à la source** plutôt que d'activer Cloudflare Images : quatre
images connues à la construction ne justifient pas un produit facturé à
l'exécution. Converties une fois en AVIF/WebP aux tailles réellement affichées,
elles sont servies telles quelles — sans coût, et sans la pénalité que le
premier visiteur paie sur une optimisation à la volée.

`unoptimized: true` seul est écarté : servir le PNG de 1091 Ko brut ferait
régresser les Core Web Vitals, ce que la condition d'Eric interdit.

## Ordre d'exécution — rien n'est irréversible avant l'étape 6

1. **Préparer** — `@opennextjs/cloudflare`, `wrangler.jsonc`, images
   pré-optimisées, variables d'environnement recréées dans Cloudflare.
2. **Déployer sur l'URL `*.workers.dev`** — pas de DNS, pas de visiteur. Le site
   tourne côte à côte avec Vercel, qui continue de servir `iqwine.ai`.
3. **Rejouer le vérificateur contre cette URL** :
   `node scripts/verifier-routage.mjs https://<projet>.workers.dev`
   Les onze contrôles doivent passer : routes, redirections, `hreflang`,
   canonical, `og:url`, sitemap, slugs anglais, négociation de langue.
4. **Vérifier à la main ce que le vérificateur ne voit pas** : l'image Open
   Graph rend-elle avec les bonnes polices ; le formulaire de contact aboutit-il
   jusqu'à l'application ; `llms.txt`, `robots.txt` et la clé IndexNow
   sont-ils servis.
5. **Comparer AVANT/APRÈS** — mêmes pages, mêmes conditions : poids, temps de
   réponse, Core Web Vitals. Une migration justifiée par la performance qui ne
   la mesure pas ne prouve rien.
6. **PROUVER LE RETOUR ARRIÈRE AVANT D'EN AVOIR BESOIN.** Le projet Vercel reste
   en place, non supprimé, avec son domaine de secours actif. On vérifie qu'il
   sert encore le site, puis on note l'unique geste qui ramène tout : remettre
   l'enregistrement DNS sur Vercel. Tant que cette preuve n'est pas faite, on ne
   touche pas au DNS.
7. **Bascule DNS** — avec Eric, dans Chrome, étape par étape. C'est le premier
   geste visible par un visiteur.
8. **Surveiller immédiatement** — erreurs, performance, indexation. Puis
   soumettre le sitemap et IndexNow.

## Les pièges connus de ce compte Cloudflare

**Le `robots.txt` géré.** Sur ce compte, la fonction « Managed robots.txt » a
déjà annulé une directive posée par l'application (incident documenté :
`app.iqwine.ca` restait indexable malgré un `Disallow`). Après la bascule, il
faut **lire le fichier réellement servi**, pas vérifier une case.

**Le contrôle des crawlers IA.** Même famille : il peut injecter des règles que
le dépôt ne connaît pas. Le site marketing DOIT rester indexable — c'est
l'inverse exact de la politique de l'application.

**Un en-tête a UN producteur.** Aujourd'hui `next.config.ts` pose les en-têtes
de sécurité et la CSP. Sur Cloudflare, la plateforme peut en poser aussi. Le
risque n'est pas qu'il en manque — c'est qu'il y en ait deux qui se
contredisent, et que personne ne sache lequel gagne.

## Variables d'environnement à recréer

Une migration de plateforme les recrée toutes à la main. C'est là que les replis
mentent : celui de `llms.txt` pointait encore sur l'ancien domaine, masqué tant
que la variable était posée — corrigé le 2026-08-03 pour cette raison précise.

```
  INDEXNOW_KEY               secret
  IQWINE_APP_URL
  NEXT_PUBLIC_APP_LOGIN_URL
  NEXT_PUBLIC_APP_SIGNUP_URL
  NEXT_PUBLIC_GA_ID
  NEXT_PUBLIC_SITE_URL       origine canonique — canonical, hreflang, sitemap
  REDIRECT_ORIGIN
```

## Le critère de succès

Le plan le dit sans détour : ce chantier **ne livre aucune valeur utilisateur**,
et c'est ce qui le rend dangereux — il n'a pas de bénéfice visible à opposer à
ses régressions. **Son seul critère de succès est l'absence de différence.**

Si un visiteur peut faire la différence, la migration a échoué.
