# Refonte v3 « À l'unisson » — le sort de chaque contenu existant

> **⇢ Pour l'état ACTUEL du site, lire d'abord `refonte-v3-etat-final.md`.**
> Ce document-ci reste le journal des directives éditoriales et de la
> construction page par page ; l'état final (architecture, routes, pages LOCK,
> règle de protection du produit dans sa version corrigée, purges, assets en
> attente) y est consolidé au 2026-08-14.

> **Directive d'Eric, 2026-08-12** : la homepage séduit, les pages
> fonctionnelles prouvent. AUCUN bon contenu n'est supprimé parce qu'il quitte
> la homepage — il est reclassé. Ce document est la référence de la Phase 2
> (architecture des pages fonctionnelles), à ne pas ouvrir avant la validation
> visuelle de la homepage.

## Les deux niveaux

| Niveau | Surface | Mission |
| --- | --- | --- |
| 1 — Séduire | Homepage | « Je comprends iQWine. Je comprends Octave. Je veux l'essayer. » |
| 2 — Prouver | Pages fonctionnelles | « Maintenant je comprends tout ce qu'il peut réellement faire. » |

Règle : simplifier la homepage ne simplifie pas le produit — c'est mettre la
bonne information au bon endroit.

## Classification (état au 2026-08-12, début de l'implémentation)

Légende : **1** = homepage · **2** = page fonctionnelle · **3** = asset
réutilisable · **4** = archive. Rien n'est effacé du dépôt, y compris en 4.

| Élément | Classe | Destination / remarque |
| --- | --- | --- |
| Hero « Le Rayon » + SectionQuestion + SectionRayonMagasin (neufs) | 1 | La nouvelle narration (mouvements 1-3, implémentés) |
| Démo interactive (SectionDemo + DemoPhone + photos de bouteilles) | 1 + 2 | Home au mouvement 5 (le plat) ; version longue sur la page Accords mets-vins |
| « Même question. Deux réponses. » + Jour 1/Mois 3/Mois 12 (SectionPalais) | 1 + 2 | Cœur du mouvement 9 (allégé) ; développement complet sur la page Octave |
| Film de marque (film-iqwine.mp4, teaser, page /le-film, FilmPlayer) | 1 (pastille) + 2 | Pastille au mouvement 2 (fait) ; le film entier reste sur /le-film et pourra ouvrir le hub Fonctionnalités |
| Vidéo démo de l'app (octave-demo.webm/mp4) | 1 + 2 | Recadrée séquence carte pour le mouvement 4 (restaurant) ; entière sur la page Carte des vins |
| Capture cellier desktop (08-cellier-desktop) | 1 + 2 | Mouvement 7 (une seule, grande) ; galerie sur la page Cellier intelligent |
| Captures d'app 01-06 (fiche, suggestions, menu-scan, carnet, cave, recherche) | 3 | Réservoir de preuves pour les pages fonctionnelles ; captures THÈME CLAIR à produire (brief F du concept) |
| SectionSaq (« Octave sait exactement où elle est », pastille dispo) | 2 + 3 | Retirée de la home (remplacée par le mouvement 3) ; son contenu nourrit la page Points de vente |
| SectionPourquoi (tension apogée/bouteilles oubliées) | 3 | Retirée de la home ; ses lignes nourrissent les pages Apogée et Cellier |
| SectionMomentsEnjeu (soirs à enjeu + frise 3 états d'apogée) | 1 (frise) + 2 | La frise d'apogée nourrit le mouvement 8 ; le reste, la page Apogée |
| SectionTroisMoments (3 iPhones + kill-shot resto) | 3 | Sera éclatée dans les mouvements 4-6 ; le comparatif resto nourrit la page Carte des vins |
| SectionPiliers (chapitres I-IV) | 3 | Devient « Choisir · Accorder · Collectionner » (pied de home + hub) ; lien /octave→/sommelier-ia corrigé |
| SectionCaveWeb (« Une cave qui se souvient ») | 1 (transformée) | Mouvements 6-7 « Votre cave sait quand ouvrir » |
| Tableau comparatif (SectionComparison — ChatGPT/Vivino/CellarTracker) | 3 | Retiré de la home à terme ; l'argument « un assistant générique vous redécouvre » survit en une ligne (mvt 9) ; le tableau peut vivre sur /tarifs si utile |
| SectionCercle (« Le Cercle iQWine ») | 4 | Promesse de communauté que le produit s'interdit ; le ShareButton (composant) est réutilisable |
| SectionConfiance (témoignages bêta + badges) | 1 | Mouvement 10, près de la décision |
| Tarifs (Pricing + toggle) + FAQ | 1 + 2 | Mouvement 10 resserré ; détail complet sur /tarifs |
| HeroV4 + HeroDemo + HeroTrustBar | 3 | Remplacés par HeroRayon ; le crossfade de captures (HeroDemo) est réutilisable sur les pages fonctionnelles ; la trust bar nourrit le mouvement 10 |
| Pages piliers /apogee, /recherche, /recevoir (PillarPage) | 2 | Embryons des pages fonctionnelles Apogée / Points de vente / Accords |
| /sommelier-ia (Octave à la 1re personne, 540 l.) | 2 | La future page Octave — la plus proche du nouvel esprit |
| /notre-maison, /le-film, /beta, /contact, légal | conservées | Routes intouchables (liens app iOS) ; reskin seulement |

## Pré-architecture des pages fonctionnelles (Phase 2 — à valider)

Candidates d'Eric ↔ existant :

| Candidate | Point de départ existant | Assets disponibles |
| --- | --- | --- |
| Octave — Sommelier IA | `/sommelier-ia` | OctaveContent, DemoPhone, TestimonialRotator, SectionPalais |
| Carte des vins | — (à créer) | octave-demo vidéo, capture 03-menu-scan, kill-shot resto |
| Accords mets-vins | `/recevoir` (menus accordés) | SectionDemo/DemoPhone, photos bouteilles |
| Cellier intelligent | — (à créer, ou extension de la home M7) | 08-cellier-desktop, 05-cave-visuelle (non référencée !), SectionCaveWeb |
| Apogée | `/apogee` | frise 3 états, PillarPage, lignes de SectionPourquoi |
| Scan d'étiquette | — (à évaluer : capacité réelle = 5 chemins d'entrée) | capture 01-fiche-vin |
| Points de vente | `/recherche` | SectionSaq, capture 06-recherche-hors-cave |

