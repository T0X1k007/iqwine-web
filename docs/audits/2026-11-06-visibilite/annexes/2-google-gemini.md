# Agent 2 · Google Search, AI Overviews, AI Mode, Gemini : audit de visibilité d'iqwine.ai

Date : 2026-11-06 (mesures en ligne entre 14 h 38 et 15 h 30 UTC). Lecture seule : aucun fichier du dépôt modifié, aucune console ouverte, aucun contact.
Périmètre : les quatre surfaces Google, analysées séparément. Le SEO technique (canonical, hreflang, CWV, validation JSON-LD, 307 de la racine) appartient à l'Agent 1 ; il n'est cité ici que lorsqu'il touche une règle propre à une surface Google.

Légende des niveaux de preuve :
- **EXIGENCE DOCUMENTÉE** : écrite dans une documentation officielle Google consultée ce jour.
- **BONNE PRATIQUE PLAUSIBLE** : recommandée par Google ou cohérente avec ses docs, sans effet garanti.
- **HYPOTHÈSE À TESTER** : raisonnement non démontré ; critère de test fourni.

Aucune inclusion, aucune position, aucun affichage dans une AI Overview ni dans Gemini n'est promis.

---

## 1. Ce qui a changé en 2026 et qu'il faut savoir avant tout

1. **Un nouveau réglage Search Console conditionne AI Overviews et AI Mode.** Depuis le 31 août 2026, toute propriété dispose de *Paramètres > Search generative AI* : Inclure (défaut) / Exclure / Hériter du parent. Exclure retire le site d'AI Overviews, d'AI Mode et des fonctions d'IA générative de Discover, sans effet sur le classement classique ni sur l'entraînement. Le guide officiel d'optimisation pour l'IA en fait une **condition d'éligibilité** : le site doit y être « included ». (support.google.com/webmasters/answer/16908024 ; developers.google.com/search/docs/fundamentals/ai-optimization-guide)
2. **Un rapport « Generative AI performance (Search) »** existe depuis le 31 août 2026 : impressions seulement, par page, pays, appareil, date ; pas de requêtes. (support.google.com/webmasters/answer/16984139)
3. **Le résultat enrichi FAQ n'existe plus** : retiré de Google Search le 7 mai 2026, documentation supprimée le 15 juin 2026. (developers.google.com/search/docs/appearance/structured-data/faqpage)
4. **AIPREF** : billet Search Central du 30 octobre 2026. Google vise 2027 pour un jeton partagé de préférence d'entraînement dans robots.txt. Google-Extended continue d'exister à côté ; un refus d'entraînement via le jeton partagé, sans mention explicite de Google-Extended, sera traité comme un refus de Google-Extended. (developers.google.com/search/blog/2026/10/ai-training-control)
5. **Google-Extended couvre aussi le grounding dans les Gemini Apps**, pas seulement l'entraînement. Le bloquer retire le contenu des réponses ancrées de l'application Gemini, mais n'a aucun effet sur Search, AI Overviews ou AI Mode. (developers.google.com/search/docs/crawling-indexing/google-common-crawlers ; gemini.google/overview)

---

## 2. Sources officielles consultées (toutes le 2026-11-06)

