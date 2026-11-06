# Agent 6 · Mesure, conversion et banc de visibilité IA

Audit de https://iqwine.ai, 2026-11-06 (mesures entre 14:41 et 14:45 UTC). Lecture seule : aucun fichier de dépôt modifié, aucun accès prod, VPS ou base, aucun secret lu.

Dépôts lus :
- `~/Projects/iQWine_Web` @ `3fe6b1b` (`main` = `origin/production`, même SHA au moment de la lecture).
- `~/Projects/cellier-vin` : copie de travail sur `dev/apogee-v7-suites` (`973b3ebf8`) ; les faits cités sont vérifiés sur `origin/main` (`5ec89b085`, 2026-11-05) ou sur l'étiquette `v0.163.0-rc.3` quand c'est indiqué.

Livrables connexes, dans le même dossier :
- `/tmp/claude-1000/-home-ebigras-Projects-iQWine-Web/b169f3ff-26b5-4233-bc29-e163ffdd5eba/scratchpad/banc-visibilite-ia.csv` (30 questions)
- `/tmp/claude-1000/-home-ebigras-Projects-iQWine-Web/b169f3ff-26b5-4233-bc29-e163ffdd5eba/scratchpad/journal-tests-2026-11-06.csv` (17 exécutions)
- HTML et en-têtes bruts : dossier `a6/` du même scratchpad.

---

## Mission A · Mesure de départ

### A1. Analytique du site : il n'y a rien qui mesure

