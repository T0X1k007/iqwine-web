# MFP-15 lot A — audit de compatibilité Cloudflare

> **Périmètre**, fixé par Eric (directive v3) : le **site marketing seul**.
> Ni l'application, ni la base, ni Stripe. La section MFP-15 du plan décrit une
> migration d'infrastructure bien plus large, positionnée après le GO LIVE ;
> ce document ne traite que ce qui rentre dans le périmètre pré-lancement.

## L'état de départ, mesuré

| Point | Constat (2026-08-03) |
| ----- | -------------------- |
| Hébergeur du site | **Vercel**, sans Cloudflare devant (`server: Vercel`, `x-vercel-cache: HIT`, aucun `cf-ray`) |
| Hébergeur de l'application | Cloudflare → OVH (`server: cloudflare`, `cf-ray` présent) |
| Version de Next | 16.2.3 |
| Route handlers | **3** — `llms.txt`, `api/contact`, `api/indexnow-key` |
| Middleware | **1** — négociation de langue, aucune dépendance lourde |
| Server Actions | **0** |
| Rendu | statique, sauf `api/indexnow-key` (`force-dynamic`) |

Le site est petit et sa surface serveur l'est encore plus. C'est ce qui rend
cette migration envisageable dans un délai pré-lancement, là où l'application —
Server Actions, Prisma, BullMQ, SSE — ne le serait pas.

## La seule incompatibilité réelle : les polices de l'image Open Graph

`src/app/[locale]/opengraph-image.tsx` lit trois fichiers WOFF sur le disque :

```ts
const FONT_DIR = join(process.cwd(), 'src/app/_og-fonts');
const FONTS = [{ name: DISPLAY, data: readFileSync(join(FONT_DIR, 'cormorant-600.woff')), … }];
```

**Ce n'est pas un problème à la requête** : `generateStaticParams` rend les deux
langues, donc l'image est prérendue à la construction, où `readFileSync`
fonctionne. Cloudflare ne servirait qu'un PNG statique.

**C'est un problème au CHARGEMENT DU MODULE.** L'appel est au niveau supérieur,
pas dans la fonction : le fichier ne peut pas être importé dans un runtime sans
système de fichiers, même si la route n'est jamais exécutée. Le sort du module
dans le paquet Worker dépend alors de ce que le compilateur en fait — ce qui se
VÉRIFIE, jamais ne se suppose.

**Correctif portable, à faire avant toute bascule :**

```ts
const data = await fetch(new URL('./_og-fonts/cormorant-600.woff', import.meta.url))
  .then((r) => r.arrayBuffer());
```

`import.meta.url` fonctionne dans les deux runtimes et Next embarque l'actif.
Le changement supprime `node:fs` et `node:path` du dépôt entier.

## Le reste de l'inventaire

```
  process.cwd  ×2      ← les deux dans opengraph-image, disparaissent avec le correctif
  node:path    ×1      ← idem
  node:fs      ×1      ← idem
  Buffer       ×1      ← disponible sous `nodejs_compat`
```

Aucune dépendance de production n'est problématique : `framer-motion`,
`lucide-react` et `@next/third-parties` sont côté client ; `resend` parle en
HTTP.

## Les surfaces qui parlent au monde extérieur

Le plan nomme le vrai risque du lot B : **le doublon silencieux** — deux couches
qui posent le même en-tête, ou pire, deux qui se contredisent. Aujourd'hui elles
sont produites par l'application (`next.config.ts` : `headers()`, CSP, redirections
et réécritures) et par Vercel. Sur Cloudflare, une part passerait à la plateforme.

**Règle à tenir : un en-tête a UN producteur, et on sait lequel.** Le point de
vigilance de la décision D8 reste entier — sur ce compte, le `robots.txt` géré
et le contrôle des crawlers IA ont déjà annulé une directive posée par
l'application. Toute bascule doit les neutraliser explicitement **et vérifier le
fichier réellement servi**, pas la case cochée.

## Les variables d'environnement à recréer

Une migration de plateforme les recrée toutes à la main — c'est là que les replis
mentent. Celui de `llms.txt` pointait encore sur l'ancien domaine, masqué tant
que la variable était posée ; il a été corrigé le 2026-08-03 pour cette raison
précise.

```
  INDEXNOW_KEY             secret   soumission IndexNow
  IQWINE_APP_URL                    relais du formulaire de contact
  NEXT_PUBLIC_APP_LOGIN_URL         lien de connexion
  NEXT_PUBLIC_APP_SIGNUP_URL        lien d'inscription
  NEXT_PUBLIC_GA_ID                 mesure d'audience
  NEXT_PUBLIC_SITE_URL              origine canonique — canonical, hreflang, sitemap
  REDIRECT_ORIGIN                   domaine cible des redirections
```

## Ce qui reste à décider — et c'est une question, pas une conclusion

Le plan pose que ce chantier **ne livre aucune valeur utilisateur** et que
« c'est ce qui le rend dangereux : il n'a pas de bénéfice visible à opposer à
ses régressions ». Son seul critère de succès est l'absence de différence.

Deux lectures du périmètre d'Eric sont possibles :

- **(a) Cloudflare DEVANT Vercel** — on proxie l'enregistrement DNS. Vercel reste
  l'origine. Gain : WAF, cache et règles au bord, cohérence avec l'application.
  Risque : faible, réversible en décochant le nuage orange ;
- **(b) Cloudflare À LA PLACE de Vercel** — hébergement sur Workers via
  `@opennextjs/cloudflare`. Le mot « rollback Vercel prêt AVANT le DNS » de la
  directive penche pour cette lecture. Gain : un seul fournisseur. Risque :
  réel, et c'est celui que le lot A ci-dessus mesure.

(a) prend une heure et se défait en une minute. (b) est le vrai chantier.
**Cette question doit être tranchée avant d'écrire une ligne**, parce que les
deux ne partagent que le nom.
