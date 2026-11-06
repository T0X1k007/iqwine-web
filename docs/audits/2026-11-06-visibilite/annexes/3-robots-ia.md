# Agent 3 · ChatGPT, Claude et accès des robots IA à iqwine.ai

Audit de visibilité, 2026-11-06. Mesures en ligne entre 14 h 41 et 14 h 55 UTC, depuis vmdev (point de présence Cloudflare YYZ). Lecture seule : aucun changement au dépôt, aucun contact, aucun secret affiché. Environ 70 requêtes HTTP au total, espacées, sans boucle.

Production = branche `production` = `main` au moment de l'audit (`git log origin/production..origin/main` vide, tête `3fe6b1b`).

---

## 0. L'essentiel en 8 points

1. **Le bord Cloudflare bloque les robots d'ENTRAÎNEMENT** (GPTBot, ClaudeBot, CCBot, Bytespider, Amazonbot, anthropic-ai, Claude-Web) : 403 « Your request was blocked. » sur les pages, `sitemap.xml` et `llms.txt`. Seul `robots.txt` leur reste ouvert. Cette décision n'est écrite **nulle part** (ni dépôt, ni ai-memory). R-01.
2. **Les robots de RECHERCHE et de RÉCUPÉRATION à la demande passent** en simulation (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, bingbot, Applebot, Googlebot) : 200, HTML complet, aucun défi. Le passage des VRAIS robots n'est pas prouvé (pas d'accès aux journaux). R-03.
3. **`robots.txt` dit le contraire du bord** : il autorise tout le monde. Le refus d'entraînement, s'il est voulu, ne tient qu'au nuage orange de Cloudflare. R-02.
4. **Le site annonce un essai « 14 jours ou 12 conseils »** (meta description de 5 pages sur 9 testées, FAQ JSON-LD) alors que la production de l'app (tag `v0.163.0`) sert **25 conseils**. Ce sont précisément les textes que les assistants citent. R-05.
5. **Les réponses de la FAQ Tarifs n'existent pas dans le HTML visible** (montées par JavaScript au clic) ; elles ne vivent que dans le JSON-LD, qui expose en plus l'identifiant interne « Standard ». R-06, R-07.
6. **Le H1 de Tarifs se lit « Trouvez votre ctave »** pour tout extracteur de texte (le « O » est un SVG). R-08.
7. **`/pricing` mène à un 404** en deux sauts (307 vers `/fr/pricing`, 404). R-12.
8. **`llms.txt`** est exact et conforme aux règles LOCKED, mais aucun grand fournisseur ne documente le lire : maintenance minimale, pas d'investissement. R-10, R-11.

---

## 1. Méthode et niveaux de preuve

Trois niveaux, jamais confondus dans ce rapport :