| # | Source | Ce qu'on en retient |
|---|---|---|
| S1 | developers.google.com/search/docs/appearance/ai-features | Éligibilité AIO / AI Mode : page indexée et éligible au snippet ; « no additional technical requirements » ; pas de schema spécial ; trafic IA compté dans le rapport Performance « Web » ; query fan-out ; contrôles nosnippet, data-nosnippet, max-snippet, noindex ; Google-Extended pour l'entraînement et le grounding ailleurs. Page sans date visible et qui ne mentionne pas encore le réglage Search Console (voir S2, S3). |
| S2 | developers.google.com/search/docs/fundamentals/ai-optimization-guide | Éligibilité = indexée + snippet + **site inclus dans Search generative AI** ; contenu unique, people-first, bien organisé ; HTML sémantique ; JS indexable si non bloqué ; données structurées non requises ; **llms.txt et fichiers « pour l'IA » non utilisés par Google Search** ; pas de « chunking » ; méfiance envers les hacks AEO/GEO ; abus de contenu à grande échelle = spam ; Merchant Center et Business Profile pour commerces et entreprises locales. |
| S3 | support.google.com/webmasters/answer/16908024 | Réglage Search generative AI : options, défaut Inclure, héritage parent/enfant, 1 à 2 jours de délai, mondial depuis le 2026-08-31, pas d'effet sur l'entraînement (→ Google-Extended), pas un signal de classement. |
| S4 | support.google.com/webmasters/answer/16984139 | Rapport Generative AI performance : impressions, pages, pays, appareils ; seuil minimal d'impressions ; AIO + AI Mode. |
| S5 | blog.google, « New opportunities, control and insights for website owners », 2026-06-03, mis à jour 2026-08-31 | Annonce du contrôle et des rapports ; Preferred Sources dans AIO et AI Mode. |
| S6 | developers.google.com/search/docs/crawling-indexing/google-common-crawlers | Google-Extended (entraînement Gemini + grounding Gemini Apps et Vertex AI ; aucun effet sur Search) ; GoogleOther (générique, aucun produit précis) ; Google-CloudVertexBot (crawls demandés par le propriétaire pour Vertex AI Agents, aucun effet sur Search). |
| S7 | developers.google.com/search/blog/2026/10/ai-training-control (2026-10-30) | AIPREF, 2027, coexistence avec Google-Extended. |
| S8 | developers.google.com/search/docs/crawling-indexing/robots-meta-tag | nosnippet et max-snippet s'appliquent explicitement à AI Overviews et AI Mode (nosnippet interdit aussi l'usage comme « direct input ») ; data-nosnippet par élément ; noindex retire la page. |
| S9 | developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics | « If the content isn't visible in the rendered HTML, Google won't be able to index it. » |
| S10 | developers.google.com/search/docs/appearance/structured-data/organization | Aucune propriété requise ; recommandées : name, alternateName, legalName, url, description, logo (≥ 112 × 112 px, explorable), sameAs, contactPoint, foundingDate, etc. ; sur l'accueil ou la page « à propos » ; aide à désambiguïser et à choisir le logo (résultats, panneau de connaissances), sans garantie. |
| S11 | developers.google.com/search/docs/appearance/site-names | WebSite (name, url, alternateName) sur la page d'accueil du domaine ; url = accueil canonique ; pas de nom de site au niveau d'un sous-répertoire ; cohérence avec og:site_name et title. |
| S12 | developers.google.com/search/docs/appearance/structured-data/software-app | Résultat enrichi app : name + offers.price + **aggregateRating ou review obligatoires**. |
| S13 | developers.google.com/search/docs/fundamentals/creating-helpful-content | People-first ; E-E-A-T, « trust is most important » ; Who/How/Why ; exactitude factuelle. |
| S14 | support.google.com/business/answer/3038177 | Google Business Profile : lieu physique accueillant des clients ou déplacement chez eux ; les entreprises uniquement en ligne ne sont pas admissibles. |
| S15 | support.google.com/knowledgepanel/answer/7534902 | Revendiquer un panneau de connaissances suppose qu'il existe déjà ; vérification par Search Console, YouTube, X ou Facebook. |
| S16 | gemini.google/overview | Gemini s'appuie sur des sources externes dont Google Search (RAG) ; les URL exclues via Google-Extended ne servent ni à l'entraînement ni à l'ancrage. |
| S17 | support.google.com/gemini/answer/16279220 | Réponses Gemini : peuvent être inexactes, y compris sur leurs propres citations ; aucune consigne pour éditeurs. |
| S18 | support.google.com/chrome/answer/16283624 et support.google.com/gemini (Privacy Hub 13594961) | Gemini dans Chrome répond à partir de l'onglet affiché (contenu + URL), avec contrôle côté utilisateur ; aucun contrôle éditeur documenté. |

---

## 3. Tableaux par surface

### 3.1 Google Search classique

| Règle | Niveau | Source (2026-11-06) | État iqwine.ai | Action |
|---|---|---|---|---|
| Googlebot autorisé dans robots.txt | EXIGENCE | S1, S2 | `User-Agent: * Allow: /` ; seule `/api/` est fermée. CONFIRMÉ | Rien |
| Page indexable (pas de noindex) | EXIGENCE | S8 | 30 URL du sitemap : `index, follow`, aucun `X-Robots-Tag`. `/fr/beta` en `noindex, follow` (voulu). CONFIRMÉ | Rien |
| Contenu présent dans le HTML rendu | EXIGENCE | S9 | Réponses de la FAQ de /tarifs **absentes du DOM** tant qu'on ne clique pas ; démo d'accords : seule « lasagne » est dans le DOM | G-02, G-12 |
| Contenu éducatif indexable | EXIGENCE | S8 | Le « Guide d'Octave » (60 questions) vit sur app.iqwine.ai en `noindex, nofollow` | G-01 |
| Contenu exact et fiable (trust) | BONNE PRATIQUE | S13 | Essai « 12 conseils » sur les 15 pages téléchargées, alors que l'app sert 25 (ai-memory, v0.163.0) | G-03 |
| Nom de site : WebSite sur l'accueil du domaine, url = accueil canonique | EXIGENCE (pour le nom de site) | S11 | `WebSite.url = https://iqwine.ai/fr` ; la racine répond 307 | G-08 (renvoi Agent 1) |
| Organization : logo ≥ 112 px, sameAs, etc. | BONNE PRATIQUE | S10 | logo `icon.png` 512 × 512 OK ; **aucun sameAs**, pas d'alternateName, pas de fondatrice | G-04 |
| Résultat enrichi FAQ | Supprimé | faqpage (S-dépréciation) | FAQPage JSON-LD présent sur /tarifs : sans effet d'affichage désormais | G-02 (garder le balisage n'est pas nuisible, mais il doit refléter le visible) |
| Résultat enrichi app | EXIGENCE | S12 | Pas d'aggregateRating ni de review → non éligible | G-11 (ne rien fabriquer) |
| Search Console vérifiée, sitemap soumis | BONNE PRATIQUE | S2 | Enregistrement TXT `google-site-verification` présent sur iqwine.ai (valeur non affichée). Contenu de la console : NON VÉRIFIÉ | G-10 |

