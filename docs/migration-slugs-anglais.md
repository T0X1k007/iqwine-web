# Migration des slugs anglais — 2026-08-03

> Décision d'Eric : « faisons les URLs anglaises maintenant, avant que les URLs
> historiques accumulent de l'autorité. » Une migration d'adresses coûte
> d'autant plus cher que les anciennes ont du poids ; le site venait d'être
> indexé, c'était donc le moment le moins cher.

## Le défaut corrigé

Les pages anglaises existaient, étaient réellement en anglais
(`<title>Pricing — iQWine</title>`) et étaient correctement déclarées en
`hreflang`. Mais leurs adresses restaient françaises :
`iqwine.ai/en/notre-maison`, `/en/confidentialite`, `/en/tarifs`.

Deux coûts, et le second est le plus lourd :

- un lecteur anglophone voit une adresse qu'il ne comprend pas, à l'endroit
  précis où il décide s'il est au bon endroit — barre d'adresse, résultat de
  recherche, lien partagé ;
- le slug est l'un des rares signaux de pertinence que Google lit sans
  ambiguïté. `/en/pricing` dit ce que `/en/tarifs` ne dira jamais à quelqu'un
  qui cherche « wine cellar app pricing ».

## La table

| Dossier (identifiant interne) | Français | Anglais | Titre anglais de la page |
| ----------------------------- | -------- | ------- | ------------------------ |
| `sommelier-ia` | `sommelier-ia` | **`ai-sommelier`** | AI Sommelier — Octave |
| `le-film` | `le-film` | **`the-film`** | The film |
| `apogee` | `apogee` | **`drinking-window`** | Drinking window |
| `recherche` | `recherche` | **`search`** | Search |
| `recevoir` | `recevoir` | **`entertaining`** | Entertaining |
| `tarifs` | `tarifs` | **`pricing`** | Pricing |
| `notre-maison` | `notre-maison` | **`our-story`** | Our story |
| `conditions` | `conditions` | **`terms`** | Terms of Use |
| `confidentialite` | `confidentialite` | **`privacy`** | Privacy Policy |
| `contact` | `contact` | `contact` | Contact |
| `beta` | `beta` | `beta` | Become a beta tester |

Les slugs anglais sont tirés des **titres anglais réels des pages**, relevés en
production. Un slug qui contredit son titre est un slug qu'on retraduira.

`apogee` n'a pas d'équivalent d'un mot en anglais œnologique courant ; la page
s'intitule déjà « Drinking window », le slug suit.

## Comment c'est fait — une seule source de vérité

`SEGMENTS` dans `src/lib/locale.ts`. La clé est le **nom du dossier**, qui est
l'identifiant interne d'une page et ne change jamais.

- `localePath(rest, locale)` traduit vers l'extérieur : `/tarifs` + `en` →
  `/en/pricing` ;
- `splitLocalePath(pathname)` retraduit vers l'intérieur : `/en/pricing` →
  `{ locale: 'en', rest: '/tarifs' }`.

**Aucun autre fichier n'a eu besoin d'être modifié** pour le sitemap, les
`canonical`, les `hreflang`, les données structurées, le sélecteur de langue et
les liens internes : ils passent tous par ces deux fonctions.

Le service se fait par **réécriture** (`/en/pricing` rend le contenu de
`app/[locale]/tarifs/`), donc invisible — l'adresse affichée reste celle que le
visiteur copie et partage. Une redirection aurait fait réapparaître l'adresse
française dans sa barre, ce que cette migration supprime.

## Deux lacunes trouvées en chemin

### `x-default` mentait

`alternatesFor` déclare `x-default` sur les chemins nus (`/tarifs`) en
affirmant qu'ils « négocient et redirigent vers la bonne langue de CETTE page ».
Mesuré le 2026-08-03 en production :

