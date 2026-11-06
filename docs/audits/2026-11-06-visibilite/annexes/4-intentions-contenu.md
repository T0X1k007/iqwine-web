# Agent 4 · Intentions de recherche et contenu · iqwine.ai

Audit du 2026-11-06. Lecture seule : aucun fichier du dépôt modifié, aucun contact, aucun secret.
Pièces brutes : `/tmp/claude-1000/-home-ebigras-Projects-iQWine-Web/b169f3ff-26b5-4233-bc29-e163ffdd5eba/scratchpad/a4/` (`pages/*.html` et `*.txt` = texte servi des 30 URL + 3 pages de l'app ; `suggest/suggestions*.txt` = autocomplétion Google relevée le jour même).

## 0. Méthode

1. **Texte servi** : les 30 URL du sitemap récupérées par `curl` (UA navigateur, toutes en 200), puis extraction du title, de la meta description, des H1 à H3, des liens, des types JSON-LD et du texte visible (`a4/scripts/extract.py`). Le site servi est la branche `production`. `main` n'a que 3 commits d'avance (Notre histoire, Conditions), sans effet sur ce qui suit.
2. **Vérité produit** : `cellier-vin/docs/foundations/05-ce-que-le-produit-fait.md`, `lib/billing/plan-catalog.ts` lu **au tag `v0.163.0`** (la version en prod), `messages/fr.json` (Guide d'Octave, libellés de l'apogée), `docs/versions/JOURNAL.md`, `docs/decisions/2026-08-12-vocabulaire-magasin.md`, `~/ai-memory/projects/iqwine/{CONTEXT,CURRENT_STATE,DECISIONS}.md` (après `pull`), l'API iTunes Lookup (fiche App Store) et les fiches Google Play FR et EN.
3. **Signaux de demande** : autocomplétion de `suggestqueries.google.com` (client firefox, `gl=ca`, `hl=fr` puis `hl=en`) sur 55 requêtes de départ en français et 36 en anglais. **Aucun volume n'est inventé.** Le potentiel combine quatre signaux qualitatifs : (a) la requête est-elle suggérée, et avec combien de variantes ; (b) les modificateurs suggérés (gratuit, android, iphone, excel, saq…) ; (c) la concurrence observée par WebSearch (moteur américain, donc biaisé) ; (d) l'adéquation au produit et l'étape d'achat. Échelle Élevé / Moyen / Faible, avec un niveau de confiance.
4. **Concurrence** : WebSearch (sources en fin de document). Les affirmations des concurrents sont du texte de boutique, non vérifié.

## 1. Vérité produit : ce que le site peut promettre (vérifié le 2026-11-06)

| Sujet | Réalité servie | Source |
|---|---|---|
| Essai | **14 jours ou 25 conseils**, au premier atteint, fonctions du Passionné, sans carte ; jusqu'à 8 jours de plus selon le remplissage de la cave ; ensuite, retour au Gratuit | `plan-catalog.ts` @ `v0.163.0` (`TRIAL_AI_RECOMMENDATIONS = 25`) ; CURRENT_STATE 2026-11-06 |
| Forfaits | Gratuit 0 $ (100 bouteilles, 2 conseils/mois, 1 personne) · Passionné 14,95 $/mois ou 149 $/an (200, 50, 1) · Premium 29,95 $/mois ou 299 $/an (illimité, 200, 4) | `PLAN_CATALOG`, `FREE_LIMITS` |
| Plateformes | iOS en vente (1.2.1, 2026-11-01, 1 note) ; Android en production sur Play (1.0.3, **Canada et Portugal seulement**, « 1+ téléchargement ») **sans achat intégré** ; web | iTunes Lookup ; fiche Play ; CURRENT_STATE §Android ; `contexte-natif.ts` |
| En magasin | Disponibilité magasin par magasin et prix **d'un seul catalogue, au Québec**. Jamais « les magasins » au sens de plusieurs marchands | décision vocabulaire 2026-08-12 ; doc 05 §2.2 |
| Accord | Choix **déterministe** (moteur de score), l'IA rédige le pourquoi ; même question, même réponse ; sait dire non | doc 05 §2.1 |
| Apogée (moteur v7, prod 2026-11-06) | Quatre repères : Début, Apogée (« Vers » si estimation), **Sûr jusqu'en**, Garde maximale. Statuts : Jeune / À boire maintenant / À boire sans tarder / Au-delà de la garde estimée / « Vin évolué, à goûter ». Une pastille dit la **source** (producteur, magasin, estimation d'Octave) et trois barres la **fiabilité**. Facteur de format appliqué à la lecture (magnum) | `Guide.pourquoi-apogee` ; `lib/wine/apogee/lecture.ts` ; DECISIONS 2026-11-01 |
| Carte des vins | Photo **ou QR d'une carte en ligne** (drapeau `CARTE_EN_LIGNE` à 1 en prod depuis le 2026-10-11) ; trois bouteilles : meilleur accord, valeur sûre, choix audacieux ; prix situé par rapport à la carte, jamais au prix en boutique ; toute langue | JOURNAL v0.138.x ; `Guide.carte-vins-resto` |
| Entrée en cave | Photo d'étiquette, code-barres, rafale, reçu, **import CSV / Excel / JSON** (exports d'autres applications compris, sans modèle propre à chaque logiciel), « Est-ce le même ? » (v0.141.0), « Noter & conserver » | doc 05 §3.1 ; `Guide.importer-collection` ; JOURNAL |
| iPhone | Widget, Centre de contrôle, raccourcis Siri (FR et EN) | notes de version 1.2.1 |
| Interdits | multi-marchands ; apogée présentée comme une certitude ; bonne affaire ou chasse au rabais ; investissement ; communauté ; « propulsé par l'IA » en tête ; « bientôt » ; offre Restaurant B2B (en pause) ; « SAQ » visible ; « points de vente » et « succursale(s) » | doc 05 §5 ; DECISIONS 2026-09-16, 09-26, 09-27 |

**Divergence à nommer** : le mandat parle d'« Octave V3 non servi ». Or ai-memory (CURRENT_STATE, 2026-09-20) indique que le **Palais V3 est ALLUMÉ en production** (7 drapeaux `PALATE_*`). La règle LOCKED reste juste et ne change pas : ne promettre que ce que la version servie fait. Rien ci-dessous ne s'appuie sur une fonction non servie.

## 2. Carte des intentions (FR-CA et EN-CA)