Footer cible : colonne **« Fonctionnalités »** listant ces pages — la porte
d'entrée vers la profondeur produit. Liens contextuels depuis la home
(« Découvrir → ») seulement quand ils aident le parcours.

SEO : une page = une intention. Aucune page créée « pour le SEO » sans valeur
utilisateur réelle. Les routes existantes ne changent pas d'URL sans décision
d'Eric (redirections 301 sinon).

## Garde-fous d'implémentation (actifs dès maintenant)

1. Aucun fichier/asset supprimé — les sections sorties de la home restent
   compilables dans `src/components/sections/`.
2. Aucune route existante cassée ; les ancres publiques (`#demo`, `#tarifs`…)
   suivies dans la nav sont maintenues ou re-pointées dans le même commit.
3. Chaque mouvement de la home est un composant autonome, déplaçable tel quel
   vers une page fonctionnelle.
4. Chantier actuel : la homepage validée, rien d'autre. La Phase 2 démarre
   après la validation visuelle, avec la proposition complète (pages, URLs,
   hiérarchie, footer, objectifs marketing/SEO, réutilisation des assets).

## Règle permanente — design de toutes les pages (Eric, 2026-08-13)

**Le look & feel vient de la nouvelle homepage** (palette ivoire/bordeaux/or/
nuit, Cormorant + Hanken, respiration éditoriale, ligne d'accord, Octave comme
voix, interfaces = preuves). **Le rythme clair/sombre s'adapte au storytelling
de CHAQUE page** — jamais une alternance mécanique : la lumière suit l'histoire
(une page peut être majoritairement claire, basculer vers la nuit à la preuve
ou au climax, revenir à la lumière). **Les preuves viennent de l'ancien site et
de l'application réelle** — adaptées, recadrées, recolorées ou refaites pour
sembler nées dans cette DA ; thème d'interface (clair/sombre) assorti au
mouvement de la section, avec assez de contraste pour rester une preuve.
**Le produit réel reste la source de vérité.** Même ADN, histoires différentes ;
même palette, rythmes différents ; même Octave, moments différents.

## Règle photo (Eric, 2026-08-14)

