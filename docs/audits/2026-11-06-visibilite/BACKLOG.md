# Backlog visibilité iqwine.ai (audit du 2026-11-06)

Source : `RAPPORT.md` du même dossier. Les ID V-xx renvoient au tableau consolidé du rapport.

Règles communes à tous les lots :
- **Chaîne qualité locale complète sur le SHA exact** : `pnpm typecheck && pnpm lint && pnpm build && pnpm verifier:routage`, plus `pnpm legal:verifier` si le légal est touché et `pnpm images:verifier` si une image change.
- **Déploiement** selon la règle de la branche `production` (`main` ne fait que des préversions).
- **Pages publiques LOCK** (`docs/refonte-v3-contenus.md`) : tout texte visible nouveau ou modifié exige le GO d'Éric, page par page. Directive `docs/refonte-v3-seo.md` : le SEO ne tue jamais l'émotion.
- **Interdits** :
  - « SAQ » générique, « points de vente », « succursale(s) » ;
  - Éric fondateur ;
  - lien `app.iqwine.ai` ajouté sur une plateforme publique ;
  - l'offre Restaurant B2B ;
  - une note ou un avis fabriqués ;
  - tout contenu privé ;
  - le tiret cadratin en pause.
- **Vérification proportionnée** : `curl` du HTML servi après déploiement (critères ci-dessous), sans E2E coûteux.

---

## Semaine 1

### Lot A · Vérité de l'essai, des forfaits et du vocabulaire (V-01, V-02, V-03, V-18, V-27) · P1 · S

**Dépendance** : décision 1 d'Éric (mécanique au 25e conseil).