| Élément | Constat | Preuve |
|---|---|---|
| GA4 (`@next/third-parties`) | Câblé mais **éteint** : rendu seulement si `NEXT_PUBLIC_GA_ID` existe au build. | `src/app/[locale]/layout.tsx:184-186` ; 0 occurrence de `googletagmanager`/`gtag` dans le HTML servi de `/fr`, `/en/pricing`, `/fr/tarifs`. |
| Couche d'événements | `src/lib/analytics.ts` : 12 événements (`signup_click`, `app_store_click`, `play_store_click`, `plan_selected`, `scroll_depth`…) poussés dans `window.dataLayer`, utilisés par environ 30 composants. **Aucun consommateur** : rien ne lit ce `dataLayer`. | grep des imports ; HTML servi. |
| Vercel Analytics / Speed Insights | Absents (`@vercel/analytics` n'est pas dans `package.json`). | `package.json` |
| Cloudflare Web Analytics (balise RUM) | Absente du HTML servi (aucune `beacon.min.js` ni `cloudflareinsights`). Cloudflare garde sa propre analytique de zone, côté serveur, visible seulement dans le tableau de bord d'Éric. | HTML servi ; `docs/decision-cloudflare.md` (« analytique et journaux »). |
| Plausible, umami, Matomo, PostHog, Clarity… | Absents. | grep du dépôt. |
| Seul chiffre d'audience trouvé | « 549 visiteurs quotidiens » dans `docs/decision-cloudflare.md` (2026-08-03), sans source ni méthode. | |

**La CSP servie interdit presque tout outil tiers** (en-tête relu en ligne à 14:41 UTC, identique à `next.config.ts:47-68`) :
`script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com` · `connect-src 'self' https://challenges.cloudflare.com` · `img-src 'self' data: blob:`.

| Outil | Charge-t-il avec la CSP actuelle ? |
|---|---|
| GA4 / GTM | **Non** : le script de `www.googletagmanager.com` et les envois vers `*.google-analytics.com` sont bloqués. Poser `NEXT_PUBLIC_GA_ID` sans toucher à la CSP donnerait une fausse impression de mesure, avec zéro donnée. |
| Cloudflare Web Analytics | **Non** : il faut `script-src static.cloudflareinsights.com` et, en installation manuelle, `connect-src cloudflareinsights.com`. En installation automatique sur zone proxifiée, la balise renvoie vers `/cdn-cgi/rum` sur le même domaine (couvert par `'self'`), mais le script reste bloqué. Source : developers.cloudflare.com, FAQ Web Analytics et page « Content Security Policies », consultées le 2026-11-06. |
| Vercel Web Analytics | **Probablement oui** : script et envois en même origine (`/_vercel/insights/*`), couverts par `'self'`. À confirmer dans la documentation Vercel avant de choisir. |
| Plausible / umami hébergés ailleurs | Non sans modifier la CSP. |

### A2. Des CTA à l'inscription : l'attribution s'arrête au site

Liens relevés dans le HTML servi :
- **Essai** : `https://app.iqwine.ai/signup?utm_source=marketing&utm_medium=cta&utm_campaign=trial&src=<emplacement>&lang=<fr|en>`, avec en plus `plan` et `period` sur les cartes de prix. Ces liens sont produits par `buildSignupUrl` (`src/lib/constants.ts:74-91`), qui a 27 appelants. `src` dit **où** se trouve le bouton (`hero`, `nav`, `sticky`, `tarifs-hero`, `accords`, `apogee`…).
- **Connexion** : `https://app.iqwine.ai/login`, sans paramètre.
- **Pages publiques de l'app** : `https://app.iqwine.ai/apprendre` et `https://app.iqwine.ai/octave-verifiable` (pied de page et `SommelierContent.tsx:436`). Elles répondent 200 avec `x-robots-tag: noindex, nofollow`.
- **Boutiques** : App Store `apps.apple.com/ca/app/iqwine-sommelier-ia-vins/id6798458954` et Google Play `play.google.com/store/apps/details?id=ca.iqwine.app`, **sans paramètre de campagne**. `CTA_VERS_STORE = false` : les CTA principaux mènent tous à l'essai web.
- `Referrer-Policy: strict-origin-when-cross-origin` : l'app ne reçoit que `https://iqwine.ai/` comme référent, jamais le chemin.

Ce que ça donne :
1. **La source réelle est écrasée.** Qu'un visiteur arrive de Google, de `chatgpt.com?utm_source=chatgpt.com`, de Perplexity ou d'une publication Metricool, son lien d'inscription dit toujours `utm_source=marketing`. Le site ne lit ni l'UTM d'arrivée ni `document.referrer` (aucune occurrence dans `src/`).
2. Règle « ne jamais exposer app.iqwine.ai sur une plateforme publique » : le site renvoie à l'app, ce qui est permis ; l'app reste `noindex`. **Aucune recommandation ici de lever ce `noindex` ou d'exposer l'app.**

### A3. Côté app (`cellier-vin`, lecture seule)

| Sujet | Ce qui existe | Preuve |
|---|---|---|
| Captation à l'inscription | `parseSignupEntry` lit `utm_source/medium/campaign`, `src`, `plan`, `period`, `lang`, `ref`/`parrain`, `code`, bornés à 64 caractères `[A-Za-z0-9._+-]`. L'attribution est **persistée** dans `User.preferences.acquisition` à la création du compte par courriel. Présent depuis 2026-07-31 et dans `v0.163.0-rc.3`. | `lib/auth/signup-entry.ts:176-228, 352-372` ; `app/(public)/signup/actions.ts:321` |
| Inscription Google / Apple (OAuth) | **Aucune attribution** : `SocialAuthButtons` ne reçoit que la liste des fournisseurs, `signIn(id, { callbackUrl })` ne transporte pas l'UTM, et `events.createUser` → `signalerInscriptionOAuth` n'enregistre que `source = google | apple | oauth`. | `components/auth/SocialAuthButtons.tsx:151-177` ; `lib/auth/config.ts:862+` ; `lib/analytics/activation-events.ts` |
| Référent HTTP | Jamais capté à l'inscription. | grep `referer` dans `app/(public)/signup`, `lib/auth` |
| Lecteur de l'attribution | **Aucun** : `ACQUISITION_PREF_KEY` n'est lu nulle part en dehors du module qui l'écrit (pas de tuile admin, pas de requête versionnée). Les événements produit (Axiom) filtrent `utm*`/`src` par liste blanche. | grep `app lib scripts` |
| Définition d'activation | **Deux définitions coexistent** : (1) runbook §5, « % activation (≥1 accord) », temps jusqu'au premier accord, source `SommelierEvent`, tableau `/admin/sommelier-analytics` ; (2) entonnoir P21B `signup_started → session_minted → first_bottle → revelation_seen` (Axiom) avec `onboarding_completed`. Aucune décision dans `ai-memory` ne tranche. | `docs/runbook-operations.md:59-63` ; `lib/analytics/product-events.ts:27-50` ; `lib/analytics/activation-events.ts` |
| Conversion payante | Stripe : `upgrade_completed` émis au webhook `checkout` avec `source` = mur d'upsell (`wall_quota`, `trial_ended`, `plans_page`…), **pas l'acquisition**. Apple : **aucun `upgrade_completed`** dans `lib/billing/apple/*`. Google Play : rail de facturation retiré (`lib/billing/rail.ts:68-84`). D'après `ai-memory` (CURRENT_STATE l. 96), « nouvel abonné payant » = premier encaissement réel (Stripe `Payment STRIPE_CARD > 0` ; Apple `apple.*` ACTIVE hors Sandbox). | `lib/billing/stripe-events.ts:337-350` |
| Divergence documentaire | Le runbook (modifié le 2026-10-01) dit encore « Stripe LIVE = bascule des clés en attente », alors qu'`ai-memory` parle d'encaissements réels. À trancher par Éric, sans incidence sur la mesure elle-même. | |

### A4. Données manquantes (aucun accès) et qui peut les fournir

| Donnée | Pourquoi elle compte | Qui | Format demandé |
|---|---|---|---|
| Google Search Console, propriété Domaine `iqwine.ai` (et l'ancienne `iqwine.ca`) | Impressions et clics par requête, pays, page, appareil ; rapport « IA générative » (impressions AI Overviews / AI Mode, lancé en juin 2026 selon des sources secondaires) ; couverture d'index ; sitemaps | Éric (propriétaire) | Export 16 mois, Performance > Requêtes et Pages (CSV) ; Pages > Indexation ; état des sitemaps ; outil de changement d'adresse `iqwine.ca → iqwine.ai` : fait ou non (prévu dans `docs/bascule-iqwine-ai.md` étape 1) |
| Bing Webmaster Tools | Index Bing, utile pour Copilot et, en partie, pour d'autres moteurs de réponse ; journal IndexNow | Éric | Rapport de recherche (CSV), pages indexées, sitemaps, historique IndexNow (le script `scripts/soumettre-indexnow.mjs` existe ; la clé est sur Vercel) |
| Cloudflare, zone `iqwine.ai` | Seule mesure de trafic existante : requêtes, visiteurs uniques, pays, chemins, robots (Bot Analytics / AI Crawl Control si le forfait le permet) | Éric | Captures ou export 30 jours : Traffic, Security > Bots, AI Crawl Control (GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended) |
| Vercel | Journaux de requêtes, statut 4xx/5xx | Éric | Facultatif |
| App Store Connect, App Analytics | Pages vues de la fiche, installations, sources (Recherche App Store, Référent web, App Referrer) | Éric | Export 90 jours, Sources |
| Google Play Console | Acquisition de la fiche, installations par source | Éric | Export 90 jours |
| Base prod (lecture via `cellier_lecture`, geste d'Éric ou de la session iqwine) | Inscriptions par `preferences.acquisition`, activation, premier encaissement | Éric ou session iqwine autorisée | Requête agrégée seulement, sans PII (voir D4) |
| Axiom (dataset `cellier`) | Entonnoir P21B, `upgrade_completed` | Session iqwine (clé de lecture sur vmdev) | Comptes agrégés par semaine |

### A5. Limites d'attribution propres aux moteurs IA

- **Citation sans clic** : une réponse peut nommer iQWine ou paraphraser iqwine.ai sans aucune visite. Seul un banc de questions le mesure (missions B à D).
- **ChatGPT** : les liens de sources portent en général `utm_source=chatgpt.com`, mais pas de façon garantie (essais Seer Interactive, juin 2025). Des sources secondaires de 2026 signalent une rupture du marquage après le 2026-10-09 (clics arrivant sans UTM ni référent, donc classés « direct »). **NON VÉRIFIÉ** auprès d'OpenAI : on ne peut pas s'appuyer sur ce marquage seul.
- **Perplexity, Gemini, Copilot, Claude.ai** : en général un référent (`perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`, `bing.com`, `claude.ai`), souvent sans UTM ; les applis mobiles et certains liens `noreferrer` n'envoient rien.
- **Google AI Overviews / AI Mode** : ces clics sont comptés dans le trafic web ordinaire de Search Console, sans qu'on puisse les isoler ; le rapport IA dédié ne donne que des impressions (sources secondaires, Search Central non consulté directement).
- **Chez iQWine en particulier** : même un visiteur bien étiqueté perd sa source, (1) parce qu'aucun outil ne l'enregistre sur le site et (2) parce que le CTA la remplace par `marketing`. Les inscriptions OAuth et celles faites dans les applis natives n'en ont aucune.
- **Boutiques** : un passage par l'App Store ou Google Play coupe la chaîne. Il faut des liens de campagne (`pt`/`ct` chez Apple, `referrer=` chez Google Play) pour en garder une partie, et seulement en agrégé.

---

## Mission B · Banc reproductible (30 questions)

Fichier : `/tmp/claude-1000/-home-ebigras-Projects-iQWine-Web/b169f3ff-26b5-4233-bc29-e163ffdd5eba/scratchpad/banc-visibilite-ia.csv`

- 15 FR, 15 EN ; **25 sans marque**, 5 de marque (B14, B15, B28, B29, B30).
- Intentions : `app_cave` (4), `sommelier_ia` (2), `reco_perso` (2), `choisir_vin` (2), `accords` (2), `apogee` (4), `quebec` (3), `comparatif` (4), `carte_resto` (2), `marque` (5).
- La colonne `reponse_de_reference_ou_signal_attendu` sert de grille d'exactitude, avec les valeurs relevées sur iqwine.ai/fr/tarifs le 2026-11-06 : Passionné 14,95 $/mois (12,42 $/mois à l'année) ; Premium 29,95 $/mois (24,92 $/mois à l'année). Elle rappelle la fondatrice (Mégane Bigras ; Éric est porte-parole, jamais fondateur).
- B10 contient « SAQ » parce que c'est la formulation réelle des internautes. **C'est une mesure, pas une recommandation d'employer ce mot sur le site** (décision LOCKED).

## Mission C · Échantillon exécuté

**Plateforme exacte** : outil `WebSearch` de Claude Code, en mode `standard`, utilisé par l'agent. Son moteur sous-jacent n'est pas divulgué et l'outil se déclare « US-only ». **Ce n'est ni ChatGPT, ni Gemini, ni Google AI Overviews, ni Copilot, ni Perplexity, ni l'interface grand public de Claude.ai.** Recherche web : oui. Contexte géographique : États-Unis (annoncé par l'outil), aucun compte, aucun historique.

Exécutions : 12 questions du banc, dont 3 répétées une seconde fois (B03, B09, B18), plus 2 diagnostics hors banc, soit **17 tests** entre 14:43:53 et 14:44:42 UTC. Détail : `journal-tests-2026-11-06.csv`.

| Résultat | Valeur |
|---|---|
| iQWine présent (mention, recommandation ou citation) | **0 / 17** |
| URL iqwine.ai citées | **0** |
| Requêtes de marque (B14, B15, B28) | 3 / 3 sans réponse ; confusion avec des homonymes (QWINE, marque américaine ; iWine ; iWines, Chili ; WineIQ ; iWinePad) |
| Diagnostic restreint aux domaines `iqwine.ai`, `iqwine.ca`, `apps.apple.com` | 0 page iqwine.ai et 0 fiche App Store iQWine renvoyées : ce moteur n'a vraisemblablement **rien indexé** de iqwine.ai |
| Concurrents récurrents | Sommo (5 tests), InVintory (5), CellarTracker (4), Vivino (4), Gioia (3), Oeni (3), Vinfinity (2), application SAQ (3), Signature Sommelier (3), VinoCell (3) |
| Variabilité (3 paires) | URL sources quasi identiques à 13 s d'intervalle ; dans la synthèse, 1 ou 2 noms changent sur 5 à 7. Lecture : une absence est stable, un classement ne l'est pas. |
| Exactitude des infos sur iQWine | Rien à évaluer : aucune affirmation produite, donc pas d'erreur non plus |

**Ce que ça autorise à dire** : dans un moteur web générique consulté depuis les États-Unis, iQWine est introuvable, même par son nom. **Ce que ça n'autorise pas** : conclure sur ChatGPT, Gemini, AI Overviews, Copilot ou Perplexity, qui ont leurs propres index et leurs propres signaux de localisation.

### Plateformes NON EXÉCUTÉES : protocole manuel pour Éric

ChatGPT, Gemini, Google AI Overviews / AI Mode, Copilot, Perplexity et Claude.ai : **NON EXÉCUTÉ**. Aucune réponse n'a été simulée.

| Plateforme | Mode à tester | Réglages |
|---|---|---|
| ChatGPT | (a) déconnecté sur chatgpt.com ; (b) connecté sur un **compte de test dédié** sans mémoire ni instructions personnalisées | Recherche web activée (bouton Rechercher), une conversation neuve par question |
| Gemini | Connecté sur un compte Google de test, activité des applis Gemini désactivée | Langue de l'interface = langue de la question |
| Google AI Overviews / AI Mode | google.ca en navigation privée, déconnecté, `hl=fr` ou `hl=en`, depuis une IP au Québec | Noter si un AI Overview apparaît ; tester AI Mode à part |
| Copilot | copilot.microsoft.com déconnecté | Mode par défaut |
| Perplexity | Déconnecté, mode par défaut | |
| Claude.ai | Compte de test, recherche web activée | |

Règles communes : une question par conversation, aucune relance, copie intégrale de la réponse et de ses sources, capture d'écran, heure UTC, version du modèle si elle est affichée, région de l'IP. **Jamais de compte personnel ou client.** Aucun lien vers app.iqwine.ai dans les questions.

## Mission D · Protocole de suivi

### D1. Fréquence
- **Mensuel** (1er lundi) : 12 questions (B01, B03, B05, B06, B08, B09, B14, B16, B18, B21, B24, B28) sur 3 plateformes prioritaires (ChatGPT avec recherche, Google AI Overviews / AI Mode, Perplexity), soit 36 tests, environ 1 h 15.
- **Trimestriel** : les 30 questions sur les 6 plateformes (180 tests), avec le WebSearch de l'agent comme 7e colonne gratuite.
- **Témoins de variabilité** : B03, B09 et B18, 3 fois chacun le même jour, à chaque passage.
- Après un changement de contenu ou d'indexation, attendre au moins 4 semaines avant de relire le banc.

### D2. Gabarit du journal (CSV, une ligne par test)
```
test_id,banc_id,repetition,date_utc,langue,question,plateforme,version_modele,connecte,mode,recherche_web,contexte_geo,iqwine_statut,rang_iqwine,urls_iqwine_citees,autres_urls_citees,concurrents_presents,exactitude_points_ok,exactitude_points_total,erreurs_critiques,capture,observateur,notes
```
- `iqwine_statut` ∈ `absent` | `mention` | `recommandation` (cité comme choix conseillé) | `citation` (URL iqwine.ai donnée en source). Plusieurs valeurs possibles, séparées par `;`.
- `erreurs_critiques` : Éric présenté comme fondateur, app.iqwine.ai cité comme adresse, offre Restaurant présentée comme disponible, prix ou essai faux, « partenaire SAQ ».

### D3. Indicateurs de visibilité
| Indicateur | Calcul |
|---|---|
| Taux de présence par intention et par plateforme | tests avec `iqwine_statut ≠ absent` / tests de l'intention |
| Taux de recommandation | tests `recommandation` / tests sans marque |
| Part des citations iqwine.ai | tests citant au moins une URL iqwine.ai / tous les tests ; et URL iqwine.ai / toutes les URL citées |
| Part de voix | mentions d'iQWine / mentions de toutes les applis nommées (même banc, même mois) |
| Exactitude de marque | Σ points corrects / Σ points vérifiables sur B14, B15, B28, B29, B30 ; plus le nombre d'erreurs critiques (cible : 0) |

### D4. Indicateurs business (une fois les accès et M-01, M-03 et M-04 réglés)
- **GSC** : impressions et clics **hors marque** (exclure les requêtes contenant `iqwine`, `iq wine`, `i q wine`), par langue et par page ; impressions du rapport IA générative.
- **Bing WMT** : même découpage.
- **Arrivées par source** sur le site (outil choisi en M-01) : organique, IA (`chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`, `claude.ai`), social, direct.
- **Inscriptions par source** : comptage agrégé de `User.preferences.acquisition`. Requête de lecture, sans PII, à versionner côté app, par exemple `count(*) group by preferences->'acquisition'->>'utmSource', ->>'src', semaine`, avec une ligne « sans attribution » séparée pour l'OAuth.
- **Activation** : définition unique à trancher (M-06). Proposition alignée sur « Octave d'abord » : premier conseil personnalisé d'Octave reçu dans les 7 jours suivant l'inscription.
- **Conversion payante** : premier encaissement réel dans les 30 jours (Stripe `Payment STRIPE_CARD > 0`, Apple ACTIVE hors Sandbox), par source d'inscription.
- **Installations par campagne** : App Store Connect (`ct=`) et Play Console (`utm_source`).

### D5. Règles contre la sur-interprétation
1. Les petits nombres ne prouvent rien : sur 12 tests, un passage de 0 à 1 n'est pas une tendance. Pour parler de changement, il faut au moins 2 tests de plus, **deux mois de suite**, dans les mêmes conditions.
2. Ne comparer que ce qui est comparable : même question exacte, même plateforme, même mode connecté ou non, même région.
3. Une présence n'est pas du trafic, et une citation n'est pas une recommandation. Ne jamais convertir le banc en volume de recherche.
4. Les modèles changent sans prévenir : noter la version, et considérer toute rupture qui coïncide avec un changement de modèle comme une rupture de série.
5. Pas de causalité sans délai : un correctif du site ne s'évalue pas avant 4 semaines, ni sans une preuve d'indexation (GSC ou Bing).
6. Le WebSearch de l'agent n'est qu'une colonne de plus : il ne représente aucune plateforme grand public.
7. Un seul observateur, toujours avec captures : toute ligne sans capture est écartée.

---

## Constats

| ID | Classe | Fichier / URL | Observation | Preuve / méthode | Conséquence | Correctif | Prio | Effort | Confiance | Critère de vérification |
|---|---|---|---|---|---|---|---|---|---|---|
| M-01 | CONFIRMÉ | `src/app/[locale]/layout.tsx:184` ; HTML servi | Aucune analytique d'audience active sur iqwine.ai : GA4 conditionnel non posé, aucune balise Cloudflare ni Vercel. | grep du dépôt ; `curl` de 3 pages à 14:41 UTC, 0 traceur | Aucune donnée de source, de page d'atterrissage ou de conversion du site. Impossible de mesurer le trafic venu des IA. | Arbitrage d'Éric. Recommandé : un outil **sans témoin** (Vercel Web Analytics, compatible `'self'` à confirmer, ou Cloudflare Web Analytics avec ajustement de CSP, voir M-02), puis mise à jour de la Politique de confidentialité (M-13). GA4 seulement avec consentement et CSP adaptée. | P1 | M | Haute | Une visite test apparaît dans l'outil sous 24 h ; aucune violation CSP dans la console. |
| M-02 | CONFIRMÉ | `next.config.ts:47-68` ; en-tête CSP servi | La CSP bloque GA4 et Cloudflare Web Analytics, même si on les active. | En-tête relu en ligne ; doc Cloudflare (`script-src static.cloudflareinsights.com`, `connect-src cloudflareinsights.com`) | Le piège : poser `NEXT_PUBLIC_GA_ID` donnerait une mesure fantôme, à zéro. | Ajouter à la CSP seulement les origines de l'outil retenu, d'abord en `Content-Security-Policy-Report-Only`. | P2 | S | Haute | Requête de la balise en 200 dans l'onglet Réseau, 0 erreur CSP. |
| M-03 | CONFIRMÉ | `src/lib/constants.ts:74-91` | `buildSignupUrl` impose `utm_source=marketing` à chaque CTA ; l'UTM d'arrivée et le référent ne sont jamais transmis. | Code ; liens du HTML servi | Même avec un outil en place, l'app ne peut pas relier une inscription à Google, à ChatGPT ou à une campagne sociale. | Capter au premier atterrissage (`sessionStorage`, sans PII) l'UTM entrant et l'**hôte** du référent, puis les transmettre : `utm_source` = source réelle (sinon hôte du référent, sinon `direct`), `utm_medium=site`, `src` = emplacement. Valeurs compatibles avec `ATTRIBUTION_RE` côté app (`chatgpt.com` passe). | P1 | M | Haute | Arriver sur `/fr?utm_source=test.ia` puis cliquer « Essayer » : le lien porte `utm_source=test.ia`. |
| M-04 | CONFIRMÉ (lecture de code) | `components/auth/SocialAuthButtons.tsx`, `lib/auth/config.ts:862+`, `lib/analytics/activation-events.ts` (cellier-vin) | Une inscription Google ou Apple ne persiste aucune attribution : seule l'inscription par courriel écrit `preferences.acquisition`. | Code `origin/main` ; aucun test exécuté | Une part inconnue des inscriptions reste sans source, ce qui fausse toute répartition. | Côté app, dans un lot soumis à `docs/AGENT-DEPLOYMENT-RULES.md` : témoin first-party court (≤ 30 min, httpOnly) posé avant `signIn` avec l'attribution bornée, relu dans `events.createUser`. | P1 | M | Moyenne-haute | Sur staging, une inscription Google de test arrivée par `?utm_source=test` porte `preferences.acquisition.utmSource = test`. |
| M-05 | CONFIRMÉ | `lib/auth/signup-entry.ts:176` (cellier-vin) | L'attribution persistée n'a aucun lecteur : ni rapport, ni tuile, ni requête versionnée. | grep `ACQUISITION_PREF_KEY`, `acquisition` | Ces données dorment ; l'entonnoir source → payant n'est jamais calculé. | Requête de lecture agrégée versionnée (`scripts/lecture/`) : inscriptions × activation J7 × payant J30, par `utmSource` et `src`. | P2 | S | Haute | La requête rend un tableau par semaine, sans courriel ni nom. |
| M-06 | CONFIRMÉ | `docs/runbook-operations.md:61` ; `lib/analytics/product-events.ts` | Deux définitions d'activation coexistent (≥ 1 accord, contre l'entonnoir première bouteille / révélation), et aucune décision ne tranche. | Lecture | Les KPI d'activation peuvent se contredire selon le tableau consulté. | Arbitrage d'Éric. Proposition : « premier conseil personnalisé d'Octave dans les 7 jours », à inscrire comme décision. | P2 | S | Haute | Décision datée dans `ai-memory`, une seule mesure affichée. |
| M-07 | CONFIRMÉ | `src/lib/constants.ts:27-41` ; `BadgesPlateformes.tsx` | Les liens App Store et Google Play n'ont aucun paramètre de campagne. | HTML servi | Les installations venues du site sont invisibles dans App Store Connect et Play Console. | App Store : `?pt=<jeton fournisseur>&ct=site-<emplacement>` (jeton fourni par Éric depuis App Store Connect). Play : `&referrer=utm_source%3Diqwine.ai%26utm_medium%3D<emplacement>`. | P2 | S | Haute | La campagne `site-hero` apparaît dans App Analytics > Sources sous 48 h. |
| M-08 | CONFIRMÉ | `src/lib/analytics.ts` | 12 événements de clic sont instrumentés mais muets (aucun consommateur du `dataLayer`). | Code + HTML | Travail déjà fait, et perdu. Le choix de l'outil en dépend : Cloudflare Web Analytics ne prend pas d'événements personnalisés ; Vercel les réserve à une offre payante (à confirmer). | En M-01, retenir un outil capable de recevoir `signup_click`, `app_store_click` et `plan_selected`, ou brancher `track()` sur l'outil retenu. | P2 | S-M | Moyenne (capacités des outils à confirmer) | `signup_click` apparaît dans l'outil après un clic test. |
| M-09 | OPPORTUNITÉ | Pied de page ; `SommelierContent.tsx:436` | Le site renvoie à `app.iqwine.ai/apprendre` et `/octave-verifiable`, pages de contenu en `noindex, nofollow`. | `curl` : 200 + `x-robots-tag` | Leur contenu (apprendre le vin, preuve d'Octave) ne compte pour aucun moteur ni aucune IA. | **Ne pas lever le `noindex` de l'app.** Si ce contenu doit compter pour la visibilité, en publier une version sur iqwine.ai. Arbitrage d'Éric. | P3 | M | Haute | n/a |
| M-10 | CONFIRMÉ (ce moteur seulement) | Journal du 2026-11-06 | WebSearch de l'agent : iQWine présent dans **0 test sur 17**, requêtes de marque et filtre de domaine compris ; des homonymes captent la marque. | 17 exécutions, voir le CSV | Dans ce moteur, iQWine n'existe pas ; les concurrents (Sommo, InVintory, Gioia, CellarTracker, Oeni) occupent l'intention « apprend vos goûts ». | Relève des agents chargés de l'indexation (GSC, Bing, IndexNow, liens entrants). Ici : répéter le banc chaque mois. | P1 | n/a | Haute pour ce moteur ; nulle pour les autres plateformes | Au moins 1 page iqwine.ai renvoyée par la requête restreinte au domaine (T17). |
| M-11 | CONFIRMÉ | `src/lib/trial.ts` (`TRIAL_RECOS = 12`), `/fr/tarifs` ; app `lib/billing/plan-catalog.ts:77` (`TRIAL_AI_RECOMMENDATIONS = 25`, `origin/main`) | Le site annonce 12 conseils d'essai ; le code de l'app en prévoit 25. | Code + HTML servi | Toute IA qui lit le site répétera « 12 » : c'est l'exactitude de marque de B15 et B29 qui est en jeu. | Synchroniser `trial.ts` dès que 25 est servi en prod, comme l'exige son propre commentaire. L'état servi en prod est à confirmer : `ai-memory` est ambigu (l. 6 contre l. 17). | P1 | S | Haute (écart de code) ; moyenne (état prod) | La meta et la page tarifs disent le même nombre que la prod. |
| M-12 | NON VÉRIFIÉ (accès) | GSC, Bing WMT, Cloudflare, App Store Connect, Play Console, Axiom, base | Aucune donnée d'impressions, d'index, de trafic, d'installations ou d'entonnoir accessible à l'audit. On ne sait pas si la déclaration GSC et l'outil de changement d'adresse prévus dans `docs/bascule-iqwine-ai.md` ont été faits. | Mandat | Aucune ligne de base chiffrée. | Exports listés en A4, fournis par Éric. | P1 | S (Éric) | n/a | Exports reçus et datés. |
| M-13 | CONFIRMÉ (silence de la politique) / HYPOTHÈSE (portée légale) | https://iqwine.ai/fr/confidentialite | La politique ne mentionne aucune mesure d'audience ni aucun témoin. Elle est cohérente avec l'état actuel. | Texte servi : 0 occurrence d'« analytique », « témoin », « cookie » | Ajouter un outil sans la mettre à jour créerait un écart. Avec la Loi 25 (art. 8.1, technologies de profilage désactivées par défaut), un outil à témoins exigerait un consentement. | Mettre à jour la politique en même temps que M-01. Avis juridique si GA4. | P2 | S | Moyenne | Politique à jour le jour de l'activation. |
| M-14 | CONFIRMÉ | `lib/billing/stripe-events.ts:343` ; `lib/billing/apple/*` (cellier-vin) | `upgrade_completed` n'est émis que pour Stripe, et sa `source` est le mur d'upsell, pas l'acquisition. Aucun événement pour Apple. | grep | Un tableau fondé sur `upgrade_completed` sous-compte les achats iOS. | Mesurer la conversion payante en base (premier encaissement réel, Stripe ou Apple, voir D4) plutôt que par l'événement. Ou émettre `upgrade_completed` côté Apple. | P2 | S | Haute | Le total de la requête égale le nombre de nouveaux payants affiché par la tuile admin. |

## Limites

- **Un seul moteur exécuté** : le WebSearch de l'agent, au moteur non divulgué, géolocalisé aux États-Unis, sans compte. Il ne représente ni ChatGPT, ni Gemini, ni AI Overviews, ni Copilot, ni Perplexity, ni Claude.ai, qui sont tous NON EXÉCUTÉS.
- Échantillon minuscule (12 questions, 3 répétitions à 13 secondes d'intervalle) : la variabilité observée est une borne basse, pas une mesure.
- Aucun accès à GSC, Bing, Cloudflare, Vercel, aux consoles des boutiques, à Axiom ni à la base : aucune ligne de base chiffrée de trafic, d'inscriptions, d'activation ou de conversion.
- Les constats côté app reposent sur la lecture de `origin/main` et de `v0.163.0-rc.3`, pas sur la production servie. M-04 n'a pas été rejoué en test.
- Les règles de Cloudflare sur la CSP viennent de developers.cloudflare.com (consulté par recherche, pas par lecture directe de la page). Les faits sur le marquage UTM de ChatGPT et sur le rapport IA de Search Console viennent de sources secondaires : à recouper avec les pages officielles. Les capacités de Vercel Web Analytics (même origine, événements payants) sont à confirmer dans sa documentation.
- La présence de la balise Cloudflare a été vérifiée avec un agent utilisateur de navigateur générique via `curl`, sans exécuter le JavaScript.
- « 549 visiteurs quotidiens » est repris d'un document, sans source vérifiable.