Étapes : D = découverte · P = problème à résoudre · C = comparaison d'applications · A = choix et abonnement · U = utilisation concrète.
« Sugg. » = la requête ou ses variantes sortent de l'autocomplétion du 2026-11-06 (fichiers `suggest/`).

| # | Groupe | Étape | Requêtes FR-CA (exemples) | Requêtes EN-CA (exemples) | Signal | Conversion | Page | Potentiel · confiance |
|---|---|---|---|---|---|---|---|---|
| 1 | Appli de gestion de cave | P, C, A | application cave à vin (**gratuite**, **android**, **iphone**) ; application gestion cave à vin ; meilleure application de gestion de cave à vin ; comparatif application gestion cave à vin ; logiciel gestion cave à vin gratuit / **excel** ; inventaire cave à vin ; application cellier | wine cellar app (free, for iphone) ; wine cellar management app ; wine inventory app (for home, with barcode scanner, android) ; best wine cellar inventory app | Sugg. fortes, 5 à 10 variantes, modificateurs gratuit, plateforme, excel | Élevée | `/fr/cellier-intelligent` ↔ `/en/wine-cellar-app` (existe) | **Élevé** · moyenne |
| 2 | Choisir un vin (appli) | P, U | application pour choisir un vin ; application pour trouver le bon vin ; quel vin choisir ; quel vin acheter | app to choose wine ; wine selection app ; how to know what wine to order | Sugg. présentes mais peu de variantes ; « quel vin acheter » dérive vers la France (Lidl, Leclerc) | Moyenne | `/fr/choisir-un-vin` ↔ `/en/how-to-choose-wine` | Moyen · moyenne |
| 2b | Choisir un vin (général) | D | comment choisir un (bon) vin rouge / blanc / rosé ; … au supermarché | how to choose a wine for beginners | Sugg. fortes, intention éditoriale | **Faible** | aucune page dédiée (à ne pas créer) | Faible pour l'acquisition · moyenne |
| 3 | Sommelier IA | D, C | sommelier ia ; sommelier virtuel ; application sommelier ; (sommelier en ligne = formation, hors cible) | ai sommelier (app) ; ai wine sommelier app ; virtual sommelier ; personal sommelier app ; ai vs sommeliers wine pairing | FR : sugg. pauvres (« sommelier ia » sort sans variante utile) ; EN : riches, **concurrence dense** (Gioia, Vinea, Sommo, Sommi, Vinarai, Vincent d'InVintory, « vivino ai sommelier ») | Élevée | `/fr/sommelier-ia` ↔ `/en/ai-sommelier` | FR Moyen · EN Moyen (difficile) · faible |
| 4 | Recommandations personnalisées | D, U | recommandation vin (rouge, blanc) **saq** ; vin recommandé ; recommandation vin salut bonjour | wine recommendation app ; wine suggestion app | Sugg. FR dominées par des listes éditoriales et le nom du détaillant | Faible à moyenne | couvert par `/sommelier-ia` (pas de nouvelle page) | Faible · moyenne |
| 5 | Accords mets-vins | U, D | accord mets vins (**saq**) ; quel vin avec sushi / pizza / raclette / tartare / **fondue chinoise** / lasagne / huîtres / **côtes levées** ; application accord mets vins | wine pairing app ; best wine pairing app ; what wine goes with salmon / lasagna / smoked meat ; chatgpt wine pairing | Sugg. très fortes en longue traîne (plats) ; « application accord mets vins » existe | Plat isolé : faible ; appli : moyenne | `/fr/accord-mets-vins` ↔ `/en/wine-pairing` | Moyen (appli) / Élevé en volume mais faible conversion (plats) · moyenne |
| 6 | Apogée, quand boire | P, U | **quand boire un vin application** ; apogée d'un vin ; connaître l'apogée d'un vin ; qu'est-ce que l'apogée d'un vin ; potentiel de garde ; comment connaître le temps de garde d'un vin | **wine drinking window app** ; drinking window calculator / chart ; **when to drink wine app** ; drinking window for barolo / brunello / châteauneuf | Sugg. explicites « … application » / « … app » dans les deux langues | Élevée (propriétaires de cave) | `/fr/apogee` ↔ `/en/drinking-window` | **Élevé** · moyenne |
| 7 | Appli vin au Québec | C, A | application vin québec (aucune sugg.) ; appli cave à vin québec (aucune) ; application **saq** (android, iphone, ne fonctionne pas, **gpt**, inspire) | wine app canada ; best wine app canada ; wine app quebec (aucune sugg.) ; saq app (not working) | Formulations « Québec » quasi absentes ; la demande locale passe par le nom du détaillant (interdit) | Navigationnelle vers le détaillant : nulle pour nous | aucune page dédiée ; intégrer « partout au Québec » aux pages existantes | Faible en direct · moyenne (voir §5) |
| 8 | Scan d'étiquette | U, C | application scanner vin (prix, gratuit) ; application scanner étiquette vin ; application qui reconnaît les vins | wine label scanner app (iphone) ; scan wine label (for price) ; wine barcode scanner app ; best app to scan wine labels | Sugg. fortes ; l'intention « prix » domine (terrain de Vivino) | Moyenne | partiel : `/cellier-intelligent` et `/choisir-un-vin` | Moyen · faible (risque de cannibalisation) |
| 9 | Carte des vins au restaurant (grand public) | P, U | comment choisir un vin au restaurant ; application vin restaurant (aucune sugg. utile) | how to choose / pick wine at a restaurant ; how to know what wine to order ; « wine list app » (**surtout B2B** : « for restaurants ») | Sugg. nettes sur le « comment » | Moyenne | `/fr/carte-des-vins` ↔ `/en/wine-list` | Moyen · moyenne |
| 10 | Tarifs, gratuité | A | application vin gratuite ; application cave à vin gratuite ; iqwine prix | wine cellar app free ; best wine app free ; free wine cellar management app | « gratuit » = premier modificateur dans les deux langues | Élevée | `/fr/tarifs` ↔ `/en/pricing` | **Élevé** (via le Gratuit 100 bouteilles) · moyenne |
| 11 | Plateformes | A | application iphone gestion cave à vin ; application cave à vin gratuite android | wine cellar apps for iphone ; wine app android ; best wine app for iphone ; wine scanning app for iphone | Sugg. fortes | Élevée | aucune section dédiée ; badges sur l'accueil seulement | Moyen · moyenne |
| 12 | Comparatifs | C | vivino alternative ; application comme vivino ; **cellartracker français** ; **cellartracker export** ; gestion cave à vin vivino ; comparatif application gestion cave à vin | vivino alternative (app, reddit) ; vivino vs … ; cellartracker vs vivino / oeni ; best wine cellar app | Sugg. présentes dans les deux langues | Élevée | **aucune page** | Moyen · faible |
| 13 | IA généraliste contre sommelier | C | chatgpt vin (bruit : Vinted) | chatgpt wine pairing ; ai versus human sommelier | Faible en FR | Moyenne | section de `/sommelier-ia` | Faible · faible |

**Lecture générale.** Les recherches qui convertissent sont celles qui contiennent **« application / app » + une tâche** (cave, apogée, scan, accord) ou un **modificateur d'achat** (gratuit, iphone, android, meilleure, comparatif, alternative). Les recherches de culture du vin (« comment choisir un vin rouge », « quel vin avec la raclette », « combien de temps garder un vin ouvert ») ont du volume mais convertissent mal. Elles appellent du contenu de masse, ce que la directive d'Éric exclut.

## 3. Pages existantes et pages manquantes

| Intention | Page existante | Couverture | Décision proposée |
|---|---|---|---|
| Gestion de cave | `/fr/cellier-intelligent` (439 mots) ↔ `/en/wine-cellar-app` (415) | Bonne ouverture émotionnelle ; ne dit rien du Gratuit, des plateformes, de l'import, ni de la migration ; aucune FAQ | **Enrichir** (plan n° 3) |
| Apogée | `/fr/apogee` (309) ↔ `/en/drinking-window` (315) | Title en question, mais la page n'y répond pas ; décrit l'ancien modèle à 3 états | **Refondre** (plan n° 2) |
| Sommelier IA | `/fr/sommelier-ia` (594) ↔ `/en/ai-sommelier` (538) | La meilleure page ; preuve « Octave vérifiable » renvoyée vers une page non indexée de l'app | **Enrichir** (plan n° 4) |
| Accords | `/fr/accord-mets-vins` (580) ↔ `/en/wine-pairing` (537) | La démo n'expose qu'un plat sur 4 dans le HTML | **Enrichir** (plan n° 5) |
| Restaurant (grand public) | `/fr/carte-des-vins` (347) ↔ `/en/wine-list` (331) | Ni le QR ni la méthode en trois bouteilles | **Enrichir** (plan n° 6) |
| Choisir en magasin | `/fr/choisir-un-vin` (386) ↔ `/en/how-to-choose-wine` (366) | Title informationnel et contenu produit ; ne dit pas « au Québec » | **Corriger** (plan n° 1) et arbitrer le title |
| Tarifs | `/fr/tarifs` (910) ↔ `/en/pricing` (889) | FAQ riche (FAQPage) mais erreurs de vérité | **Corriger** (plan n° 1) |
| Hub | `/fr/fonctions` ↔ `/en/features` | Bon maillage | Garder |
| Comparatif, alternative | **manquante** | n/d | **Créer une seule page** (plan n° 7) |
| Scan d'étiquette | **manquante** (partiel) | n/d | Conditionnelle (plan n° 8) |
| Plateformes | **manquante** (FAQ d'une ligne) | n/d | Section ou FAQ, pas une page |
| Appli Québec | **manquante** | n/d | Pas de page ; signal « partout au Québec » dans les pages existantes |
| Quel vin avec [plat] | **manquante** | n/d | **Ne pas créer** de pages par plat ; un bloc « à la table québécoise » dans `/accord-mets-vins` |

Aucune paire de pages n'est aujourd'hui en concurrence sur la même intention. Le seul risque de cannibalisation futur vient d'une page « scan » qui recouperait `/cellier-intelligent` (entrée en cave) et `/choisir-un-vin` (compagnon d'achat).

## 4. Constats

Format : classe · URL ou fichier · observation · preuve · conséquence · correctif · priorité · effort · confiance · critère de vérification.

**C-01 · CONFIRMÉ · essai annoncé à 12 conseils au lieu de 25**
- URL : 31 fichiers servis sur 30 URL + `/fr/beta`. Meta description de presque chaque page (« Essai : 14 jours ou 12 conseils »), JSON-LD `RegisterAction` présent partout, FAQ de `/fr/tarifs` et `/en/pricing` (« 14 jours, ou 12 conseils »), Conditions §3 (« 12 interactions avec Octave »).
- Preuve : `grep "12 conseils\|12 pieces of"` sur les HTML ; `git show v0.163.0:lib/billing/plan-catalog.ts` → `TRIAL_AI_RECOMMENDATIONS = 25`. La source du site, `src/lib/trial.ts`, a `TRIAL_RECOS = 12` et rappelle que changer l'un oblige à changer l'autre.
- Conséquence : le site sous-promet l'offre, et c'est le texte que Google affiche dans les extraits. Le site, l'app et les Conditions ne disent pas la même chose.
- Correctif : `TRIAL_RECOS = 25` dans `src/lib/trial.ts`, ce qui propage la valeur aux metas, à la FAQ et au JSON-LD. Les Conditions viennent de l'app (`legal-terms.generated.json`) : à resynchroniser après décision d'Éric sur le texte légal. Le garde-fou de coût de 0,90 $ est interne et ne se publie pas.
- P1 · S · confiance élevée · critère : `curl` de toutes les URL → zéro « 12 conseils » ou « 12 pieces », et Conditions alignées sur l'app.

**C-02 · CONFIRMÉ · vocabulaire interdit sur le site (« succursale », « point(s) de vente »)**
- URL : `/fr/tarifs`, FAQ « Qu'est-ce qu'un conseil » (« Une bouteille photographiée **en succursale** ») ; `/fr` (« Dans un **point de vente** pris en charge » + 2 textes alt) ; `/fr/cellier-intelligent` (« Le reçu d'un **point de vente** pris en charge ») ; `/fr/fonctions` (alt) ; `/llms.txt` (« points de vente pris en charge » ×2, « annuaire de succursales ») ; `/fr/confidentialite` (« points de vente »).
- Preuve : grep sur les HTML servis ; DECISIONS 2026-09-16 (« Ni "points de vente", ni "succursales" ») et 2026-09-27 (interdits « y compris dans les textes légaux »).
- Conséquence : écart avec une décision LOCKED, qui se retrouve aussi dans le texte que lisent les moteurs IA (`llms.txt`).
- Correctif : « en magasin » et « in store » partout. La Politique vient de l'app : à corriger à la source.
- P1 · S · élevée · critère : grep insensible à la casse « succursale|point de vente|points de vente » = 0 sur le site et `llms.txt`.

**C-03 · CONFIRMÉ (hors du site, signalé) · les fiches des boutiques contredisent les décisions LOCKED**
- URL : Google Play FR (« Les disponibilités **SAQ**, succursale par succursale, et l'historique des prix pour **reconnaître un bon prix** » ; 3 « SAQ » et 4 « succursale ») et EN (« SAQ availability… recognize a good price ») ; App Store FR (« points de vente pris en charge », « en succursale près de vous »).
- Preuve : `a4/pages/play-fr.html`, `play-en.html` ; iTunes Lookup.
- Conséquence : ces fiches se classent sur « application cave à vin android / iphone ». Elles enfreignent la règle « SAQ » (App Store et Play nommés explicitement) et l'interdit n° 3 (aucune promesse de bonne affaire). La fiche Play est datée du 16 septembre, le jour même de la décision.
- Correctif : geste d'Éric en console (Play et App Store Connect). Aucun agent ne touche aux boutiques.
- P1 · S · élevée · critère : relecture des deux fiches en navigation anonyme.

**C-04 · CONFIRMÉ · identifiant interne « Standard » visible dans la FAQ des tarifs**
- URL : `/fr/tarifs` et `/en/pricing`, FAQ « Dois-je donner ma carte ? » : « le jour où vous choisissez **Standard** ou Premium ».
- Preuve : JSON-LD FAQPage et texte servi.
- Conséquence : le libellé public est Passionné / Enthusiast. La réponse est aussi reprise par les extraits enrichis et les moteurs IA.
- Correctif : « Passionné ou Premium » / « Enthusiast or Premium » (`src/lib/faq.ts`).
- P1 · S · élevée · critère : zéro « Standard » visible.

**C-05 · CONFIRMÉ · la page Apogée décrit l'ancien modèle et ne répond pas à sa propre question**
- URL : `/fr/apogee`, `/en/drinking-window`, accueil (section « Ce soir ? »), `llms.txt`.
- Observation : le site montre trois états (« Trop jeune / À son sommet / À boire sans tarder »). L'app v7 affiche « Jeune / À boire maintenant / À boire sans tarder / Au-delà de la garde estimée », avec quatre repères (Début, Apogée ou Vers, Sûr jusqu'en, Garde maximale), une pastille de source et trois barres de fiabilité. Le title promet « Quand ouvrir une bouteille de vin ? » ; la page (309 mots) ne dit jamais comment on le sait.
- Preuve : `messages/fr.json` (`Guide.pourquoi-apogee`, `Apogee.carte.*`, `Vision.bottleWindowStatus_*`) ; texte servi.
- Conséquence : la capture et le vocabulaire du site ne correspondent plus à ce que l'utilisateur verra. L'intention la plus explicite de l'audit (« quand boire un vin application », « wine drinking window app ») tombe sur une page sans réponse à citer.
- Correctif : plan n° 2. **Attendre** que les libellés v7 encore ouverts soient stabilisés (« sans tarder » à deux sens, l'anglais « Safe until » : CURRENT_STATE 2026-11-06) avant de figer le texte.
- P1 · M · élevée · critère : libellés du site identiques à ceux de l'app ; une réponse directe de 40 à 80 mots présente dans le HTML.

**C-06 · CONFIRMÉ · la limite géographique « en magasin » n'est pas dite là où elle compte**
- URL : `/fr/choisir-un-vin`, `/en/how-to-choose-wine`, `/fr` et `/en` (« Disponible près de vous. Vérifié avant de vous y envoyer »).
- Observation : la disponibilité ne couvre que le Québec, puisqu'il n'y a qu'un catalogue. Seule la FAQ des tarifs le dit. Les pages anglaises visent pourtant l'EN-CA (requête « best wine app canada »).
- Conséquence : un visiteur ontarien est induit en erreur. Et le seul signal local conforme à la règle LOCKED (« partout au Québec ») manque sur les pages qui devraient le porter.
- Correctif : une phrase sur chaque page concernée, par exemple « La disponibilité en magasin couvre tout le Québec. Ailleurs, Octave vous conseille depuis votre cave, au restaurant et à table. » Sans « pour l'instant » (interdit n° 8 : rien d'annoncé « bientôt »).
- P1 · S · élevée · critère : la mention figure dans le HTML des 4 pages.

**C-07 · CONFIRMÉ · le contenu le plus citable vit sur un domaine non indexé**
- URL : `https://app.iqwine.ai/octave-verifiable` et `https://app.iqwine.ai/apprendre` (Guide d'Octave, environ 70 questions-réponses), liés depuis le pied de page de toutes les pages du site.
- Preuve : en-tête `x-robots-tag: noindex, nofollow` sur les deux.
- Conséquence : la preuve de confiance (choix déterministe, prix réels, « je ne sais pas ») et les réponses de méthode (lire une fenêtre de dégustation, choisir sur une carte, importer une collection) sont invisibles pour Google et les moteurs IA. Second point : le pied de page du site public renvoie vers `app.iqwine.ai`. C'est en tension avec la règle LOCKED n° 4, qui vise peut-être seulement les plateformes publiques. **Je n'ai pas tranché ; c'est à confirmer avec Éric.**
- Correctif : reprendre « Octave vérifiable » comme section de `/sommelier-ia`, et une à trois réponses du Guide, réécrites pour un visiteur, dans la FAQ de chaque page fonctionnelle. Garder l'app en noindex pour éviter les doublons.
- P2 · M · élevée (constat) / moyenne (gain) · critère : les passages figurent dans le HTML d'iqwine.ai ; le pied de page ne renvoie plus vers l'app (si Éric le décide).

**C-08 · CONFIRMÉ · la démo d'accords n'expose qu'un plat sur quatre**
- URL : `/fr/accord-mets-vins`, `/en/wine-pairing`.
- Preuve : dans le HTML servi, seule la réponse « lasagne » apparaît. « sushi », « huîtres » et « bœuf braisé » n'existent que comme boutons ; leurs réponses (`src/lib/demoData.ts`) ne s'affichent qu'au clic, côté client.
- Conséquence : trois réponses déjà rédigées, qui correspondent à des suggestions réelles (« quel vin avec sushi », « … des huîtres », « … lasagne »), ne sont pas indexables.
- Correctif : rendre les 4 réponses dans le HTML (onglets dont le contenu est présent dans le DOM), avec la mention « Exemple ».
- P2 · S · élevée · critère : `curl | grep "Blanc de Blancs"` trouve la réponse sushi.

**C-09 · OPPORTUNITÉ · le Gratuit n'existe pas pour les pages fonctionnelles**
- URL : `/fr/cellier-intelligent`, `/en/wine-cellar-app`.
- Observation : « gratuit / free » est le premier modificateur suggéré sur l'intention cave (« application cave à vin gratuite android / iphone », « wine cellar app free »). Le forfait Gratuit réel (100 bouteilles, sans date de fin, sans carte) n'est expliqué que sur `/tarifs`.
- Correctif : un bloc factuel « Gratuit jusqu'à 100 bouteilles, sans date de fin, sans carte » et un title qui l'assume (voir le plan n° 3).
- P2 · S · moyenne · critère : impressions sur les requêtes « gratuite / free » dans Search Console, 8 semaines après.

**C-10 · OPPORTUNITÉ · la migration depuis une autre application n'est pas racontée**
- Observation : le produit importe CSV, Excel et JSON, exports d'autres applications compris, en reconnaissant les colonnes (le Guide cite des exports CellarTracker et Vivino). Le site lui consacre une ligne (« Une cave déjà en tableur ? Elle s'importe. »). Requêtes suggérées : « cellartracker export », « cellartracker français », « gestion cave à vin excel », « vivino alternative ».
- Correctif : plans n° 3 et 7.
- P2 · S à M · moyenne.

**C-11 · OPPORTUNITÉ · des capacités livrées sont absentes du site**
- Observation : le widget iOS, le Centre de contrôle et les raccourcis Siri (1.2.1), le **QR de carte en ligne** (en prod depuis le 2026-10-11), « Est-ce le même ? » et « Noter & conserver » ne figurent sur aucune page (grep « widget|siri » : zéro résultat).
- Conséquence : rien ne répond à « wine app for iphone », ni au cas devenu courant d'une carte de restaurant consultée par QR.
- Correctif : une ligne sur `/carte-des-vins` (QR), une sur `/cellier-intelligent` (iPhone), une FAQ plateformes.
- P2 · S · élevée (livré) · critère : présence dans le HTML.

**C-12 · CONFIRMÉ · la FAQ « Octave peut-il se tromper ? » élude la question**
- URL : `/fr/tarifs`, `/en/pricing`.
- Observation : la réponse est « Octave ne devine pas : il s'appuie sur des données… ». Elle ne dit jamais oui, alors que le site lui-même écrit « Un repère assumé, jamais une promesse ».
- Conséquence : une réponse évasive se cite mal et fragilise la confiance, qui est l'argument central.
- Correctif : voir la réponse proposée au §7.
- P2 · S · élevée.

**C-13 · HYPOTHÈSE · le title de `/choisir-un-vin` ne correspond pas à l'intention qu'il vise**
- Observation : « Comment choisir un bon vin ? Votre sommelier IA vous guide » vise une requête éditoriale (les suggestions dérivent vers « rouge », « supermarché », « Bordeaux »), alors que la page est un argumentaire produit sans critères de choix.
- Conséquence probable : faible taux de clic ou rebond rapide. Non mesuré, faute d'accès à Search Console.
- Correctif, au choix d'Éric : (A) garder le title et ajouter une réponse directe courte (trois questions à se poser : le plat, le budget, ce que vous avez aimé la dernière fois ; Octave fait la troisième pour vous) ; (B) viser l'intention de l'appli : « Application pour choisir un vin en magasin, selon votre palais ».
- P2 · S · faible · critère : CTR et position de la page dans Search Console avant et après.

**C-14 · CONFIRMÉ · des composants archivés contiennent des affirmations fausses sur les concurrents**
- Fichiers : `src/components/sections/SectionComparison.tsx` (Vivino « ne lit pas une carte de restaurant » ; « Exclusif » ; iQWine « non » sur la localisation physique, alors que le cellier visuel existe) et `SectionTroisMoments.tsx` (« ChatGPT ne voit pas la carte »).
- Preuve : Vivino scanne les cartes des vins depuis 2017 (sources en fin de document) ; ChatGPT accepte des images ; Éric interdit toute revendication d'exclusivité (`refonte-v3-contenus.md`, 2026-08-14). Ces composants ne sont **pas servis**.
- Conséquence : une reprise telle quelle pour une page comparative exposerait à de la publicité trompeuse.
- Correctif : ne pas les réutiliser ; repartir de faits datés et sourcés (plan n° 7).
- P2 · S · élevée.

**C-15 · OPPORTUNITÉ · « sommelier IA qui apprend vos goûts » n'est plus distinctif en anglais**
- Observation : au moins 6 applications anglophones revendiquent exactement cette promesse (Gioia, Vinea, Sommo, Sommi, Vinarai, Vincent d'InVintory).
- Correctif : appuyer `/en/ai-sommelier` sur des différences **vérifiables** : la même question donne la même réponse (choix déterministe) ; il sait dire non ; il connaît votre cave à la case près ; disponibilité en magasin au Québec ; conçu en français ; hébergé au Canada ; aucune vente de vin, aucune commission. Ne revendiquer aucune exclusivité.
- P2 · M · moyenne.

**C-16 · CONFIRMÉ · le H1 de la page Tarifs se lit « Trouvez votre ctave. »**
- Preuve : le « O » est un SVG (`role="img" aria-label="Octave"`) suivi d'un `<span>ctave</span>`. Une extraction de texte donne « ctave », et le H1 ne contient pas le mot « tarifs ».
- Correctif : texte réservé aux lecteurs d'écran (`sr-only`) « Octave » à la place de l'`aria-label`, ou surtitre « Tarifs » dans le H1.
- P3 · S · élevée.

**C-17 · CONFIRMÉ · tirets cadratins servis**
- URL : FAQ `/fr/tarifs` (« sans date de fin — et un cadeau », « utilisateurs — et chaque ») et `/en/pricing`, dans le JSON-LD comme dans le texte visible.
- Correctif : des virgules (règle d'Éric du 2026-08-14).
- P3 · S · élevée.

**C-18 · OPPORTUNITÉ · les témoignages réels et consentis ne sont servis nulle part**
- Observation : `src/lib/testimonials.ts` contient André (Terrebonne), François (Saint-Jérôme) et Cédric, avec consentement daté du 2026-06-22. Aucune page ne les affiche depuis la v3 (grep « Terrebonne » : zéro).
- Correctif : un témoignage par page, à l'endroit de la preuve. **Pas** de balisage `Review` ni `AggregateRating` : il s'agit d'avis sur son propre produit, et l'App Store n'affiche qu'une note.
- P3 · S · élevée.

**C-19 · CONFIRMÉ · « mode Restaurant » prête à confusion avec l'offre B2B en pause**
- URL : `/fr/tarifs` (« le mode Restaurant »), `/en/pricing` (« Restaurant mode »). En anglais, « wine list app » est surtout une requête B2B (« for restaurants »).
- Correctif : « la carte des vins au restaurant ». Ne viser aucune requête de logiciel pour restaurateurs.
- P3 · S · moyenne.

**C-20 · OPPORTUNITÉ · `llms.txt` n'a pas les faits que les moteurs IA cherchent**
- Observation : aucun prix, aucun détail de l'essai, aucune plateforme, ancien modèle d'apogée, vocabulaire interdit (C-02).
- Correctif : ajouter les forfaits en dollars canadiens, l'essai, iOS / Android (Canada) / web, FR et EN, le Québec pour la disponibilité, la méthode d'apogée en 3 lignes, puis le lien Support canonique (`https://iqwine.ai/support`).
- P2 · S · élevée.

**C-21 · HYPOTHÈSE · promesse difficile à prouver sur `/sommelier-ia`**
- Observation : « Mois 12 : il connaît votre palais mieux que vos invités. »
- Conséquence : aucune mesure ne soutient cette phrase ; elle est sans risque juridique, mais peu citable.
- Correctif : la garder comme image d'émotion, ou l'ancrer dans un fait (« Ce qu'Octave a compris de vous », écran réel).
- P3 · S · faible.

## 5. Le cas « appli SAQ » sous la règle LOCKED

**Ce que montrent les suggestions** (FR, `gl=ca`) :
- (a) **Navigationnel** vers le détaillant : « application saq » (android, iphone, ne fonctionne pas, gpt, inspire, francais), « saq inspire … », « saq app not working ». Ces personnes cherchent l'appli du détaillant. Même sans la règle, viser ces requêtes ne rapporterait presque rien et exposerait à un risque de marque (faire croire à une affiliation).
- (b) **Achat local** : « accord mets vin saq », « recommandation vin rouge saq », « recommandation vin blanc saq », « recommandation vin saq ». Les Québécois **ajoutent le nom du détaillant pour dire "achetable ici"**. C'est l'intention la plus proche de « En magasin » d'Octave.
- (c) **Curiosité IA** : « application saq gpt ». Aucune application de ce genre trouvée chez le détaillant (WebSearch, confiance faible : moteur américain).
- « application vin québec », « wine app quebec », « appli cave à vin québec » : **aucune suggestion**. La demande locale ne passe pas par le mot « Québec ».

**Impact de la décision LOCKED** : les requêtes (b) en correspondance exacte sont largement perdues. Le site peut en récupérer une partie par la sémantique (« en magasin, partout au Québec », « prix en dollars canadiens », « disponible près de chez vous »), par les signaux `fr-CA` et `areaServed` Québec (déjà dans le JSON-LD), et par des exemples de plats québécois. Je qualifie la perte de **modérée et non chiffrable** (confiance faible).

**Formulations conformes à utiliser** :
- « La disponibilité en magasin, magasin par magasin, partout au Québec. »
- « In store, store by store, across Québec. »
- « Un vin que vous pouvez acheter près de chez vous ce soir. »

À ne jamais écrire : « vos magasins », « vos cavistes » (promesse de plusieurs marchands), « points de vente », « succursales ».

**ARBITRAGE d'Éric (non recommandé comme acquis)** : lever la règle, ou l'étendre à une phrase factuelle d'attribution hors des textes légaux (par exemple dans une FAQ : « Source des disponibilités : Société des alcools du Québec. iQWine n'est pas affilié… »), sur le modèle de l'exception du 2026-09-27 pour les Conditions §7. À peser : le gain est seulement sémantique (une mention d'attribution ne fait pas classer sur « recommandation vin saq »), il y a un risque de laisser croire à un partenariat, et un risque de marque. Mon avis : le statu quo tient, et l'effort va mieux aux intentions 1, 6 et 10. Indépendamment, les fiches Play et App Store enfreignent déjà la règle (C-03).

## 6. Plan éditorial priorisé (8 chantiers au plus)

Les pages publiques sont LOCK (`refonte-v3-contenus.md`) : chaque chantier exige le GO d'Éric. Le tableau livrable de `refonte-v3-seo.md` (URL, intention, title, H1, meta, sections, liens, CTA, Schema) est à produire pour chaque page validée.

| # | Chantier | Pourquoi maintenant | Prio · effort |
|---|---|---|---|
| 1 | **Passe de vérité transverse** : essai 25 (C-01) ; vocabulaire (C-02) ; « Standard » (C-04) ; « partout au Québec » (C-06) ; FAQ « se tromper » (C-12) ; tirets (C-17) ; « mode Restaurant » (C-19) ; `llms.txt` (C-20) | Corrige ce que Google et les moteurs IA citent déjà ; aucune nouvelle page | P1 · S |
| 2 | **Refonte `/fr/apogee` ↔ `/en/drinking-window`** | Intention « … application / app » explicite dans les deux langues ; la méthode du moteur v7 est vérifiable et unique à raconter | P1 · M (après stabilisation des libellés v7) |
| 3 | **Enrichir `/fr/cellier-intelligent` ↔ `/en/wine-cellar-app`** : Gratuit 100 bouteilles, import (tableur et exports d'autres applis), iPhone (widget) / Android / web, hors ligne, multi-caves, FAQ | Intention n° 1 en volume et en conversion | P1 · M |
| 4 | **Enrichir `/fr/sommelier-ia` ↔ `/en/ai-sommelier`** : section « Octave vérifiable » rapatriée, FAQ (Est-ce un assistant généraliste ? Hors du Québec ? Peut-il se tromper ? Mes données ?), différences vérifiables (C-15) | Concurrence anglaise dense ; preuve aujourd'hui non indexée | P2 · M |
| 5 | **`/fr/accord-mets-vins`** : les 4 réponses de la démo dans le HTML (C-08), et un bloc unique « À la table québécoise » (fondue chinoise, côtes levées, tourtière, pâté chinois), avec de vraies captures d'Octave, sans page par plat | Longue traîne suggérée, couverte sans contenu de masse | P2 · S à M |
| 6 | **`/fr/carte-des-vins` ↔ `/en/wine-list`** : QR de carte en ligne, méthode en 3 bouteilles, prix situé dans la carte, FAQ (langue étrangère, prix, discrétion) | Fonctions livrées absentes ; « comment choisir un vin au restaurant » suggéré | P2 · S |
| 7 | **Nouvelle page comparative honnête** : `/fr/comparatif-applications-vin` ↔ `/en/wine-app-comparison` (slugs à valider, sur le modèle de `/choisir-un-vin` et `/how-to-choose-wine`), avec une section « Changer d'application sans tout ressaisir » | « vivino alternative », « cellartracker français / export », « comparatif application gestion cave à vin » : aucune page aujourd'hui | P2 · M |
| 8 | **Page scan, conditionnelle** : `/fr/scanner-une-etiquette` ↔ `/en/wine-label-scanner`, seulement si Search Console montre des impressions sur les requêtes de scan dirigées vers `/cellier-intelligent` sans clics | Évite la cannibalisation tant que la donnée manque | P3 · M |

### Détail des chantiers 2 à 7 (structure, questions, liens, CTA)

**2. Apogée.** Ton : « Vous l'avez gardée dix ans. Vous l'avez ouverte un an trop tard. » (garder).
- Structure : problème (le regret) → la courbe (monter, s'ouvrir, redescendre) → **« Comment Octave le sait »** (sources dans l'ordre, pastille, fiabilité, format) → les quatre repères sur une **vraie capture** de la carte d'apogée v7 → les statuts → les alertes calmes (deux par semaine au plus) → limites → CTA.
- Questions à traiter : Qu'est-ce que l'apogée d'un vin ? Comment connaître le potentiel de garde d'une bouteille ? Que veut dire « Sûr jusqu'en » ? Un magnum se garde-t-il plus longtemps ? Puis-je corriger une fenêtre ? (oui : `Guide.editer-apogee`)
- Liens : entrée depuis l'accueil (« Ce soir ? ») et `/cellier-intelligent` ; sortie vers `/accord-mets-vins` (« ouvrez-la avec quoi ? ») et `/cellier-intelligent`.
- CTA : « Voir l'apogée de vos bouteilles » vers l'inscription.
- Title FR proposé : « Quand boire un vin ? L'apogée de chaque bouteille, avec Octave · iQWine ». EN : « When to drink a wine: the drinking window of every bottle · iQWine ».
- Potentiel élevé, confiance moyenne.

**3. Cellier.**
- Ajouter : « Gratuit jusqu'à 100 bouteilles, sans date de fin » ; « Cinq façons d'entrer une bouteille » (dont l'import, avec la phrase vérifiée du §7) ; « Sur iPhone, Android et le web » (widget et Centre de contrôle sur iPhone) ; hors ligne ; plusieurs caves ; FAQ (gratuit ? importer depuis Excel ou une autre appli ? Android ? combien de bouteilles ? mes données ?).
- Title FR : « Application de cave à vin, gratuite jusqu'à 100 bouteilles · iQWine » (à arbitrer contre l'actuel « …qui sait quand ouvrir »).
- Liens : vers `/apogee`, `/tarifs`, et la page comparative (n° 7).
- Potentiel élevé, confiance moyenne.

**4. Sommelier IA.** Garder « Même question. Deux réponses. »
- Ajouter « Ce qu'il ne fait jamais » : le contenu d'Octave vérifiable (choix calculé, prix réels ou annoncés comme estimation, « je ne sais pas ») et l'absence de toute vente de vin ou commission. Puis une FAQ.
- EN : ne pas copier le FR. Viser « ai sommelier app » avec les différences vérifiables de C-15.
- Potentiel moyen, confiance faible (concurrence).

**5. Accords.** Rendre les 4 plats de la démo dans le HTML. Bloc « À la table québécoise » : 4 plats, une réponse courte chacun, **produite par Octave et capturée telle quelle** (étiquetée « réponse réelle d'Octave, le [date] »), avec le principe d'accord en une phrase. Garder « Chaque repas, son fil de vins » (menu accordé, livré). Pas de pages par plat. Potentiel moyen.

**6. Carte des vins.** Ajouter « Photographiez la carte, ou son code QR » et la méthode en trois bouteilles. Ajouter une FAQ (carte en italien ? prix ? photo discrète ?). Ne pas parler aux restaurateurs. Potentiel moyen.

**7. Comparatif.**
- Contenu :
  - un tableau **daté**, sourcé, dont les cellules ne disent que ce qui est vérifiable chez chacun (sources publiques des éditeurs, date de relevé) ;
  - « Quand choisir une autre application » (honnêteté : Vivino pour les notes de la communauté, CellarTracker pour l'archive de notes et la cote du marché) ;
  - « Ce qu'iQWine fait autrement » (palais personnel, choix déterministe, cave à la case, apogée sourcée, français natif, Canada) ;
  - « Changer sans tout ressaisir » (l'import).
- Aucune exclusivité, aucun dénigrement, aucune réutilisation de `SectionComparison` (C-14). À relire avant publication, puis à revoir tous les six mois.
- Potentiel moyen, confiance faible.

## 7. Contenus citables proposés (fidèles au produit, à valider par Éric)

Chaque passage se lit seul et donne une réponse directe en 40 à 80 mots. Le vocabulaire est vérifié contre le Guide de l'app.

**« Comment Octave sait-il quand ouvrir une bouteille ? »** (`/apogee`)
> Il cherche d'abord les dates publiées par le producteur, pour ce vin et ce millésime. À défaut, la fiche du vin en magasin. Sinon, il raisonne comme un sommelier, sur CE vin : appellation, cépages, élevage, millésime, structure. Une pastille vous dit d'où vient la fenêtre ; trois petites barres, sa fiabilité. Un magnum garde plus longtemps qu'une bouteille. Et tout suppose une cave fraîche, sombre et stable : un repère, jamais une garantie.

Sources : `Guide.pourquoi-apogee` ; DECISIONS 2026-11-01 ; `lecture.ts`. ⚠ Le niveau de détail est à arbitrer avec la règle « montrer le résultat, jamais la mécanique », mais ce texte ne dit rien de plus que ce que l'app montre déjà à ses utilisateurs.

**« Que veut dire "Sûr jusqu'en" ? »** (`/apogee`)
> C'est l'année jusqu'à laquelle, selon Octave, ce vin restera vraiment bon après son apogée. Au-delà, il peut encore tenir jusqu'à sa garde maximale, mais il décline doucement.

À rédiger seulement quand le libellé v7 sera figé.

**« Octave peut-il se tromper ? »** (`/tarifs`, remplace la réponse actuelle)
> Oui. Une fenêtre de dégustation est une estimation, un palais se précise avec le temps, et une donnée peut manquer. Ce qu'il ne fait pas : inventer. Quand il ne sait pas, il le dit. Quand rien dans votre cave ne convient au plat, il le dit aussi.

**« Puis-je importer ma cave depuis une autre application ? »** (`/cellier-intelligent`, page n° 7)
> Oui. Apportez un fichier CSV, Excel ou JSON, votre tableur ou l'export d'une autre application de cave. Octave reconnaît vos colonnes, vous montre ce qu'il a compris, et rien n'entre sans votre accord. Les vins mal reconnus s'affichent pour que vous les corrigiez d'un regard.

**« Octave fonctionne-t-il hors du Québec ? »** (`/choisir-un-vin`, `/sommelier-ia`, EN)
> Oui, pour votre cave, l'apogée, les accords, la carte des vins au restaurant et le scan d'étiquette. La disponibilité et les prix en magasin couvrent le Québec.
>
> EN : « Yes, for your cellar, drinking windows, pairings, restaurant wine lists and label scanning. In-store availability and prices cover Québec. »

**« Comment choisir un vin sur une carte au restaurant ? »** (`/carte-des-vins`)
> Dites à Octave ce que vous mangez, puis photographiez la carte, ou son code QR si elle est en ligne. Il lit les vins et leurs prix, dans n'importe quelle langue, et fait ressortir trois bouteilles : le meilleur accord, une valeur sûre, un choix plus audacieux. Il situe chaque prix par rapport au reste de cette carte, jamais par rapport au prix en boutique.

**« Sur quels appareils ? »** (`/tarifs`, `/cellier-intelligent`)
> Sur iPhone (App Store), sur Android (Google Play, au Canada) et sur le web. Sur iPhone, un widget et le Centre de contrôle donnent accès au scan et aux accords en un geste.

⚠ NON VÉRIFIÉ : le parcours d'abonnement d'un utilisateur Android (aucun achat intégré). À confirmer avant d'écrire une phrase à ce sujet.

**Captures réelles à produire** (brief à Éric, règle photo du 2026-08-14) :
- carte d'apogée v7 avec pastille et barres de fiabilité ;
- résultat de carte des vins en 3 bouteilles ;
- écran d'import avec correspondance des colonnes ;
- « Ce qu'Octave a compris de vous » ;
- widget iOS.

Aucune capture de données personnelles réelles : utiliser un compte de démonstration.

## 8. Arbitrages nécessaires (Éric)

1. **Essai 25** : aligner le site **et** les Conditions §3 (« 12 interactions ») ; dire si l'extension jusqu'à 8 jours se publie.
2. **« SAQ »** : statu quo (recommandé par les règles) ou phrase d'attribution hors des textes légaux (§5). Les fiches Play et App Store sont à corriger dans tous les cas (C-03).
3. **Méthode de l'apogée** : jusqu'où l'expliquer face à la règle « jamais la mécanique » (2026-08-14). Ma proposition s'en tient à ce que l'app montre déjà.
4. **Liens du pied de page vers `app.iqwine.ai`** (Guide, Octave vérifiable) au regard de la règle LOCKED n° 4 ; rapatrier ces contenus sur iqwine.ai ?
5. **Title de `/choisir-un-vin`** : réponse directe (A) ou intention d'appli (B) (C-13).
6. **Title de `/cellier-intelligent`** : mettre « gratuite jusqu'à 100 bouteilles » en avant ?
7. **Page comparative** : nommer des concurrents (usage nominatif factuel), avec quelle cadence de mise à jour.
8. **Pages LOCK** : GO page par page pour les chantiers 2 à 6.

## 9. Limites

- **Aucun volume de recherche** : ni Search Console, ni Keyword Planner, ni outil tiers. Les potentiels sont qualitatifs. L'autocomplétion reflète la popularité relative, pas les volumes, et `gl=ca hl=fr` mélange des requêtes de France (Lidl, Leclerc, Vinted).
- **WebSearch est américain** : l'image de la concurrence en FR-CA est incomplète. Les SERP réelles de Google.ca n'ont pas été observées.
- Les affirmations des concurrents (Gioia, Vinea, Sommo, Oeni…) viennent de leurs fiches, non vérifiées. Les prix de CellarTracker sont contradictoires selon les sources.
- Je n'ai pas vérifié en appareil : l'achat sur Android, le widget, le rendu du QR de carte. Je me fonde sur le JOURNAL, les notes de version et le code.
- Le moteur d'apogée v7 est en prod depuis le 2026-11-06 et a des libellés encore ouverts : le texte proposé au §7 est provisoire.
- Le Guide de l'app a été lu dans `messages/fr.json` de la copie locale (`v0.163.0-30`), pas dans le HTML de l'app connectée.
- Les autres agents couvrent le SEO technique (Schema, hreflang, performance). Je ne cite ici que ce qui touche au contenu.

## Sources externes consultées (2026-11-06)

- Autocomplétion : `https://suggestqueries.google.com/complete/search` (relevés bruts dans `a4/suggest/`).
- App Store : `https://itunes.apple.com/lookup?id=6798458954&country=ca` ; fiche `https://apps.apple.com/ca/app/iqwine-sommelier-ia-vins/id6798458954`.
- Google Play : `https://play.google.com/store/apps/details?id=ca.iqwine.app` (fr_CA, en_CA).
- Vivino, scan de carte des vins : https://eftm.com/2017/05/vivino-winelist-scanner-39538 ; https://oresundstartups.com/get-instant-overview-wine-lists-restaurants-vivino-realeases-new-feature/ ; https://www.iculture.nl/nieuws/vivino-kan-nu-wijnkaarten-in-restaurants-inscannen/
- CellarTracker, abonnement et fonctions : https://support.cellartracker.com/article/25-voluntary-payment ; https://support.cellartracker.com/article/32-what-can-be-tracked
- Applications « sommelier IA » : https://apps.apple.com/app/id6755970777 (Gioia) ; https://apps.apple.com/us/app/id6763097970 (Vinea) ; https://apps.apple.com/app/id6757319027 (Sommo) ; https://play.google.com/store/apps/details?id=com.vinarai.app (Vinarai) ; https://invintory.com/blog/wine-and-food-pairings-what-an-ai-cellar-assistant-can-suggest/
- Applications de cave (FR) : https://apps.apple.com/FR/app/id6445827140 (Oeni) ; https://www.blick.ch/fr/lifestyle/food/vin/nous-avons-teste-pour-vous-voici-les-applications-les-plus-utiles-sur-le-vin-id17476976.html
