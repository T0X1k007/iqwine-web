# Audit de visibilité d'iqwine.ai : moteurs de recherche et assistants IA

Date : 2026-11-06 (mesures entre 14 h 38 et 16 h UTC). Auteur : DATA (Claude Code), six agents spécialisés, synthèse et contre-vérification par DATA.
Mandat : audit en lecture seule et plan d'exécution. **Rien n'a été modifié, déployé, publié ni envoyé.**
Annexes (preuves, commandes, sources officielles datées) : `annexes/0` à `annexes/6`, banc `annexes/banc-visibilite-ia.csv`, journal `annexes/journal-tests-2026-11-06.csv`.
Backlog exécutable : `BACKLOG.md` (même dossier).

Légende des classes : **CONFIRMÉ** (problème prouvé) · **OPPORTUNITÉ** · **HYPOTHÈSE** (à tester) · **NON VÉRIFIÉ** (accès manquant).

---

## 0. Périmètre, architecture et sources

- **Site audité** : dépôt `T0X1k007/iqwine-web` (`~/Projects/iQWine_Web`), Next.js 16 App Router, hébergé chez Vercel, Cloudflare en proxy devant (WAF, cache). `main` = `production` = `3fe6b1b` le jour de l'audit : **le code lu est le code servi** (vérifié par l'agent 1).
- **Séparation respectée** : site public `iqwine.ai` (audité) ; application `app.iqwine.ai` (`x-robots-tag: noindex, nofollow`, connexion requise, hors périmètre d'indexation) ; staging `staging.iqwine.ai` (401) ; données privées (caves, profils, conversations) : **jamais lues, jamais proposées à l'indexation**.
- **Vérité produit** vérifiée dans le code de l'app au tag `v0.163.0` (servi en production selon ai-memory) : essai 14 jours **ou 25 conseils** (`lib/billing/plan-catalog.ts:77`), Gratuit 100 bouteilles et 2 conseils par mois, Passionné 14,95 $ par mois ou 149 $ par an, Premium 29,95 $ par mois ou 299 $ par an ; iOS en vente ; Android sur Google Play (Canada et Portugal, sans achat intégré) ; offre Restaurant B2B **en pause, absente de la production** : elle n'apparaît dans aucune proposition.
- **Règles LOCKED appliquées à toutes les recommandations** : « SAQ » interdit comme vocabulaire visible (sauf nom propre d'un magasin et §7 des textes légaux) ; « points de vente » et « succursale(s) » interdits ; positionnement « Octave d'abord » ; entité « iQWine » seul, Mégane fondatrice, Éric porte-parole ; jamais `app.iqwine.ai` sur une plateforme publique.
- **Outils** : curl, Chromium local, WebSearch et WebFetch, API publique iTunes, suggestions de recherche, Metricool en lecture (réglages de marque). Aucun achat, aucun compte créé.

### Divergences nommées (règle 2 des WORKING_RULES)

1. **Essai : la mémoire se contredit.** `DECISIONS.md` (2026-11-01) garde « fin d'essai sur 12 conseils ou sur le coût en dollars » parmi les **arbitrages ouverts**. Pourtant `CURRENT_STATE.md` (2026-11-05 et 2026-11-06) et le code `v0.163.0` disent 25. Le code fait foi techniquement ; l'entrée de `DECISIONS.md` est périmée et doit être close.
2. **Le site annonce 12 conseils** (`src/lib/trial.ts`, `TRIAL_RECOS = 12`, et `src/lib/legal-terms.generated.json`, `recos: 12`), alors que l'app sert 25. Les Conditions de l'app interpolent ce nombre (`lib/legal/legal-meta.ts:23`). Le site est donc simplement en retard d'une synchronisation, ce n'est pas un choix.
3. **Octave V3.** Le mandat parle d'Octave V3 non servi ; ai-memory indique que le Palais V3 est allumé en production depuis le 2026-09-20. La règle « ne promettre que ce que la version servie fait » reste appliquée ; aucune proposition ne repose sur une fonction non servie.
4. **Consigne GitHub Actions** : l'annexe 1 parle encore de la suspension temporaire de la CI. Elle a expiré le 2026-10-01 et ne s'applique plus. Le dépôt du site n'a d'ailleurs aucun workflow.

---

## 1. Verdict

**Ce qui aide.** Le socle technique est sain, et c'est rare à ce stade :
- 30 URL publiques bilingues, canonicals auto-référents et hreflang réciproques sur 30 pages sur 30 ;
- un seul H1 par page, contenu principal dans le HTML sans JavaScript ;
- redirections 308 en un saut depuis `.ca`, `www` et les anciens slugs ;
- `app.iqwine.ai` et staging correctement fermés à l'indexation ;
- aucun blocage des robots de recherche (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot passent en simulation) ;
- un positionnement net (Octave, sommelier qui apprend vos goûts) et des pages déjà alignées sur les bonnes intentions (cellier, apogée, accords, carte des vins, sommelier IA, tarifs).

**Ce qui limite réellement**, par ordre d'impact :
1. **Autorité externe très faible dans les sources consultées.** Aucune presse, aucun annuaire, aucun lien externe trouvé par les moyens gratuits utilisés. 1 note sur l'App Store, « 1+ téléchargement » sur Google Play. Dans **le seul moteur testé, l'outil WebSearch de Claude Code** (moteur non divulgué, réglé sur les États-Unis), iQWine apparaît **0 fois sur 17 tests**, et des homonymes (WineIQ, QWINE, iWine) prennent la place du nom. **Ce résultat ne vaut que pour ce moteur** : il ne dit rien de Google, de ChatGPT ni de Gemini. Search Console montre d'ailleurs que Google affiche iQWine sur sa marque (« iq wine », position moyenne 4,8 ; voir `ADDENDUM-CONSOLES.md`). Le domaine `.ai` n'a que 3 mois (bascule du 2026-08-02).
2. **Rien ne se mesure.** Il n'y a aucune analytique active (GA4 câblé mais sans identifiant, et bloqué de toute façon par la CSP). Les CTA écrasent la source d'arrivée (`utm_source=marketing`), l'inscription Google ou Apple ne garde aucune attribution, et deux définitions d'activation coexistent. Search Console et Bing Webmaster Tools n'ont pas pu être consultés. **On ne peut aujourd'hui ni prouver un problème d'indexation, ni mesurer un gain.**
3. **Des informations publiques fausses ou contraires aux règles** sont exactement celles que les moteurs et les IA reprennent :
   - essai à « 12 conseils » sur 14 meta descriptions et dans le JSON-LD de toutes les pages ;
   - « Standard » au lieu de Passionné ;
   - « point(s) de vente » et « succursale » sur l'accueil, le cellier, les tarifs, la politique et `llms.txt` ;
   - fiche Google Play avec « SAQ », `app.iqwine.ai` comme site web et politique, « Eric Bigras » comme développeur, et une fiche anglaise centrée sur la cave.
4. **Le contenu le plus citable est invisible** :
   - les 14 réponses de la FAQ Tarifs n'existent pas dans le HTML tant qu'on ne clique pas ;
   - le Guide d'Octave (environ 60 à 70 questions-réponses) et « Octave vérifiable » vivent sur `app.iqwine.ai`, en noindex ;
   - la démo d'accords n'expose qu'un plat sur 4 ;
   - la page Apogée décrit l'ancien modèle et ne répond pas à la question de son titre.
5. **Pages trop minces pour les intentions qui convertissent.** Les intentions qui convertissent sont « application » + tâche (cave, apogée, scan) ou un modificateur d'achat (gratuit, iPhone, Android, alternative). Or le Gratuit à 100 bouteilles, l'import depuis une autre appli, les plateformes et une comparaison honnête sont absents ou enfouis.

**Aucune garantie de position ni de recommandation par une IA n'est donnée ici.** Aucun score global n'est calculé.

---

## 2. Top 3 des actions à plus fort ROI

### TOP 1 · Rendre la visibilité mesurable (Search Console, Bing et attribution)

**Pourquoi d'abord.** C'est le seul chantier qui peut révéler un blocage invisible : sitemap non soumis, changement d'adresse `.ca` vers `.ai` non déclaré, réglage « Search generative AI » mal placé, Bing jamais vérifié. Il conditionne aussi la preuve de tous les autres. Sans lui, impossible de relier une page à un abonné.

**Contenu** :
- **Éric, environ 1 heure en console :**
  - Search Console : propriété de domaine `iqwine.ai`, sitemap soumis, couverture des 30 URL, Changement d'adresse depuis `iqwine.ca`, réglage *Paramètres > Search generative AI* sur Inclure, rapport *Generative AI performance* ;
  - Bing Webmaster Tools : import depuis Search Console, sitemap ;
  - Cloudflare : écran AI Crawl Control et Security Events, pour confirmer le passage réel des robots de recherche ;
  - Vercel : redirection de `iqwine-web.vercel.app`.
- **DATA, lot technique M (lot H1 et lot M du backlog) :**
  - une analytique sans cookie compatible avec la CSP, à arbitrer ;
  - transmission de l'UTM et du référent d'arrivée jusqu'à l'inscription ;
  - attribution conservée pour Google et Apple côté app ;
  - une requête agrégée « inscriptions, activation et premier paiement par source ».

**Effort** : S pour Éric, M pour DATA (2 à 3 jours, deux dépôts). **Confiance** : haute sur la valeur de diagnostic ; l'effet direct sur le trafic est inconnu tant que les consoles ne sont pas lues.

### TOP 2 · Une seule vérité publique, extractible

**Contenu :**
- **Site, lots A et B, effort S** : passer l'essai à 25, partout et par source unique, avec synchronisation des Conditions ; supprimer « Standard » ; retirer le vocabulaire interdit ; mettre les réponses de la FAQ dans le HTML ; corriger le H1 « ctave » ; compléter `llms.txt` (prix, plateformes, fondatrice) ; compléter le JSON-LD Organization (`founder` Mégane, `sameAs` vers les 4 comptes sociaux).
- **Fiches de boutiques, Éric, effort S** : retirer « SAQ », « succursale » et « bon prix » ; remplacer `app.iqwine.ai` par `iqwine.ai` ; aligner le titre anglais de Play sur « Personal Sommelier » ; uniformiser l'éditeur.

**Pourquoi** : c'est ce que les moteurs et les IA citent déjà ou citeront en premier. Une IA qui lit « 12 conseils » ou un lien vers l'app répète l'erreur. Trois règles LOCKED sont aujourd'hui enfreintes hors du site.
**Effort** : S (1 jour DATA, 1 heure Éric). **Confiance** : haute.

### TOP 3 · Deux pages d'intention qui convertissent : Cellier et Apogée

**Contenu :**
- **Enrichir `/fr/cellier-intelligent` ↔ `/en/wine-cellar-app`** : gratuit jusqu'à 100 bouteilles, cinq façons d'entrer une bouteille dont l'import CSV, Excel ou JSON depuis une autre appli, iPhone, Android et web, FAQ.
- **Refondre `/fr/apogee` ↔ `/en/drinking-window`** : modèle v7 à 4 repères, pastille de source, fiabilité, réponse directe à « quand boire ce vin », vraie capture.
- **Ensuite** : rapatrier sur `iqwine.ai` le contenu public d'« Octave vérifiable », sous réserve d'arbitrage.

**Pourquoi** : l'autocomplétion du 2026-11-06 suggère telles quelles « application cave à vin gratuite », « quand boire un vin application » et « wine drinking window app ». Ce sont des intentions d'outil, portées par des propriétaires de cave, donc le cœur payant. Aucun volume n'est inventé ; la méthode et la confiance (moyenne) sont détaillées dans l'annexe 4.
**Effort** : M (3 à 5 jours avec captures), GO page par page (pages LOCK, `docs/refonte-v3-contenus.md`), et pour l'apogée, après stabilisation des libellés v7. **Confiance** : moyenne.

> **Pourquoi l'autorité externe n'est pas dans le Top 3.** C'est le frein principal (point 1 du verdict), mais il dépend de tiers et se construit sur des mois. Il démarre en parallèle au plan à 30 jours : demande d'avis dans l'app, Product Hunt, dossier de presse. Il produira plus si les Top 2 et 3 sont faits d'abord : on n'invite pas la presse sur une page qui annonce un essai faux.

---

## 3. Tableau consolidé des constats (sans doublons)

ID consolidé, puis les ID d'agents fusionnés. P = priorité, E = effort.

| ID | Classe | Constat | Où | Preuve | Conséquence | Correctif | P | E | Conf. | Critère de vérification |
|---|---|---|---|---|---|---|---|---|---|---|
| V-01 | CONFIRMÉ | Essai annoncé « 14 jours ou 12 conseils », l'app sert 25 (T-01, R-05, C-01, A-05, G-03, M-11) | `src/lib/trial.ts:51`, `legal-terms.generated.json:18`, 14 meta descriptions, JSON-LD `RegisterAction` des 30 pages, FAQ, Conditions §3 | `curl` : 8 occurrences sur `/fr` ; `plan-catalog.ts:77` @ `v0.163.0` = 25 | Promesse fausse reprise par Google et les IA ; écart contractuel site/app | `TRIAL_RECOS = 25`, `pnpm legal:synchroniser`, test qui compare au catalogue de l'app | P1 | S | Haute | 0 « 12 conseils » ou « 12 interactions » dans le HTML des 32 pages |
| V-02 | CONFIRMÉ | Vocabulaire interdit servi : « point(s) de vente », « succursale » (C-02) | `/fr` (3), `/fr/cellier-intelligent` (1), `/fr/tarifs` (2), `/fr/confidentialite` (2), `llms.txt` (4) ; `SectionSaq.tsx`, `SectionRayonMagasin.tsx`, `SectionQuestion.tsx` | `curl \| grep` du 2026-11-06 | Contraire à la règle LOCKED du 2026-09-16 et 09-27 | « en magasin » ; le test qui bloque ces termes côté app est à reproduire côté site | P1 | S | Haute | grep des 32 pages et de `llms.txt` = 0 |
| V-03 | CONFIRMÉ | « Standard » (identifiant interne) visible au lieu de Passionné (T-08, R-07, C-04) | `src/lib/faq.ts:68-69` (FAQ et JSON-LD) | lecture du code et du HTML | Contraire à la règle des libellés ; IA qui cite un forfait inexistant | Libellé Passionné ou Enthusiast | P1 | S | Haute | 0 « Standard » public |
| V-04 | CONFIRMÉ | 14 réponses de la FAQ Tarifs absentes du HTML et du DOM (rendu `{open && …}`) (T-02, R-06, G-02) | `src/components/sections/SectionFaq.tsx:42-59` | HTML sans JS ; DOM avant clic | Les réponses de marque les plus demandées (prix, carte, gratuit) sont inindexables ; `FAQPage` décrit un texte non visible ; le résultat enrichi FAQ n'existe plus depuis mai 2026 | `<details>` ou contenu toujours rendu et replié en CSS | P1 | S | Haute | Chaque `acceptedAnswer` est retrouvée dans le texte visible du HTML initial |
| V-05 | CONFIRMÉ | Fiches de boutiques contraires à 3 règles LOCKED (A-01 à A-04, G-05, C-03) | Google Play FR et EN (« SAQ » 3 fois, « succursale » 4 fois, « bon prix », site web et politique = `app.iqwine.ai`, développeur « Eric Bigras », EN « Cellar & Sommelier ») ; App Store (politique = `app.iqwine.ai/confidentialite`, « points de vente », achats intégrés en français sur la fiche EN) | fiches publiques, source `cellier-vin/docs/ops/play-fiche-textes.md:81,141` | Ce sont les pages iQWine les plus probablement indexées ; elles exposent l'app et contredisent le positionnement | Mise à jour en console (Éric) et des fichiers source | P1 | S | Haute | Relecture des 4 fiches : 0 terme interdit, 0 `app.iqwine.ai` |
| V-06 | CONFIRMÉ | Aucune analytique active ; la CSP bloquerait GA4 et le script Cloudflare (M-01, M-02, M-08) | `layout.tsx:184-186`, `next.config.ts:47-68`, `src/lib/analytics.ts` | 0 traceur dans le HTML servi ; en-tête CSP | Aucune mesure d'audience ni de conversion du site ; 12 événements émis dans le vide | Outil sans cookie en même origine (Vercel Web Analytics, à confirmer) ou CSP ajustée, sur arbitrage | P1 | S | Haute | Visites et événements `signup_click` visibles 48 h après déploiement |
| V-07 | CONFIRMÉ | La source d'arrivée est écrasée vers l'inscription (M-03), et perdue en OAuth (M-04) ; personne ne lit l'attribution (M-05) | `src/lib/constants.ts:74-91` ; `cellier-vin` : `SocialAuthButtons.tsx:151-177`, `signup-entry.ts` | lecture du code (OAuth non rejoué) | Impossible de relier SEO ou IA à une inscription | Transmettre l'UTM et le référent ; les conserver en OAuth ; requête agrégée versionnée | P1 | M | Haute (site), moyenne (OAuth) | Inscription de test depuis `?utm_source=test` : la valeur est retrouvée en base |
| V-08 | NON VÉRIFIÉ | Search Console, Bing Webmaster Tools, IndexNow : état inconnu (T-16, G-10, M-12, R-14) | DNS : TXT `google-site-verification` sur `.ai` et `.ca` ; aucune preuve Bing | `dig` | On ignore indexation, requêtes, changement d'adresse, réglage IA | Passe console d'Éric (§11) | P1 | S | n/a | Captures des 7 contrôles dans `docs/audits/` |
| V-09 | CONFIRMÉ | Autorité externe très faible dans les sources consultées ; absence dans le seul moteur testé (WebSearch de l'outil, non généralisable à Google, ChatGPT ou Gemini) (A-09, M banc) | Web | 14 requêtes de l'agent 5, 17 tests de l'agent 6 : 0 iqwine.ai | Les IA à recherche web n'ont rien à citer hors du site | Plan d'autorité (§10) | P1 | L | Haute (constat), faible (portée Google non mesurée) | Liens référents dans GSC ; présence au banc mensuel |
| V-10 | CONFIRMÉ | Collision de nom avec « WineIQ – AI Sommelier » (Royaume-Uni, 2026) et homonymes (A-08) | Web, boutiques | 2 synthèses du moteur ont substitué WineIQ à iQWine | Confusion d'entité dans les réponses IA | Entité très explicite (Organization, `sameAs`, « iQWine, Octave, Québec ») ; vérification d'antériorité du nom par Éric | P2 | S | Moyenne | Banc : 0 confusion sur B14, B15, B28 |
| V-11 | CONFIRMÉ | Contenus de confiance hébergés sur un domaine en noindex (G-01, C-07, R-13, T-17) | `app.iqwine.ai/apprendre` (Guide), `/octave-verifiable`, liés du pied de page | `x-robots-tag: noindex, nofollow` | Le meilleur contenu question-réponse est inéligible à toutes les surfaces | **Arbitrage** : republier le contenu public sur `iqwine.ai` (ne jamais lever le noindex de l'app) | P2 | M à L | Haute | Pages `iqwine.ai/.../guide/...` indexées |
| V-12 | CONFIRMÉ | Page Apogée : ancien modèle à 3 états, ne répond pas à son titre (C-05, G-06) | `/fr/apogee`, `/en/drinking-window` | texte servi vs moteur v7 | Intention forte mal servie | Refonte (Top 3) | P1 | M | Haute | Réponse directe en tête, 4 repères v7, capture réelle |
| V-13 | OPPORTUNITÉ | Cellier : Gratuit 100 bouteilles, import, plateformes absents (C-10, C-11, R-09) | `/fr/cellier-intelligent` (439 mots) | texte servi | Les intentions « gratuite », « android », « excel » ne trouvent rien | Enrichir (Top 3) | P1 | M | Moyenne | Section et FAQ présentes ; impressions GSC sur ces requêtes |
| V-14 | CONFIRMÉ | Démo d'accords : 1 plat sur 4 dans le HTML (G-12, C-08) | `/fr/accord-mets-vins` | HTML sans JS | 3 réponses citables invisibles | Rendre les 4 | P2 | S | Haute | 4 réponses dans le HTML initial |
| V-15 | CONFIRMÉ | `iqwine-web.vercel.app` sert tout le site, indexable, hors Cloudflare (T-04) | hôte Vercel | `curl` 200, sans `x-robots-tag` | Doublon d'hôte (atténué par le canonical) ; contournement du WAF | Redirection 308 dans Vercel ou par le middleware | P2 | S | Haute | 308 vers `iqwine.ai` |
| V-16 | CONFIRMÉ | `/en/privacy` sert un corps en français sous `lang="en-CA"` (T-03) | `/en/privacy` | H1 « Politique de confidentialité » | Page EN de faible qualité ; signal de langue incohérent | Traduction juridique (arbitrage) | P2 | M | Haute | H1 et corps en anglais |
| V-17 | CONFIRMÉ | Maillage contextuel mince : l'accueil ne lie ni `/sommelier-ia`, ni `/tarifs`, ni `/apogee` dans son contenu (T-06) | sections de l'accueil | matrice des liens | Autorité interne mal dirigée, contraire à « Octave d'abord » | Liens contextuels naturels | P2 | M | Haute | Au moins 3 liens contextuels par page fonctionnelle |
| V-18 | CONFIRMÉ | 16 meta descriptions sur 30 dépassent 160 caractères ; titre Tarifs à 69 caractères avec « iQWine » en double (T-07) | `page.tsx` | mesure | Troncature (sur le suffixe d'essai faux) | Réécrire avec le lot A | P2 | S | Haute | Descriptions ≤ 155, titres ≤ 62 |
| V-19 | CONFIRMÉ | 404 Next par défaut, en anglais, sans lien (T-05) ; `/pricing` mène à `/fr/pricing` = 404 (R-12, T-13) | routage | `curl` | Visiteurs et liens externes perdus | 404 de marque, alias `/pricing` | P2 | S à M | Haute | `/pricing` (AL fr) → `/fr/tarifs` ; 404 avec liens |
| V-20 | CONFIRMÉ | H1 Tarifs lu « Trouvez votre ctave » sans rendu (le O est un SVG) (T-14, R-08, G-07) | `OctaveWordmark.tsx` | texte extrait | Titre illisible pour les robots et lecteurs d'écran | Texte accessible (`aria-label` ou texte masqué visuellement) | P2 | S | Haute | Texte extrait = « Octave » |
| V-21 | CONFIRMÉ | Robots d'entraînement (GPTBot, ClaudeBot, CCBot…) bloqués en 403 au bord Cloudflare, alors que robots.txt les autorise ; choix non documenté (R-01, R-02, R-17) | Cloudflare | simulation UA reproduite par DATA | Aucun effet sur la recherche ; présence future dans les connaissances des modèles réduite ; incohérence | **Arbitrage** puis aligner robots.txt et bord, et documenter | P2 | S | Moyenne (simulation) | Décision écrite ; robots.txt et réglage Cloudflare concordants |
| V-22 | NON VÉRIFIÉ | Passage réel des robots de recherche IA (OAI-SearchBot, Claude-SearchBot, PerplexityBot, Bingbot) (R-03, R-04) | Cloudflare | simulation UA : 200 | Si la protection bloque les vraies IP, visibilité IA nulle | Lire AI Crawl Control et Security Events | P1 | S | n/a | Requêtes autorisées visibles par robot |
| V-23 | OPPORTUNITÉ | Comptes sociaux (Instagram, TikTok, YouTube, Facebook) absents du site et du JSON-LD ; ni `founder`, ni `sameAs` (A-06, A-07, G-04) | `src/lib/structured-data.ts`, pied de page | grep : 0 lien | Entité moins reconnaissable, risque d'homonymie | `sameAs`, `founder` Mégane (jamais Éric), liens du pied de page | P2 | S | Haute | JSON-LD validé, liens présents |
| V-24 | OPPORTUNITÉ | Aucune page comparative, alors que « vivino alternative » et « cellartracker français » sont suggérés (C, A-10) | à créer | suggestions du 2026-11-06 | Demande de comparaison captée par InVintory | Une seule page honnête, datée, sourcée | P2 | M | Faible | Page publiée, revue tous les six mois |
| V-25 | CONFIRMÉ | `SoftwareApplication` non admissible au résultat enrichi (il faudrait une note réelle) ; lien App Store sur l'ancien nom ; `VideoObject` en français sur les pages EN ; `lastmod` uniforme (T-09 à T-11, A-13) | `structured-data.ts`, `constants.ts:28`, `sitemap.ts` | lecture | Mineur | Lot G ; **ne jamais fabriquer de note** | P3 | S | Haute | Validateur sans avertissement bloquant |
| V-26 | HYPOTHÈSE | JS de 212 à 271 Ko par page, TBT de laboratoire de 400 à 650 ms : risque sur l'INP (T-15) | toutes | Chromium mobile émulé (PSI refusé, quota) | Possible frein Core Web Vitals | Mesure PSI ou CrUX, puis décider | P3 | M | Moyenne | PSI mobile archivé ; INP terrain si disponible |
| V-27 | CONFIRMÉ | `llms.txt` exact mais incomplet (sans prix, plateformes ni fondatrice) ; aucun grand fournisseur ne documente le lire, et Google dit ne pas l'utiliser (R-10, R-11, G) | `src/app/llms.txt` | lecture et sources officielles | Faible enjeu | Mise à jour minimale avec le lot A, sans plus d'investissement | P3 | S | Haute | Fichier cohérent avec `/tarifs` |
| V-28 | CONFIRMÉ | Deux définitions d'activation ; `upgrade_completed` émis pour Stripe seulement (M-06, M-14) | `cellier-vin` : runbook §5, `product-events.ts` | lecture | Entonnoir SEO vers abonné non calculable | **Arbitrage** d'une définition unique | P2 | S | Haute | Définition inscrite ; requête qui la calcule |

Constats mineurs restants (tirets cadratins, code mort qui présente Éric comme « Fondateur », `Vary` sur la 307) : annexes 1, 4 et 5, lot G.

---

## 4. Matrice d'accessibilité des moteurs et robots

État au 2026-11-06. Niveau de preuve : **S** = simulation par User-Agent (un vrai robot vérifié par IP peut être traité autrement), **C** = configuration lue, **L** = confirmé dans les journaux (**aucun** : pas d'accès).

| Robot | Fonction documentée | Souhaitable | robots.txt | Bord Cloudflare | Preuve | Action |
|---|---|---|---|---|---|---|
| Googlebot | Index Google, base de Search, d'AI Overviews et d'AI Mode | Oui | Autorisé | 200 | S, C | Confirmer en GSC |
| Google-Extended | Jeton : entraînement de Gemini et ancrage de l'app Gemini (pas Search, pas AI Overviews) | Oui (sinon perte de l'ancrage Gemini) | Autorisé (non nommé) | sans objet (pas de robot propre) | C | Ne pas bloquer |
| Bingbot | Index Bing : Bing, Copilot, DuckDuckGo ; usage par ChatGPT seulement attesté par des sources secondaires | Oui, levier majeur | Autorisé | 200 | S | Vérifier Bing WMT |
| OAI-SearchBot | Recherche ChatGPT | Oui, indispensable | Autorisé | 200 | S | Confirmer en journaux |
| ChatGPT-User | Lecture à la demande d'un utilisateur | Oui | Autorisé (peut ne pas s'appliquer) | 200 | S | idem |
| GPTBot | Entraînement OpenAI | **Arbitrage** | Autorisé | **403** | S (reproduit par DATA) | Aligner après décision |
| Claude-SearchBot | Recherche Claude | Oui, indispensable | Autorisé | 200 | S (reproduit) | Confirmer |
| Claude-User | Lecture à la demande | Oui | Autorisé | 200 | S | idem |
| ClaudeBot | Entraînement Anthropic | **Arbitrage** | Autorisé | **403** | S (reproduit) | Aligner après décision |
| PerplexityBot / Perplexity-User | Recherche / à la demande | Oui | Autorisé | 200 | S | Confirmer |
| Applebot / Applebot-Extended | Recherche Apple / jeton d'entraînement | Oui / arbitrage | Autorisé | 200 / sans objet | S | Aucune |
| CCBot | Common Crawl (entraînement de tiers) | Arbitrage | Autorisé | 403 | S | Aligner |
| Bytespider, Amazonbot | Entraînement | Sans intérêt documenté pour le Québec | Autorisé | 403 | S | Les nommer dans robots.txt |
| meta-externalagent | Entraînement Meta | Arbitrage | Autorisé | **200** (non bloqué) | S | Incohérence à régler avec la décision |

Lecture : le schéma correspond à la politique Cloudflare des robots IA avec « Training = Block, Search = Allow ». L'origine exacte (politique IA ou règle WAF) n'est **pas vérifiée**. **Ce blocage n'empêche pas d'être cité par ChatGPT ou Claude en recherche web.** Il réduit seulement la présence dans les connaissances apprises des futurs modèles, qui ne garantit d'ailleurs aucune recommandation. Les deux variantes de robots.txt cibles et leur pour et contre sont dans l'annexe 3, §8 et §10.

Contrôles Google en 2026, vérifiés dans les sources officielles (annexe 2) :
- l'éligibilité à AI Overviews et AI Mode exige que la page soit indexée, éligible à l'extrait, **et** que le site soit inclus dans le réglage *Search generative AI* de Search Console (déployé mondialement le 2026-08-31, Inclure par défaut ; source vérifiée directement par DATA : support.google.com/webmasters/answer/16908024) ;
- aucune directive `nosnippet` ou `max-snippet` ne bride le site ;
- le résultat enrichi FAQ a été retiré de Google Search en mai 2026.

---

## 5. Carte des intentions, pages existantes et manquantes

Détail complet (requêtes, signal, conversion, structure, questions, CTA) : annexe 4, §2, §3 et §6. Aucun volume n'est inventé : le potentiel combine les suggestions de recherche du 2026-11-06, la concurrence observée et l'adéquation au produit.

| # | Intention (FR / EN) | Conversion | Page | Décision | Potentiel · confiance |
|---|---|---|---|---|---|
| 1 | Application de cave à vin (gratuite, iPhone, Android, Excel) / wine cellar app | Élevée | `/fr/cellier-intelligent` ↔ `/en/wine-cellar-app` | **Enrichir** (Top 3) | Élevé · moyenne |
| 6 | Quand boire un vin, apogée (application) / drinking window app | Élevée | `/fr/apogee` ↔ `/en/drinking-window` | **Refondre** (Top 3) | Élevé · moyenne |
| 10 | Gratuit, prix / free wine app | Élevée | `/fr/tarifs` ↔ `/en/pricing` | Corriger (Top 2) | Élevé · moyenne |
| 3 | Sommelier IA / AI sommelier app | Élevée | `/fr/sommelier-ia` ↔ `/en/ai-sommelier` | Enrichir (Octave vérifiable, FAQ) | Moyen · faible (EN très concurrentiel) |
| 5 | Accords mets-vins (application ; plats) | Moyenne pour l'appli, faible pour un plat | `/fr/accord-mets-vins` ↔ `/en/wine-pairing` | 4 plats dans le HTML, un bloc « à la table québécoise », **pas de pages par plat** | Moyen · moyenne |
| 9 | Choisir un vin au restaurant / how to pick wine at a restaurant | Moyenne | `/fr/carte-des-vins` ↔ `/en/wine-list` | Ajouter le QR et la méthode en 3 bouteilles | Moyen · moyenne |
| 12 | Alternative à Vivino, CellarTracker en français | Élevée | **manquante** | **Créer une seule page comparative** | Moyen · faible |
| 11 | Application vin iPhone / Android | Élevée | section seulement | Section et FAQ, pas de page | Moyen · moyenne |
| 2 | Application pour choisir un vin | Moyenne | `/fr/choisir-un-vin` ↔ `/en/how-to-choose-wine` | Corriger, arbitrer le titre | Moyen · moyenne |
| 8 | Scanner une étiquette | Moyenne | partielle | Page **conditionnelle** aux données GSC (risque de cannibalisation) | Moyen · faible |
| 7 | Appli vin au Québec | Faible en direct | aucune | Pas de page ; « magasin par magasin, partout au Québec » dans les pages existantes | Faible · moyenne |
| 4, 2b, 13 | Culture du vin générale, recommandation générique, ChatGPT et vin | Faible | aucune | **Ne pas créer** (contenu de masse exclu par la directive d'Éric) | Faible |

**Le cas « SAQ ».** Les suggestions montrent que les Québécois ajoutent ce nom pour dire « achetable ici » (« recommandation vin rouge saq »). La règle LOCKED fait perdre ces requêtes en correspondance exacte ; perte modérée, non chiffrable. Les formulations conformes sont « en magasin, magasin par magasin, partout au Québec » et « in store, across Québec ». **Recommandation : statu quo.** Une levée ou une phrase d'attribution hors textes légaux reste un arbitrage d'Éric, non recommandé : le gain serait sémantique seulement, avec un risque de laisser croire à un partenariat.

---

## 6. Comparaison concurrentielle (sources et dates : annexe 5, §1)

| Concurrent | Preuves de confiance (App Store CA, 2026-11-06) | Ce qui capte la demande | Occasion pour iQWine |
|---|---|---|---|
| Vivino | 19 418 notes, 4,79 | base de vins, notes communautaires, pages régions | « bon vin **pour vous** », pas selon la foule ; en français ; prix locaux réels |
| CellarTracker | 1 647 notes, 4,83 ; 200 M bouteilles suivies (Business Wire, 2026-04-23) | référence des collectionneurs, fenêtres communautaires | gestion simple, en français, avec un sommelier qui explique ; import depuis CellarTracker |
| InVintory (Toronto) | 1 316 notes, 4,76 ; 370 k collectionneurs déclarés ; Product Hunt, presse | **le plus outillé pour les IA** : `llms.txt` avec tarifs, pages comparatives contre Vivino et CellarTracker, page AI Sommelier, serveur MCP, 138 articles d'aide | concurrent le plus direct (même prix affiché, essai de 14 jours) ; iQWine se distingue par le français natif, la disponibilité en magasin au Québec, le palais appris, le « je ne sais pas » |
| Appli du détaillant provincial | 24 115 notes, 4,72 | carrefour éditorial FR sur les accords | il vend ; iQWine ne vend rien et ne touche aucune commission ; accord depuis **votre** cave |
| Oeni | 697 notes, 4,72 | « gestion cave à vin » en français | Octave et l'ancrage québécois |

À surveiller : WineIQ (homonyme), Sommo, Gioia, Vinea (sommeliers IA anglophones). Aucune appli « sommelier IA » québécoise trouvée. La présence de ces concurrents dans ChatGPT, Gemini ou les AI Overviews n'a **pas été vérifiée**.

---

## 7. Banc de visibilité IA

- **Banc** : 30 questions (15 FR, 15 EN, 25 sans marque, 5 de marque avec grille d'exactitude) dans `annexes/banc-visibilite-ia.csv`. La question B10 contient « SAQ » parce que c'est la formulation réelle des internautes : c'est une mesure, pas une consigne de rédaction.
- **Exécuté le 2026-11-06, 14 h 43 à 14 h 44 UTC** : 17 tests (12 questions, dont 3 répétées, et 2 diagnostics) sur **le seul outil WebSearch de Claude Code** (moteur non divulgué, déclaré limité aux États-Unis). **Ce n'est ni Google, ni ChatGPT, ni Gemini, ni Claude.ai.** Résultat, **pour ce seul moteur** : iQWine présent 0 fois sur 17, 0 URL citée, 3 requêtes de marque sur 3 sans résultat, homonymes à la place. Aucune conclusion sur Google, ChatGPT ou Gemini ne s'en déduit. Concurrents récurrents : Sommo, InVintory, CellarTracker, Vivino, Gioia, Oeni. Variabilité : sources stables d'une répétition à l'autre, 1 ou 2 noms changent dans la synthèse. Journal : `annexes/journal-tests-2026-11-06.csv`.
- **NON EXÉCUTÉ** : ChatGPT, Gemini, AI Overviews et AI Mode, Copilot, Perplexity, Claude.ai. Aucune réponse n'a été simulée.
- **Protocole de suivi** (annexe 6, mission D) :
  - mensuel (1er lundi) : 12 questions sur 3 plateformes, environ 1 h 15 ;
  - trimestriel : 30 questions sur 6 plateformes ;
  - témoins de variabilité répétés 3 fois ;
  - comptes de test dédiés, jamais personnels ;
  - captures obligatoires ;
  - gabarit CSV ;
  - 7 règles contre la sur-interprétation, dont : aucun changement n'est déclaré sans 2 mois concordants, et aucun effet n'est lu avant 4 semaines et une preuve d'indexation.
- **Indicateurs business** : impressions et clics hors marque (GSC, Bing), arrivées par source (dont `chatgpt.com`, `perplexity.ai`, `gemini.google.com`), inscriptions par source, activation (définition à trancher), premier paiement à 30 jours.
- **Limites d'attribution** : une citation IA ne produit pas forcément de clic ; une partie des visites IA arrive sans référent ; l'app native masque le référent ; seuls ChatGPT et quelques autres ajoutent un `utm_source`.

---

## 8. Plan priorisé

**Immédiat (semaine 1)**
1. Éric : passe console (§11) ; corriger les fiches Play et App Store (V-05) ; trancher les décisions du §11.
2. DATA : lots A et B (vérité et FAQ indexable), en un seul déploiement ; lot C (hôte Vercel) si Éric ne le fait pas en console.
3. DATA : clore l'arbitrage périmé de l'essai dans `ai-memory` (sur ton accord).

**30 jours**
1. Lot M : analytique, transmission de l'attribution, OAuth et requête agrégée (selon l'arbitrage).
2. Lot E : maillage contextuel et métadonnées ; lot D : 404 de marque ; lot G : hygiène.
3. Pages : enrichir le Cellier, puis la refonte Apogée (après stabilisation des libellés v7).
4. Entité : `sameAs`, `founder`, liens sociaux.
5. Autorité : demande d'avis native dans l'app (E-2), fiche Product Hunt et AlternativeTo (E-3).
6. Banc : premier passage manuel sur ChatGPT, AI Overviews et Perplexity, comme ligne de base.

**90 jours**
1. Pages : sommelier IA enrichi, accords (4 plats et table québécoise), carte des vins (QR), page comparative unique.
2. Guide d'Octave rapatrié sur `iqwine.ai`, si l'arbitrage est favorable.
3. Dossier de presse et démonstrations (E-4 à E-6).
4. Revue à 90 jours : GSC hors marque, rapport IA générative, inscriptions par source, banc trimestriel. On ne garde que ce qui bouge un indicateur business.
5. Page scan seulement si GSC le justifie ; performance (V-26) seulement si les données terrain la confirment.

---

## 9. Lots techniques

Le détail par fichier est dans `BACKLOG.md`. Chaque lot passe la chaîne qualité locale complète (`pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm verifier:routage`, plus `pnpm legal:verifier` si le légal est touché) sur le SHA exact, puis suit la règle de déploiement de la branche `production`. Les pages publiques sont LOCK : GO d'Éric page par page pour tout changement de texte visible.

## 10. Actions éditoriales et externes

| Action | Responsable proposé | Quand |
|---|---|---|
| Corriger les 4 fiches de boutiques (V-05) et leurs fichiers source `cellier-vin/docs/ops/*-fiche-textes.md` | Éric (console), DATA (fichiers source) | Semaine 1 |
| Captures réelles sur un compte de démonstration : carte d'apogée v7, carte des vins en 3 bouteilles, import, « Ce qu'Octave a compris de vous » (widget iOS retiré du périmètre par Éric, 2026-11-07 ; les pages utilisent les captures réelles déjà en ligne, `public/screenshots/`) | Éric | 30 jours |
| Validation du texte des pages Cellier et Apogée, puis des suivantes | Éric (GO), DATA (rédaction conforme à `refonte-v3-seo.md`) | 30 et 90 jours |
| Demande d'avis native après un conseil jugé utile | Éric (décision), session de développement de l'app | 30 jours |
| Product Hunt, AlternativeTo | Éric | 30 jours |
| Dossier de presse « projet familial québécois » (la question de Mégane, ce qu'Octave ne fait pas) ; médias vin et techno : liste dans l'annexe 5, E-4 et E-5, **contacts à reconfirmer** | Mégane (histoire), Éric (porte-parole) | 90 jours |
| Démonstrations au milieu professionnel (ACSP-Québec, ITHQ), créateurs avec un compte de test | Mégane et Éric | 90 jours |
| Banc mensuel | Éric (ou une personne désignée), gabarit fourni | Mensuel |

Aucun contact n'a été pris et rien n'a été publié dans ce mandat.

## 11. Accès manquants et décisions réservées à Éric

**Accès manquants**, par ordre d'utilité :
1. Search Console : couverture, sitemap, Changement d'adresse, *Search generative AI*, rapport IA générative.
2. Bing Webmaster Tools.
3. Cloudflare : AI Crawl Control, Security Events, Bot Fight Mode.
4. Vercel : domaines et journaux.
5. App Store Connect et Play Console (sources d'installation).
6. Agrégats de l'app : inscriptions par source, activation, paiements (requête de lecture, sans données personnelles).

**Décisions** (les seules qui bloquent) :
1. **Essai à 25** : confirmer la mécanique publique au 25e conseil (seuls les conseils s'arrêtent, ou tout l'essai ?). Elle détermine la phrase de la FAQ et des Conditions synchronisées.
2. **Robots d'entraînement** : garder le refus actuel (le documenter et l'écrire dans robots.txt) ou l'autoriser. Sans effet sur la recherche web dans les deux cas.
3. **Outil d'analytique** : outil sans cookie en même origine (Vercel Web Analytics, coût et conformité Loi 25 à confirmer) ou ajustement de la CSP pour un autre outil.
4. **Définition unique de l'activation** (proposée : premier conseil personnalisé d'Octave dans les 7 jours).
5. **Guide d'Octave et « Octave vérifiable »** : les republier sur `iqwine.ai` (contenu public seulement). Le noindex de l'app reste intact dans tous les cas.
6. **Page comparative** nommant des concurrents (usage nominatif factuel, revue tous les six mois).
7. **Traduction de la politique de confidentialité EN** (relecture juridique).

Déjà tranché, à ne pas rouvrir sans ta demande : « SAQ » (statu quo recommandé), Restaurant (absent), entité et rôles.