**Fichiers** :
- `src/lib/trial.ts` (`TRIAL_RECOS` l. 51, `TRIAL_MECHANICS`) ;
- `pnpm legal:synchroniser` (régénère `src/lib/legal-terms.generated.json` depuis `cellier-vin`, qui interpole déjà 25) ;
- `src/lib/faq.ts` (l. 68-69 « Standard » ; réponses d'essai) ;
- `src/lib/structured-data.ts` (`RegisterAction`, `founder`, `sameAs` du lot E1 si regroupé) ;
- les composants qui portent « point(s) de vente » : `SectionSaq.tsx`, `SectionRayonMagasin.tsx`, `SectionQuestion.tsx` (`SectionTroisMoments.tsx` est archivé : à vérifier, ne pas réutiliser) ;
- les meta descriptions des `page.tsx` et de `layout.tsx` (≤ 155 caractères, titres ≤ 62) ;
- `src/app/llms.txt/route.ts` (prix, plateformes, fondatrice, vocabulaire).

**Garde à ajouter** : un test ou une règle de lint côté site qui refuse « point(s) de vente », « succursale(s) » et « SAQ » générique dans les textes, sur le modèle de `tests/i18n/zero-saq-generique.test.ts` de l'app. Plus une comparaison `TRIAL_RECOS` = `TRIAL_AI_RECOMMENDATIONS` lue dans `cellier-vin` quand le dépôt est présent (même mécanisme que `legal:verifier`).

**Critères d'acceptation** :
- sur les 32 pages et `llms.txt` servis : 0 « 12 conseils », 0 « 12 interactions », 0 « 12 pieces of advice », 0 « Standard » public, 0 « point(s) de vente », 0 « succursale » ;
- `pnpm legal:verifier` vert ;
- descriptions ≤ 155 caractères.

### Lot B · FAQ et démo indexables, H1 lisible (V-04, V-14, V-20) · P1 · S

**Dépendance** : aucune.

**Fichiers** : `src/components/sections/SectionFaq.tsx` (remplacer `{open && …}` par un contenu toujours rendu, replié en CSS ou `<details>`, `aria-expanded` conservé) ; le composant de démo d'accords de `/accord-mets-vins` (4 plats rendus) ; `src/components/octave/OctaveWordmark.tsx` (texte accessible « Octave »).

**Critères** :
- chaque `acceptedAnswer` du JSON-LD `FAQPage` est retrouvée telle quelle dans le texte visible du HTML initial ;
- les 4 réponses de la démo sont présentes sans JS ;
- le texte extrait du H1 de Tarifs contient « Octave » ;
- CLS ≤ 0,1 en local.

### Lot C · Hôte unique (V-15) · P2 · S

**Fichiers** : console Vercel (Éric), domaine `iqwine-web.vercel.app` redirigé en 308 vers `iqwine.ai`. À défaut, `src/middleware.ts` (contrôle du `host`, sans toucher aux préversions).

**Critère** : `curl -sI https://iqwine-web.vercel.app/fr` → 308 vers `https://iqwine.ai/fr`, préversions intactes.

### Lot H · Passe console (V-08, V-22) · P1 · S · Éric

| Console | Contrôles |
|---|---|
| Search Console | Propriété Domaine `iqwine.ai` ; sitemap soumis ; état des 30 URL ; Changement d'adresse `iqwine.ca` → `iqwine.ai` ; *Paramètres > Search generative AI* = Inclure ; rapport *Generative AI performance* ; requêtes hors marque (base du suivi) |
| Bing Webmaster Tools | Import depuis GSC, sitemap, état d'exploration |
| Cloudflare | AI Crawl Control : quels robots sont bloqués et par quelle règle ; Security Events filtrés sur OAI-SearchBot, Claude-SearchBot, PerplexityBot, Bingbot ; état de Bot Fight Mode |
| PageSpeed Insights | 3 URL en mobile (`/fr`, `/fr/sommelier-ia`, `/fr/tarifs`), avec une clé API gratuite si le quota anonyme refuse |

**Livrable** : captures ou exports dans `docs/audits/2026-11-06-visibilite/consoles/`, qui servent de ligne de base.

---

## 30 jours

### Lot M · Mesure et attribution (V-06, V-07, V-28) · P1 · M · deux dépôts

**Dépendances** : décisions 3 (outil) et 4 (activation).

**Site** :
- outil d'analytique retenu, avec la CSP ajustée seulement si nécessaire (`next.config.ts:47-68`) ;
- brancher `src/lib/analytics.ts` sur l'outil ;
- `buildSignupUrl` (`src/lib/constants.ts:74-91`) transmet l'UTM d'arrivée (mémorisée en `sessionStorage` à l'atterrissage), avec repli sur le domaine référent, puis sur `marketing` ;
- paramètres de campagne sur les liens App Store (`ct=`) et Play (`referrer=utm_source…`).

**App (`cellier-vin`, sa procédure, ses règles de déploiement)** :
- conserver l'attribution à travers l'OAuth Google et Apple (cookie court lu dans `events.createUser`) ;
- requête de lecture versionnée sans données personnelles : inscriptions, activation à 7 jours et premier paiement à 30 jours par source ;
- `upgrade_completed` aussi pour Apple.

**Critères** :
- une visite depuis `?utm_source=test-audit` puis une inscription de test (compte de test, staging) donne `acquisition.utmSource = test-audit`, y compris via Google ;
- la requête agrégée retourne la ligne ;
- l'outil d'analytique montre la visite.

### Lot E · Maillage, entité, métadonnées (V-17, V-23, V-10) · P2 · M

**Dépendance** : GO d'Éric sur le texte des liens.

**Fichiers** :
- sections de l'accueil (liens contextuels vers `/sommelier-ia`, `/tarifs`, `/apogee`, `/carte-des-vins`) ;
- pages fonctionnelles (au moins 3 liens contextuels chacune, sur le graphe de `refonte-v3-seo.md`) ;
- `src/lib/structured-data.ts` : `Organization.founder` = Mégane Bigras, `sameAs` vers Instagram @iqwineapp, TikTok @iqwine, YouTube @iQWineApp et la page Facebook ; `WebSite.url` à la racine ;
- liens sociaux dans le pied de page.

**Critères** : JSON-LD valide (Rich Results Test et validateur Schema.org) ; aucune mention d'Éric comme fondateur ; matrice de liens régénérée.

### Lot D · 404 de marque (V-19) · P2 · M

**Fichiers** : nouveaux `src/app/[locale]/not-found.tsx` et route attrape-tout ; alias `/pricing` et `/tarifs` selon la langue (`src/lib/locale.ts`, `src/middleware.ts`) ; cas ajoutés à `scripts/verifier-routage.mjs`.

**Critères** :
- `/fr/inexistant` → 404, `lang="fr-CA"`, `noindex`, au moins 4 liens ;
- `/pricing` avec Accept-Language fr → `/fr/tarifs` ;
- `verifier:routage` vert.

### Lot G · Hygiène (V-25) · P3 · S

Lien App Store canonique (`constants.ts:28`) ; `VideoObject` EN en anglais (`le-film`, `carte-des-vins`) ; `lastmod` par page (`sitemap.ts`) ; `Vary` et `private` sur la 307 racine ; URL en majuscules → 308 ; code mort qui présente Éric comme « Fondateur » supprimé. **Aucune `aggregateRating`** tant qu'il n'y a pas de notes réelles affichées.

### Page P1 · Cellier enrichi (V-13) · P1 · M · GO d'Éric

`/fr/cellier-intelligent` ↔ `/en/wine-cellar-app` (`src/app/[locale]/cellier-intelligent/`). Structure, questions, title proposé et liens : annexe 4, §6, chantier 3. Les textes citables (« Puis-je importer ma cave ? », « Sur quels appareils ? ») sont dans l'annexe 4, §7.

**À vérifier avant d'écrire** : le parcours d'abonnement Android, sans achat intégré.

**Critères** : section Gratuit 100 bouteilles, import, plateformes, FAQ visible dans le HTML ; 3 liens contextuels ; captures réelles d'un compte de démonstration.

### Page P2 · Apogée refondue (V-12) · P1 · M · GO d'Éric, après stabilisation des libellés v7

`/fr/apogee` ↔ `/en/drinking-window`. Elle ouvre sur une réponse directe à « Quand boire ce vin ? », puis présente les 4 repères v7, la pastille de source, la fiabilité et les limites (« un repère, jamais une garantie »), avec une capture réelle. Le niveau d'explication est arbitré contre la règle « montrer le résultat, jamais la mécanique » (annexe 4, §8, point 3).

---

## 90 jours

| Lot | Contenu | Dépendance |
|---|---|---|
| P3 · Sommelier IA | « Ce qu'Octave ne fait jamais » (contenu d'Octave vérifiable), FAQ, version EN propre (pas une traduction) | Décision 5 |
| P4 · Accords | Bloc « À la table québécoise » : 4 plats, réponses réelles d'Octave capturées et datées ; pas de page par plat | GO |
| P5 · Carte des vins | QR d'une carte en ligne, méthode en 3 bouteilles, FAQ | GO |
| P6 · Comparatif | Une seule page `/fr/comparatif-applications-vin` ↔ `/en/wine-app-comparison` (slugs à valider), tableau daté et sourcé, « quand choisir une autre appli », import | Décision 6 |
| P7 · Guide public | Republication sur `iqwine.ai` du contenu public du Guide d'Octave (questions-réponses), sans toucher au noindex de l'app | Décision 5 |
| F · Politique EN | Traduction juridique de `/en/privacy` | Décision 7 |
| Perf | Seulement si PSI ou CrUX confirment un INP faible : réduire le JS client (framer-motion, polices préchargées) | Lot H |
| P8 · Page scan | Seulement si GSC montre des impressions de scan sans clics | Données GSC |

## Hors site (responsable : Éric, sauf mention)

- Fiches Play et App Store (V-05), et fichiers source `cellier-vin/docs/ops/play-fiche-textes.md` et équivalent App Store (DATA).
- Robots d'entraînement : appliquer la décision 2 dans Cloudflare **et** dans `src/app/robots.ts` (DATA), puis la documenter dans `docs/decision-cloudflare.md`.
- Demande d'avis native dans l'app (session de développement de l'app, sur décision).
- Product Hunt, AlternativeTo ; dossier de presse ; banc mensuel (`annexes/banc-visibilite-ia.csv`, gabarit dans l'annexe 6, D2).
