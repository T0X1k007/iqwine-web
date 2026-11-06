# Corrections préparées des fiches App Store et Google Play

Préparé le 2026-11-06 à partir des fiches **inspectées dans les consoles** (voir `ADDENDUM-CONSOLES.md`, §4 et §5). **Rien n'a été saisi ni publié.**

Il y a deux natures de champs, à ne pas mélanger :
- **Textes commerciaux** (titre, sous-titre, descriptions) : corrigés ci-dessous.
- **Informations du titulaire** (compte personnel Play au nom d'Eric Bigras ; vendeur Apple Groupe Medtech inc.) : **inchangées**, conformément à ta consigne. Seuls les liens publics et l'adresse de contact de la fiche sont corrigés, sans toucher à l'identité légale.

Vérités produit utilisées (code servi, tag `v0.163.0` de l'app) :
- « Photographier un plat » existe : choix « Plat » de la caméra du sommelier (`messages/fr.json:1593`, Guide EN l. 5014). Il reste donc dans les fiches.
- **Aucun « historique des prix »** n'existe dans les textes de l'app (recherche vide dans `messages/`). La promesse « reconnaître un bon prix » est retirée : c'est aussi une promesse de « bonne affaire », interdite (doc produit 05 §5).

## Google Play Console

Un **brouillon non publié** existe déjà. Il corrige le titre anglais et retire « SAQ ». Les corrections ci-dessous s'appliquent **sur ce brouillon**, puis on l'envoie à l'examen.

### Fiche FR (fr-CA), paragraphe « EN MAGASIN, AU QUÉBEC »

Remplacer :

> Les disponibilités des points de vente de vins, succursale par succursale, et l'historique des prix pour reconnaître un bon prix quand il passe.

par :

> Dites ce que vous cherchez : Octave vous propose des vins qui vous ressemblent, avec leur disponibilité en magasin, magasin par magasin, partout au Québec, et leur prix affiché.

### Fiche EN (en-CA), paragraphe « IN STORE, IN QUEBEC »

Remplacer :

> Wine store availability, store by store, and price history, so you recognize a good price when it comes along.

par :

> Tell Octave what you're looking for: Octave suggests wines that suit you, with their in-store availability, store by store, across Québec, and their listed price.

Le titre EN du brouillon « iQWine – Personal Sommelier » est **à garder** : il remplace « iQWine — Cellar & Sommelier ».

### Coordonnées de la fiche (Présence sur le Store > Paramètres de la boutique)

| Champ | Actuel | Proposé |
|---|---|---|
| Site Web | `https://app.iqwine.ai` | `https://iqwine.ai` |
| Adresse de courriel | alias admin `@iqwine.ca` | `support@iqwine.ca` (alias d'assistance canonique, décision du 2026-09-16) |

### Politique de confidentialité (Règles et programmes > Contenu de l'appli)

| Actuel | Proposé |
|---|---|
| `https://app.iqwine.ai/confidentialite` | `https://iqwine.ai/fr/confidentialite` |

### Action obligatoire, distincte de la fiche

**Déclarer le statut de commerçant avant le 1er février 2027.** Sinon, Google retire l'appli. Seul le propriétaire du compte peut le faire.

## App Store Connect

La description d'une version déjà publiée ne se modifie qu'avec **une nouvelle version** : à préparer avec la prochaine soumission iOS. Le texte promotionnel et l'URL de la politique se modifient sans nouvelle version.

### Description FR (fr-CA)

| Actuel | Proposé |
|---|---|
| « Vous êtes dans un point de vente, face à un mur de bouteilles, sans savoir par où commencer. » | « Vous êtes en magasin, face à un mur de bouteilles, sans savoir par où commencer. » |
| « Parmi les vins disponibles dans les points de vente pris en charge, il vous aide à trouver ceux qui vous correspondent, et vous dit lesquels sont en succursale près de vous. » | « Parmi les vins offerts en magasin au Québec, il vous aide à trouver ceux qui vous correspondent, et vous dit lesquels sont disponibles près de vous. » |
| « Repérer, parmi les vins des points de vente pris en charge, ceux qui vous correspondent » | « Repérer, parmi les vins offerts en magasin, ceux qui vous correspondent » |

Retirer aussi le tiret cadratin de « …vous correspondent — et vous dit… » (une virgule le remplace dans la proposition ci-dessus).

### Description EN (en-CA), section « IN STORE »

Remplacer :

> Wine availability store by store, and price history, so you recognize a good price when it comes along

par :

> In-store availability, store by store, across Québec, and the listed price of every wine Octave suggests

### Confidentialité de l'app (sans nouvelle version)

| Actuel | Proposé |
|---|---|
| `https://app.iqwine.ai/confidentialite` | `https://iqwine.ai/fr/confidentialite` (et `https://iqwine.ai/en/privacy` pour la langue anglaise si le champ est localisé) |

### Accès à App Analytics

L'utilisateur « Admin iqwine » ne voit pas App Analytics. Le titulaire du compte doit lui accorder l'accès aux rapports (Utilisateurs et accès), sinon les sources d'installation restent invisibles.

## Fichiers source à aligner (dépôt de l'app, par sa session, sur sa procédure)

`cellier-vin/docs/ops/play-fiche-textes.md` (lignes 81 et 141, encore « SAQ ») et `cellier-vin/docs/ops/app-store-fiche-textes.md` : y reporter ces textes, pour que la prochaine copie ne réintroduise pas l'ancien vocabulaire.