### 3.2 AI Overviews

| Règle | Niveau | Source | État iqwine.ai | Action |
|---|---|---|---|---|
| Indexée + éligible au snippet | EXIGENCE | S1, S2 | Oui pour les 30 URL (pas de nosnippet ni de max-snippet ; 0 occurrence de `data-nosnippet`). CONFIRMÉ | Rien |
| Site « Inclus » dans Search generative AI | EXIGENCE (depuis 2026-08-31) | S2, S3 | Défaut = Inclure. Réglage réel : NON VÉRIFIÉ (pas d'accès console) | G-10 |
| nosnippet / max-snippet limitent l'usage par AIO | EXIGENCE (contrôle) | S8 | Aucun en place : rien ne bride l'extraction | Rien ; ne pas en ajouter globalement |
| Google-Extended **n'a aucun effet** sur AIO | EXIGENCE | S6, S1 | Non mentionné dans robots.txt (donc autorisé) | Rien |
| Pas de schema spécial, pas de llms.txt requis | EXIGENCE | S1, S2 | llms.txt servi : neutre pour Google | G-14 (vocabulaire) |
| Contenu unique, organisé, qui répond | BONNE PRATIQUE | S2, S13 | Pages titrées en question (« Quand ouvrir une bouteille de vin ? ») mais corps narratif, sans réponse factuelle extractible | G-06 |
| Mesure : rapport Performance « Web » + rapport Generative AI | EXIGENCE (outil) | S1, S4 | NON VÉRIFIÉ | G-10 |

### 3.3 AI Mode

| Règle | Niveau | Source | État iqwine.ai | Action |
|---|---|---|---|---|
| Mêmes exigences qu'AIO (indexée, snippet, réglage Inclure) | EXIGENCE | S1, S2, S3 | Idem 3.2 | G-10 |
| Query fan-out : sous-requêtes sur sous-thèmes | Fonctionnement documenté | S1 | Les sous-thèmes probables (fenêtre de garde, accord par plat, essai gratuit, appareils, prix) sont soit narratifs, soit hors DOM, soit en noindex sur app | G-01, G-02, G-06 |
| Preferred Sources (AIO et AI Mode) exige l'inclusion au réglage | EXIGENCE | S5 ; developers.google.com/search/docs/appearance/preferred-sources (titre vu dans les résultats, page non lue en entier) | Sans objet tant que la marque n'a pas d'audience fidèle | Aucune action prioritaire |
| Expériences agentiques (UCP) | Émergent | S2 | Sans objet (pas de commerce de produits) | Aucune |

### 3.4 Application Gemini (et Gemini dans Chrome)

| Règle | Niveau | Source | État iqwine.ai | Action |
|---|---|---|---|---|
| Gemini s'appuie sur Google Search (RAG) | Fonctionnement documenté | S16 | Dépend donc de l'indexation Google : mêmes freins (G-01, G-02, G-03) | G-01, G-02, G-03 |
| Google-Extended contrôle entraînement **et** grounding Gemini Apps | EXIGENCE | S6, S16 | Non bloqué → contenu utilisable pour l'ancrage (et pour l'entraînement : les deux sont liés dans un seul jeton) | G-09 (arbitrage conscient) |
| Réglage Search generative AI | Ne couvre pas Gemini (non mentionné) | S3 | Sans objet | Ne pas supposer qu'il couvre Gemini |
| Aucune consigne éditeur propre à l'application Gemini | Constat documentaire | S17 | Rien à paramétrer de plus | Aucune |
| Gemini dans Chrome lit l'onglet affiché (contenu + URL), décision de l'utilisateur | Fonctionnement documenté | S18 | Un visiteur sur /tarifs qui demande « est-ce sans carte ? » : les réponses de la FAQ ne sont pas dans le DOM tant qu'il n'a pas cliqué | G-02 (HYPOTHÈSE quant à l'effet) |
| AIPREF 2027 | Annoncé | S7 | Rien à faire maintenant | G-09 : piège à éviter plus tard |

---

## 4. Contrôles robots : état et lecture

| Jeton | Ce qu'il contrôle réellement (doc) | iqwine.ai | app.iqwine.ai |
|---|---|---|---|
| Googlebot | Exploration pour Search, donc AIO, AI Mode, et indirectement Gemini (via l'index) | autorisé | robots.txt : tout fermé sauf login, signup, légal, `/apprendre`, `/octave-verifiable` ; **mais `X-Robots-Tag: noindex, nofollow` sur tout le sous-domaine** |
| Google-Extended | Entraînement Gemini + grounding Gemini Apps et Vertex AI ; zéro effet Search/AIO/AI Mode | non mentionné = autorisé | non mentionné |
| GoogleOther | Générique, R&D, aucun produit précis | autorisé | idem `*` |
| Google-CloudVertexBot | Crawls demandés par le propriétaire pour Vertex AI Agents | autorisé (sans effet tant que personne ne le déclenche) | idem |
| nosnippet / max-snippet / data-nosnippet | Longueur et usage des extraits, y compris AIO et AI Mode | absents | sans objet (noindex) |

Vérifications : `curl` de robots.txt, des en-têtes et du HTML des pages ; requête avec l'UA Googlebot sur /fr = 200, même taille que l'UA navigateur (77 039 o). Une vraie IP Googlebot n'a pas pu être simulée : l'éventuel filtrage Cloudflare par vérification d'IP est NON VÉRIFIÉ (Agent 1).

---

## 5. Identité de marque : cohérence observée

| Surface | Nom affiché | Description courte | Lien vers le site | Observations |
|---|---|---|---|---|
| iqwine.ai (title accueil FR) | iQWine · Octave, votre sommelier IA qui apprend vos goûts | meta : « Octave, votre sommelier IA, apprend votre palais… Essai : 14 jours ou 12 conseils, sans carte. » | | « 12 » contredit l'app (G-03) |
| JSON-LD Organization | iQWine | « Le sommelier IA qui sait quoi ouvrir, quoi acheter et quoi commander. » | url https://iqwine.ai | pas de sameAs, pas de fondatrice (G-04) |
| App Store FR | iQWine – Sommelier personnel ; sous-titre « Octave apprend vos goûts » | | iqwine.ai, /support, /conditions, /confidentialite | vendeur « Groupe Medtech inc. » (attendu) ; 1 note publique. Cohérent |
| App Store EN | iQWine – Personal Sommelier | | | Cohérent |
| Google Play FR | iQWine – Sommelier personnel | « Votre sommelier qui apprend vos goûts, de la cave au resto et en magasin. » | **Site Web : https://app.iqwine.ai** ; politique : app.iqwine.ai/confidentialite ; courriel admin@iqwine.ca ; « À propos du développeur » : Eric Bigras, support@iqwine.ca | **« Les disponibilités SAQ, succursale par succursale »** dans la description longue (G-05) |
| Réseaux sociaux | Aucun lien sur le site ni dans le code (`grep` instagram/facebook/tiktok/youtube/linkedin : 0) | | | Comptes réels inconnus : à fournir par Éric (G-04) |
| Moteur tiers (WebSearch, PAS Google) | Requêtes « iQWine » et « "iqwine.ai" OR "iQWine" Octave sommelier » : **aucun résultat sur iQWine** ; homonymes proches : WineIQ, « Wine AI », marque QWINE, restaurants « L'Octave » | | | Empreinte de marque faible hors du site ; désambiguïsation utile (G-04) |

---

## 6. Constats

### G-01 · CONFIRMÉ · Le contenu le plus « répondant » de la marque est hors index
- **URL** : https://app.iqwine.ai/apprendre, /octave-verifiable, /en/apprendre (liés depuis le pied de page de chaque page d'iqwine.ai : « Apprendre le vin », « Octave vérifiable »).
- **Observation** : « Le Guide d'Octave : apprendre le vin, simplement », 60 fiches `/apprendre/<slug>` rédigées en questions (« Comment lire la fenêtre de dégustation ? », « Comment choisir un vin sur la carte des vins au restaurant ? », « Comment servir un vin au mieux ? »). robots.txt d'app les autorise explicitement (`Allow: /apprendre`), mais le serveur renvoie `x-robots-tag: noindex, nofollow` sur ces pages et sur le sitemap d'app.
- **Preuve** : `curl -D -` sur les trois URL (en-tête présent) ; `curl app.iqwine.ai/robots.txt`.
- **Conséquence** : EXIGENCE DOCUMENTÉE (S1, S2, S8) : une page en noindex n'est éligible ni à Search, ni à AI Overviews, ni à AI Mode, et ne peut donc pas servir d'ancrage à Gemini via l'index. La contradiction robots Allow / noindex indique une intention d'indexer qui ne se réalise pas.
- **Correctif** : **arbitrage d'Éric**. La règle LOCKED n° 4 interdit d'exposer app.iqwine.ai : ne PAS lever le noindex d'app. Option compatible : publier les fiches publiques du guide sur iqwine.ai (ex. `/fr/guide/<slug>` et `/en/guide/<slug>`), en HTML rendu côté serveur, dans le sitemap, et rediriger ou canonicaliser les URL d'app vers elles ; retirer alors `/apprendre` de l'`Allow` d'app. Relire chaque fiche contre la règle Octave d'abord et l'interdit « SAQ » (titre vu : « Comment choisir mon magasin de référence ? », conforme). Ne pas multiplier les pages pour l'IA (abus de contenu à grande échelle, S2).
- **Priorité** P1 · **Effort** L · **Confiance** haute sur le constat, moyenne sur le gain.
- **Vérification** : `curl -I https://iqwine.ai/fr/guide/...` sans `x-robots-tag` ; Inspection d'URL « L'URL est sur Google » ; impressions de ces pages dans le rapport Generative AI performance après 8 à 12 semaines.

### G-02 · CONFIRMÉ · Les réponses de la FAQ de /tarifs ne sont pas dans le DOM
- **Fichier/URL** : `src/components/sections/SectionFaq.tsx` (accordéon `AnimatePresence`, `useState(false)`) ; https://iqwine.ai/fr/tarifs et /en/pricing.
- **Observation** : 15 questions (carte de crédit, fin de l'essai, résiliation, appareils, disponibilité, différence entre forfaits). Les réponses n'existent que dans le JSON-LD FAQPage et la charge RSC ; le HTML visible ne les contient pas (`aria-expanded="false"` × 15 ; « Environ 30 secondes » absent hors `<script>`).
- **Preuve** : script `a2_analyse.py` (comparaison JSON-LD vs corps sans scripts) ; lecture du composant.
- **Conséquence** : EXIGENCE DOCUMENTÉE (S9) : contenu absent du HTML rendu = non indexable. Ce sont précisément les questions de marque qu'AI Overviews et AI Mode reçoivent (« iQWine est-il gratuit ? », « faut-il une carte ? »). En plus, le résultat enrichi FAQ n'existe plus depuis mai 2026 : le JSON-LD n'apporte plus d'affichage et décrit un texte que la page ne montre pas. HYPOTHÈSE : Gemini dans Chrome, qui lit l'onglet, ne voit pas non plus ces réponses.
- **Correctif** : rendre les réponses dans le DOM dès le serveur (masquées visuellement, `<details>`/`hidden="until-found"` ou hauteur 0 animée), en gardant l'animation. Corriger au passage le tiret cadratin de la réponse « Le forfait Gratuit expire-t-il… » (« sans date de fin — et un cadeau »), contraire à la consigne de voix.
- **Priorité** P1 · **Effort** S · **Confiance** haute.
- **Vérification** : `curl -s https://iqwine.ai/fr/tarifs | sed 's/<script.*<\/script>//'` contient « Environ 30 secondes » ; Inspection d'URL > HTML rendu.

### G-03 · CONFIRMÉ (site) · Les conditions d'essai publiées divergent de l'app
- **Fichier/URL** : `src/lib/trial.ts` (`TRIAL_RECOS = 12`) ; meta descriptions, og/twitter, `RegisterAction` du JSON-LD et FAQ de /tarifs ; **15 pages sur 15** téléchargées contiennent « 12 conseils » ou « 12 pieces ».
- **Observation** : ai-memory `CURRENT_STATE.md` (2026-11-06) : la prod de l'app v0.163.0 sert « 25 conseils ou 14 jours ». `origin/production` = `main` (0 commit d'écart) : la prod du site affiche bien 12.
- **Preuve** : grep des pages ; lecture de `trial.ts` et d'ai-memory (l'app elle-même n'a pas été inspectée par moi).
- **Conséquence** : la meta description est souvent reprise comme extrait ; AIO et Gemini citeront « 12 conseils ». S13 : la confiance est le critère E-E-A-T le plus important, et une erreur factuelle vérifiable est un signal négatif. Le commentaire de `trial.ts` exige lui-même la synchronisation avec `plan-catalog.ts` de l'app.
- **Correctif** : confirmer avec Éric la valeur servie (25), puis passer `TRIAL_RECOS` à 25 et redéployer. Vérifier aussi l'anglais. Re-crawl : soumettre /fr/tarifs et l'accueil à l'Inspection d'URL.
- **Priorité** P1 · **Effort** S · **Confiance** haute pour le site, moyenne pour la valeur de l'app (source : mémoire).
- **Vérification** : `curl -s https://iqwine.ai/fr | grep -c "12 conseils"` = 0 ; extrait Google mis à jour (à observer manuellement).

### G-04 · CONFIRMÉ · Entité de marque peu ancrée : aucun sameAs, homonymes nombreux
- **URL** : JSON-LD de toutes les pages (`@id https://iqwine.ai/#organization`).
- **Observation** : Organization contient name, url, logo (512 px, conforme), description, areaServed, contactPoint ; **pas de sameAs, d'alternateName, de founder ni de foundingDate**. Aucun lien social sur le site. Sur un moteur tiers, « iQWine » ne remonte rien sur la marque et renvoie vers WineIQ, QWINE, « Wine AI » ; « Octave » renvoie à des restaurants.
- **Preuve** : extraction JSON-LD ; `grep` du code ; WebSearch (moteur tiers, PAS Google).
- **Conséquence** : BONNE PRATIQUE PLAUSIBLE (S10) : sameAs et les propriétés d'identité aident Google à distinguer l'organisation de ses homonymes ; le panneau de connaissances ne se revendique qu'une fois créé (S15). HYPOTHÈSE : sans liens d'identité, Gemini et AI Mode confondent plus facilement iQWine avec WineIQ ou « IQ Wine ».
- **Correctif** : ajouter à Organization `sameAs` = fiche développeur App Store (`https://apps.apple.com/ca/developer/iqwine/id6798458956`), page développeur Google Play (`https://play.google.com/store/apps/developer?id=iQWine`) et **uniquement** les comptes sociaux officiels qui existent réellement (liste à fournir par Éric) ; `alternateName` : « iqwine.ai » ; `founder` : Person « Mégane Bigras » (règle LOCKED n° 3 ; Éric jamais fondateur) ; `foundingDate` si Éric le confirme. Ajouter les mêmes liens dans le pied de page pour que le balisage reflète le visible. Jamais app.iqwine.ai.
- **Priorité** P2 · **Effort** S · **Confiance** moyenne (effet non garanti).
- **Vérification** : Rich Results Test / validateur Schema.org sans erreur ; après quelques semaines, recherche « iQWine » sur google.ca (manuelle) : panneau de connaissances ou non.

### G-05 · CONFIRMÉ · La fiche Google Play contredit deux règles LOCKED et brouille l'identité
- **URL** : https://play.google.com/store/apps/details?id=ca.iqwine.app&hl=fr_CA&gl=CA
- **Observation** : « Site Web » = **https://app.iqwine.ai** (aussi `appstore:developer_url` et `author.url` du JSON-LD Play) ; politique de confidentialité = app.iqwine.ai/confidentialite ; courriel d'assistance admin@iqwine.ca ; bloc « À propos du développeur » : « Eric Bigras », support@iqwine.ca ; description longue : « EN MAGASIN, AU QUÉBEC Les disponibilités **SAQ, succursale par succursale**… ».
- **Preuve** : `curl` de la fiche publique, extraits HTML.
- **Conséquence** : viole la règle LOCKED n° 1 (« SAQ » interdit, Google Play cité nommément ; « succursales » aussi proscrit) et n° 4 (app.iqwine.ai exposé sur une plateforme publique ; support canonique = iqwine.ai/support). Pour Google, la fiche Play est un signal d'entité : elle pointe vers un hôte en noindex au lieu d'iqwine.ai, alors que l'App Store pointe vers iqwine.ai. Le nom « Eric Bigras » comme développeur heurte la règle n° 3 (Éric jamais développeur) ; il peut s'agir d'une exigence de la Play Console liée au type de compte : **arbitrage d'Éric**.
- **Correctif** (geste humain dans la Play Console, pas par un agent) : Site Web → https://iqwine.ai ; politique → https://iqwine.ai/fr/confidentialite ; courriel → l'adresse de support canonique ; réécrire le paragraphe « EN MAGASIN, AU QUÉBEC » sans « SAQ » ni « succursale » (ex. « Les disponibilités en magasin, magasin par magasin, et l'historique des prix… ») ; vérifier la version en-CA. Examiner si un compte d'organisation (Groupe Medtech Inc.) changerait l'affichage développeur.
- **Priorité** P1 · **Effort** S (contenu) / M (type de compte) · **Confiance** haute.
- **Vérification** : `curl` de la fiche : 0 « SAQ », 0 « app.iqwine.ai ».

### G-06 · HYPOTHÈSE · Les pages titrées en question n'y répondent pas de façon extractible
- **URL** : /fr/apogee (« Quand ouvrir une bouteille de vin ? »), /en/drinking-window, /fr/choisir-un-vin (« Comment choisir un bon vin ? »), /fr/accord-mets-vins.
- **Observation** : le title promet une réponse générale ; le corps est un récit produit (« Vous l'avez gardée dix ans… », trois états « Trop jeune / À son sommet / À boire sans tarder », un exemple Barolo 2016). Aucun paragraphe n'explique ce qui détermine une fenêtre de garde, ni comment s'y fier ; /fonctions a de bonnes questions en H2 (« Quel vin avec ce repas ? ») mais des réponses de deux lignes centrées produit.
- **Preuve** : extraction du texte visible (`a2_text.py`).
- **Conséquence** : S2 : les fonctions IA reposent sur les systèmes de classement habituels et privilégient un contenu unique et organisé ; avec le fan-out, une requête informationnelle (« quand boire un Barolo 2016 ») trouvera plutôt des pages qui répondent. HYPOTHÈSE À TESTER : ces pages sont surtout candidates pour des requêtes de marque ou d'appli, peu pour l'informationnel.
- **Correctif** : sous la partie émotionnelle (directive « le SEO ne tue jamais l'émotion »), une courte section « En bref » factuelle et propre à iQWine : ce que l'apogée signifie dans Octave (un repère, jamais une certitude), les facteurs que le moteur prend en compte **tels qu'ils sont servis aujourd'hui** (aucune promesse V3), un exemple. Même chose pour l'accord (pourquoi telle structure appelle tel vin). Pas de « chunking » artificiel ni de réécriture « pour l'IA » (S2). Couplage naturel avec G-01.
- **Priorité** P2 · **Effort** M · **Confiance** moyenne-faible.
- **Vérification** : rapport Generative AI performance et rapport Performance (requêtes) par page, avant/après, sur 8 à 12 semaines.

### G-07 · CONFIRMÉ · Le H1 de /tarifs se lit « Trouvez votre ctave. »
- **Fichier/URL** : `src/components/octave/OctaveWordmark.tsx` (le « O » est un SVG dans `role="img" aria-label="Octave"`, suivi de `<span aria-hidden="true">ctave</span>`) ; https://iqwine.ai/fr/tarifs.
- **Observation** : le texte brut du H1 ne contient pas « Octave ». Seule page du site touchée parmi celles téléchargées (le guide d'app aussi).
- **Conséquence** : HYPOTHÈSE : Google peut tenir compte d'aria-label, rien ne le documente ; le nom du produit manque peut-être au titre principal de la page de prix.
- **Correctif** : ajouter un texte visuellement masqué « Octave » (classe sr-only) et garder le visuel, ou n'utiliser le mot-symbole que hors H1.
- **Priorité** P3 · **Effort** S · **Confiance** moyenne.
- **Vérification** : `textContent` du H1 = « Trouvez votre Octave. »

### G-08 · CONFIRMÉ · Le nom de site est déclaré sur un sous-répertoire (renvoi Agent 1)
- **URL** : JSON-LD `WebSite.url = https://iqwine.ai/fr` ; `https://iqwine.ai/` → 307 vers /fr.
- **Conséquence** : EXIGENCE DOCUMENTÉE pour le nom de site (S11) : WebSite sur la page d'accueil du domaine, url = accueil canonique ; les sous-répertoires ne sont pas pris en charge. Le nom « iQWine » risque de ne pas être retenu comme nom de site (NON VÉRIFIÉ : SERP inaccessible).
- **Correctif** : `WebSite.url = https://iqwine.ai/`, `alternateName: ["iqwine.ai"]`, en coordination avec la décision de l'Agent 1 sur la racine (307 ou page servie).
- **Priorité** P2 · **Effort** S · **Confiance** moyenne.
- **Vérification** : nom affiché au-dessus des résultats sur google.ca (manuel).

### G-09 · CONFIRMÉ · Aucun contrôle IA ne bride iqwine.ai ; un choix reste à rendre explicite
- **Observation** : ni Google-Extended, ni GoogleOther, ni nosnippet, ni max-snippet, ni data-nosnippet. Cloudflare ne réécrit pas robots.txt (pas de bloc « managed robots » ni de Content-Signal observé).
- **Conséquence** : techniquement éligible aux quatre surfaces. Google-Extended lie entraînement et grounding Gemini (S6, S16) : bloquer pour éviter l'entraînement ferait aussi perdre l'ancrage dans l'application Gemini, sans toucher AIO ni AI Mode.
- **Correctif** : laisser tel quel si Éric veut la visibilité Gemini ; consigner ce choix. Piège 2027 (S7) : si un jour un jeton AIPREF de refus d'entraînement est ajouté, Google-Extended sera considéré refusé sauf autorisation explicite. Vérifier que l'option Cloudflare « bloquer les robots IA / robots.txt géré » reste éteinte (elle peut ajouter Google-Extended).
- **Priorité** P3 · **Effort** S · **Confiance** haute.
- **Vérification** : `curl https://iqwine.ai/robots.txt` inchangé après chaque changement Cloudflare.

### G-10 · NON VÉRIFIÉ (accès) · État de Search Console
- **Observation** : un TXT `google-site-verification` existe sur iqwine.ai (valeur non affichée) : une propriété Domaine est probablement vérifiée. Réglage Search generative AI, rapport Generative AI performance, couverture d'indexation, sitemap soumis : non consultables.
- **Conséquence** : le réglage conditionne l'éligibilité AIO / AI Mode (S2, S3). Par défaut Inclure, mais un réglage hérité ou modifié par erreur suffit à disparaître des deux surfaces.
- **Correctif** (Éric, dans la console) : Paramètres > Search generative AI = Inclure (ou Hériter, si le parent est Inclure) pour iqwine.ai ; consulter le rapport Generative AI performance (peut être absent faute d'impressions, S4) ; vérifier l'indexation des 30 URL et la soumission du sitemap.
- **Priorité** P1 (vérification de 5 minutes, enjeu d'éligibilité) · **Effort** S · **Confiance** n/a.
- **Vérification** : capture du réglage ; nombre de pages indexées = 30 attendu (hors /beta).

### G-11 · OPPORTUNITÉ (à ne pas forcer) · Résultat enrichi d'app, Business Profile, panneau de connaissances
- **Observation** : SoftwareApplication sans aggregateRating ni review → non éligible (S12). App Store : 1 note publique. iQWine est une app en ligne sans lieu d'accueil.
- **Conséquence** : Google Business Profile non admissible pour une entreprise uniquement en ligne (S14) ; panneau de connaissances revendicable seulement s'il existe (S15).
- **Correctif** : ne pas importer de notes d'une boutique ni en inventer ; ne pas créer de fiche Business Profile ; si un panneau apparaît, le revendiquer via Search Console. Revisiter quand des avis collectés sur le site existeront.
- **Priorité** P3 · **Effort** S · **Confiance** haute.

### G-12 · CONFIRMÉ (DOM) / HYPOTHÈSE (effet) · Démo d'accords : 1 plat sur 4 indexable
- **URL** : /fr/accord-mets-vins, /en/wine-pairing.
- **Observation** : sélecteur « lasagne, sushi, huîtres, bœuf braisé » ; seul le conseil « lasagne » (Chianti Classico 2022, Montepulciano d'Abruzzo) est dans le HTML.
- **Conséquence** : S9 ; les trois autres accords, exemples concrets de « quel vin avec… », ne sont pas indexables.
- **Correctif** : rendre les quatre réponses dans le DOM (onglets masqués), ou les résumer en texte statique sous la démo.
- **Priorité** P3 · **Effort** S · **Confiance** moyenne.

### G-13 · HYPOTHÈSE · Arbitrage « SAQ » (règle LOCKED n° 1)
- **Observation** : le site compte 0 « SAQ » visible (conforme). Une application concurrente (« Cave à vin », App Store) écrit dans sa description que ses données viennent « de la SAQ et LCBO ». La fiche Play d'iQWine contient encore « SAQ » (G-05, à corriger).
- **Conséquence** : HYPOTHÈSE À TESTER : pour les requêtes contenant « SAQ » (« appli vin SAQ », « disponibilité SAQ app »), un nom propre, Google ne fera pas forcément le lien avec « en magasin au Québec ». Aucun volume de recherche n'a été mesuré ni ne doit être supposé.
- **Correctif** : **aucune recommandation d'ajouter « SAQ »** : conflit avec une décision LOCKED. Si Éric veut mesurer l'enjeu : regarder dans Search Console si des requêtes contenant « SAQ » génèrent déjà des impressions, puis arbitrer. Les exceptions existantes (nom propre réel d'un magasin, textes légaux §7) ne justifient pas une page de mots-clés.
- **Priorité** P2 (décision) · **Effort** S · **Confiance** faible.

### G-14 · CONFIRMÉ · llms.txt : sans effet chez Google, et vocabulaire à aligner
- **URL** : https://iqwine.ai/llms.txt
- **Observation** : Google Search n'utilise pas ces fichiers (S2). Le fichier emploie « point de vente » (2 fois) et « succursales » (1 fois), que la règle LOCKED n° 1 proscrit comme périphrases.
- **Correctif** : remplacer par « magasin », « en magasin ». Le garder pour les autres moteurs (hors périmètre).
- **Priorité** P3 · **Effort** S · **Confiance** haute.

---

## 7. Ce que Google montre : non observé

- `WebFetch https://www.google.com/search?q=iQWine&hl=fr&gl=ca` : page d'erreur d'accès Google. **NON VÉRIFIÉ** : SERP, AI Overview, AI Mode, panneau de connaissances, nom de site, extraits.
- WebSearch (moteur **tiers**, pas Google) : « iQWine » et « "iqwine.ai" OR "iQWine" Octave sommelier » ne renvoient aucune page d'iQWine ; « application cave à vin sommelier IA Québec » renvoie InVintory, Viniou, « Cave à vin », sans iQWine. Ces résultats ne disent rien de l'index Google.
- Aucune observation d'AI Overview ni de réponse Gemini n'est rapportée dans ce document.

Protocole manuel proposé à Éric (navigateur, session non connectée, google.ca, FR et EN) : « iQWine », « iqwine.ai », « Octave sommelier IA », « application cave à vin Québec », « quand ouvrir une bouteille de vin », « quel vin avec une lasagne » ; mêmes questions dans AI Mode et dans l'application Gemini ; noter date, présence et URL citées.

---

## 8. Ordre d'action suggéré

1. G-10 (5 min dans la console), G-03 et G-02 (code, S) : corrigent l'éligibilité et l'exactitude.
2. G-05 (Play Console) : deux règles LOCKED en jeu.
3. G-04, G-08 : identité d'entité (balisage, S).
4. G-01 (L, arbitrage), puis G-06.
5. G-07, G-12, G-14, G-09, G-11 au fil de l'eau ; G-13 = décision d'Éric.

---

## 9. Limites

- Aucun accès à Search Console, à la Play Console, à App Store Connect ni à Cloudflare : réglages et rapports NON VÉRIFIÉS.
- Google Search inaccessible depuis cet environnement : aucune observation de SERP, d'AI Overview, d'AI Mode ni de Gemini.
- Les pages officielles ne portent pas de date de mise à jour visible dans le texte récupéré ; les dates citées sont celles écrites dans les billets et les pages d'aide (31 août 2026, 30 octobre 2026, 7 mai et 15 juin 2026). La page S1 ne mentionne pas encore le réglage Search Console que S2 et S3 rendent obligatoire : S2/S3 sont plus récentes et font foi ici.
- Les WebFetch résument les pages par un modèle intermédiaire ; les citations clés ont été recoupées sur au moins deux pages officielles quand c'était possible. La page Preferred Sources et les consignes Review snippet n'ont pas été lues en entier.
- Le comportement de Google face à `aria-label` (G-07) et aux contenus d'accordéon hors DOM (G-02, au-delà de la règle « rendered HTML ») n'est pas documenté au-delà de S9.
- La valeur d'essai de l'app (25) vient d'ai-memory, pas d'une inspection de l'app. Par ailleurs `git -C ~/ai-memory pull --rebase` a échoué (« Cannot rebase onto multiple branches ») : lecture faite sur la copie locale, non modifiée.
- Simulation Googlebot par UA seulement, pas depuis une IP Google.
- Fichiers de travail : `/tmp/claude-1000/-home-ebigras-Projects-iQWine-Web/b169f3ff-26b5-4233-bc29-e163ffdd5eba/scratchpad/a2pages/` (HTML téléchargés), `a2_analyse.py`, `a2_text.py`.
