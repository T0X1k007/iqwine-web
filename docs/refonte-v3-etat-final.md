# Refonte v3 « À l'unisson » — ÉTAT FINAL

> ## ⚠ LIRE AVANT TOUT `git push` — la v3 n'est PAS en production
>
> **Au 2026-08-14, le site public sert l'ANCIENNE version, volontairement.**
>
> La refonte est terminée, validée et **poussée sur `main`** (commit
> `dd0a4d2`). Elle a été mise en ligne une dizaine de minutes, puis retirée par
> un **Instant Rollback Vercel** vers `83ab2cc`, à la demande d'Eric, qui veut
> choisir son moment pour passer au public.
>
> **Le piège :** le projet Vercel `iqwine-web` déploie automatiquement `main` en
> production. Comme `main` porte déjà la v3, **n'importe quel push sur `main`
> la remettra en ligne**, même un push qui ne concerne qu'un détail.
>
> **Avant de pousser, demander à Eric s'il est prêt à passer public.** S'il ne
> l'est pas : travailler sur une branche dédiée, ou différer le push. Le
> travail local peut se commiter sans risque ; c'est le `push` qui déploie.
>
> **Pour remettre la v3 en ligne le moment venu :** Vercel → projet
> `iqwine-web` → *Deployments* → ligne `dd0a4d2` → menu `⋯` → **Promote**.
> Instantané, aucune reconstruction, le déploiement existe toujours.
>
> ### Où travailler
>
> | | |
> |---|---|
> | Dépôt du site | `/home/ebigras/Projects/iQWine_Web` |
> | Dépôt de l'application | `/home/ebigras/Projects/cellier-vin` (lecture seule pour vérifier les promesses produit) |
> | Serveur de dev | `pnpm dev --port 3020 --hostname 0.0.0.0` |
> | Revue par Eric | `http://100.77.174.52:3020` (Tailscale) |
> | Branche | `main`, alignée sur `origin/main` |
>
> ### Le réflexe avant chaque livraison
>
> ```bash
> pnpm typecheck && pnpm lint          # à chaque changement
> pnpm build                           # avant toute mise en ligne
> pnpm start --port 3100 &             # puis le contrat de routage :
> node scripts/verifier-routage.mjs    # doit afficher 170/170
> ```


**Dernière mise à jour : 2026-08-14, après la PASSE CLAIRE et la fermeture v3.**

Ce document est le **point d'entrée unique** pour comprendre l'état du site sans
reconstruire l'historique des conversations. Les deux autres documents de la
refonte restent valables et le complètent :

