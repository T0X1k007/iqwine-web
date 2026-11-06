# Agent 1 · SEO technique et indexation · iqwine.ai

Audit du 2026-11-06 (mesures entre 14 h 40 et 15 h 30 UTC). Lecture seule : aucun commit, aucun déploiement, aucun GitHub Actions.

## Méthode et périmètre

- **Code = production.** `origin/main`, `origin/production` et le worktree `~/Projects/iQWine_Web-v2` pointent tous sur `3fe6b1b` (2026-09-27). Aucun écart main/production : tout ce qui est cité dans le code est ce qui est servi.
- **Crawl :** 32 pages (les 30 URL du sitemap plus `/fr/beta` et `/en/beta`) téléchargées avec l'agent utilisateur de Googlebot (`curl -A 'Googlebot/2.1'`, aucun blocage Cloudflare constaté). Analyse avec des scripts stdlib : `scratchpad/scripts/analyse.py` (métadonnées, JSON-LD, liens), `texte.py` (texte visible sans JS), `opacite.py` (texte masqué). Résultat brut : `scratchpad/analyse.json`, HTML dans `scratchpad/crawl/`.
- **Redirections :** environ 70 variantes d'URL testées avec `curl -w '%{http_code} %{redirect_url}'`.
- **Performance :** l'API PageSpeed Insights sans clé a répondu **429** (« Quota exceeded … Queries per day »), et Lighthouse par `npx` a été refusé par le garde-fou de la session. Mesure de remplacement : Chromium local (Playwright de `cellier-vin`, déjà installé) en mobile émulé, CPU ×4, réseau « Slow 4G » (150 ms, 1,6 Mb/s), 2 passes par page, script `scratchpad/scripts/mesure-lab.cjs`. **Ce n'est pas Lighthouse.** Données terrain (CrUX) : non consultées, il faut une clé.
- **Docs Google** consultées le 2026-11-06 :
  - journal des mises à jour (developers.google.com/search/updates) : le 2026-05-08, « Deprecating the FAQ rich result feature », retrait effectif le 2026-05-07 ; le 2026-06-15, la doc FAQPage est retirée, et `…/structured-data/faqpage` redirige désormais vers ce journal ;
  - Software App (`…/structured-data/software-app`) : `name` et `offers.price` requis, plus `aggregateRating` **ou** `review` ;
  - Localized versions (`…/international/localized-versions`) : `x-default` conçu pour les « language selector pages » et les « auto-redirecting home pages », retours obligatoires (« If two pages don't both point to each other, the tags will be ignored ») ;
  - Build sitemap : « Google ignores `<priority>` and `<changefreq>` » ; `lastmod` n'est utilisé que s'il est « consistently and verifiably accurate » ;
  - Video SEO : la vidéo doit être le contenu principal d'une « watch page », et la vignette comme les octets vidéo doivent être récupérables.

## Ce qui est sain (vérifié, ne pas toucher)

- 30/30 canonicals auto-référents. Hreflang `fr-CA`, `en-CA` et `x-default` réciproques sur 30/30 pages, et identiques entre le HTML et le sitemap. Seul écart, cosmétique : `x-default` de l'accueil vaut `https://iqwine.ai` dans le HTML et `https://iqwine.ai/` dans le sitemap.
- 1 seul H1 sur chacune des 32 pages. `<html lang>` correct partout (sauf sur la 404, voir T-05).
- **Aucun texte masqué au rendu initial.** `FadeInOnScroll` est « fail-visible » depuis le 2026-08-12. Sur l'accueil, les 30 `opacity` inline sont des bouteilles décoratives floues (`alt=""`, à bon droit). H1, textes, prix et CTA sont tous dans le HTML sans JS.
- Anciennes adresses : `/en/<dossier FR>`, `/fr|en/recevoir`, `/fr|en/recherche`, `/en/search` et `/en/entertaining` font toutes **un seul saut en 308** vers la bonne cible. `iqwine.ca/fr/tarifs` → `iqwine.ai/fr/tarifs` en 1 saut ; `iqwine.ca/tarifs` en 2 sauts (308 puis 307 négocié), un choix documenté dans `next.config.ts`.
- Barre oblique finale : `/fr/` et `/fr/tarifs/` font un 308 vers la version sans barre. Paramètres : `?utm_*` → 200 avec canonical propre.
- `/beta` : `noindex, follow`, hors sitemap, sans canonical. C'est voulu (`sitemap.ts`, commentaire « `/beta` reste hors sitemap »).
- Aucune page orpheline : depuis `/fr`, les 15 pages FR sont à 1 clic et les 15 EN à 2 clics (et l'inverse depuis `/en`).
- La racine `/` répond en 307 selon le cookie `iqwine-locale`, sinon `Accept-Language`, sinon `fr`. C'est conforme au cas d'usage `x-default` « auto-redirecting home pages » de Google. Testé : AL `en` → `/en`, AL `fr` ou vide → `/fr`, cookie `en` plus AL `fr` sur `/tarifs` → `/en/pricing`.
- Prix du JSON-LD (`offers` à 0,00, 14,95 et 29,95 $ CA par mois) cohérents avec les prix visibles (14,95 et 29,95 $ CA par mois, 149 et 299 $ par an) et avec l'app (`plan-catalog.ts` au tag `v0.163.0` : 1495 et 2995 ¢, 50 et 200 conseils).
- Fiche Google Play publique (200, « iQWine – Sommelier personnel ») : le `downloadUrl` Android pointe sur une fiche réelle.

---

## Constats

### T-01 · CONFIRMÉ · P1 · Effort S · Confiance haute : l'essai annoncé (« 12 conseils ») contredit l'app servie (25)
- **Où :** `src/lib/trial.ts:51` (`TRIAL_RECOS = 12`), propagé par `TRIAL_SHORT`, `TRIAL_FULL` et `TRIAL_MECHANICS` (`trial.ts:145-148`, `112-115`, `372-378`).
- **Observation :**
  - Le commentaire de `trial.ts` dit « Doit égaler `TRIAL_AI_RECOMMENDATIONS` de l'app ». Or l'app au tag `v0.163.0` (`git show v0.163.0:lib/billing/plan-catalog.ts`, ligne 77) vaut `TRIAL_AI_RECOMMENDATIONS = 25`.
  - « 12 » est servi dans :
    - **14 meta descriptions**, plus og/twitter (FR et EN : accueil, fonctions, cellier-intelligent, sommelier-ia, choisir-un-vin, accord-mets-vins, carte-des-vins) ;
    - le `RegisterAction` du JSON-LD global présent sur **les 32 pages** (`structured-data.ts:128-132`) ;
    - la réponse FAQ « Quand mes 14 premiers jours se terminent-ils ? » (`faq.ts:211-233`, qui affiche aussi « 22 jours au total »).
  - Le texte visible de la page ne contient **nulle part** « 12 » : il dit « Passionné offert 14 jours ». Le chiffre faux vit donc là où Google le montre (extrait de résultat) et là où les IA le lisent (JSON-LD, RSC).
  - Deuxième divergence, de forme : la meta dit « Essai : … », alors que le modèle du 2026-09-14 (`trial.ts:150-179`) a remplacé « essai » par « Passionné offert 14 jours ».
- **Preuve :** `grep -c '12 conseils'` sur le HTML : 8 occurrences par page fonctionnelle, 0 dans le texte visible (`texte.py`). Le tag `v0.163.0` de l'app donne 25.
- **Sous-point NON VÉRIFIÉ :**
  - `TRIAL_MECHANICS` dit « Les fonctionnalités du Passionné s'arrêtent au premier des deux seuils ». `ai-memory CURRENT_STATE` (2026-11-06) note « au 25e, seuls les conseils s'arrêtent ». Si c'est le comportement servi, la mécanique décrite par la FAQ est fausse au-delà du chiffre.
  - Les paliers (+2 jours à 10, 25, 50 et 100 bouteilles, max 22 jours) concordent avec `TRIAL_EXTENSION_STEPS` de l'app.
  - **À trancher par Éric.**
- **Conséquence :** promesse publique inexacte (sous-vend l'offre) dans les extraits Google et Bing, et dans les données que lisent les moteurs de réponse IA. Incohérence site/app visible dès la première séance d'essai.
- **Correctif :**
  - `trial.ts:51` → `25` ; relire `TRIAL_MECHANICS` selon l'arbitrage ;
  - réécrire les descriptions dans `layout.tsx:92-100`, `sommelier-ia/page.tsx:15,19`, `carte-des-vins/page.tsx:16,20`, `cellier-intelligent/page.tsx:15,19`, `accord-mets-vins/page.tsx:15,19`, `fonctions/page.tsx:15,19`, `choisir-un-vin/page.tsx:18,22`, avec la formule visible « Passionné offert 14 jours » plutôt que « Essai : … » (voir T-07 pour la longueur) ;
  - libellé de `RegisterAction` dans `structured-data.ts:128-132`.
- **Vérification :** après déploiement, `curl -s https://iqwine.ai/fr | grep -c '12 conseils'` = 0 sur les 32 pages ; `grep -c '25 conseils'` ≥ 1 dans le JSON-LD ; `pnpm verifier:routage` vert.

### T-02 · CONFIRMÉ · P1 · Effort S · Confiance haute : réponses FAQ absentes du HTML et du DOM, `FAQPage` sans résultat enrichi Google
- **Où :** `src/components/sections/SectionFaq.tsx:42-59` (`<AnimatePresence>{open && (<motion.div>…`) ; `src/app/[locale]/tarifs/page.tsx:61` (émission de `faqPageLd`).
- **Observation :**
  - Sur `/fr/tarifs` et `/en/pricing`, les 14 **questions** sont dans le HTML, mais **aucune réponse** n'y est. Le texte visible ne contient ni « When exactly » (réponse), ni « 22 days », ni « Standard ».
  - Les réponses n'existent dans le DOM qu'après un clic, que Googlebot ne fait pas. Elles ne sont présentes que dans le JSON-LD `FAQPage`.
  - Les résultats enrichis FAQ ne sont plus affichés par Google depuis le 2026-05-07 (annonce du 2026-05-08, doc retirée le 2026-06-15).
- **Preuve :** `texte.py` sur `crawl/fr_tarifs.html` et `crawl/en_pricing.html` ; lecture de `SectionFaq.tsx`.
- **Conséquence :**
  - Environ 600 mots de contenu de réassurance à forte valeur de longue traîne (carte de crédit, annulation, ce qu'est un conseil, appareils) ne sont pas indexés comme contenu de page.
  - Le balisage décrit un contenu invisible, ce qui contredit la règle générale de Google sur les données structurées : refléter le contenu visible.
  - Le gain « rich result » attendu n'existe plus.
- **Correctif :**
  - Rendre les réponses dans le DOM, fermées visuellement : `<details>/<summary>` natif, ou contenu toujours monté avec hauteur animée et `hidden="until-found"`.
  - Garder `FAQPage` seulement comme description sémantique (Bing et moteurs IA), sans en attendre de résultat enrichi Google.
  - Fichiers : `SectionFaq.tsx`, éventuellement `faq.ts`.
- **Vérification :** `curl -s https://iqwine.ai/fr/tarifs | grep -c "à aucun moment"` ≥ 1 hors `<script>` ; chaque `acceptedAnswer.text` du JSON-LD retrouvé dans le texte visible (adapter `texte.py`) ; CLS de `/fr/tarifs` ≤ 0,1.

### T-03 · CONFIRMÉ · P2 · Effort S (code) ou M (traduction juridique) · Confiance haute : `/en/privacy` sert un corps entièrement en français
- **Où :** `src/app/[locale]/confidentialite/page.tsx:31-35` et suivantes (`title="Politique de confidentialité"`, sections codées en dur en FR, sans `t()`).
- **Observation :** `<html lang="en-CA">`, `<title>Privacy Policy · iQWine</title>`, hreflang `en-CA`, mais H1 « Politique de confidentialité » et 688 mots identiques à la version FR. `/en/terms`, lui, est bien en anglais (H1 « Terms of Service »).
- **Preuve :** `analyse.py` (H1 EN = FR), extrait de `texte.py`.
- **Conséquence :** contenu dupliqué FR/EN sous deux URL déclarées dans deux langues différentes. Google détecte la langue réelle et peut ignorer la paire hreflang, puis choisir lui-même la canonique. L'impact SEO est faible (page juridique), l'impact de confiance réel pour un anglophone.
- **Correctif :** traduire la politique (arbitrage d'Éric : texte juridique, Loi 25 ; la Politique est synchronisée avec `cellier-vin`). Repli temporaire possible : un bandeau EN « The English version is in preparation » plus un H1 EN. Ne pas pointer le canonical EN vers FR sans décision.
- **Vérification :** H1 de `/en/privacy` en anglais ; la langue du texte visible correspond à `lang`.

### T-04 · CONFIRMÉ · P2 · Effort S · Confiance haute : l'hôte `iqwine-web.vercel.app` sert tout le site, indexable
- **Où :** configuration des domaines Vercel. Côté code : `src/middleware.ts` (aucun contrôle d'hôte), `next.config.ts` `headers()`.
- **Observation :** `curl -sI https://iqwine-web.vercel.app/fr` → **200**, sans `X-Robots-Tag`. Meta robots `index, follow`. `robots.txt` identique (Allow /). Canonical `https://iqwine.ai/fr`.
- **Conséquence :**
  - Hôte en double qui contourne Cloudflare (WAF, cache, analytique).
  - Le canonical limite le risque de duplication, sans l'éliminer : Google peut explorer et dépenser du budget de crawl, et des liens externes peuvent s'y fixer.
- **Correctif :** dans Vercel, rediriger `iqwine-web.vercel.app` en 308 vers `https://iqwine.ai` (geste d'Éric dans la console). À défaut, côté middleware, ajouter `X-Robots-Tag: noindex` quand `host` ≠ `iqwine.ai`, en préservant les préversions Vercel, qui reçoivent déjà `noindex` de la plateforme.
- **Vérification :** `curl -sI https://iqwine-web.vercel.app/fr` → 308 vers `iqwine.ai/fr`, ou `x-robots-tag: noindex`.

### T-05 · CONFIRMÉ · P2 · Effort M · Confiance haute : la 404 n'est pas personnalisée
- **Où :** `src/app/` ne contient aucun `not-found.tsx` ni `[locale]/not-found.tsx`.
- **Observation :**
  - `/fr/inexistant` → statut **404** correct, `<meta name="robots" content="noindex">`.
  - Mais c'est la page par défaut de Next : « 404: This page could not be found. », **en anglais** sur `/fr/…`, `<html>` sans `lang`, **aucun lien**.
  - Les chemins nus inconnus (`/zz`, `/blog`, `/faq`) font d'abord un 307 vers `/fr/zz`, puis la 404.
- **Conséquence :** cul-de-sac pour l'utilisateur et le robot (aucun lien de reprise), incohérence de marque et de langue.
- **Correctif :** `src/app/[locale]/not-found.tsx` bilingue (liens vers l'accueil, Fonctions, Tarifs et Support, CTA) et un attrape-tout `src/app/[locale]/[...reste]/page.tsx` qui appelle `notFound()`, pour que la 404 hérite du layout localisé. Garder le statut 404 (jamais de 200).
- **Vérification :** `/fr/inexistant` et `/en/inexistant` → 404, `lang` fr-CA ou en-CA, au moins 4 liens internes, `noindex`.

### T-06 · CONFIRMÉ · P2 · Effort M · Confiance haute : maillage contextuel mince, l'accueil ne pousse pas Octave
- **Où :** `src/app/[locale]/page.tsx` et les sections de l'accueil, pages fonctionnelles. Matrice calculée sur les liens `<a href>` de `<main>` uniquement.
- **Observation :**
  - Les 32 pages lient **exactement les mêmes 17 cibles** par la navigation et le pied de page.
  - Dans `<main>` :

    | Page | Liens internes dans `<main>` |
    |---|---|
    | `/fr` | 4 pages : accord-mets-vins, cellier-intelligent, choisir-un-vin, le-film. Rien vers **sommelier-ia**, apogee, carte-des-vins, fonctions, tarifs |
    | `/fr/le-film` | `/fr` seulement |
    | `/fr/notre-maison` | `/fr`, sommelier-ia |
    | `/fr/cellier-intelligent` | `/fr`, apogee, fonctions |
    | `/fr/accord-mets-vins` | `/fr`, cellier-intelligent, fonctions |
    | `/fr/sommelier-ia` | `/fr`, accord-mets-vins, cellier-intelligent (ni tarifs, ni carte-des-vins, ni choisir-un-vin) |

  - `docs/refonte-v3-seo.md` (§ Le principe SEO) exige pourtant que « la home envoie l'autorité vers les pages fonctionnelles par des liens contextuels naturels ».
  - Le positionnement LOCKED « Octave d'abord » n'a aucun lien contextuel de l'accueil vers `/sommelier-ia`. Le CTA « Rencontrer Octave » mène à `app.iqwine.ai/signup`.
- **Preuve :** script de graphe (`analyse.json`, extraction de `<main>`).
- **Conséquence :** signal de pertinence et de hiérarchie faible. Les liens de gabarit (nav/footer) pèsent moins que les liens éditoriaux. La page pilier Octave n'est pas désignée comme telle.
- **Correctif (sans toucher aux ouvertures émotionnelles) :**
  - accueil : un lien texte vers `/sommelier-ia` dans le bloc Octave, vers `/apogee`, `/carte-des-vins` et `/tarifs` dans leurs moments respectifs ;
  - chaque page fonctionnelle : au moins 2 pages sœurs, plus `/sommelier-ia` et `/tarifs` ;
  - `/le-film` : liens vers les fonctions montrées.
  - Fichiers : composants de sections de chaque page.
- **Vérification :** rejouer le script de matrice ; `<main>` de `/fr` contient `/fr/sommelier-ia` et `/fr/tarifs` ; aucune page fonctionnelle avec moins de 3 liens internes dans `<main>`.

### T-07 · CONFIRMÉ · P2 · Effort S · Confiance haute : descriptions trop longues, quelques titres tronqués
- **Où :** les fichiers `page.tsx` cités en T-01, plus `tarifs/page.tsx:15-24`, `choisir-un-vin/page.tsx:17,21`, `notre-maison/page.tsx:37,42`, `apogee/page.tsx:17`.
- **Observation :**
  - **16/30 meta descriptions dépassent 160 caractères** : FR cellier 207, choisir 218, fonctions 197, tarifs 201, carte 186, accords 180, accueil 170, sommelier 168 ; EN cellar 213, home 192, wine-list 190, features 188, pairing 181, how-to 179, pricing 172, ai-sommelier 161. Le suffixe d'essai, placé en fin, est précisément la partie tronquée, et c'est elle qui est fausse (T-01).
  - Titres de plus de 60 caractères : FR tarifs 69 (**marque en double** : « Tarifs iQWine : … · iQWine », idem en EN), choisir 67, notre-maison 67, apogee 65 ; EN how-to 64, pricing 63.
  - Aucun titre ni aucune description en double entre pages, hormis les paires FR/EN identiques « Contact · iQWine » et « Support · iQWine », sans conséquence.
- **Conséquence :** extraits coupés, et Google réécrit plus volontiers les descriptions trop longues.
- **Correctif :** descriptions de 140 à 155 caractères, bénéfice d'abord, « Passionné offert 14 jours » si la place le permet ; retirer « iQWine » du début du titre Tarifs. Le copy reste celui de la marque (directive « le SEO ne tue jamais l'émotion »).
- **Vérification :** `analyse.py` : 0 description au-delà de 160, 0 titre au-delà de 62.

### T-08 · CONFIRMÉ · P2 · Effort S · Confiance haute : « Standard » apparaît en public, contre la règle LOCKED 6
- **Où :** `src/lib/faq.ts:68-69`.
- **Observation :** réponse à « Faut-il une carte de crédit ? » : « …le jour où vous choisissez **Standard** ou Premium » (EN : « Standard or Premium »). Visible à l'ouverture de l'accordéon et dans le JSON-LD `FAQPage`. La décision LOCKED fixe les libellés publics à Gratuit / Passionné / Premium (EN Enthusiast).
- **Correctif :** « Passionné ou Premium » / « Enthusiast or Premium ».
- **Vérification :** `grep -c 'Standard' crawl/*tarifs*` et `*pricing*` = 0.

### T-09 · CONFIRMÉ · P3 · Effort S · Confiance haute : `SoftwareApplication` non admissible au résultat enrichi, lien App Store redirigé
- **Où :** `src/lib/structured-data.ts` (graphe global, environ lignes 100 à 135), `src/lib/constants.ts:28`.
- **Observation :**
  - JSON-LD valide (32/32 blocs analysés sans erreur), avec `offers`, mais **sans `aggregateRating` ni `review`**, alors que la doc Software App exige l'un des deux. Il n'y a donc pas d'extrait enrichi d'app possible.
  - L'URL App Store `…/iqwine-sommelier-ia-vins/id6798458954` fait un 301 vers `…/iqwine-personal-sommelier/id6798458954`.
- **Conséquence :** aucune pénalité, mais aucun gain d'affichage. Lien sortant avec un saut inutile.
- **Correctif :** ne **jamais** fabriquer de note. Si Éric veut le résultat enrichi, il faut une note réelle affichée sur la page avec sa source : arbitrage, et prudence sur les règles de Google concernant les avis. Mettre à jour `constants.ts:28` vers l'URL finale.
- **Vérification :** test des résultats enrichis de Google (manuel), `curl -sI` sur le lien App Store → 200 direct.

### T-10 · CONFIRMÉ · P3 · Effort S · Confiance haute : `VideoObject` en français sur les pages anglaises
- **Où :** `src/app/[locale]/le-film/page.tsx:54`, `carte-des-vins/page.tsx:37`.
- **Observation :**
  - `/en/the-film` et `/en/wine-list` émettent `name` « iQWine, le film » et « Octave met en évidence… », descriptions en français, sans `inLanguage`. Vignettes et MP4 répondent 200.
  - Sur `/carte-des-vins`, la vidéo est complémentaire : pas une « watch page », donc pas de fonctions vidéo selon la doc Google. `/le-film` est une vraie page de visionnage.
- **Correctif :** localiser `name` et `description` par langue, ajouter `inLanguage`. Laisser le `VideoObject` de `/carte-des-vins` (inoffensif) ou le retirer.
- **Vérification :** JSON-LD de `/en/the-film` en anglais.

### T-11 · CONFIRMÉ · P3 · Effort S · Confiance haute : `lastmod` du sitemap = date du build, uniforme
- **Où :** `src/app/sitemap.ts:54` (`const lastModified = new Date()`).
- **Observation :** les 30 `<lastmod>` valent `2026-09-27T13:31:49.894Z`, soit l'heure du dernier build et non celle d'une modification de contenu. `priority` et `changefreq` sont ignorés par Google.
- **Conséquence :** un `lastmod` non fiable est ignoré par Google. Le signal de fraîcheur est perdu.
- **Correctif :** une date par page (constante tenue à la main dans `PAGES`, ou date git du dossier au build). Retirer `priority` et `changefreq` est facultatif.
- **Vérification :** des `lastmod` différents selon les pages, cohérents avec `git log -1 --format=%cI -- src/app/[locale]/<page>`.

### T-12 · CONFIRMÉ · P3 · Effort S · Confiance moyenne : la 307 de négociation n'a ni `Vary` ni `private`
- **Où :** `src/middleware.ts:58-72`.
- **Observation :** `curl -sI -H 'Accept-Language: en' https://iqwine.ai/` → 307, `cache-control: public, max-age=0, must-revalidate`, **aucun `Vary: Accept-Language, Cookie`**, `cf-cache-status: DYNAMIC`. Le 307 lui-même est délibéré et conforme : ne pas passer en 308.
- **Conséquence :** aucune aujourd'hui (Cloudflare ne met pas en cache). Risque **HYPOTHÈSE** : le jour où une règle de cache Cloudflare s'appliquerait, une redirection de langue pourrait être servie à la mauvaise personne.
- **Correctif :** sur la réponse 307, poser `Cache-Control: private, no-store` et `Vary: Accept-Language, Cookie`.
- **Vérification :** `curl -sI https://iqwine.ai/` montre les deux en-têtes.

### T-13 · CONFIRMÉ · P3 · Effort S · Confiance haute : variantes d'URL et liens non localisés
- **Observation :**
  - Casse : `/fr/Tarifs`, `/fr/TARIFS`, `/fr/SOMMELIER-IA` et `/en/Pricing` répondent **200** (canonical correct en minuscules).
  - `/FR/tarifs` → 307 → `/fr/FR/tarifs` → 404.
  - Slugs anglais nus : `/pricing` et `/features` → 307 → `/fr/pricing` → **404** pour un navigateur francophone (`ALIAS` de `lib/locale.ts` ne connaît que `octave`, `recevoir` et `recherche`).
  - `ContactContent.tsx:40` (`'/tarifs#faq'`) et `:58` (`'/beta'`) produisent des liens nus, donc un 307 de plus. Un anglophone qui a un cookie `fr` peut basculer de langue.
- **Correctif :**
  - dans `middleware.ts`, un 308 vers les minuscules quand le chemin contient des majuscules ;
  - ajouter dans `ALIAS` les slugs EN (`pricing`, `features`, `ai-sommelier`, …), résolus via `segmentCanonique(…, 'en')` ;
  - utiliser `LocaleLink` dans `ContactContent.tsx`.
- **Vérification :** `/fr/Tarifs` → 308 `/fr/tarifs` ; `/pricing` avec AL `fr` → `/fr/tarifs` ; le HTML de `/fr/contact` ne contient plus `href="/tarifs`.

### T-14 · CONFIRMÉ · P3 · Effort S · Confiance moyenne : le H1 de Tarifs se lit « Trouvez votre ctave »
- **Où :** `src/components/octave/OctaveWordmark.tsx:35`.
- **Observation :** le « O » est un SVG dans `<span role="img" aria-label="Octave">`. L'extraction texte du H1 donne « Trouvez votre ctave. » (FR) et « Find your ctave. » (EN). Les moteurs n'exploitent pas de façon fiable l'`aria-label` d'un `span` dans un titre.
- **Correctif :** ajouter un texte lisible masqué visuellement (`<span class="sr-only">Octave</span>`), le SVG et le reste du mot passant en `aria-hidden`, sans changer le rendu.
- **Vérification :** le texte du H1 extrait par `analyse.py` contient « Octave ».

### T-15 · HYPOTHÈSE · P2 · Effort M · Confiance moyenne : performance correcte en LCP, JS lourd (TBT et INP à surveiller)
- **Mesures labo locales (pas Lighthouse, 2 passes, mobile émulé, CPU ×4, Slow 4G) :**

  | Page | LCP | Élément LCP | TBT approx. | CLS | JS (br) |
  |---|---|---|---|---|---|
  | `/fr` | 2,48 à 2,54 s | H1 (texte) | 607 à 654 ms | 0 à 0,065 | 160 Ko transférés |
  | `/fr/sommelier-ia` | 1,89 à 2,04 s | `IMG octave-conversation.jpg` | 404 à 442 ms | ≤ 0,001 | 214 Ko |
  | `/fr/tarifs` | 2,05 à 2,08 s | `P` sous-titre | 535 à 586 ms | ≤ 0,054 | 223 Ko |

- **Autres mesures :**
  - TTFB de 165 à 230 ms (cache Vercel `HIT`). HTML de `/fr` : 77 Ko brut, 14,6 Ko en brotli.
  - JS par page : 10 à 12 fichiers, 682 à 851 Ko bruts, 212 à 271 Ko en brotli.
  - 5 polices woff2 **préchargées** (environ 180 Ko, dont des graisses italiques et `latin-ext`), en concurrence avec le rendu sur réseau lent.
  - `logo-iqwine.png` : 46 Ko pour un affichage de 71×80 px.
- **Conséquence probable :** LCP dans la zone « bonne » à la limite (2,5 s) sur l'accueil. Un TBT élevé laisse craindre un INP moyen sur mobile (framer-motion et hydratation).
- **Correctif :**
  - mesurer d'abord : PSI avec une clé, ou rapport Core Web Vitals de Search Console ;
  - ensuite : `preload: false` sur les graisses non utilisées au-dessus de la ligne de flottaison (`layout.tsx:26-41`), logo en WebP/AVIF, audit des composants client de l'accueil (sections non interactives en composants serveur, `LazyMotion` avec `m.`).
- **Vérification :** PSI mobile sur les 3 URL : LCP ≤ 2,5 s, TBT ≤ 200 ms (labo) ; terrain (CrUX ou GSC) : INP ≤ 200 ms au 75e centile.

### T-16 · NON VÉRIFIÉ (accès) · P1 · Effort S (Éric, consoles) : Search Console, Bing, IndexNow
- **Preuves trouvées :**
  - `dig TXT iqwine.ai` et `dig TXT iqwine.ca` : un enregistrement `google-site-verification=<masqué>` sur **chacun**, ce qui indique des propriétés de domaine GSC probables. Aucune balise `google-site-verification` dans le HTML.
  - Bing : aucune `msvalidate.01`, `/BingSiteAuth.xml` en 404, aucun TXT ou CNAME Bing. Bing est donc soit importé depuis GSC, soit non vérifié.
  - IndexNow : la clé est servie à la racine (`/<clé>.txt` → 200 `text/plain`, testé sans afficher la clé). La soumission est **manuelle** (`scripts/soumettre-indexnow.mjs`) et rien ne prouve qu'elle a été faite. Remarque : `/api/indexnow-key` sans paramètre renvoie la clé ; ce n'est pas un secret (elle est publique par conception d'IndexNow).
- **À vérifier dans les consoles (liste exacte) :**
  1. GSC, propriété de domaine `iqwine.ai` : sitemap `https://iqwine.ai/sitemap.xml` soumis, statut « Opération effectuée », 30 URL découvertes.
  2. GSC, rapport Indexation des pages : combien des 30 URL sont indexées, motifs d'exclusion. Voir surtout les EN (« Détectée, actuellement non indexée ») et si les anciennes `/tarifs` ou `/octave` (307) restent indexées.
  3. GSC, inspection d'URL de `/fr/tarifs` : HTML rendu (confirmer l'absence des réponses FAQ, T-02), canonique choisie par Google.
  4. GSC, outil **Changement d'adresse** `iqwine.ca` → `iqwine.ai` : utilisé ou non. Aucune trace dans `docs/bascule-iqwine-ai.md` (étape 5) ni dans `ai-memory`.
  5. GSC : Core Web Vitals (terrain), actions manuelles, problèmes de sécurité, résultats enrichis (Vidéo, Software App).
  6. GSC : présence de `iqwine-web.vercel.app` (T-04) parmi les URL explorées.
  7. Bing Webmaster : site vérifié (importé de GSC ?), sitemap soumis, IndexNow reçu (rapport « IndexNow »).
- **Critère :** captures ou export des rapports 1, 2, 4 et 7 joints au dossier d'audit.

### T-17 · HYPOTHÈSE · P3 · Effort L · Confiance basse : du contenu éditorial sous un sous-domaine noindex
- **Où :** `src/components/layout/Footer.tsx:47,50`.
- **Observation :** les 32 pages lient `https://app.iqwine.ai/apprendre` (« Apprendre le vin ») et `/octave-verifiable`. Ces pages publiques répondent **200** avec `x-robots-tag: noindex, nofollow`.
- **Lecture :** ne **pas** indexer `app.iqwine.ai` (règle LOCKED 4, respectée aujourd'hui). Question à Éric : ce contenu pédagogique mérite-t-il une version publique sur `iqwine.ai` ? Arbitrage produit et contenu, à croiser avec l'agent contenu.

### T-18 · CONFIRMÉ · P3 · Effort S : petites hygiènes
- **Image de partage :** une seule image Open Graph par langue pour toutes les pages (`/fr/opengraph-image`, 120 Ko). Une image par page fonctionnelle améliorerait les partages.
- **Tirets cadratins :** des « — » servent de pause dans des réponses FAQ visibles (`faq.ts:293-294` et la réponse « Le forfait Gratuit expire-t-il… »), contre la consigne de voix. À corriger avec le lot A.
- **Commentaire périmé :** `next.config.ts` mentionne « Cloudflare Workers » alors que les en-têtes prouvent l'hébergement Vercel (`x-vercel-id`). Sans effet SEO.

---

## Limites

- **Pas de Lighthouse ni de PSI :** l'API a renvoyé 429 (quota quotidien du projet partagé sans clé) et `npx lighthouse` a été refusé par le garde-fou. Les chiffres de T-15 viennent d'un Chromium local avec étranglement ; ils sont comparables entre pages, pas avec les scores officiels.
- **Pas de CrUX ni d'accès aux consoles (GSC, Bing) :** l'état réel d'indexation, la canonique choisie par Google et les erreurs hreflang ne sont **pas** connus. `site:` n'a pas été utilisé comme inventaire.
- **Rendu JS par Googlebot non simulé.** L'analyse porte sur le HTML initial ; T-02 est confirmé par le code (le DOM n'existe qu'au clic).
- **Comportement de l'app au 25e conseil** (T-01, sous-point) non vérifié en production. Seules la constante du tag `v0.163.0` et la mention d'`ai-memory` ont été lues.
- **Mesure ponctuelle** (un instant, depuis un seul point réseau au Canada). Les caches Vercel et Cloudflare peuvent varier.

---

## Lots techniques prêts à exécuter

Tous passent par la chaîne qualité locale complète (typecheck, lint, tests, build, `pnpm verifier:routage`) sur le SHA exact. Sans GitHub Actions tant que la consigne temporaire de quota s'applique. Déploiement selon la règle de la branche `production`.

| Lot | Constats | Fichiers | Dépendance | Critères d'acceptation |
|---|---|---|---|---|
| **A · Vérité de l'essai et des forfaits** (P1, S) | T-01, T-08, T-18 (tirets) | `src/lib/trial.ts` (l. 51, `TRIAL_MECHANICS` l. 372), `src/lib/faq.ts` (l. 68-69, 211-233, 293-294), `src/lib/structured-data.ts` (l. 128-132), descriptions des 7 `page.tsx` et de `layout.tsx` | **Arbitrage d'Éric** : mécanique au 25e conseil, formule « Essai » ou « Passionné offert » dans les métas | 0 « 12 conseils » ou « 12 pieces » dans le HTML des 32 pages ; 0 « Standard » public ; `TRIAL_RECOS` = `TRIAL_AI_RECOMMENDATIONS` de l'app (idéalement un test qui compare) |
| **B · FAQ indexable** (P1, S) | T-02 | `src/components/sections/SectionFaq.tsx` | aucune | Les 14 réponses sont dans le HTML initial hors `<script>`, chaque `acceptedAnswer` est retrouvée dans le texte visible ; accordéon accessible (`aria-expanded`) ; CLS ≤ 0,1 |
| **C · Hôte unique** (P2, S) | T-04 | Console Vercel (Éric) **ou** `src/middleware.ts` (contrôle de `host`) | aucune | `iqwine-web.vercel.app/*` → 308 vers `iqwine.ai/*` ou `x-robots-tag: noindex` ; préversions inchangées |
| **D · 404 de marque** (P2, M) | T-05 | nouveaux `src/app/[locale]/not-found.tsx` et `src/app/[locale]/[...reste]/page.tsx` | aucune | `/fr/x` et `/en/x` → 404, `lang` correct, `noindex`, au moins 4 liens internes ; `verifier:routage` vert (pas de collision avec les réécritures EN) |
| **E · Métadonnées et maillage** (P2, M) | T-06, T-07, T-14 | `page.tsx` de chaque page, sections de l'accueil et des pages fonctionnelles, `OctaveWordmark.tsx` | Validation du copy par Éric (directive « émotion d'abord ») | Descriptions ≤ 155 caractères, titres ≤ 62 ; `<main>` de `/fr` et `/en` lie sommelier-ia et tarifs ; chaque page fonctionnelle a au moins 3 liens contextuels ; H1 Tarifs lisible « Octave » |
| **F · Politique EN** (P2, M) | T-03 | `src/app/[locale]/confidentialite/page.tsx` (+ synchronisation avec `cellier-vin`) | **Arbitrage juridique d'Éric** | H1 et corps de `/en/privacy` en anglais, version FR intacte |
| **G · Hygiène de routage et de données** (P3, S) | T-09 (URL App Store), T-10, T-11, T-12, T-13 | `constants.ts:28`, `le-film/page.tsx`, `carte-des-vins/page.tsx`, `sitemap.ts`, `middleware.ts`, `lib/locale.ts` (`ALIAS`), `ContactContent.tsx:40,58` | aucune | `lastmod` par page ; `VideoObject` EN en anglais ; `/fr/Tarifs` → 308 ; `/pricing` avec AL `fr` → `/fr/tarifs` ; 307 racine avec `Vary` et `private` ; les nouveaux cas ajoutés à `verifier-routage.mjs` |
| **H · Mesure** (P1, S, hors code) | T-15, T-16 | Consoles GSC et Bing, PSI avec clé | Accès d'Éric | Les 7 vérifications de T-16 documentées ; PSI mobile des 3 URL archivé dans `docs/audits/` comme ligne de base (aucune n'existe : l'audit du 2026-05-12 laissait Lighthouse « à mesurer ») |

Ordre conseillé : **A et B** (un seul déploiement), puis **C** (geste console), **H** en parallèle, puis **E**, **D**, **G** ; **F** dès l'arbitrage juridique.