| Chemin | `Accept-Language: fr` | `Accept-Language: en` |
| ------ | --------------------- | --------------------- |
| `/` | 307 → `/fr` | 307 → `/en` ✅ |
| `/tarifs` | 308 → `/fr/tarifs` | 308 → `/fr/tarifs` ❌ |
| `/notre-maison` | 308 → `/fr/notre-maison` | 308 → `/fr/notre-maison` ❌ |
| `/octave` | 308 → `/fr/sommelier-ia` | 308 → `/fr/sommelier-ia` ❌ |

Seul l'accueil négociait. Pour toutes les autres pages, `x-default` désignait
une adresse qui envoie tout le monde au français — donc un doublon de la
déclaration `fr-CA`, et un anglophone arrivant par ce chemin atterrissait dans
la mauvaise langue.

Cause : les redirections de `next.config.ts` s'exécutent **avant** le
middleware. Vérifié par l'inverse — `/nimporte-quoi`, absent de leur liste,
était bien négocié en 307.

Elles sont retirées ; le middleware négocie, comme il le fait partout ailleurs.
Le commentaire d'origine disait « un 308 ne doit pas dépendre d'un en-tête » —
c'est juste, et c'est exactement pourquoi ces chemins doivent être des 307.

### `og:url` était absent de toutes les pages

Next ne le déduit pas du `canonical`. Les pages émettaient `og:title`,
`og:description`, `og:locale` et `og:type`, jamais `og:url`. Conséquences,
discrètes parce qu'un partage « marche » quand même : les plateformes qui
dédoublonnent par `og:url` comptaient deux partages de la même page comme deux
objets, et un lien portant des paramètres de campagne passait pour l'adresse de
la page. Posé, et il porte le slug traduit.

## Inventaire AVANT — production, 2026-08-03

Toutes les routes répondaient 200 dans les deux langues, l'anglais sous slug
français :

```
  chemin                     fr    en
  /  (accueil)               200   200
  /sommelier-ia              200   200      ← /en/sommelier-ia
  /le-film                   200   200      ← /en/le-film
  /apogee                    200   200      ← /en/apogee
  /recherche                 200   200      ← /en/recherche
  /recevoir                  200   200      ← /en/recevoir
  /tarifs                    200   200      ← /en/tarifs
  /notre-maison              200   200      ← /en/notre-maison
  /contact                   200   200
  /conditions                200   200      ← /en/conditions
  /confidentialite           200   200      ← /en/confidentialite
  /beta                      200   200
```

## Inventaire APRÈS

_À compléter après déploiement, avec la sortie de
`node scripts/verifier-routage.mjs https://iqwine.ai`._

## Ce qui est vérifié, et par quoi

`scripts/verifier-routage.mjs`, contrôles 10 et 11 — attentes **dérivées de la
table**, jamais réécrites :

- chaque slug anglais sert sa page en 200, sans redirection ;
- chaque ancienne adresse anglaise rend **301** vers la nouvelle, en un saut ;
- aucune boucle : en suivant les sauts, on aboutit en 200 ;
- le français est intact — c'est la moitié qu'une migration casse sans qu'on la
  regarde ;
- `canonical`, `hreflang` fr-CA/en-CA et `og:url` portent le slug traduit ;
- le sélecteur de langue mène au slug traduit de l'autre langue ;
- le sitemap annonce les nouvelles adresses et **plus** les anciennes ;
- les chemins nus négocient vraiment, `/octave` compris, en un seul saut.

Le point le plus risqué est la cohabitation d'une réécriture
`/en/pricing → /en/tarifs` et d'une redirection `/en/tarifs → /en/pricing` :
mal ordonnées, elles bouclent et le site devient injoignable. Next applique les
redirections avant les réécritures et ne re-soumet pas la destination d'une
réécriture aux redirections — mais « la documentation le dit » n'est pas une
vérification, d'où le contrôle explicite.

## Après déploiement

1. `node scripts/soumettre-indexnow.mjs` — 31 URL : les françaises, les
   nouvelles anglaises, et **les anciennes anglaises**, pour que leur 301 soit
   constaté et l'index remplacé. `/beta` est exclue, comme du sitemap.
2. Soumettre le sitemap dans Google Search Console — Google ne participe pas à
   IndexNow, c'est un geste humain dans une console.
