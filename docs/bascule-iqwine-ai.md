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

Et, **dans le dépôt applicatif** (`cellier-vin`) :

| Variable             | Après bascule   | Effet                                                                       |
| -------------------- | --------------- | --------------------------------------------------------------------------- |
| `AUTH_COOKIE_DOMAIN` | `.iqwine.ai`    | rend le cookie de langue du PROFIL lisible par le site marketing            |

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

6. **Mettre à jour le webhook Stripe.** L'endpoint LIVE créé le 2026-08-02
   (`we_1U03QCRqF3byzS5tPe6drAxM`, « iQWine production ») pointe sur
   `https://app.iqwine.ca/api/billing/stripe/webhook`. Il doit suivre le
   domaine.

   > **Pourquoi ce point mérite sa propre étape.** Un webhook laissé sur
   > l'ancien domaine ne « casse » rien de visible : les clients paient, Stripe
   > encaisse, et l'application n'en entend jamais parler. Aucune erreur
   > n'apparaît dans le produit — seulement des abonnements qui ne s'activent
   > pas, découverts un par un par des clients mécontents. C'est la panne la
   > plus coûteuse de toute la bascule, et la moins bruyante.
   >
   > La redirection permanente ne sauve pas : Stripe signe la requête pour
   > l'URL déclarée, et **ne suit pas les redirections** en POST.
   >
   > Le filet existe — `cellier-cron-billing-stripe-reconcile` rattrape les
   > webhooks manqués — mais il n'est **pas installé en production** au
   > 2026-08-02. Voir `docs/ops/derive-unites-systemd.md` du dépôt applicatif.

7. **Laisser l'ancien domaine redirigier indéfiniment.** Les courriels déjà
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

## Les décisions prises (Eric, 2026-08-02)

**Canonique : `https://iqwine.ai`, sans `www`.** `www.iqwine.ai` redirige en
permanent vers l'apex, chemin, paramètres et ancres préservés. Cette redirection
se configure chez l'hébergeur, PAS dans le code — un `redirects()` de Next ne
s'exécute qu'après que la requête a atteint l'application, donc après le
certificat et le routage. La faire là où elle doit être coûte un saut de moins.

Sur Vercel : ajouter les DEUX domaines au projet, désigner `iqwine.ai` comme
domaine principal, et laisser Vercel poser la redirection 308 depuis `www`.

**`x-default` reste NEUTRE.** Il désigne `https://iqwine.ai/`, la racine qui
négocie — jamais `/fr`. Le repli français est OPÉRATIONNEL (lancement au
Québec), pas une propriété du site : l'écrire dans une balise le figerait.

**L'ordre de priorité de la langue**, tel qu'il se réalise :

1. le cookie `iqwine-locale` — il porte AUSSI BIEN le choix manuel fait sur le
   site QUE la langue de profil écrite par l'application. C'est le geste le plus
   RÉCENT qui l'emporte, ce qui vaut mieux qu'une cascade rigide : changer sa
   langue dans son compte la propage au site, cliquer FR/EN sur le site
   l'emporte à son tour, et aucun des deux gestes n'est jamais ignoré ;
2. `Accept-Language` ;
3. repli `/fr`.

**Le maillon à configurer pour que (1) fonctionne de bout en bout** :
`AUTH_COOKIE_DOMAIN=.iqwine.ai` côté application. Sans lui, le cookie de profil
reste scopé à `app.iqwine.ai` et le site marketing ne le voit pas — la langue du
profil ne suivra pas, en silence.
