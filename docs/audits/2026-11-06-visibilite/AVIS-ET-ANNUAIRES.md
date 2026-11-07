# Demande d'avis et fiches d'annuaires (préparé le 2026-11-06, rien d'envoyé ni de publié)

## 1. Demande d'avis : déjà construite, rien à refaire

L'app servie (`v0.163.0`) contient déjà le dispositif : `lib/native/review-moment.ts` (dépôt `cellier-vin`), et le greffon `AvisBoutique` du wrapper (`iqwine-native/ios/App/App/GreffonAvisBoutique.swift`, plus l'équivalent Android).

- **Mécanisme officiel seulement** : `AppStore.requestReview` sur iOS, Google Play In-App Review sur Android. Aucune modale maison, aucune pré-question.
- **Moments de valeur** : dégustation aimée, bouteille ajoutée, recommandation jugée excellente, Année de cave lue.
- **Conditions** : au moins 3 moments, sur au moins 2 jours distincts, et 120 jours minimum entre deux tentatives. Garde côté client ; si quelque chose manque, l'app ne demande rien.

**Pourquoi seulement 1 note sur l'App Store** : la base est minuscule (6 installations Android ; nombre d'utilisateurs iOS à lire en base). Le dispositif ne peut pas produire d'avis sans utilisateurs actifs.

**Proposition** : n'ajouter aucune demande supplémentaire (règle « jamais d'interruption agressive »). Une seule amélioration de mesure, à décider : compter les **tentatives** de demande (événement agrégé, sans donnée personnelle) pour savoir si le seuil est atteint en pratique.

## 2. Annuaires pertinents : fiches prêtes à coller par Éric

Les règles de l'audit s'appliquent :
- toujours `https://iqwine.ai`, jamais `app.iqwine.ai` ;
- « iQWine » seul ; Mégane Bigras fondatrice, Éric porte-parole ;
- pas de Restaurant B2B, pas de « SAQ » ;
- essai : « 14 jours, 25 conseils d'Octave inclus ».

Les comptes se créent par Éric : je n'en crée aucun.

### Texte commun (FR)

- **Nom** : iQWine
- **Accroche (60 car.)** : Octave, le sommelier personnel qui apprend vos goûts
- **Description courte** : iQWine vous donne Octave, un sommelier personnel qui apprend votre palais. Il choisit dans votre cave l'accord pour ce soir, lit la carte des vins au restaurant, vous guide en magasin au Québec, et vous dit quand ouvrir chaque bouteille. Gratuit jusqu'à 100 bouteilles ; essai du forfait Passionné de 14 jours, sans carte.
- **Plateformes** : iPhone (App Store), Android (Google Play, Canada), web
- **Catégories** : Nourriture et boisson ; Style de vie ; IA
- **Liens** : https://iqwine.ai · App Store https://apps.apple.com/ca/app/iqwine-sommelier-personnel/id6798458954 · Google Play https://play.google.com/store/apps/details?id=ca.iqwine.app

### Text (EN)

- **Tagline**: Octave, the personal sommelier that learns your taste
- **Short description**: iQWine gives you Octave, a personal sommelier that learns your palate. Octave picks tonight's pairing from your own cellar, reads restaurant wine lists, guides you in store across Québec, and tells you when to open each bottle. Free up to 100 bottles; 14-day Enthusiast trial, no card required.

### Cibles, par ordre de pertinence

| Annuaire | Pourquoi | Prérequis |
|---|---|---|
| AlternativeTo | Les pages « alternatives à Vivino » et « à CellarTracker » captent l'intention comparative (WineIQ y figure) | Compte Éric ; proposer iQWine comme alternative à Vivino, CellarTracker et InVintory |
| Product Hunt | InVintory y est ; donne un lien et une page d'entité | Lancement à préparer : captures réelles, 1er commentaire de Mégane |
| Fiche Google Business Profile | **Non recommandée** : iQWine n'a pas d'adresse ouverte au public, et une adresse de domicile ne doit pas être exposée | aucun |

Mesure de l'effet : liens référents et impressions de marque dans Search Console, 8 à 12 semaines après la mise en ligne.

## 3. État au 2026-11-07

- **AlternativeTo** : aucune fiche iQWine (recherche faite). À créer depuis le compte d'Éric. Proposer iQWine comme alternative à Vivino, CellarTracker et InVintory.
- **Product Hunt** : distinguer deux choses.
  - La **page produit** se crée sans date.
  - Le **lancement** est un événement daté, qui mobilise une communauté : c'est une campagne, **non autorisée** à ce stade.

  L'accès est derrière une vérification anti-robot de Cloudflare.
- **Visuels** : captures réelles déjà publiées sur le site, `public/screenshots/` :
  - `07-apogee-cave` : apogée ;
  - `02-home-suggestions` : conseils d'Octave ;
  - `05-cave-visuelle` : la cave ;
  - `08-cellier-desktop` : le cellier sur le web.