La home = référence de DA, PAS une photothèque. Les photos humaines/
émotionnelles sont EXCLUSIVES à chaque page (jamais réutilisées d'une page à
l'autre) ; seules les preuves produit (captures, films, démos) se réutilisent,
adaptées. Toute nouvelle photo = brief à Eric (page, section, objectif
narratif, scène, ratio, dimensions px, zone de sécurité, comportement mobile) ;
il génère, l'agent intègre et optimise (AVIF/WebP + tailles responsives).
Asset à harmoniser plus tard : badge du film « Propulsé par Octave · Québec ».

## Règle de copy (Eric, 2026-08-14)

Aucun tiret cadratin « — » comme pause dans les phrases du site : virgules.
Appliqué rétroactivement à tout le contenu (294+ occurrences). Les titres SEO
utilisent « · » comme séparateur de marque (« Tarifs · iQWine »), jamais un
tiret. Les commentaires de code ne sont pas concernés (mais ceux retouchés au
passage restent tels quels).

## État des pages (2026-08-13, fin de journée)

- Home V1 : VERROUILLÉE (reste : photo Repas S4B + passage Safari d'Eric).
- Hub /fonctions : VERROUILLÉ (4 photos exclusives d'Eric intégrées).
- /cellier-intelligent : **LOCK définitif** — plus aucune modification sauf
  bug/QA. 3 photos exclusives, 05-cave-visuelle en première utilisation,
  147/147 contrôles.
- /accord-mets-vins : conception validée (S1 corrigée : le MOMENT, pas les
  règles ; S3 = démo jouable, climax produit). En attente des 3 photos
  d'Eric (accord-moment, accord-geste, accord-recevoir) avant codage.
  Au codage : 301 /recevoir → /accord-mets-vins dans le même déploiement.

Mise à jour : /accord-mets-vins est LOCK définitif (2026-08-13) — construite,
micro-passe responsive validée (bascule mobile de la démo, carte d'accord sous
la photo), 301 /recevoir posées et vérifiées (156/156). Prochaine : conception
/sommelier-ia.

Mise à jour (2026-08-14) : /sommelier-ia refondue (micro-passe validée) et
/carte-des-vins construite — la vidéo réelle du scan y est le climax produit,
avec VideoObject. Correctif technique au passage : OctaveDemoVideo mettait la
vidéo en lecture même sous prefers-reduced-motion (l'attribut autoplay du SSR
démarre avant le hook client) ; la pause est désormais appliquée sur
l'élément, contrôles rendus. Restent : /choisir-un-vin (+301 /recherche),
refonte /apogee, QA globale + purge des fichiers hérités.

Mise à jour (2026-08-14, suite) : /choisir-un-vin construite (FR + EN,
/en/how-to-choose-wine) — conception validée avec 3 ajustements d'Eric :
S4 formule le RÉSULTAT cave + proximité sans décrire la mécanique (titre et
texte fournis par lui), aucune revendication d'exclusivité nulle part, et la
conclusion porte sur la personne (« La bonne bouteille existe. Celle qui vous
ressemble. »). 301 /recherche posées (fr, en/search, en/recherche), alias du
chemin nu, sitemap, vérificateur 170/170. Liens entrants rebranchés : hub
(carte « En magasin »), accueil S3, pied de page, menu Fonctions. Photos
CHOIX-01 (S1, paysage 3:2, min 2000×1333) et CHOIX-02 (S3, portrait 3:4,
min 1200×1600) à venir : emplacements aux ratios exacts, briefs au fil de la
conversation du 2026-08-14. Restent : refonte /apogee, QA globale + purge
des fichiers hérités (/recevoir, /recherche).

## Checkpoint stratégique du 2026-08-14 — P0/P1 exécutés

- C5 : la phrase stratégique (« Un sommelier connaît les vins… ») posée en S1
  de /sommelier-ia, FR + EN. Emplacement UNIQUE, ne pas la répéter ailleurs.
- C1/C2/C3 : les énumérations du profil de goût (« cépages, régions,
  styles ») retirées des textes explicatifs — montrer le résultat, jamais la
  mécanique. C4 : « voir sur quoi il s'appuie » remplace « voir comment il
  travaille ».
- /notre-maison devient À PROPOS DE NOUS (URLs et hreflang conservés :
  /notre-maison ↔ /en/our-story). BIO-2 = portrait (section 1), BIO-1 =
  narrative (section 2). Emplacements VISION-01/02 prêts, photos à venir.
- Vidéo octave-demo recadrée 90 s → 34 s sur les RÉSULTATS (protection du
  produit) ; original complet préservé dans sources-videos/ ; VideoObject,
  poster et aria-label alignés. Constat : l'original ne contenait aucun scan
  de carte des vins.
- Footer : « Notre maison » → « À propos de nous » / « About us ».


## Clôture de la phase 2 (2026-08-14)

/apogee refondue : dernier pilier hérité. Ouverture en NUIT (exception validée,
seule page Fonction qui va de la nuit vers le jour : regret → compréhension →
maîtrise → sérénité). URLs inchangées, donc aucune redirection.

QA globale v3 passée sur 14 pages × 2 langues × 4 largeurs (1440, 1280, 768,
393), soit 112 rendus. Défauts trouvés et corrigés : débordement horizontal de
142 px sur mobile (le SVG LigneAccord n'avait pas de largeur fluide et imposait
ses 480 px intrinsèques), « ,, » visible sur la page Tarifs (séquelle de la
passe des tirets cadratins), dernier tiret cadratin rendu (demoData, anglais),
TARIFS disparu de la navbar desktop après l'ajout de « Notre histoire »
(indices codés en dur), titres /apogee trop longs.

Purge effectuée : recevoir/, recherche/ et components/pillars/ (voir l'état
final pour le détail des vérifications préalables).

RÈGLE DE PROTECTION DU PRODUIT CORRIGÉE : les preuves statiques (captures,
bouteilles, fiches, cartes de résultat) sont des PREUVES MARKETING et doivent
rester. Seuls les enregistrements et animations qui rejouent un workflow
complet, et les explications de mécanique interne, sont proscrits.


## Fermeture definitive de la v3 (2026-08-14)

/tarifs refondue (conversion d'abord : premier prix de 2 253 px a 1 208 px,
page de 8 428 a 6 532 px, offre inchangee), puis passe de direction artistique
(arc nuit/ivoire, cartes premium, disparition des cartes dans les cartes).
/beta corrigee (titre a l'echelle v3, plus de cesure). Passe claire sur
/le-film, /contact, /beta et les deux pages legales.

TOUTES les pages publiques sont desormais LOCK. Assets APO-01, APO-02 et
REPAS-01 integres. Voir refonte-v3-etat-final.md pour l'etat qui fait foi.