- `refonte-v3-contenus.md` — les directives éditoriales et le journal des pages ;
- `refonte-v3-seo.md` — la doctrine SEO (SEO first, sans tuer l'émotion).

---

## 1. Le positionnement, en trois lignes

iQWine n'est pas « une application de cave avec de l'IA ». C'est **Octave, votre
sommelier IA qui apprend vos goûts**. La cave, le scan, les accords et l'apogée
sont des capacités au service d'une seule promesse.

- Signature : **« Octave. À l'unisson de vos goûts. »**
- Descripteur : **« Votre sommelier IA qui apprend vos goûts. »**
- Phrase de marque (accueil UNIQUEMENT, jamais répétée) : « Vous ne cherchez plus
  un bon vin. Vous cherchez le vôtre. »
- Phrase stratégique (emplacement UNIQUE, `/sommelier-ia` S1) : « Un sommelier
  connaît les vins. Octave apprend à connaître vos goûts… » Elle **guide**
  l'écriture des autres pages, elle ne s'y recopie pas.

---

## 2. Architecture des pages (état final)

| Page | FR | EN | État |
|---|---|---|---|
| Accueil | `/fr` | `/en` | **LOCK** |
| Hub Fonctions | `/fr/fonctions` | `/en/features` | **LOCK** |
| Choisir un vin | `/fr/choisir-un-vin` | `/en/how-to-choose-wine` | **LOCK** |
| Cellier intelligent | `/fr/cellier-intelligent` | `/en/wine-cellar-app` | **LOCK** |
| Accords mets-vins | `/fr/accord-mets-vins` | `/en/wine-pairing` | **LOCK** |
| Carte des vins | `/fr/carte-des-vins` | `/en/wine-list` | **LOCK** |
| Octave, sommelier IA | `/fr/sommelier-ia` | `/en/ai-sommelier` | **LOCK** |
| L'apogée | `/fr/apogee` | `/en/drinking-window` | **LOCK** |
| Notre histoire | `/fr/notre-maison` | `/en/our-story` | **LOCK** |
| Le film | `/fr/le-film` | `/en/the-film` | **LOCK** (passe claire) |
| Tarifs | `/fr/tarifs` | `/en/pricing` | **LOCK** (refonte v3 + passe claire) |
| Contact | `/fr/contact` | `/en/contact` | **LOCK** (passe claire) |
| Conditions | `/fr/conditions` | `/en/terms` | **LOCK** (passe claire, sobre) |
| Confidentialité | `/fr/confidentialite` | `/en/privacy` | **LOCK** (passe claire, sobre) |
| Bêta | `/fr/beta` | `/en/beta` | **LOCK** (passe claire), hors sitemap volontairement |

**14 pages indexables × 2 langues = 28 URL au sitemap.** Ce compte est un
CONTRAT : le vérificateur de routage échoue si une page entre ou sort sans que
le compte soit mis à jour.

### Le libellé « Notre histoire » n'est pas une URL

Décision du 2026-08-14 : la page `/notre-maison` ↔ `/en/our-story` s'appelle
**« Notre histoire » / « Our story »** dans la barre du haut, le pied de page,
le fil d'Ariane et son œil-de-bœuf. **Les URLs, le canonical, les hreflang et le H1 narratif n'ont pas bougé** :
c'est un libellé, pas une nouvelle page.

Le `<title>`, lui, a été aligné à la passe de fermeture : il disait encore
« À propos de nous », héritage de l'ancien positionnement, ce qui faisait douter
un visiteur venu du lien « Notre histoire ». Il reprend désormais le libellé de
navigation ET porte la seule requête utile à cette page.

- FR : « Notre histoire : comment est né Octave, votre sommelier IA · iQWine »
- EN : « Our story: how Octave, your AI sommelier, came to be · iQWine »

---

## 3. Routage : ce qui est absorbé, et comment

Deux anciennes pages pilier ont été **absorbées**, jamais supprimées de l'index
sans filet :

| Ancienne adresse | Devient | Mécanique |
|---|---|---|
| `/recevoir` (chemin nu) | `/fr/accord-mets-vins` | ALIAS middleware, 307, négocie la langue |
| `/fr/recevoir`, `/en/recevoir`, `/en/entertaining` | page Accords | 308 permanent, `next.config.ts` |
| `/recherche` (chemin nu) | `/fr/choisir-un-vin` | ALIAS middleware, 307, négocie la langue |
| `/fr/recherche`, `/en/search`, `/en/recherche` | page Choisir un vin | 308 permanent, `next.config.ts` |
| `/octave` (chemin nu) | `/sommelier-ia` | ALIAS middleware, historique |

**Pourquoi un ALIAS pour le chemin nu plutôt qu'une redirection de config** : une
redirection de `next.config` s'exécute AVANT le middleware et ne peut pas
négocier la langue ; elle enverrait tout le monde au français. L'alias rend un
307 (temporaire, comme doit l'être toute réponse qui dépend d'un en-tête) vers la
bonne langue, **en un seul saut**.

Toutes ces redirections sont vérifiées à chaque exécution du vérificateur.

---

## 4. Protection du produit — LA RÈGLE, dans sa version corrigée

La règle a été **corrigée le 2026-08-14** après une sur-interprétation. La
version qui fait foi :

### PREUVE PRODUIT = OUI (à conserver, et à remettre si retirée)

Captures d'écran **statiques** de l'application, fiches de vin réelles,
bouteilles détourées, résultats de recommandation, cartes produit, suggestions
d'Octave, écrans de cave, résultats d'accords, lecture de carte des vins,
disponibilité, apogée, carnet de dégustation, mockups statiques, cartes
dessinées à partir du produit, interfaces statiques montrant **ce que
l'utilisateur obtient**, et animations purement graphiques ou poétiques.

**Ce sont des preuves marketing. Le visiteur doit voir qu'iQWine est une vraie
application.** Ne jamais les retirer « pour épurer ».

### DOCUMENTATION DU WORKFLOW = NON

1. **Enregistrements d'écran continus** montrant accueil → saisie → options →
   étapes → bouton → calcul → résultat. C'est le problème qu'avait la vidéo de
   90 s. Une vidéo courte qui va droit au **résultat → recommandation → fiche**
   peut rester (d'où la coupe à 34 s).
2. **Animations qui rejouent le workflow réel** : ordre des étapes, navigation,
   décisions intermédiaires, champs, logique fonctionnelle, mécanique de
   recommandation. Une animation esthétique ou conceptuelle reste (la ligne
   d'accord, la courbe de l'apogée, l'accordage des souvenirs).
3. **Explications textuelles trop détaillées** : comment le moteur combine les
   données, dans quel ordre il interroge cave/magasin/contexte, scoring,
   pondérations, règles, seuils, architecture mémoire, processus métier.

**Filtre simple : montrer ce que l'utilisateur voit une fois qu'Octave l'a aidé ;
jamais étape par étape comment Octave y arrive.**

### Où vivent les preuves aujourd'hui

| Preuve | Page(s) |
|---|---|
| `01-fiche-vin` | `/cellier-intelligent`, `/apogee` |
| `02-home-suggestions` | `/sommelier-ia` |
| `03-menu-scan` | `/carte-des-vins` |
| `04-carnet` | `/sommelier-ia` |
| `05-cave-visuelle`, `08-cellier-desktop` | `/cellier-intelligent`, `/fonctions` |
| `06-recherche-hors-cave` | `/choisir-un-vin` (écran complet) |
| `07-apogee-cave` | `/apogee` (recadrage dédié aux cartouches d'apogée) |
| Bouteilles détourées | accueil (`pio-cesare`, `trimbach`, `masciarelli`), `/choisir-un-vin` (`castello-ama`), `/apogee` (`pio-cesare`), `/accord-mets-vins` (`guigal`) |
| Vidéo réelle 34 s | `/carte-des-vins` uniquement (climax) |

`07-apogee-cave` est un **recadrage** de `06-recherche-hors-cave` : la barre de
recherche et le bouton « Explorer hors cave » sont retirés pour que la preuve
porte sur les cartouches APOGÉE et leurs bornes. Les deux pages ne donnent donc
pas l'impression de montrer la même capture.

---

## 5. Règles éditoriales permanentes

- **Aucun tiret cadratin (« — ») dans le contenu FR/EN du site.** Virgules,
  points, deux-points, parenthèses. Les commentaires de code n'y sont pas soumis.
  Le dernier tiret rendu a été retiré le 2026-08-14 (`demoData.ts`, anglais).
- **Le produit est la source de vérité.** Ne jamais promettre une capacité qui
  n'existe pas. Vérifier dans `~/Projects/cellier-vin` avant d'écrire une
  promesse comportementale (voir §6).
- **L'apogée est un repère, jamais une certitude.** La phrase « Un repère, jamais
  une certitude : une bouteille reste vivante » est un garde-fou, pas du style.
- **Jamais de nom d'enseigne** : « point de vente (de vins) pris en charge ».
- **Essai** : toujours « 14 jours ou 12 interactions », via `lib/trial.ts`.
- **Pas de bouton App Store** tant que `APP_STORE_URL` est `null`.
- **Aucune revendication d'exclusivité** (« la seule application qui… »). La
  différenciation est la relation et l'apprentissage du palais, pas une fonction
  qu'un concurrent peut copier.
- **Photos** : chaque page a ses photos exclusives, jamais un recyclage d'une
  autre page. L'accueil est la référence de direction artistique, pas une
  photothèque.

---

## 6. Vérité produit vérifiée au code (à ne pas réécrire de mémoire)

**Notifications d'apogée** (`~/Projects/cellier-vin`) :

- `lib/notifications/detect.ts` — la déduplication porte sur (utilisateur,
  bouteille, type de règle) sur **60 jours**, et **trois** types peuvent
  concerner la même bouteille (`approaching_peak`, `at_peak`, `window_closing`).
  → **« Octave vous prévient une seule fois » est FAUX.** Ne pas l'écrire.
- Le push est une **synthèse par utilisateur**, « jamais un par bouteille ».
- `lib/notifications/comm-budget.ts` — **au plus une communication relationnelle
  par fenêtre glissante de 7 jours**.

D'où la formulation retenue sur `/apogee` : « il vous le dit au bon moment, sans
transformer votre cave en source de notifications. »

**Compagnon d'achat** : palais **et budget** sont des critères réels
(`SommelierSearch.budgetMin/Max`).

---

## 7. Ce qui a été purgé le 2026-08-14

Supprimés après vérification des imports, routes, sitemap, redirections et
documentation :

- `src/app/[locale]/recevoir/page.tsx`
- `src/app/[locale]/recherche/page.tsx`
- `src/components/pillars/PillarPage.tsx`
- `src/components/pillars/pillar-data.ts`

Les deux pages n'étaient plus joignables (redirections permanentes), et le
composant `PillarPage` n'était importé que par elles. **Les redirections
survivent à la purge et sont vérifiées.**

### Dette connue, NON traitée (décision de portée)

15 composants v2 ne sont plus montés nulle part. **Décision d'Eric à la
fermeture (2026-08-14) : NE PAS LES SUPPRIMER.** Ils n'entrent pas dans le
bundle, ne créent aucune dette d'exécution, et plusieurs contiennent des
preuves produit ou des assets réutilisables. Ils seront traités dans un
chantier technique séparé, si nécessaire :

```
motion/CountUp · sections/HeroV4 · SectionCaveWeb · SectionCercle
SectionCommentCaMarche · SectionComparison · SectionMomentsEnjeu · SectionPalais
SectionPiliers · SectionPlat · SectionPourquoi · SectionRestaurant · SectionSaq
SectionTarifs · SectionTroisMoments
```

---

## 8. En attente d'assets

**Tous les assets sont livrés** (2026-08-14). Plus aucun emplacement en attente.

| Fichier source | Devient | Page |
|---|---|---|
| `APO-01.png` (1536 × 1024) | `apogee-regret` | `/apogee` S1, le regret |
| `APO-02.png` (1122 × 1402) | `apogee-veille` | `/apogee` S4, la veille sereine |
| `REPAS-01.png` (1024 × 1536) | `repas-maison` | accueil S4B, le repas à la maison |

`repas-maison` **remplace** `plat-accord-pates`, une image de banque qui portait
la marque visible d'un restaurant tiers (« LEO » sur l'assiette) et dont la
scène de restaurant doublonnait avec le volet gauche de la même section. Le
fichier remplacé reste au dépôt, il n'est plus monté.

Seule chose encore ouverte : **le passage Safari d'Eric** (checklist au §11).

---

## 9. Comment vérifier que rien n'est cassé

```bash
pnpm typecheck && pnpm lint          # rapide, à chaque changement
pnpm build                           # avant tout déploiement
pnpm start --port 3100 &             # puis, le contrat de routage :
node scripts/verifier-routage.mjs    # doit afficher 170/170
node scripts/generer-images.mjs --verifier
```

Le dépôt **n'a pas de suite de tests unitaires** : `scripts/verifier-routage.mjs`
tient lieu de test de contrat (170 contrôles : négociation de langue, slugs
anglais, canonicals, hreflang, x-default neutre, sitemap, alias, absence de
boucle, aucune adresse de l'ancien domaine dans les sources).

**Rappel CI (règle globale d'Eric)** : `push:` est interdit comme déclencheur ;
la chaîne qualité complète tourne **en local avant chaque déploiement**.


---

## 10. Verdict des pages non refondues (passe de fermeture, 2026-08-14)

Eric a demandé de classer chaque page héritée KEEP / ADAPT / REFONTE avant
production, plutôt que de laisser une incohérence au moment de la conversion.

### `/tarifs` → **KEEP**

Auditée FR + EN, desktop et mobile, face aux neuf pages LOCK. Elle porte déjà
la navbar et le pied de page v3, le couple Cormorant/Hanken, la peau nuit
cohérente avec `/le-film` et `/contact`, la voix de marque (« Trouvez votre
Octave. », l'anneau dans le O), le positionnement par PROFIL et non par
fonctionnalités, l'essai correct via `lib/trial.ts`, et aucune ancienne
promesse. Rien à adapter : la page ne rompt pas l'expérience au moment de
l'achat. **Un seul défaut trouvé et corrigé** : un « ,, » visible dans la
phrase d'essai, séquelle de la passe des tirets cadratins.

### `/le-film` → **KEEP**

Même constat : identité visuelle, typographie, navigation, pied de page et
responsive sont à niveau. La vidéo du film reste pertinente et n'expose aucun
workflow (c'est un film de marque, pas un enregistrement d'écran).

Les libellés de chapitres « 04 La recherche » et « 06 Recevoir » sont
**conservés délibérément** : ce sont les noms des scènes du film, ils ne sont
pas des liens, et les renommer les désynchroniserait de ce que le spectateur
voit à l'écran. Décision d'Eric : ne pas créer une dette plus grande pour un
libellé historique.

### Pages légales → **passe de cohérence minimale, faite**

Elles restent sobres et fonctionnelles : aucun storytelling, aucune photo,
aucune animation ajoutée. Vérifié : navbar et pied de page v3, Cormorant +
Hanken, entité « Groupe Medtech Inc. » exacte, essai correct (14 jours OU 12
interactions), aucune ancienne marque, FR/EN symétriques, lisibilité mobile.

**Un vrai défaut corrigé** : le `<h1>` passait SOUS la barre fixe. `LegalPage`
utilisait `py-24` (96 px) alors que la navbar mesure 128 px en desktop, soit
32 px de recouvrement, et exactement 0 px d'écart en mobile. Le conteneur part
désormais de `calc(var(--nav-h) + 3rem)` : 48 px d'air à toutes les largeurs,
sur les quatre pages, dans les deux langues.

Point laissé à Eric, non modifié : l'article 3 des Conditions décrit le service
comme « un assistant numérique de gestion de cave à vin ». C'est juridiquement
exact et la phrase mentionne déjà les recommandations par IA et les interactions
avec Octave. Modifier une définition contractuelle n'est pas une décision
d'agent ; si Eric veut l'aligner sur le positionnement, la formule proposée est
« assistant numérique de sommellerie et de gestion de cave à vin ».

---

## 11. La vidéo de `/carte-des-vins` — dette technique fermée

La vidéo RESTE : c'est une preuve produit majeure, elle n'est ni raccourcie, ni
remplacée, ni dégradée, et la version longue qui exposait le workflow n'est pas
restaurée.

**Ce qui a changé** : elle ne se télécharge plus au chargement de la page.
Mesuré, `autoplay` l'emportait sur `preload="metadata"` et le navigateur tirait
les 1,68 Mo immédiatement, alors que la vidéo vit en section 3, très loin sous
la ligne de flottaison. Un visiteur qui ne descendait jamais jusque-là payait
1,68 Mo de données mobiles pour rien.

`preload="none"`, plus d'attribut `autoplay`, et un IntersectionObserver
(200 px d'avance) qui arme la source et lance la lecture quand la vidéo approche
de l'écran. `muted` et `playsInline` restent OBLIGATOIRES pour iOS. Le poster
occupe l'espace entre-temps, donc aucun décalage de mise en page.

Résultat mesuré sur `/fr/carte-des-vins` : médias au chargement **1781 Ko →
98 Ko**, LCP **1352 ms → 308 ms**, expérience inchangée (la vidéo démarre seule
quand on la regarde).

---

## 12. Checklist Safari (validation manuelle d'Eric)

À faire sur Safari macOS ET Safari iPhone. Rien à installer.

**Typographie**
- [ ] Les titres s'affichent en Cormorant Garamond (serif), pas en Times.
- [ ] Le texte courant s'affiche en Hanken Grotesk, pas en Helvetica.
- [ ] Aucun saut de police visible au chargement (FOUT).

**Navigation**
- [ ] La barre du haut est OPAQUE dès qu'on défile un peu, jamais transparente
      par-dessus le contenu.
- [ ] Elle se masque au défilement vers le bas, réapparaît vers le haut.
- [ ] La peau passe bien ivoire ↔ nuit : `/apogee` et `/tarifs` doivent
      l'afficher SOMBRE dès l'arrivée ; l'accueil et `/fonctions`, CLAIRE.
- [ ] Le menu hamburger s'ouvre, contient « Notre histoire », se referme.
- [ ] Le sélecteur FR/EN conserve la page (depuis `/fr/apogee` → doit arriver
      sur `/en/drinking-window`, pas sur l'accueil).
- [ ] Les CTA « Essai gratuit » et « Rencontrer Octave » ouvrent l'inscription.

**Rendu**
- [ ] Le flou de la barre (`backdrop-filter`) fonctionne, sans bande grise.
- [ ] Les dégradés de transition ivoire ↔ nuit sont lisses, sans bandes.
- [ ] La ligne d'accord (le trait d'or) est fine et complète, jamais coupée.
- [ ] La courbe de l'apogée se trace à l'entrée à l'écran.
- [ ] Aucun défilement horizontal, sur AUCUNE page (le test décisif : poser le
      doigt et tirer vers la gauche).

**Images et vidéo**
- [ ] Toutes les photos s'affichent (Safari doit servir de l'AVIF ; en cas de
      doute, vérifier qu'aucun cadre vide n'apparaît).
- [ ] Aucun recadrage ne coupe un sujet essentiel sur iPhone.
- [ ] Sur `/carte-des-vins`, la vidéo démarre SEULE quand on arrive dessus,
      reste MUETTE, et ne passe JAMAIS en plein écran (test iOS critique).
- [ ] Rien ne saute pendant le chargement (pas de contenu qui se décale).

**Accessibilité**
- [ ] Avec « Réduire les animations » activé (Réglages → Accessibilité), les
      animations s'arrêtent et la vidéo ne démarre pas d'elle-même.


---

## 13. `/tarifs` — refonte v3 puis passe claire (2026-08-14)

C'est la dernière page reconstruite, et la seule dont la refonte était d'abord
**commerciale** avant d'être artistique.

### Le diagnostic qui a tout décidé

Mesuré avant de concevoir : la page faisait **8 428 px** en desktop et le
**premier prix apparaissait à 2 253 px**, soit deux écrans et demi. Le problème
n'était donc pas un manque de narration mais un EXCÈS. Deux causes :

- une section « Lequel est pour vous » qui redisait, en moins bien, la tagline
  déjà portée par chaque carte de forfait ;
- un en-tête du bloc `Pricing` qui répétait le hero mot pour mot (même
  œil-de-bœuf, même promesse d'essai, un H2 redondant).

Résultat après refonte : **6 532 px**, premier prix à **1 208 px**.

### Ce qui n'a pas bougé

Prix, quotas, forfaits, fonctionnalités incluses, essai, conditions
commerciales, destinations de CTA, contenu du comparatif, ancre `#faq`.
**L'offre est identique au caractère près.**

### Les six sections et l'arc de couleur

`S1 nuit` (ouverture courte) → **descente** → `S2 IVOIRE` (forfaits) →
**remontée** → `S3 nuit` (comparatif + CTA) → **descente** → `S4 ivoire`
(réassurance) → `S5 ivoire` (FAQ) → `S6 ivoire` (clôture).

### Décisions de présentation

- **Le Gratuit sort du comparatif.** Il n'y vivait que caché, alors que c'est
  le meilleur argument d'acquisition. Testé en quatrième colonne : les cartes
  tombaient à **283 px de large pour 968 px de haut**, comprimées, et une carte
  d'égal rang aurait concurrencé le Pro. Il est donc en **carte horizontale**
  sous les trois payantes : visible, sans liseré d'or ni ombre.
- **Plus de carte dans la carte.** Les trois limites (bouteilles, interactions,
  utilisateurs) quittent leur rectangle sombre et deviennent une composition
  typographique tenue par deux filets. Aucune information retirée.
- **Pro en tête sur mobile** (`order-first`), au milieu sur desktop.
- **Un CTA après le comparatif** : on comparait, puis il fallait remonter.

### Bugs corrigés au passage

1. Le comparatif mettait l'accent doré sur **Standard** au lieu de Pro : les
   cellules ont quatre colonnes (Gratuit + 3 payants) mais le code lisait
   `PLANS[j]`, qui n'en compte que trois. Décalage d'un rang.
2. Les boutons « Choisir Standard », « Choisir Passionné » et « Commencer
   gratuitement » rendaient **vides** sur l'ivoire : la variante `secondary`
   impose `text-foreground`, un ivoire clair. Forcé avec `!text-encre`.
3. La bascule mensuel/annuel utilisait `text-foreground-dim`, invisible sur
   ivoire.

---

## 14. La passe claire (2026-08-14) — les cinq dernières pages sombres

Constat d'Eric : `/le-film`, `/beta`, `/contact` et les deux pages légales
restaient entièrement nocturnes et détonnaient du reste du site.

**Cause racine trouvée** : la classe `.section-light` est en réalité un
**dégradé SOMBRE** (nommage hérité de la v2). Tout composant qui la demandait
rendait sombre en croyant s'éclaircir.

Ce qui a changé, uniquement de la matière :

- `legal-ui` passe en `mouvement-jour`, encre sur ivoire. **Aucun récit, aucune
  photo, aucune animation ajoutée** : les pages légales restent sobres.
- `/contact` et `/beta` passent au jour, cartes de raccourci comprises.
- `/le-film` garde sa **nuit autour du lecteur** (une vidéo se regarde dans le
  noir), mais son entrée et sa clôture rejoignent l'ivoire, avec les deux
  bandes de transition du système.
- Le composant partagé `Input` reçoit un **ton** : ses champs restaient noirs au
  milieu de pages devenues claires. La nuit demeure le défaut.
- `SectionFaq` et `Pricing` reçoivent le même paramètre `ton`.
- `ROUTES_JOUR` de la navbar accueille les cinq routes, pour que la barre
  démarre claire.
- `.iq-lead` impose `color: var(--color-foreground-dim)` : sur `/le-film`, le
  chapeau devenait illisible, forcé en `!text-encre-2`.

**Vérifié** : balayage de contraste sur les dix pages (FR + EN), aucun texte de
contenu sous le seuil. Le seul signalement est le logo, dont le dégradé
`bg-clip-text` trompe la mesure, et il est identique sur les pages LOCK.


---

## 15. Correctifs SEO / GEO de clôture (2026-08-14)

Deux défauts trouvés à l'audit final, tous deux corrigés.

### 15.1 `llms.txt` réécrit — il publiait la mécanique

Le fichier destiné aux moteurs génératifs n'avait jamais été revu depuis la
refonte. Il contenait exactement ce que la protection du produit interdit :

> « Le classement est déterministe. Un score choisit les vins ; l'IA écrit
> seulement l'explication. »
> « Le choix d'une bouteille est piloté par un score... le "quoi" vient de
> règles claires appliquées à votre cave. »

Il nommait aussi la **SAQ cinq fois**, contre la règle « point de vente pris en
charge ».

Le nouveau fichier (4 501 octets, bilingue) énonce **ce que fait le produit et
ce qu'il garantit**, jamais comment il est construit : les six situations
concrètes, le public visé, les garanties (prix réels quand publiés, apogée
comme repère jamais comme certitude, « je ne sais pas » assumé, recommandations
explicables), les limites honnêtes, et les vingt URL canoniques FR + EN.

**Contrôle automatisé passé** : zéro occurrence de « SAQ », « score »,
« pondération », « règles claires », « déterministe », « prompt »,
« algorithme ». Les vingt URL citées répondent toutes 200.

Il doit permettre à un assistant de répondre correctement à « Qu'est-ce
qu'iQWine ? », « Quelle application me dit quand ouvrir mes vins ? », « Quelle
application m'aide à choisir un vin au restaurant ? » sans lui livrer la
recette.

### 15.2 `FAQPage` retiré du graphe global

`siteGraphLd` est posé par le layout, donc sur les 28 URL, et embarquait
`faqLd` : **26 pages déclaraient une FAQ qu'elles n'affichent pas**. Or
`SectionFaq` n'est importée que par `TarifsContent`.

`faqLd` a quitté le graphe global et devient `faqPageLd`, injecté par la seule
page Tarifs. Vérifié sur le build de production : présent sur `/fr/tarifs` et
`/en/pricing`, **absent** des onze autres pages contrôlées.

`Organization`, `WebSite`, `SoftwareApplication` et `VideoObject` sont
inchangés.

### 15.3 Ce qui a été vérifié sans être modifié

- **Titles et descriptions longs** : conservés. Google tronque, il ne pénalise
  pas, et c'est le style maison validé page par page. Aucune duplication,
  aucune requête principale absente, aucun contresens FR/EN.
- **`VideoObject`** : durées confrontées aux fichiers réels. Le film dure
  **65,72 s** pour `PT1M6S` déclaré, la démo **34,4 s** pour `PT34S`. Vignettes
  et fichiers existent. Aucune donnée inventée.
- **`/le-film` et ses 143 mots** : page vidéo assumée, non gonflée.

### 15.4 Le test du clone propre

`sources-photos/` (48 Mo) et `sources-videos/` (8,7 Mo) sont exclus par
`.gitignore` : les committer alourdirait l'historique de façon irréversible pour
des fichiers que seul le poste de travail utilise.

**Vérifié plutôt que supposé** : l'index Git a été matérialisé dans un dossier
neuf (`git checkout-index`), soit exactement ce qu'obtiendrait un clone frais,
353 fichiers, 38 Mo, sans aucune source lourde. `next build` y **réussit**,
40 pages générées. Toutes les images référencées par le code existent dans ce
clone : 52 AVIF et 52 WebP lifestyle, 9 captures, 8 bouteilles, 6 fichiers
vidéo.

**Un clone propre construit le site.** C'est le test qui tranchait.
