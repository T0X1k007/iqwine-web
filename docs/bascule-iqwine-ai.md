# Bascule vers `iqwine.ai` — une seule opération, pas deux

Ce document existe pour une raison précise : **la migration de domaine et celle
des URL de langue doivent se produire ensemble.** Les faire l'une après l'autre
créerait, pour chaque ancienne URL, une chaîne de deux redirections — et une
chaîne coûte de l'autorité à chaque saut, ajoute un aller-retour à chaque
visiteur venu d'un vieux lien, et se propage à tout ce qui a déjà été partagé.

L'architecture est prête. Ce qui reste tient en trois variables et un ordre.

---

## Ce qui est déjà en place

Le passage aux URL de langue est **fait et vérifié** : `/fr/…` et `/en/…`
existent, chaque page est rendue statiquement dans les deux langues, et les
anciennes URL redirigent déjà en permanent vers leur équivalent français.

Le point qui prépare la bascule est `REDIRECT_ORIGIN`, dans
`next.config.ts` :

```ts
const ORIGIN = (process.env.REDIRECT_ORIGIN || '').replace(/\/$/, '');
const vers = (path: string) => `${ORIGIN}/fr${path === '/' ? '' : path}`;
```

**Aujourd'hui elle est vide** : les redirections restent relatives, donc
`iqwine.ca/tarifs` → `iqwine.ca/fr/tarifs`. Un seul saut, sur le domaine actuel.

**Le jour de la bascule**, on la pose à `https://iqwine.ai` et les MÊMES règles
envoient directement `iqwine.ca/tarifs` → `iqwine.ai/fr/tarifs`. Toujours un
seul saut, vers la destination finale.

C'est tout le mécanisme. Il n'y a pas de seconde table de redirection à écrire,
et donc pas de seconde table à maintenir en accord avec la première.

---

## Les trois variables

| Variable               | Aujourd'hui              | Après bascule           | Effet                                                                 |
| ---------------------- | ------------------------ | ----------------------- | --------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.iqwine.ca`  | `https://iqwine.ai`     | canonicals, `hreflang`, sitemap, données structurées, `llms.txt`      |
| `REDIRECT_ORIGIN`      | _(vide)_                 | `https://iqwine.ai`     | destination des redirections permanentes depuis l'ancien domaine       |
| `INDEXNOW_KEY`         | _(absente)_              | _(au choix)_            | prévient Bing d'un changement ; sans elle, la route de clé répond 404 |

`NEXT_PUBLIC_SITE_URL` est lue en **un seul endroit** (`src/lib/locale.ts`,
constante `SITE_ORIGIN`). Tout ce qui déclare une URL au monde extérieur en
dérive : c'est ce qui garantit que le domaine change partout d'un coup, sans
qu'un fichier oublié continue d'annoncer l'ancien.

---

## L'ordre, et pourquoi il est dans cet ordre

1. **Search Console, avant tout.** Déclarer `iqwine.ai`, le vérifier, et
   préparer l'outil de changement d'adresse. Un changement d'adresse annoncé
   APRÈS la bascule fait perdre les semaines pendant lesquelles Google a cru à
   une disparition.

2. **Déployer le nouveau domaine, l'ancien encore actif.** Les deux répondent.
   `iqwine.ai/fr/tarifs` sert la page ; `iqwine.ca/tarifs` sert encore la
   sienne. Rien n'est cassé, rien n'est encore redirigé.

3. **Poser les deux variables et redéployer.** À cet instant seulement,
   `iqwine.ca/tarifs` commence à renvoyer vers `iqwine.ai/fr/tarifs`, en un
   saut.

4. **Vérifier avant d'annoncer.** `node scripts/verifier-routage.mjs
   https://iqwine.ai` doit passer ses 55 contrôles. Puis, à la main, une
   poignée d'anciennes URL avec leurs paramètres de campagne — ils doivent
   arriver intacts.

5. **Soumettre le sitemap** sur Search Console et Bing, et déclencher IndexNow
   si la clé est posée.

6. **Laisser l'ancien domaine redirigier indéfiniment.** Les courriels déjà
   partis, les liens déjà partagés, les signets : ils ne se corrigent jamais.
   Une redirection permanente qu'on retire est un lien mort de plus, des années
   après.

---

## Ce qui va se produire, et qu'il faut avoir prévu

**Les sessions ouvertes seront perdues.** Un cookie posé sur `iqwine.ca` n'est
pas lisible depuis `iqwine.ai` — c'est la règle du navigateur, pas un défaut.
Eric l'a acceptée explicitement. Le site marketing n'ayant pas de session, seul
le cookie de langue est concerné : un visiteur repassera une fois par la
négociation, puis son choix sera de nouveau mémorisé.

**Le classement bougera quelques semaines.** C'est le comportement normal d'un
changement de domaine, et les redirections permanentes sont ce qui le raccourcit.

**`/beta` reste `noindex`** et hors sitemap, comme avant. Ce n'est pas un oubli.

---

## Ce qui reste à décider

**Le préfixe `www`.** `iqwine.ca` sert aujourd'hui depuis `www` ; `iqwine.ai`
peut servir depuis l'apex. Ce qui compte est qu'**un seul** des deux réponde et
que l'autre redirige — un canonical qui pointe vers une URL qui redirige est
une pénalité, et c'est le genre de détail qui survit des années.

**La langue par défaut.** `x-default` pointe vers le français, ce qui est la
vérité du marché d'origine. Si `iqwine.ai` vise d'abord un public anglophone,
c'est une ligne à changer — dans `src/lib/locale.ts`, `DEFAULT_LOCALE` — et il
vaut mieux la changer avant la bascule qu'après.
