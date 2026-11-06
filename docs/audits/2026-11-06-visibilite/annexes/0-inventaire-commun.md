# Inventaire commun — audit visibilité iqwine.ai (2026-11-06, mesures 14:38 UTC)

Fichiers bruts dans ce dossier : robots.txt, sitemap.xml, urls.txt (30 URL du sitemap), statuts.txt, home-fr.html.

## Architecture (dépôt ~/Projects/iQWine_Web = T0X1k007/iqwine-web)
- Next.js 16 App Router, src/app/[locale]/..., src/middleware.ts, src/app/robots.ts, sitemap.ts, llms.txt (route), manifest.ts.
- Hébergé Vercel, Cloudflare en proxy devant (WAF, cache, analytique) — docs/decision-cloudflare.md. Headers servis : server: cloudflare + x-vercel-cache.
- La PROD suit la branche `production` (worktree ~/Projects/iQWine_Web-v2) ; `main` = préversions. Comparer main vs production (git log origin/production..main).
- Docs SEO maison : docs/refonte-v3-seo.md (directive : le SEO ne tue jamais l'émotion), docs/refonte-v3-contenus.md, docs/migration-slugs-anglais.md, docs/bascule-iqwine-ai.md, docs/audits/.
- Scripts : pnpm verifier:routage (scripts/verifier-routage.mjs, 135 contrôles).

## Faits mesurés en ligne
- robots.txt : `User-Agent: *  Allow: /  Disallow: /api/` + Host + Sitemap. Aucune règle par robot IA.
- sitemap.xml : 30 URL (15 FR + 15 EN) : accueil, fonctions/features, cellier-intelligent/wine-cellar-app, sommelier-ia/ai-sommelier, le-film/the-film, apogee/drinking-window, choisir-un-vin/how-to-choose-wine, accord-mets-vins/wine-pairing, carte-des-vins/wine-list, tarifs/pricing, notre-maison/our-story, contact, support, conditions/terms, confidentialite/privacy. Toutes 200 (UA navigateur).
- https://iqwine.ai/ → 307 (temporaire) vers /fr. www.iqwine.ai, http, iqwine.ca, www.iqwine.ca → 308 vers https://iqwine.ai/.
- Accueil FR : title « iQWine · Octave, votre sommelier IA qui apprend vos goûts » ; canonical https://iqwine.ai/fr ; hreflang fr-CA, en-CA, x-default=https://iqwine.ai (qui fait 307) ; meta robots index,follow ; 2 blocs JSON-LD.
- ⚠ Meta description accueil : « Essai : 14 jours ou 12 conseils, sans carte. » Or la production de l'app (v0.163.0, 2026-11-06) sert un essai « 25 conseils ou 14 jours » (ai-memory CURRENT_STATE). Divergence à confirmer.
- app.iqwine.ai : 307 vers /login, x-robots-tag: noindex, nofollow. staging.iqwine.ai : 401 (auth basique nginx).
- llms.txt servi (4,5 Ko).

## Règles LOCKED à respecter dans toute recommandation (ai-memory DECISIONS.md)
1. « SAQ » INTERDIT dans tout texte visible (site compris) comme vocabulaire générique ; on dit « en magasin » / « in store ». Exceptions : nom propre réel d'un magasin (« SAQ Blainville ») et textes légaux §7. → Toute reco « page SAQ / mot-clé SAQ » est un CONFLIT avec une décision LOCKED : la signaler comme arbitrage d'Éric, ne jamais la recommander comme acquise.
2. Positionnement « Octave d'abord, la cave ensuite » : Octave → apprend vos goûts → sommelier personnel → cave, restaurant, magasin → scan et gestion de cave comme fonctionnalités. Ne rien promettre d'Octave V3 non servi.
3. Entité : « iQWine » seul sur le site ; légal = « iQWine (par Groupe Medtech Inc.) » seulement dans Conditions/Politique/facturation. Mégane Bigras = FONDATRICE ; Éric = « Entrepreneur & passionné… », porte-parole, jamais fondateur/créateur/développeur. Pas de « marque de commerce ».
4. Ne JAMAIS exposer app.iqwine.ai sur une plateforme publique ; le seul lien communiqué est iqwine.ai. Support canonique : https://iqwine.ai/support.
5. Restaurant (B2B) : EN PAUSE jusqu'au pilote 2027, ABSENT en production. Ne pas le présenter comme offre commerciale. (La page /carte-des-vins concerne la fonction grand public « scanner une carte des vins au restaurant », pas l'offre Restaurant B2B — à vérifier.)
6. Forfaits : identifiants Gratuit / STANDARD / Premium ; libellés publics Gratuit / Passionné (EN Enthusiast) / Premium. Nouveau compte → essai Passionné 14 jours (plafond 25 conseils depuis v0.163.0) → retour auto Gratuit.
7. App iOS en vente sur l'App Store (1.2.1). Android : Google Play (état public à vérifier : test fermé ou production ?).
8. Pas de tiret cadratin comme pause dans les textes proposés ; français canadien.

## Contraintes du mandat
Lecture seule. Aucun déploiement, aucun commit, aucun contact externe, aucune publication, aucun achat. Aucun déclenchement GitHub Actions. Aucun secret affiché. Ne jamais recommander d'exposer caves, profils, conversations ou espaces authentifiés.
Ne pas fabriquer de volumes de recherche. Dater et sourcer chaque règle technique (docs officielles).
Chaque constat : URL/fichier · observation · preuve/méthode · conséquence · correctif · priorité (P0-P3) · effort (S/M/L) · confiance · critère de vérification ; et classé : CONFIRMÉ / OPPORTUNITÉ / HYPOTHÈSE / NON VÉRIFIÉ (accès).