| Niveau | Ce que ça prouve | Ce que ça ne prouve pas |
| --- | --- | --- |
| **SIMULATION UA** (curl avec l'en-tête User-Agent du robot) | Ce que Cloudflare et Vercel font d'une requête qui SE DIT être ce robot, depuis une IP non vérifiée | Qu'un vrai robot, venant de ses IP publiées et classé « Verified bot » par Cloudflare, reçoit la même réponse |
| **CONFIGURATION INSPECTÉE** (code du dépôt, docs, en-têtes, contenu servi) | Ce que le site déclare et sert | Le réglage réel du tableau de bord Cloudflare |
| **PASSAGE CONFIRMÉ DANS LES JOURNAUX** | Le vrai robot est venu et a reçu un 200 | **Aucun constat de ce rapport n'atteint ce niveau** : pas d'accès au tableau de bord Cloudflare ni aux journaux Vercel |

Indice utile : Cloudflare documente que ses politiques IA s'appliquent « to Verified bots with that behavior **and matching unverified bots** » (source C1 ci-dessous). Un blocage obtenu par simple UA laisse donc fortement présumer que le vrai robot vérifié est bloqué aussi. Ça reste une HYPOTHÈSE forte tant que les journaux ne l'ont pas montré.

Fichiers bruts : `/tmp/claude-1000/-home-ebigras-Projects-iQWine-Web/b169f3ff-26b5-4233-bc29-e163ffdd5eba/scratchpad/a3/` (en-têtes `hdr-*.txt`, pages `pages/*.html`, texte sans JS `pages/*.txt`, JSON-LD `pages/*.ld.json`, sources officielles `src/`).

---

## 2. Sources officielles (consultées le 2026-11-06)

| Réf. | Source | URL | Date de la source |
| --- | --- | --- | --- |
| O1 | OpenAI, « Overview of OpenAI Crawlers » | https://developers.openai.com/api/docs/bots (redirigé depuis platform.openai.com/docs/bots) | page courante, lue le 2026-11-06 |
| O2 | Plages IP OpenAI | https://openai.com/searchbot.json · https://openai.com/chatgpt-user.json · https://openai.com/gptbot.json | `creationTime` 2026-01-02, 2026-10-27, 2026-09-22 |
| A1 | Anthropic, « Does Anthropic crawl data from the web, and how can site owners block the crawler? » | https://support.claude.com/en/articles/8896518 | « Updated yesterday », soit vers le 2026-11-05 |
| A2 | Plages IP Anthropic (une liste commune à ses robots) | https://claude.com/crawling/bots.json | `creationTime` 2026-10-20 |
| P1 | Perplexity, « Perplexity crawlers » | https://docs.perplexity.ai/docs/resources/perplexity-crawlers | page courante |
| P2 | Plages IP Perplexity | https://www.perplexity.ai/perplexitybot.json · https://www.perplexity.ai/perplexity-user.json | non lues en détail |
| B1 | Bing, plages IP de Bingbot | https://www.bing.com/toolbox/bingbot.json | `creationTime` 2024-01-03 |
| B2 | Bing Webmaster Blog, contrôles NOCACHE / NOARCHIVE pour Bing Chat (devenu Copilot) | https://blogs.bing.com/webmaster/2023/9/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat/ | septembre 2023, **ancienne**, non revérifiée pour Copilot 2026 |
| AP1 | Apple, « About Applebot » | https://support.apple.com/en-us/119829 ; IP : https://search.developer.apple.com/applebot.json | page courante |
| CC1 | Common Crawl, CCBot | https://commoncrawl.org/ccbot | page courante |
| G1 | Google, robots courants (dont Google-Extended) | https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers | « Last updated 2026-10-30 » |
| C1 | Cloudflare, « AI Crawler and Agent access policies » | https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/ | « Last updated Nov 2, 2026 » |
| C2 | Cloudflare, « robots.txt setting » (Bot Preference Sync) | https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/ | « Last updated Nov 2, 2026 » |
| I1 | IETF, draft-kelley-aipref-training-preference-signal-00 | https://datatracker.ietf.org/doc/draft-kelley-aipref-training-preference-signal/ | octobre 2026, expire le 3 mai 2027 |

**Non obtenu directement** : le centre d'aide OpenAI sur ChatGPT search (https://help.openai.com/en/articles/9237897-chatgpt-search) répond 403 à curl. Le lien ChatGPT search ↔ Bing ne repose donc ici que sur des sources secondaires (voir §3, ligne Bingbot).

---

## 3. Rôle de chaque robot, selon sa documentation officielle

| Robot | Fonction documentée | robots.txt | Plages IP | Source |
| --- | --- | --- | --- | --- |
| **OAI-SearchBot** | RECHERCHE. « used to surface websites in search results in ChatGPT's search features. Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers, though can still appear as navigational links. » OpenAI recommande de l'autoriser dans robots.txt ET de laisser passer ses IP. Délai d'effet d'un changement : environ 24 h. | Respecté | searchbot.json | O1, O2 |
| **ChatGPT-User** | RÉCUPÉRATION À LA DEMANDE (question d'un utilisateur, GPT personnalisé, Actions). « not used for crawling the web in an automatic fashion », « not used to determine whether content may appear in Search ». | « robots.txt rules may not apply » | chatgpt-user.json | O1, O2 |
| **GPTBot** | ENTRAÎNEMENT. « Disallowing GPTBot indicates a site's content should not be used in training generative AI foundation models. » Réglage **indépendant** d'OAI-SearchBot. Si les deux sont permis, OpenAI peut faire une seule collecte pour les deux usages. | Respecté | gptbot.json | O1, O2 |
| **ClaudeBot** | ENTRAÎNEMENT. « When a site restricts ClaudeBot access, it signals that the site's future materials should be excluded from our AI model training datasets. » | Respecté, `Crawl-delay` pris en charge. Anthropic précise que bloquer par IP « may not work correctly or persistently guarantee an opt-out », robots.txt est LA méthode. Depuis le 2026-10-30, Anthropic honore aussi le signal IETF « no AI training » ; une règle qui nomme ClaudeBot prime. | bots.json (commun) | A1, A2, I1 |
| **Claude-SearchBot** | RECHERCHE. Le désactiver « prevents our system from indexing your content for search optimization, which may reduce your site's visibility ». | Respecté | bots.json | A1 |
| **Claude-User** | RÉCUPÉRATION À LA DEMANDE. Le désactiver « prevents our system from retrieving your content in response to a user query ». | Respecté (A1 : « Anthropic's Bots respect "do not crawl" signals »). Anthropic ne contourne pas les CAPTCHA : un défi Cloudflare = page non lue. | bots.json | A1 |
| **PerplexityBot** | RECHERCHE. « not used to crawl content for AI foundation models. » Perplexity recommande de l'autoriser et de laisser passer ses IP, avec une recette de règle WAF Cloudflare. Délai : jusqu'à 24 h. | Respecté | perplexitybot.json | P1, P2 |
| **Perplexity-User** | RÉCUPÉRATION À LA DEMANDE. Pas d'entraînement. | « generally ignores robots.txt rules » | perplexity-user.json | P1, P2 |
| **Bingbot** | Index Bing. Sert Bing **et** les réponses de Copilot (ex-Bing Chat) : B2 dit que le contenu de l'index Bing alimente les réponses, pilotable par `NOCACHE` (titre, URL, extrait seulement) ou `NOARCHIVE` (exclu des réponses et de l'entraînement). **ChatGPT et Bing** : OpenAI écrit que ChatGPT search « leverages third-party search providers » ; des sources secondaires (nov. 2024) rapportent que le centre d'aide nomme Microsoft Bing parmi eux. La page O1 ne mentionne pas Bing. **Classement : documenté par des tiers, non vérifié à la source.** | Respecté | bingbot.json | B1, B2 ; secondaire : searchengineland.com, seroundtable.com |
| **Applebot** | Recherche Spotlight, Siri, Safari ; ses données « may also be used to help train Apple foundation models ». Peut exécuter le rendu (JS). Si robots.txt ne nomme pas Applebot mais nomme Googlebot, il suit Googlebot. Ne suit pas `Crawl-delay`. | Respecté | applebot.json + DNS inverse `*.applebot.apple.com` | AP1 |
| **Applebot-Extended** | **Jeton robots.txt seulement, aucun robot distinct.** Disallow = refus d'entraînement des modèles Apple, sans effet sur la recherche Apple. Pour les réponses « connaissances générales » de Siri : balise `nosnippet`. | Jeton | n/a | AP1 |
| **CCBot** (Common Crawl) | Archive ouverte du web, réutilisée par de nombreux entraînements de modèles. | Respecté (`User-agent: CCBot` / `Disallow: /`). Common Crawl prévient que des robots se font passer pour CCBot. | DNS inverse `*.crawl.commoncrawl.org` (IPv4) | CC1 |
| **Google-Extended** (rappel, hors mandat strict) | **Jeton seulement.** Contrôle l'entraînement Gemini **ET l'ancrage (« grounding ») dans l'app Gemini** et Vertex AI. Sans effet sur Google Search. Google prévoit de suivre le signal IETF `__usage_ai-training` début 2027. | Jeton | n/a | G1 |

**Conséquence clé** : bloquer Google-Extended pour refuser l'entraînement retirerait aussi iQWine de l'ancrage des réponses de l'app Gemini. Ce n'est PAS un simple refus d'entraînement.

---

## 4. Matrice robot × surface (mesures du 2026-11-06)

Cible : `https://iqwine.ai/fr` (77 039 octets en 200). « Pages » = `/fr` ; sitemap et llms.txt testés pour les trois robots bloqués. Aucun en-tête `cf-mitigated` n'a été reçu : **aucun défi**, seulement des 200 ou des 403 nets.

| Robot | Fonction | Accès souhaitable aux pages publiques | robots.txt actuel | CDN/WAF, SIMULATION UA | Preuve | Action |
| --- | --- | --- | --- | --- | --- | --- |
| OAI-SearchBot | Recherche | **OUI, indispensable** (ChatGPT search) | Autorisé (`*`) | 200 · 77 039 o · `x-vercel-cache: HIT` | `a3/hdr-OAI-SearchBot.txt` | Confirmer le passage réel (R-03) |
| ChatGPT-User | À la demande | **OUI** | Autorisé (et peut l'ignorer) | 200 · 77 039 o | `hdr-ChatGPT-User.txt` | idem |
| GPTBot | Entraînement | **Arbitrage d'Éric** (§8) | Autorisé (`*`) | **403 · 25 o · « Your request was blocked. »**, aucun en-tête Vercel ; idem `sitemap.xml`, `llms.txt` ; `robots.txt` 200 | `hdr-GPTBot.txt` | Aligner robots.txt et bord (R-01, R-02) |
| Claude-SearchBot | Recherche | **OUI, indispensable** | Autorisé | 200 · 77 039 o | `hdr-Claude-SearchBot.txt` | R-03 |
| Claude-User | À la demande | **OUI** | Autorisé | 200 · 77 039 o | `hdr-Claude-User.txt` | R-03 |
| ClaudeBot | Entraînement | Arbitrage d'Éric | Autorisé | **403 · 25 o** (pages, sitemap, llms.txt) ; robots.txt 200 | `hdr-ClaudeBot.txt` | R-01, R-02 |
| anthropic-ai, Claude-Web (anciens UA) | obsolètes | sans objet | Autorisé | 403 | sortie console | aucune |
| PerplexityBot | Recherche | **OUI** | Autorisé | 200 · 77 039 o | `hdr-PerplexityBot.txt` | R-03 |
| Perplexity-User | À la demande | **OUI** | Autorisé (l'ignore) | 200 · 77 039 o | `hdr-Perplexity-User.txt` | R-03 |
| bingbot | Index Bing → Bing, Copilot, en partie ChatGPT | **OUI, levier majeur** | Autorisé | 200 · 77 039 o | `hdr-bingbot.txt` | R-14 |
| Googlebot | Index Google (+ AI Overviews) | OUI | Autorisé | 200 · 77 039 o | `hdr-Googlebot.txt` | hors mandat |
| Applebot | Recherche Apple (+ entraînement) | OUI | Autorisé | 200 · 77 039 o | `hdr-Applebot.txt` | aucune |
| Applebot-Extended | Jeton d'entraînement | Arbitrage d'Éric | Autorisé (non nommé) | sans objet (pas de robot) | AP1 | §8 |
| Google-Extended | Jeton entraînement + ancrage Gemini | **OUI** (sinon perte de l'ancrage Gemini) | Autorisé (non nommé) | sans objet | G1 | ne pas bloquer |
| CCBot | Archive ouverte → entraînement tiers | Arbitrage d'Éric | Autorisé | **403 · 25 o** ; robots.txt 200 | `hdr-CCBot.txt` | R-01, R-02 |
| Bytespider (ByteDance) | Entraînement | Bloquer (aucun bénéfice de visibilité au Québec documenté) | Autorisé | 403 | console | robots.txt cible |
| Amazonbot | Entraînement / produits Amazon | Faible enjeu | Autorisé | 403 | console | R-17 |
| meta-externalagent | Entraînement Meta | Arbitrage d'Éric | Autorisé | **200** (non bloqué, contrairement aux autres robots d'entraînement) | console | R-17 |
| Google-CloudVertexBot, MistralAI-User, DuckAssistBot | Divers (agents, à la demande) | OUI | Autorisé | 200 | console | aucune |
| Navigateur, curl | témoin | | | 200 · 77 039 o, aucun défi | `hdr-browser.txt`, `hdr-curl.txt` | |

Lecture du schéma bloqué/permis : il correspond exactement à la politique Cloudflare « AI Crawler and Agent access policies » avec **Training = Block** et **Search = Agent = Allow** (C1). Un 402 aurait signalé « pay per crawl » : il n'y en a pas. `robots.txt` est servi tel que le génère `src/app/robots.ts`, sans directives gérées ni `Content-Signal` : **Bot Preference Sync est donc probablement éteint** (C2 : le fichier est modifié dès qu'une politique est à Block et la synchro active). Origine exacte du blocage (politique IA ou règle WAF personnalisée) : **NON VÉRIFIÉ**.

---

## 5. Lisibilité sans JavaScript

Méthode : HTML initial récupéré avec l'UA d'OAI-SearchBot, retrait de `<head>`, `<script>`, `<style>`, `<svg>`, `<noscript>`, puis texte brut. JSON-LD extrait à part. Toutes les pages sont prérendues (`x-nextjs-prerender: 1`) : le corps du texte est bien dans le HTML initial.

| Information clé | Accueil FR / EN | sommelier-ia | cellier-intelligent | apogee | accord-mets-vins | tarifs / pricing |
| --- | --- | --- | --- | --- | --- | --- |
| Ce qu'est iQWine / Octave | ✔ texte (H1, « Votre sommelier IA qui apprend vos goûts ») | ✔ | ✔ | ✔ | ✔ | ✔ sauf H1 : « Trouvez votre **ctave** » (R-08) |
| Plateformes iOS / Android / web | ✘ en texte. Seulement dans les `alt` des badges App Store / Google Play et dans le JSON-LD (`operatingSystem: Web, iOS, Android`, `downloadUrl`) | ✘ | ✘ | ✘ | ✘ | ✔ « iPhone, Android et web » ; FAQ « installable en un geste » (JSON-LD seulement) |
| Prix des forfaits | ✘ texte (JSON-LD `offers` seulement) | ✘ | ✘ | ✘ | ✘ | ✔ 0 $, 14,95 $, 29,95 $ CAD/mois, 149 $ et 299 $/an, TPS et TVQ en sus. Le mensuel et l'annuel ressortent collés (« 12,42 14,95 $ CAD / mois ») : lecture ambiguë possible |
| Essai | ✔ « Passionné offert 14 jours · Sans carte » ; meta : « 14 jours ou **12** conseils » (R-05) | meta « 12 conseils » | meta « 12 conseils » | ✔ texte | meta « 12 conseils » | ✔ « 14 jours » ; FAQ JSON-LD « 12 conseils » |
| Langue | ✔ sélecteur FR/EN, `inLanguage` fr-CA / en-CA | ✔ | ✔ | ✔ | ✔ | ✔ |
| Région | ✔ « Conçu au Québec · Hébergé au Canada » (pied de page) ; `areaServed: Québec, Canada` | ✔ pied | ✔ pied | ✔ pied | ✔ pied | ✔ « Conçu au Québec » |
| Qui est derrière | ✘ (seulement sur `/fr/notre-maison` ; `Organization` sans `founder`) | ✘ | ✘ | ✘ | ✘ | ✘ |
| Réponses FAQ | | | | | | ✘ dans le DOM : montées seulement au clic (`AnimatePresence`, `{open && …}` dans `src/components/sections/SectionFaq.tsx`) ; présentes dans le JSON-LD `FAQPage` et la charge RSC (R-06) |

`/fr/notre-maison` : rôles conformes à la règle LOCKED n° 3 (« Mégane Bigras · Fondatrice d'iQWine », « Éric Bigras · Porte-parole d'iQWine · Entrepreneuriat & passion du vin »), en texte, sans JS. Aucune occurrence de « SAQ » dans le texte visible des 9 pages testées. Aucun contenu clé n'est uniquement dans une vidéo sur ces pages (pas de `<video>` détecté dans leur HTML initial).

---

## 6. Stabilité des URL citées

| URL demandée | Réponse | Verdict |
| --- | --- | --- |
| `https://iqwine.ai/` | **307** → `/fr` | temporaire ; `x-default` pointe aussi vers des URL qui font 307 (`/tarifs` → `/fr/tarifs`). Relève surtout de l'agent SEO technique |
| `/fr/`, `/en/` | 308 → sans barre finale | ✔ |
| `/en/tarifs`, `/en/sommelier-ia`, `/en/cellier-intelligent`, `/en/notre-maison` | 308 → slug anglais | ✔ migration des slugs tenue |
| `/tarifs`, `/sommelier-ia` | 307 → `/fr/…` | ✔ (temporaire) |
| **`/pricing`** | 307 → `/fr/pricing` → **404** | ✘ R-12 |
| **`/fr/pricing`** | **404** | ✘ R-12 |
| `/fr/Tarifs` | 200, canonical `/fr/tarifs` | ✔ toléré |
| `/fr/faq`, `/fr/apprendre`, `/fr/octave-verifiable` | 404 | contenus vivant sur `app.iqwine.ai` (noindex) : R-13 |
| `/llms-full.txt`, `/.well-known/ai.txt` | 404 | normal, rien à créer |
| `www.iqwine.ai`, `iqwine.ca`, `www.iqwine.ca`, `http://` | 308 → `https://iqwine.ai/` (inventaire commun) | ✔ |

---

## 7. llms.txt

**Servi** : `https://iqwine.ai/llms.txt`, 200, `text/markdown; charset=utf-8`, 4 519 octets, **identique octet pour octet** au gabarit de `src/app/llms.txt/route.ts` (vérifié par script).

**Exactitude vs site et règles LOCKED**

| Point | État |
| --- | --- |
| « SAQ » générique | ✔ absent du contenu servi (le mot reste dans un commentaire du code, « prix SAQ réels », jamais servi) |
| Restaurant B2B | ✔ absent ; « Choisir un vin au restaurant » = fonction grand public, conforme |
| Rôles Mégane / Éric | ✔ ni l'un ni l'autre n'est nommé ; aucune attribution erronée |
| Essai | ✔ « Un essai gratuit est proposé, sans carte de crédit » : formulation robuste, ni 12 ni 25 |
| Mécanique interne | ✔ aucune (réécrit le 2026-08-14, `docs/refonte-v3-etat-final.md` §15.1) |
| Liens | ✔ 20 URL canoniques, toutes dans le sitemap ; aucun lien vers `app.iqwine.ai` |
| Manques | Plateformes (iOS, Android, web) et liens App Store / Google Play ; noms et prix des forfaits ; fondatrice ; contact et support anglais |
| Accessibilité | 403 pour GPTBot, ClaudeBot, CCBot (bloqués au bord) ; 200 pour les robots de recherche |

**Adoption documentée** : aucune page officielle consultée (O1, A1, P1, AP1, CC1, G1) ne mentionne `llms.txt` ; toutes renvoient à `robots.txt`. Google a déclaré publiquement ne pas le prendre en charge (rapporté par seroundtable.com, « Google Search Team Does Not Endorse LLMs.txt Files »). Des requêtes de robots OpenAI vers des `llms.txt` ont été observées dans des journaux tiers, sans confirmation d'usage par OpenAI. **Conclusion** : `llms.txt` n'est une condition de rien. Coût de maintenance faible, bénéfice non démontré. Le garder exact, ne pas l'enrichir en priorité.

---

## 8. Entraînement : pour et contre (arbitrage d'Éric)

Trois choses distinctes, à ne pas confondre :

1. **Visibilité en recherche web IA** (ChatGPT search, Claude, Perplexity, Copilot) : dépend d'OAI-SearchBot, Claude-SearchBot, PerplexityBot, Bingbot, et des robots à la demande. **Déjà ouverte** (en simulation). Le refus d'entraînement n'y touche pas, selon O1 et A1.
2. **Présence dans les connaissances d'un modèle** (ce que le modèle « sait » sans chercher) : dépend des corpus d'entraînement, alimentés par GPTBot, ClaudeBot, CCBot, Applebot-Extended, Google-Extended… mais **aussi** par tout ce qui parle d'iQWine ailleurs (App Store, presse, réseaux). Bloquer le site n'efface pas la marque des modèles ; ça retire seulement la source la plus juste.
3. **Autorisation d'entraînement** : un signal juridique et éthique, exprimé par robots.txt (et bientôt `__usage_ai-training`, I1).

| Pour autoriser l'entraînement sur les pages publiques | Contre |
| --- | --- |
| Marque jeune : les prochains modèles apprendraient « iQWine = Octave, sommelier IA, Québec » à partir de la source officielle plutôt que de tiers | Aucune attribution ni visite en retour |
| Contenu marketing, déjà débarrassé de la mécanique (§15.1 de l'état final) : peu à protéger | Les textes et la voix de marque peuvent être réutilisés sans contrôle |
| Les assistants répondent souvent sans chercher : la connaissance du modèle compte pour les questions générales (« quelle app me dit quand ouvrir mes vins ? ») | Bénéfice impossible à mesurer et décalé de plusieurs mois (cycles d'entraînement) |
| Coût nul | Le blocage actuel a peut-être été posé volontairement : à confirmer avant de l'inverser |

**Lecture de l'auditeur (à trancher par Éric)** : pour un produit qui veut être recommandé par les assistants, l'ouverture à GPTBot, ClaudeBot et Applebot-Extended sur les pages marketing a une espérance positive et un risque faible. CCBot, Bytespider et Amazonbot ont un lien plus lointain avec la visibilité au Québec. Quel que soit le choix, il doit être **écrit** (robots.txt + ai-memory) et **cohérent** entre robots.txt et Cloudflare.

---

## 9. Constats

Format : classe · URL/fichier · observation · preuve · conséquence · correctif · priorité · effort · confiance · critère de vérification.

### R-01 · Blocage non documenté des robots d'entraînement au bord Cloudflare
- **Classe** : CONFIRMÉ (simulation UA) ; origine du réglage NON VÉRIFIÉE.
- **URL** : toutes les pages, `/sitemap.xml`, `/llms.txt` de iqwine.ai.
- **Observation** : GPTBot, ClaudeBot, CCBot, Bytespider, Amazonbot, anthropic-ai, Claude-Web → 403, corps « Your request was blocked. » (25 o), `server: cloudflare`, aucun en-tête Vercel. `robots.txt` reste à 200. Rien dans `docs/`, `docs/decision-cloudflare.md` ni `~/ai-memory/cross-project/INFRASTRUCTURE.md` (qui ne mentionne le Bot Fight Mode que pour la zone `gmte.ch`).
- **Preuve** : `a3/hdr-GPTBot.txt`, `a3/hdr-ClaudeBot.txt`, `a3/hdr-CCBot.txt` ; cf-ray `a564dbfca9aeabd0-YYZ`.
- **Conséquence** : refus d'entraînement de fait, décidé nulle part. Une future session peut l'« améliorer » ou le défaire sans savoir.
- **Correctif** : Éric confirme dans Cloudflare > zone iqwine.ai > **Security > Settings**, filtre **Bot traffic** > **AI Crawler and Agent access policies** (valeurs Search / Agent / Training), et dans **Security > Security rules** (règles personnalisées sur `http.user_agent`). Puis tranche le §8 et l'inscrit.
- **Priorité** P1 · **Effort** S · **Confiance** haute sur le blocage, moyenne sur sa source.
- **Vérification** : capture du réglage ; `curl -s -o /dev/null -w '%{http_code}' -A 'Mozilla/5.0 (compatible; GPTBot/1.4; +https://openai.com/gptbot)' https://iqwine.ai/fr` rend la valeur attendue après décision.

### R-02 · robots.txt contredit le bord
- **Classe** : CONFIRMÉ (configuration inspectée).
- **Fichier** : `src/app/robots.ts` ; servi : `User-Agent: * / Allow: / / Disallow: /api/` + `Host` + `Sitemap`.
- **Observation** : robots.txt autorise GPTBot, ClaudeBot, CCBot ; le bord les bloque. Anthropic (A1) et OpenAI (O1) désignent robots.txt comme LE mécanisme de refus.
- **Conséquence** : signal incohérent. Le refus repose sur le nuage orange, que `docs/decision-cloudflare.md` présente comme « réversible en décochant » : le jour où on le décoche, le refus disparaît sans bruit. À l'inverse, si Éric choisit d'ouvrir, il faut aussi changer Cloudflare.
- **Correctif** : appliquer l'une des deux variantes du §10 dans `robots.ts`, et régler Cloudflare dans le même sens.
- **P2** · **S** · confiance haute.
- **Vérification** : `curl -s https://iqwine.ai/robots.txt` montre les groupes nommés ; la simulation UA du §4 donne le même verdict que robots.txt.

### R-03 · Passage réel des robots de recherche non prouvé
- **Classe** : NON VÉRIFIÉ (accès) ; SIMULATION UA favorable.
- **Observation** : OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, bingbot, Applebot → 200, 77 039 o, aucun défi.
- **Conséquence** : c'est LE levier de visibilité ChatGPT / Claude / Perplexity. Un défi sur IP de centre de données (Bot Fight Mode, règle WAF) les rendrait aveugles : Anthropic ne contourne pas les CAPTCHA (A1).
- **Correctif / quoi regarder** :
  1. Cloudflare > **AI Crawl Control** > **Crawlers** (ou Metrics) : sur 30 jours, requêtes **Allowed** vs **Blocked** pour OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User. Onglet **Robots.txt** : conformité.
  2. Cloudflare > **Security > Analytics / Events** : filtre User agent contient `SearchBot`, `-User`, `PerplexityBot`, `bingbot` ; colonne Action (block, managed_challenge, js_challenge) ; champ « Verified bot category ».
  3. Vercel > projet > **Logs** (Observability) : filtre sur l'UA, statut 200 (rétention courte selon le plan, à faire le jour même).
- **P1** · **S** · confiance moyenne (simulation seulement).
- **Vérification** : au moins une requête 200 d'OAI-SearchBot et de Claude-SearchBot venant de leurs IP publiées (O2, A2) dans les 30 derniers jours, zéro « challenge ».

### R-04 · État du Bot Fight Mode sur la zone iqwine.ai inconnu
- **Classe** : HYPOTHÈSE.
- **Observation** : actif sur `gmte.ch` (ai-memory INFRASTRUCTURE). Pour iqwine.ai, aucune trace. Mes requêtes curl (UA `curl/8.5.0`) n'ont reçu aucun défi, ce qui suggère qu'il n'est pas actif ou que l'IP de vmdev n'est pas jugée suspecte.
- **Conséquence** : le Bot Fight Mode épargne les robots vérifiés, mais pas forcément les récupérateurs à la demande non vérifiés.
- **Correctif** : vérifier Security > Settings > Bot traffic > **Bot Fight Mode**. S'il est actif, contrôler dans les Events qu'aucun robot IA de recherche n'est défié.
- **P2** · **S** · confiance basse.
- **Vérification** : réglage lu, Events sans défi pour les UA du §4.

### R-05 · Le site annonce 12 conseils d'essai, l'app en sert 25
- **Classe** : CONFIRMÉ.
- **Fichiers** : `src/lib/trial.ts` (`TRIAL_RECOS = 12`) ; `src/lib/faq.ts` ; meta description de `/fr`, `/en`, `/fr/sommelier-ia`, `/fr/cellier-intelligent`, `/fr/accord-mets-vins` (« Essai : 14 jours ou 12 conseils, sans carte », EN « 14 days or 12 pieces of advice ») ; FAQ JSON-LD de `/fr/tarifs` et `/en/pricing`.
- **Preuve** : `git -C ~/Projects/cellier-vin show v0.163.0:lib/billing/plan-catalog.ts` → `TRIAL_AI_RECOMMENDATIONS = 25` ; ai-memory `CURRENT_STATE.md` (v0.163.0 en production le 2026-11-06, « essai 25 conseils ou 14 jours »). Note : `DECISIONS.md` liste encore la « fin d'essai sur 12 conseils » parmi les ARBITRAGES OUVERTS, et `trial.ts` documente une prolongation par remplissage de cave (14 jours n'est pas un plafond).
- **Conséquence** : la meta description est le texte le plus souvent repris tel quel par les moteurs et assistants. Ils citeront « 12 conseils », faux. La page Tarifs se contredit aussi (visible « 14 jours », FAQ « 14 jours ou 12 conseils »).
- **Correctif** : Éric confirme le chiffre de référence (divergence entre `DECISIONS.md` et `CURRENT_STATE.md` à nommer) ; puis une seule constante (`TRIAL_RECOS`) à mettre à jour, rebâtir, vérifier. Option plus robuste : retirer le nombre des meta descriptions (« Essai Passionné de 14 jours, sans carte »).
- **P1** · **S** · confiance haute.
- **Vérification** : `curl -s https://iqwine.ai/fr | grep -o 'content="[^"]*conseils[^"]*"'` ne montre plus « 12 ».

### R-06 · Réponses de la FAQ Tarifs absentes du HTML visible
- **Classe** : CONFIRMÉ.
- **Fichier** : `src/components/sections/SectionFaq.tsx` (réponse montée seulement si `open`, via `AnimatePresence`).
- **Observation** : texte sans JS de `/fr/tarifs` : les 15 questions, aucune réponse. « Environ 30 secondes » n'apparaît que dans le JSON-LD et la charge RSC.
- **Conséquence** : un récupérateur qui convertit le HTML en texte (cas probable de ChatGPT-User et Claude-User, HYPOTHÈSE sur leur chaîne) ne voit ni « sans carte, à aucun moment », ni les appareils, ni la résiliation. Google exige aussi que le contenu `FAQPage` soit visible.
- **Correctif** : toujours rendre la réponse dans le DOM (`<details>/<summary>` natif, ou contenu masqué par CSS et animé), sans changer l'apparence.
- **P2** · **S à M** · confiance haute.
- **Vérification** : `curl -s https://iqwine.ai/fr/tarifs | sed 's/<script[^>]*>.*<\/script>//g' | grep -c 'Environ 30 secondes'` ≥ 1 hors JSON-LD.

### R-07 · Identifiant interne « Standard » exposé dans la FAQ
- **Classe** : CONFIRMÉ (conflit avec la règle LOCKED n° 6).
- **Fichier** : `src/lib/faq.ts` l. 68-69 ; servi dans le JSON-LD `FAQPage` FR et EN : « …le jour où vous choisissez **Standard** ou Premium » / « …choose **Standard** or Premium ».
- **Conséquence** : les machines (seules à lire ces réponses, voir R-06) apprennent un forfait « Standard » qui n'existe pas publiquement.
- **Correctif** : « Passionné ou Premium » / « Enthusiast or Premium ».
- **P2** · **S** · confiance haute.
- **Vérification** : `curl -s https://iqwine.ai/en/pricing | grep -c 'Standard or Premium'` = 0.

### R-08 · H1 de Tarifs illisible sans rendu : « Trouvez votre ctave »
- **Classe** : CONFIRMÉ.
- **URL** : `/fr/tarifs`, `/en/pricing`. Le « O » est un `<svg aria-hidden>` dans un `<span role="img" aria-label="Octave">`, suivi du texte « ctave ».
- **Conséquence** : le titre principal de la page de prix, extrait en texte, dit « ctave ». Un lecteur d'écran peut aussi annoncer « Octave ctave ».
- **Correctif** : texte réservé aux lecteurs (`sr-only`) « Octave » et `aria-hidden` sur l'ensemble visuel SVG + « ctave ».
- **P2** · **S** · confiance haute.
- **Vérification** : texte extrait du H1 = « Trouvez votre Octave. ».

### R-09 · Plateformes, prix et équipe invisibles en texte hors de Tarifs et Notre histoire
- **Classe** : OPPORTUNITÉ.
- **Observation** : accueil FR/EN : iOS/Android seulement dans les `alt` des badges et le JSON-LD ; aucun prix en texte ; aucune mention de qui est derrière ; `Organization` sans `founder`.
- **Conséquence** : à la question « iQWine existe-t-il sur Android ? » ou « qui a créé iQWine ? », un assistant qui n'a lu que l'accueil n'a pas de phrase à citer.
- **Correctif** (compatible avec « le SEO ne tue jamais l'émotion ») : une ligne factuelle discrète près des badges (« Sur iPhone, Android et le web ») ; `founder: { "@type": "Person", "name": "Mégane Bigras" }` dans `Organization` (Éric jamais en fondateur, règle LOCKED n° 3).
- **P3** · **S** · confiance moyenne sur le gain.
- **Vérification** : texte sans JS de `/fr` contient « Android » ; JSON-LD contient `founder`.

### R-10 · llms.txt exact mais incomplet
- **Classe** : CONFIRMÉ (exactitude) / OPPORTUNITÉ (complément).
- **Fichier** : `src/app/llms.txt/route.ts`.
- **Correctif** (si on y touche) : ajouter plateformes et liens magasins, les trois forfaits et leurs prix mensuels avec la mention « Passionné offert 14 jours, sans carte » sans chiffre de conseils, « Fondé par Mégane Bigras », support et contact anglais. Retirer « prix SAQ réels » du commentaire pour que les contrôles par `grep` restent propres.
- **P3** · **S** · confiance haute.
- **Vérification** : `curl -s https://iqwine.ai/llms.txt | grep -c -E 'Android|Mégane|14,95'` ≥ 3 et `grep -c SAQ` = 0.

### R-11 · llms.txt : aucune adoption documentée par les grands fournisseurs
- **Classe** : CONFIRMÉ (sources officielles muettes, Google opposé).
- **Conséquence** : le garder (coût nul) ; ne jamais le présenter comme une condition de visibilité ; ne pas créer `llms-full.txt`.
- **P3** · **S** · confiance haute.

### R-12 · `/pricing` et `/fr/pricing` en 404
- **Classe** : CONFIRMÉ.
- **Observation** : `/pricing` → 307 `/fr/pricing` → 404. Le middleware ajoute la langue sans traduire le slug.
- **Conséquence** : les assistants devinent volontiers `iqwine.ai/pricing` ; l'utilisateur tombe sur un 404.
- **Correctif** : dans `src/middleware.ts`, un slug anglais sans préfixe → 308 `/en/<slug>` ; un slug anglais sous `/fr` → 308 `/fr/<slug-fr>` ; ajouter ces cas à `scripts/verifier-routage.mjs`.
- **P2** · **S** · confiance haute.
- **Vérification** : `curl -s -o /dev/null -w '%{http_code} %{redirect_url}' https://iqwine.ai/pricing` → 308 vers une page 200.

### R-13 · Contenus de confiance hébergés sur un domaine non indexable
- **Classe** : OPPORTUNITÉ.
- **Observation** : pied de page : « Octave vérifiable » → `app.iqwine.ai/octave-verifiable`, « Apprendre le vin » → `app.iqwine.ai/apprendre`, tous deux en `X-Robots-Tag: noindex, nofollow` (commentaire de `route.ts`).
- **Conséquence** : la page qui répond à « peut-on faire confiance à Octave ? » est hors de portée des moteurs IA.
- **Correctif** : à arbitrer par Éric. Une version publique sur `iqwine.ai` (garanties, jamais la mécanique), sans exposer l'app (règle LOCKED n° 4).
- **P3** · **M** · confiance moyenne.

### R-14 · Bing, levier commun à Copilot et en partie à ChatGPT, non vérifiable d'ici
- **Classe** : NON VÉRIFIÉ (accès).
- **Observation** : clé IndexNow configurée (`/api/indexnow-key` → 200, clé non affichée), `scripts/soumettre-indexnow.mjs` présent. Aucune balise `msvalidate.01`, `/BingSiteAuth.xml` 404 : l'inscription à Bing Webmaster Tools, si elle existe, passe par DNS ou par import depuis Search Console.
- **Correctif** : Éric vérifie dans Bing Webmaster Tools : site vérifié, sitemap soumis et lu, 30 URL indexées, aucune erreur d'exploration. Ne pas poser `NOCACHE` / `NOARCHIVE`.
- **P1** · **S** · confiance moyenne.
- **Vérification** : tableau « Pages indexées » de Bing ≥ 25 URL du sitemap.

### R-15 · Ne pas bloquer Google-Extended en croyant ne refuser que l'entraînement
- **Classe** : CONFIRMÉ (G1).
- **Conséquence** : bloquer ce jeton retire iQWine de l'ancrage de l'app Gemini.
- **Correctif** : dans la variante « refus d'entraînement » du §10, ne pas nommer Google-Extended, ou le faire en connaissance de cause.
- **P2** (garde-fou) · **S** · confiance haute.

### R-16 · Signal IETF `__usage_ai-training`
- **Classe** : OPPORTUNITÉ, seulement si Éric refuse l'entraînement.
- **Observation** : honoré par Anthropic depuis le 2026-10-30 (A1), prévu par Google début 2027 (G1) ; brouillon -00 (I1), susceptible de changer.
- **Correctif** : groupe `User-Agent: __usage_ai-training` / `Disallow: /` dans la variante B. Sans effet sur la recherche.
- **P3** · **S** · confiance moyenne (norme en brouillon).

### R-17 · Blocage d'entraînement incomplet et partiellement hors sujet
- **Classe** : CONFIRMÉ (simulation UA).
- **Observation** : `meta-externalagent` (entraînement Meta) passe en 200, alors que GPTBot et ClaudeBot sont bloqués ; Amazonbot est bloqué.
- **Conséquence** : la politique actuelle ne traduit aucune intention lisible.
- **Correctif** : réglé par la décision du §8 et la variante choisie au §10.
- **P3** · **S** · confiance moyenne.

---

## 10. robots.txt cible (proposition, NON appliquée)

Règle de syntaxe à ne pas rater : un robot qui trouve un groupe à son nom **ignore** le groupe `*`. Chaque groupe nommé doit donc répéter `Disallow: /api/`. La directive `Host` n'est lue que par Yandex : inoffensive, on peut la garder.

### Variante A, entraînement autorisé (lecture de l'auditeur)

```
# Recherche et récupération à la demande : bienvenus
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Bingbot
User-agent: Applebot
User-agent: Googlebot
Allow: /
Disallow: /api/

# Entraînement : autorisé sur les pages publiques (décision d'Éric du AAAA-MM-JJ)
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Applebot-Extended
User-agent: Google-Extended
Allow: /
Disallow: /api/

# Sans lien avec la visibilité au Québec
User-agent: Bytespider
Disallow: /

User-agent: *
Allow: /
Disallow: /api/

Host: https://iqwine.ai
Sitemap: https://iqwine.ai/sitemap.xml
```
Cloudflare : Training passe à **Allow** (sinon robots.txt promet ce que le bord refuse).

### Variante B, entraînement refusé

```
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Bingbot
User-agent: Applebot
User-agent: Googlebot
User-agent: Google-Extended   # garde l'ancrage Gemini, voir R-15
Allow: /
Disallow: /api/

User-agent: GPTBot
User-agent: ClaudeBot
User-agent: CCBot
User-agent: Applebot-Extended
User-agent: Bytespider
User-agent: Amazonbot
User-agent: meta-externalagent
User-agent: __usage_ai-training
Disallow: /

User-agent: *
Allow: /
Disallow: /api/

Host: https://iqwine.ai
Sitemap: https://iqwine.ai/sitemap.xml
```
Cloudflare : Training reste à **Block** ; Search et Agent restent à **Allow**. Le refus devient durable même si le proxy est retiré.

Mise en œuvre dans les deux cas : `src/app/robots.ts` accepte un tableau `rules` avec `userAgent: string[]` ; ajouter un contrôle dans `scripts/verifier-routage.mjs` (OAI-SearchBot et Claude-SearchBot jamais en `Disallow: /`).

---

## 11. Ce qu'Éric doit regarder (liste courte)

| Où | Quoi | Répond à |
| --- | --- | --- |
| Cloudflare > iqwine.ai > Security > Settings > Bot traffic > **AI Crawler and Agent access policies** | Valeurs Search / Agent / Training ; état de **Bot Preference Sync** | R-01, R-02 |
| Cloudflare > Security > Settings > **Bot Fight Mode** | Actif ou non | R-04 |
| Cloudflare > Security > **Security rules** (règles personnalisées) | Règle sur `http.user_agent` ou sur des ASN de centres de données | R-01 |
| Cloudflare > **AI Crawl Control** > Crawlers + Robots.txt | Allowed / Blocked par robot sur 30 jours | R-03 |
| Cloudflare > Security > **Events** | Actions sur UA `SearchBot`, `-User`, `PerplexityBot`, `bingbot` | R-03 |
| Vercel > projet > **Logs** ; Firewall (règles et ensembles gérés de robots) | 200 reçus par les robots de recherche ; aucune règle Vercel qui les refuse | R-03 |
| **Bing Webmaster Tools** | Vérification, sitemap, pages indexées | R-14 |

---

## 12. Limites

- **Aucun accès** au tableau de bord Cloudflare, aux journaux Cloudflare ou Vercel, ni à Bing Webmaster Tools / Search Console : tout ce qui touche au passage RÉEL des robots est NON VÉRIFIÉ.
- Simulations depuis **une seule IP** (vmdev, point de présence YYZ), à un seul moment. Cloudflare classe les vrais robots par IP et signature : un 200 simulé ne garantit pas un 200 réel, un 403 simulé le laisse fortement présumer (C1) sans le prouver.
- Je n'ai interrogé **aucun assistant** (ChatGPT, Claude, Perplexity, Copilot) : la présence réelle d'iQWine dans leurs réponses n'est pas mesurée ici.
- Le lien ChatGPT search ↔ Bing repose sur des sources **secondaires** : le centre d'aide OpenAI a répondu 403.
- Le billet Bing (B2) date de 2023 et parle de Bing Chat ; son application à Copilot en 2026 n'est pas revérifiée.
- La façon dont ChatGPT-User et Claude-User transforment le HTML (scripts gardés ou non, JSON-LD lu ou non) n'est pas documentée : R-06 en tire une HYPOTHÈSE prudente.
- La divergence 12 / 25 conseils (R-05) oppose `DECISIONS.md` (arbitrage ouvert) et `CURRENT_STATE.md` + code de l'app (25) : à nommer à Éric, pas à trancher ici.
- Les pages hors échantillon (choisir-un-vin, carte-des-vins, fonctions, le-film, contact, support, légal) n'ont pas été passées au crible sans JS.
