# Agent 5 · Autorité, marque et concurrence · iqwine.ai

Date des mesures : 2026-11-06 (UTC). Lecture seule : aucune modification, aucun contact, aucune inscription.
Outils : WebSearch (moteur de l'outil, index américain, **ce n'est pas Google**), API publique iTunes (`itunes.apple.com/search` et `/lookup`, `country=ca`), `curl` sur les pages publiques (WebFetch était bloqué pour la plupart des domaines), lecture des dépôts `iQWine_Web`, `cellier-vin` et `iqwine-native`, lecture seule de Metricool (`getBrandSettings`) pour retrouver les comptes sociaux de la marque.
Bruts conservés dans le scratchpad : `dl-itunes/`, `dl-play/`, `dl-conc/`, `dl-site/`.

---

## 1. Concurrents réellement visibles (5 retenus)

Constat préalable : sur les 14 requêtes passées (FR et EN, intentions cave, sommelier IA, accords, apogée, Québec), **aucune n'a fait remonter iqwine.ai ni les fiches iQWine**. Les résultats sont dominés par les fiches App Store, les agrégateurs d'applis (appgoblin, mwm.ai, apptail) et quelques blogues.

| # | Concurrent | Pages qui captent la demande (URL) | Profondeur du contenu | Preuves de confiance (source, date) | Mentions externes vérifiables | Présence dans des réponses IA | Différenciation réaliste pour iQWine |
|---|---|---|---|---|---|---|---|
| 1 | **Vivino** | https://www.vivino.com/en/ (rubriques Grapes, Regions, Wine News, Toplists) ; App Store https://apps.apple.com/ca/app/id414461255 | Très large : base vins, notes communautaires, pages vignobles et régions, place de marché. Pas de `llms.txt` (404, 2026-11-06). | API iTunes CA 2026-11-06 : **19 418 notes, 4,79/5**. Accueil : « Trusted by millions ». Fiche App Store (via recherche) : « 65 million users » ; un profil tiers relaie 77,7 M (non primaire). | Citée le plus souvent par les blogues québécois (francoischarron.com, prodigemobile.com), avec la réserve que la comparaison de prix sert peu au Québec. | NON VÉRIFIÉ (aucun accès aux moteurs IA) | Vivino répond « est-ce un bon vin selon la foule ? » ; iQWine répond « est-ce un bon vin **pour vous** ? », en français, avec des prix réels locaux quand ils sont publiés. |
| 2 | **CellarTracker** | https://www.cellartracker.com/ (anti-robot, HTTP 202) ; App Store https://apps.apple.com/ca/app/id6446102275 ; rapport https://insights.cellartracker.com/ | Référence des collectionneurs : notes de dégustation, fenêtres de consommation communautaires. | API iTunes CA : **1 647 notes, 4,83/5**. Business Wire 2026-04-23 : 200 M bouteilles suivies, 100 M ouvertes, 14 M avis, 5 M vins (https://www.businesswire.com/news/home/20260423291208/en/). Fiche CA : 8,8 M utilisateurs déclarés. | Business Wire, VinePair, Jancis Robinson (sondage). | NON VÉRIFIÉ | Interface experte et anglophone ; iQWine peut occuper « gestion de cave simple, en français, avec un sommelier qui explique ». |
| 3 | **InVintory** (Toronto) | https://invintory.com/ ; https://invintory.com/ai-sommelier/ ; comparatifs https://invintory.com/cellartracker et https://invintory.com/vivino ; https://invintory.com/llm-info/ ; https://invintory.com/mcp/ ; `llms.txt` complet (6,8 Ko) | **Le plus outillé pour les moteurs IA** : `llms.txt` avec tarifs, pages de comparaison, page « AI Sommelier » (Vincent lit aussi les cartes de restaurant), serveur MCP, centre d'aide de 138 articles avec son propre `llms.txt`. | API iTunes CA : **1 316 notes, 4,76/5**. Accueil : « 4.8, 4,000+ App Store ratings · 370k+ Collectors · 17M+ Bottles tracked ». Financement d'amorçage 2,3 M USD (newswire.ca, 2024-11). | newswire.ca, THE KIT (citée « As seen in »), Product Hunt (https://www.producthunt.com/products/invintory), partenariat Rosehill (Mississauga). | NON VÉRIFIÉ | **Concurrent le plus direct** : même prix affiché (14,95/mois, devise non précisée), essai de 14 jours, sommelier IA, cartes de restaurant. iQWine se distingue par le français natif, la disponibilité et les prix en magasin au Québec, l'apprentissage du palais et le « je ne sais pas ». |
| 4 | **Appli et site du détaillant provincial** (nommé ici par nécessité d'analyse ; règle LOCKED n° 1 : ce nom reste interdit dans nos textes visibles) | https://www.saq.com/fr/contenu/mot-cle/accords-vins-mets?p=1 (accords, pastilles de goût) ; App Store https://apps.apple.com/ca/app/id382431661 | Carrefour éditorial FR très riche sur les accords, les pastilles de goût, le service du vin. Appli : fidélité, achat, disponibilité, « des accords à partir d'un produit ». Ni cave, ni palais appris. | API iTunes CA 2026-11-06 : **24 115 notes, 4,72/5**, v6.9.1 du 2026-10-29. | Omniprésent dans les résultats FR « accord mets-vins » au Québec. | NON VÉRIFIÉ | Il vend ; iQWine ne vend pas et ne touche aucune commission. Accord **depuis votre cave et votre palais**, et non depuis un produit du catalogue. |
| 5 | **Oeni** (francophone) | App Store https://apps.apple.com/ca/app/id6445827140 (FR : « Oeni: #1 Gestion Cave à Vin ») | Cave 3D, grande base de vins, scan d'étiquette. | API iTunes CA : **697 notes, 4,72/5**. Revendique « l'application de cave la plus téléchargée en 2025 » (déclaration de l'éditeur). | Ressort sur « application gestion cave à vin » (FR). | NON VÉRIFIÉ | Concurrent francophone sur la cave ; iQWine se distingue par Octave et l'ancrage québécois. |

**Liste de veille (non retenus, preuves au même jour)** : WineIQ (homonyme, voir A-08) ; Delectable (1 490 notes CA) ; Wine-Searcher (1 281) ; Vinocell (517) ; Hello Vino (480, cartes de restaurant) ; Cellared, Cru, Vinoary (fenêtre de consommation, apparus en 2026) ; Sommo, Vinea, Gioia (sommeliers IA). Aucune appli « sommelier IA » québécoise n'a été trouvée.

---

## 2. Cohérence de l'entité iQWine (mesures du 2026-11-06)

| Élément | Site iqwine.ai (pages, JSON-LD, llms.txt) | App Store CA (id6798458954) | Google Play (`ca.iqwine.app`) | Réseaux sociaux | Verdict |
|---|---|---|---|---|---|
| Nom affiché | « iQWine » ; title FR « iQWine · Octave, votre sommelier IA qui apprend vos goûts » | FR « iQWine – Sommelier personnel » ; EN « iQWine – Personal Sommelier » | FR « iQWine – Sommelier personnel » ; **EN « iQWine — Cellar & Sommelier »** | YouTube « iQWine » (@iQWineApp) | Divergence EN Play (A-03) |
| Accroche | « Votre sommelier personnel. » ; Organization : « Le sommelier IA qui sait quoi ouvrir, quoi acheter et quoi commander. » | Sous-titre « Octave apprend vos goûts » / « Octave learns your palate » | FR courte : « Votre sommelier qui apprend vos goûts… » ; **EN courte : « Your cellar, finally alive… »** | YouTube : « Octave, votre sommelier **virtuel** … en voyage » | 4 formulations ; EN Play cave d'abord |
| Positionnement | Octave d'abord (conforme LOCKED n° 2) | Conforme | FR conforme ; **EN ouvre sur la cave** | n/d | A-03 |
| Vocabulaire « SAQ » | Absent (lot « zéro SAQ ») | Absent (« en magasin », « point de vente ») | **Présent FR et EN** | n/d | A-01 (LOCKED n° 1) |
| Éditeur / développeur | Organization « iQWine » ; légal Groupe Medtech dans Conditions | Développeur « iQWine », vendeur « Groupe Medtech inc. » | Nom « iQWine », **« À propos du développeur : Eric Bigras »** | Metricool : propriétaire `admin@iqwine.ca` | A-04 |
| Lien site | https://iqwine.ai | https://iqwine.ai | **https://app.iqwine.ai** | YouTube → https://iqwine.ai | A-02 (LOCKED n° 4) |
| Politique de confidentialité | /fr/confidentialite | **https://app.iqwine.ai/confidentialite** (champ Apple) ; https://iqwine.ai/confidentialite dans la description | **https://app.iqwine.ai/confidentialite** | n/d | A-02 |
| Courriel de support | iqwine.ai/support ; `support@iqwine.ca` dans les textes légaux | via iqwine.ai/support | **`admin@iqwine.ca`** (assistance) + `support@iqwine.ca` (développeur) | n/d | A-04 |
| Catégorie | `LifestyleApplication` | Food & Drink (+ Lifestyle) | Nourriture et boisson | n/d | Acceptable : la liste de catégories de Google n'a pas de valeur « nourriture » |
| Tarifs | Gratuit 0 $ ; Passionné 14,95 $/mois ou 149 $/an ; Premium 29,95 $/mois ou 299 $/an (CAD) | Identiques (149 $, 299 $, 14,95 $, 29,95 $) ; **libellés FR sur la fiche EN** (« Passionné annuel ») | Achats intégrés, montants non visibles | n/d | Cohérent ; A-11 |
| Essai | Meta description FR/EN et JSON-LD : **« 14 jours ou 12 conseils »** ; /tarifs : 14 jours, sans plafond affiché | Non mentionné | Non mentionné | n/d | A-05 (l'app servirait 25 conseils selon ai-memory) |
| Fonctions | 6 situations (llms.txt) | Restaurant, plat, magasin, cave, apogée, widget | Idem, sans widget (justifié : Android n'en a pas) | n/d | Cohérent |
| Notes et volumes | n/d | **1 note, 5,0** ; 18+ ; v1.2.1 du 2026-11-01 | **« 1+ téléchargements »**, aucun avis ; mise à jour 2026-09-16 | n/d | A-09 |
| Liens sociaux | **Aucun** (0 occurrence dans `src/`, pas de `sameAs`) | n/d | n/d | Instagram @iqwineapp, TikTok @iqwine, YouTube @iQWineApp, page Facebook (id 1297038106827804) | A-06 |
| Fondatrice | Page Notre histoire : Mégane Bigras fondatrice, Éric porte-parole (conforme) ; **pas de `founder` dans le JSON-LD** | n/d | n/d | n/d | A-07 |
| Lien App Store sur le site | `…/app/iqwine-sommelier-ia-vins/id6798458954` (ancien nom, redirigé) | URL canonique `…/iqwine-sommelier-personnel/…` | n/d | n/d | A-13 |

---

## 3. Constats

### A-01 · CONFIRMÉ · P1 · « SAQ » en vocabulaire générique sur la fiche Google Play
- **URL** : https://play.google.com/store/apps/details?id=ca.iqwine.app (hl=fr_CA et en_CA)
- **Observation** : FR « EN MAGASIN, AU QUÉBEC · Les disponibilités SAQ, succursale par succursale… » ; EN « IN QUEBEC · SAQ availability, store by store… ».
- **Preuve** : `dl-play/fr_CA.html`, `dl-play/en_CA.html` (2026-11-06). Source du texte : `~/Projects/cellier-vin/docs/ops/play-fiche-textes.md` l. 81 et 141 (dernier commit 06ca1476c, 2026-08-16, antérieur au lot « zéro SAQ »). La fiche Play date du 2026-09-16.
- **Conséquence** : viole la décision LOCKED n° 1 sur la surface publique la plus fiable aux yeux des moteurs ; le libellé diverge de l'App Store, qui dit déjà « en magasin ».
- **Correctif** : reprendre la formulation App Store (« Wine availability store by store, and price history… » ; FR : « Les disponibilités en magasin, succursale par succursale… ») dans la console Play et dans le document source.
- **Effort** : S · **Confiance** : haute · **Critère** : `curl` des deux fiches Play, `grep -c SAQ` = 0.

### A-02 · CONFIRMÉ · P1 · app.iqwine.ai exposé publiquement par les deux magasins d'applis
- **URL** : fiche Play (champs « Site Web » = `https://app.iqwine.ai`, « Politique de confidentialité » = `https://app.iqwine.ai/confidentialite`) ; fiche App Store (champ de politique Apple = `https://app.iqwine.ai/confidentialite`).
- **Preuve** : extraction des `href` dans `dl-play/fr_CA.html` et `dl-itunes/page-fr.html`. `https://app.iqwine.ai/confidentialite` répond 200 avec `x-robots-tag: noindex, nofollow`.
- **Conséquence** : viole la décision LOCKED n° 4. Le « site officiel » que Google Play transmet aux moteurs n'est pas iqwine.ai, et cela affaiblit le lien entre l'appli et le domaine. Une deuxième copie de la politique vit hors du site et peut diverger.
- **Correctif** : Play, site Web → `https://iqwine.ai` ; politique → `https://iqwine.ai/confidentialite` sur Play **et** dans le champ « Privacy Policy URL » d'App Store Connect.
- **Effort** : S · **Confiance** : haute · **Critère** : aucune occurrence d'`app.iqwine.ai` dans le HTML des deux fiches.

### A-03 · CONFIRMÉ · P1 · Fiche Play anglaise centrée sur la cave, à rebours du positionnement
- **Observation** : titre EN « iQWine — Cellar & Sommelier », description courte « Your cellar, finally alive: Octave knows what to open… », description longue qui ouvre sur « A cellar isn't a list ». Les fiches FR Play et App Store FR/EN disent « Sommelier personnel / Personal Sommelier ». La rubrique « What's new » de la fiche EN est en français. Tirets cadratins en pause dans le texte EN.
- **Preuve** : `dl-play/en_CA.html` ; source `play-fiche-textes.md` l. 107.
- **Conséquence** : contredit la décision LOCKED n° 2 (Octave d'abord) ; un même produit circule sous deux noms anglais, ce qui brouille l'entité dans les résultats et dans les réponses IA.
- **Correctif** : titre EN « iQWine – Personal Sommelier », descriptions EN calquées sur l'App Store EN, notes de version EN localisées, virgules au lieu des tirets.
- **Effort** : S · **Confiance** : haute · **Critère** : titres identiques sur les 4 fiches (2 magasins × 2 langues).

### A-04 · CONFIRMÉ · P2 · Identité d'éditeur dispersée entre les magasins
- **Observation** : App Store, développeur « iQWine » et vendeur « Groupe Medtech inc. » ; Play, « À propos du développeur : Eric Bigras », courriel d'assistance **`admin@iqwine.ca`**, courriel développeur `support@iqwine.ca` ; le site oriente vers https://iqwine.ai/support.
- **Conséquence** : 3 identités pour une seule entité. Le nom personnel d'Éric affiché comme développeur peut se lire comme « créateur » (sensible au regard de la décision LOCKED n° 3) ; `admin@` comme adresse d'assistance publique n'inspire pas confiance.
- **Correctif** : courriel d'assistance Play → `support@iqwine.ca` (rapide). Passage à un compte développeur Play d'organisation au nom de Groupe Medtech (D-U-N-S requis) : **arbitrage d'Éric**.
- **Effort** : S (courriel) / L (type de compte) · **Confiance** : haute · **Critère** : fiche Play sans `admin@` ; décision d'Éric consignée.

### A-05 · CONFIRMÉ · P1 · Plafond de l'essai incohérent entre surfaces
- **Observation** : meta descriptions FR/EN de l'accueil et `potentialAction` du JSON-LD : « 14 jours ou 12 conseils » ; /tarifs n'affiche que « 14 jours » ; magasins : rien ; l'appli en production servirait 25 conseils (ai-memory, CURRENT_STATE, v0.163.0, **non revérifié dans l'appli par cet agent**).
- **Preuve** : `home-fr.html`, `dl-site/en.html`, `dl-site/fr_tarifs.html`.
- **Conséquence** : un fait chiffré contradictoire est exactement ce qu'un moteur IA reprend, ou qui le pousse à écarter la source.
- **Correctif** : une seule valeur, tirée d'une source unique (config des forfaits), dans les meta, le JSON-LD, /tarifs et `llms.txt`. Constat partagé avec l'inventaire commun, à dédoublonner.
- **Effort** : S · **Confiance** : moyenne (valeur côté appli) · **Critère** : même chiffre sur toutes les surfaces et dans l'appli.

### A-06 · OPPORTUNITÉ · P1 · Comptes sociaux existants mais invisibles depuis le site
- **Observation** : la marque Metricool « iQWine » relie Instagram **@iqwineapp**, TikTok **@iqwine**, YouTube **@iQWineApp** (chaîne UCv0VSQjTTMJz8hZfPFsjDEg, renvoie vers iqwine.ai) et une page Facebook (id 1297038106827804). Le site n'y fait aucun lien (0 occurrence dans `src/`) et le JSON-LD n'a pas de `sameAs`. Les identifiants divergent (`iqwine` / `iqwineapp`). La description YouTube dit « sommelier virtuel » et mentionne « en voyage », absent du site. Aucun compte LinkedIn trouvé (NON VÉRIFIÉ).
- **Preuve** : Metricool `getBrandSettings` (lecture seule) ; `curl` Instagram et TikTok 200, YouTube 200 ; WebSearch « iqwine instagram… » : aucun résultat. Le contenu d'Instagram et de TikTok n'a pas été lu (connexion requise).
- **Conséquence** : les moteurs ne peuvent pas rattacher ces profils à l'entité, et les signaux sociaux restent orphelins.
- **Correctif** : liens dans le pied de page FR/EN ; `sameAs` dans l'Organization (Instagram, TikTok, YouTube, Facebook avec URL publique, App Store, Play) ; harmoniser la bio des profils sur « Octave, votre sommelier IA qui apprend vos goûts · iqwine.ai » ; viser à terme un identifiant unique.
- **Effort** : S · **Confiance** : haute · **Critère** : test de résultats enrichis de Google, `sameAs` présent ; liens visibles dans le pied de page.

### A-07 · OPPORTUNITÉ · P2 · Organization JSON-LD sans fondatrice ni rattachements
- **Observation** : l'Organization a `name`, `url`, `logo`, `description`, `areaServed`, `contactPoint`, mais pas `founder`, `sameAs`, `foundingLocation` ni `email`.
- **Correctif** : `founder` : `Person` « Mégane Bigras », `jobTitle` « Fondatrice » (jamais Éric, décision LOCKED n° 3) ; `foundingLocation` Québec ; `sameAs` (voir A-06) ; `email` `support@iqwine.ca`. Ne pas ajouter d'`aggregateRating` tant qu'il n'existe qu'une seule note.
- **Effort** : S · **Confiance** : haute · **Critère** : Rich Results Test sans erreur ; `founder.name` = Mégane Bigras.

### A-08 · CONFIRMÉ · P1 · Collision de marque avec « WineIQ – AI Sommelier »
- **Observation** : « WineIQ - AI Sommelier » (App Store id6757638011, éditeur « Future Context UK Limited », ContextIQ selon AlternativeTo, sortie le 2026-01-12, 0 note CA ; lancement sur PeerPush en 2026-03 sous « WineIQ — Your Personal AI Sommelier », site signalé hors ligne) fait la même promesse : sommelier IA, cave numérique, accords tirés de la cave. Autres homonymes : WINEIQ (jeu de Helvetiq), WineQ.ai (Rubay, B2B vineries), « IQ Quality Wine » (marque abandonnée, Iowa).
- **Preuve** : API iTunes CA (`term=wineiq`). Le résumeur IA de l'outil de recherche a répondu **deux fois** à des requêtes « iQWine » en proposant WineIQ (« The closest match is WineIQ… »), y compris avec un filtre sur iqwine.ai, apps.apple.com et play.google.com. C'est le seul indice observé de comportement d'un moteur IA ; ce n'est ni ChatGPT, ni Google.
- **Conséquence** : un moteur qui ne connaît pas iQWine « corrige » le nom vers WineIQ. Le risque grandit si WineIQ gagne en notoriété.
- **Correctif** : associer systématiquement « iQWine » + « Octave » + « Québec » + « iqwine.ai » sur toutes les surfaces (fiches, bios, JSON-LD, `llms.txt`) ; envisager une ligne de désambiguïsation dans `llms.txt` (**arbitrage d'Éric** : nommer un tiers). Vérification juridique de l'antériorité du nom : hors site, arbitrage d'Éric (rappel : pas de « marque de commerce » sur le site).
- **Effort** : S (cohérence) / M (juridique) · **Confiance** : haute sur la collision, moyenne sur l'impact · **Critère** : requêtes « iQWine » et « iQWine Octave » qui renvoient iqwine.ai sans correction (relevé mensuel).

### A-09 · CONFIRMÉ · P1 · Autorité externe nulle
- **Observation** : aucune mention tierce trouvée (presse québécoise, blogues vin, Product Hunt, AlternativeTo, PeerPush, annuaires d'IA). App Store : 1 note ; Play : « 1+ téléchargements », 0 avis. Le moteur de l'outil ne fait remonter **aucune page d'iqwine.ai**, même sur des requêtes de marque.
- **Preuve** : requêtes `"iQWine" app sommelier`, `"iqwine.ai"`, `"IQ Wine" OR "iQWine" -iqwine.ai`, `site:producthunt.com iqwine`, `iQWine Octave sommelier Québec Mégane Bigras` (2026-11-06). Bing et DuckDuckGo n'étaient pas exploitables (page dégradée, HTTP 202).
- **Conséquence** : aucun tiers ne corrobore l'entité, alors que Vivino, CellarTracker et InVintory en ont des dizaines. Les moteurs IA citent ce qui est corroboré.
- **Correctif** : voir la section 4 (actions externes) ; côté appli, demande d'avis native (`SKStoreReviewController` / In-App Review API) après un moment réussi.
- **Effort** : L (durée) · **Confiance** : haute pour ce moteur, **NON VÉRIFIÉ pour Google** · **Critère** : ≥ 5 mentions tierces indexées et ≥ 20 notes App Store d'ici 90 jours (cible indicative).

### A-10 · OPPORTUNITÉ · P2 · InVintory a des actifs « moteurs IA » qu'iQWine n'a pas
- **Observation** : InVintory publie un `llms.txt` avec tarifs, essai et différenciateurs, des pages « vs CellarTracker » et « vs Vivino », une page `/llm-info/`, un serveur MCP. Le `llms.txt` d'iQWine décrit bien le produit mais **ne donne aucun prix**, et le site n'a aucune page comparative.
- **Correctif** : ajouter les forfaits et l'essai (valeur unique, A-05) dans `llms.txt` ; créer une page FR/EN « Choisir son appli de cave et de sommelier » honnête et vérifiable (Vivino pour découvrir, CellarTracker pour la communauté, iQWine pour un conseil personnel en français), dans le ton du site (directive : le SEO ne tue pas l'émotion). Ne pas nommer le détaillant provincial (décision LOCKED n° 1).
- **Effort** : M · **Confiance** : moyenne (impact réel sur les moteurs non mesurable ici) · **Critère** : page publiée et indexée, prix présents dans `llms.txt`.

### A-11 · CONFIRMÉ · P3 · Achats intégrés non localisés sur la fiche App Store anglaise
- **Observation** : la fiche EN affiche « Passionné annuel $149.00 », « Premium mensuel $29.95 », alors que le libellé public anglais est « Enthusiast ».
- **Correctif** : noms d'affichage en-CA dans App Store Connect (« Enthusiast, yearly », etc.).
- **Effort** : S · **Confiance** : haute · **Critère** : `dl-itunes/page-en.html` sans « Passionné ».

### A-12 · CONFIRMÉ · P3 · Tirets cadratins en pause dans les fiches
- **Observation** : description App Store FR (« — même sur une carte en italien », « — et vous dit lesquels… ») et fiche Play EN.
- **Correctif** : remplacer par des virgules (consigne de voix d'Éric). À grouper avec A-01 et A-03.
- **Effort** : S · **Confiance** : haute.

### A-13 · CONFIRMÉ · P3 · Lien App Store du site sur l'ancien nom
- **Observation** : `downloadUrl` du JSON-LD et le lien du site pointent vers `…/app/iqwine-sommelier-ia-vins/id6798458954` ; Apple redirige vers `…/iqwine-sommelier-personnel/…`.
- **Correctif** : utiliser `https://apps.apple.com/ca/app/id6798458954`, qui ne dépend pas du nom.
- **Effort** : S · **Confiance** : haute · **Critère** : aucune occurrence de `sommelier-ia-vins` dans `src/`.

### A-14 · CONFIRMÉ · P3 · Code mort qui présente Éric comme « Fondateur »
- **Fichier** : `/home/ebigras/Projects/iQWine_Web/src/components/maison/NotreMaisonContent.tsx` l. 151 (« Éric · Fondateur, iQWine »). Le composant n'est plus importé (la page utilise `AProposContent`) ; la purge est prévue (commentaire de `notre-maison/page.tsx` l. 12). Présent aussi dans le worktree `production`.
- **Conséquence** : risque de réintroduction contraire à la décision LOCKED n° 3. Aucun impact en ligne aujourd'hui (la page publiée dit « Porte-parole »).
- **Correctif** : supprimer le fichier lors de la purge prévue. **Effort** : S.

### A-15 · NON VÉRIFIÉ · P2 · Présence d'iQWine et des concurrents dans les réponses IA
- Aucun accès à ChatGPT, Perplexity, Google AI Overviews ou Copilot. Le seul indice est A-08.
- **Protocole proposé** (manuel, mensuel, sans coût externe automatisé) : 12 requêtes fixes FR/EN (« meilleure appli de cave à vin au Québec », « AI sommelier app Canada », « appli pour choisir un vin au restaurant », « quand boire mon vin appli », « iQWine c'est quoi », « iQWine vs Vivino »…), consigner citées / non citées, sources citées, erreurs factuelles.

### A-16 · OPPORTUNITÉ · P3 · « Conçu au Québec » absent des fiches App Store
- Le site et `llms.txt` disent « Conçu au Québec, hébergé au Canada » ; les fiches App Store FR/EN ne le disent pas. Une ligne ajoutée renforce l'ancrage local, qui est le principal différenciateur face à InVintory et Vivino. **Effort** : S.

---

## 4. Actions externes légitimes (aucune n'a été engagée)

| # | Action | Cible (vérifiée par recherche, date à reconfirmer avant contact) | Responsable proposé | Priorité |
|---|---|---|---|---|
| E-1 | Corriger les fiches Play et App Store (A-01, A-02, A-03, A-04, A-11, A-12, A-16) | Play Console, App Store Connect | Éric | P1 |
| E-2 | Activer la demande d'avis native après un conseil d'Octave jugé utile | Appli iOS/Android (dépôt `cellier-vin` / `iqwine-native`) | Éric (décision) + session de dev | P1 |
| E-3 | Fiche produit sur Product Hunt (InVintory y est), AlternativeTo (WineIQ y est), PeerPush | producthunt.com, alternativeto.net, peerpush.com | Éric | P2 |
| E-4 | Dossier de presse « projet familial québécois » : la question de Mégane, Octave, ce que l'appli ne fait pas (ne vend pas de vin) | Chroniques vin : Le Devoir (Rémy Charest y a signé, statut 2026 à vérifier) ; L'actualité (Nadia Fournier, chronique vin mensuelle, Guide du vin Phaneuf) ; Montreal Gazette (Bill Zacharkiw, chroniqueur vin depuis 2007 selon une source de 2014) ; Chacun son vin / WineAlign (Marc Chapleau et al.) ; La Presse (section vin, **chroniqueur non vérifié**) | Mégane (histoire), Éric (porte-parole) | P2 |
| E-5 | Couverture techno grand public et startups | francoischarron.com (a déjà couvert les applis d'étiquette de vin) ; BetaKit (actualité des startups canadiennes) | Éric | P2 |
| E-6 | Démonstrations au milieu professionnel | ACSP-Québec (formations, encans, dîners annuels Québec et Montréal) ; programme de sommellerie de l'ITHQ | Mégane + Éric | P3 |
| E-7 | Créateurs et sommeliers sur Instagram, TikTok et YouTube (démonstration de lecture d'une carte des vins au restaurant) | À sélectionner, idéalement avec un compte iQWine de test dédié (aucune donnée réelle d'utilisateur) | Éric | P3 |
| E-8 | Mise en avant éditoriale Apple (formulaire de nomination d'App Store Connect) au moment d'une version notable | App Store Connect | Éric | P3 |
| E-9 | Partenariat ou contenu avec le détaillant provincial ou son magazine | magazine.saq.com | **Arbitrage d'Éric** : décision commerciale ; aucun impact sur la règle de vocabulaire du site, mais sujet sensible | Non classé |

Toujours communiquer **iqwine.ai** (jamais app.iqwine.ai), « iQWine » seul, Mégane fondatrice, Éric porte-parole, et ne pas présenter l'offre Restaurant B2B (en pause).

---

## 5. Contrôlable sur notre site / dépendant de tiers

**Contrôlable sur iqwine.ai (dépôt `iQWine_Web`, branche `production`)** : A-05 (meta, JSON-LD), A-06 (liens du pied de page, `sameAs`), A-07 (`founder`), A-08 (cohérence des chaînes, désambiguïsation dans `llms.txt`), A-10 (prix dans `llms.txt`, page comparative), A-13 (lien App Store), A-14 (code mort).

**Contrôlable par nous, hors site** : fiches App Store et Play (A-01 à A-04, A-11, A-12, A-16), bios des comptes sociaux (A-06), demande d'avis dans l'appli (E-2), documents source `cellier-vin/docs/ops/*-fiche-textes.md`.

**Dépend de tiers** : mentions de presse, de blogues et d'annuaires (A-09, E-3 à E-7), notes et avis des utilisateurs, comportement des moteurs IA (A-15), notoriété de WineIQ (A-08), mise en avant d'Apple (E-8).

---

## 6. Limites

- WebSearch n'est **pas Google** (index américain, résumés générés par un LLM). L'absence d'iqwine.ai dans ses résultats ne prouve pas son absence de Google ; Bing et DuckDuckGo n'étaient pas exploitables par `curl`.
- WebFetch était refusé pour vivino.com, invintory.com, cellartracker.com et alternativeto.net : lectures faites par `curl` (cellartracker.com a renvoyé un défi anti-robot 202, aucune lecture directe).
- Chiffres des magasins : vitrine canadienne seulement, relevés le 2026-11-06 via l'API iTunes ; les volumes d'utilisateurs des concurrents sont des **déclarations des éditeurs** ou de sources secondaires, et sont signalés comme tels.
- Aucun accès aux moteurs IA (ChatGPT, Perplexity, AI Overviews) : toute présence dans leurs réponses est NON VÉRIFIÉE.
- Instagram et TikTok demandent une connexion : comptes confirmés (Metricool + HTTP 200), contenu non lu ; l'URL publique de la page Facebook n'est pas connue (l'id seul renvoie 400).
- Le plafond de 25 conseils dans l'appli vient d'ai-memory, non revérifié ici.
- Les médias et chroniqueurs cités viennent de sources parfois anciennes (2014-2018) : statut 2026 à reconfirmer avant tout contact.
- Aucun volume de recherche n'a été estimé.
