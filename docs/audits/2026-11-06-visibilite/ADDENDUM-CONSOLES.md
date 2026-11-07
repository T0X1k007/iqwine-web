# Addendum : consoles inspectées le 2026-11-06

Inspection en lecture, par DATA, dans le Chrome d'Éric (sessions ouvertes par Éric). **Aucun réglage n'a été modifié, aucun brouillon enregistré, rien n'a été publié.** Aucune donnée personnelle n'est recopiée ici (courriels masqués).

Ce document **remplace** les mentions « NON VÉRIFIÉ (accès) » du rapport pour Search Console, Vercel, Cloudflare, App Store Connect et Google Play Console. **Bing Webmaster Tools n'est pas configuré** (confirmé par Éric) : il reste à créer, plus tard.

## 1. Google Search Console (propriété Domaine `iqwine.ai`, propriétaire confirmé : Eric Bigras)

| Point | Constat | Classe |
|---|---|---|
| Sitemap | `https://iqwine.ai/sitemap.xml` envoyé le 2026-08-18, dernière lecture le 2026-10-30, « Opération effectuée », 30 URL découvertes | CONFIRMÉ, sain |
| Indexation (rapport mis à jour le 2026-10-22) | **28 indexées, 76 non indexées** | CONFIRMÉ |
| Pages indexées | `/`, `/en`, les 13 pages EN intérieures, et **13 chemins nus** (`/sommelier-ia`, `/tarifs`, `/cellier-intelligent`, `/apogee`…) | CONFIRMÉ |
| **Doublons (14)** | `/fr`, `/fr/sommelier-ia`, `/fr/tarifs`, `/fr/cellier-intelligent`, `/fr/apogee`, `/fr/accord-mets-vins`, `/fr/carte-des-vins`, `/fr/choisir-un-vin`, `/fr/fonctions`, `/fr/notre-maison`, `/fr/contact`, `/fr/conditions`, `/fr/confidentialite`, `/fr/le-film` : « Page en double : Google n'a pas choisi la même URL canonique que l'utilisateur ». Inspection de `/fr/sommelier-ia` : canonique déclarée `/fr/sommelier-ia`, **canonique choisie par Google `https://iqwine.ai/sommelier-ia`**, qui redirige en **307** vers `/fr/sommelier-ia` et que le `x-default` de la page désigne | **CONFIRMÉ, problème principal** |
| Autres exclusions | `noindex` (17) = `app.iqwine.ai` (signup, login, conditions, octave-verifiable) et `/beta` : voulu. Robots.txt (15) = ressources `_next` d'`app.iqwine.ai` : sans effet sur la vitrine. Explorées non indexées (9) = polices, favicons, images OG : normal. Redirections (18) : normal | CONFIRMÉ, sans action |
| Performances (3 mois au 2026-11-03) | **31 clics, 542 impressions**, CTR 5,7 %, position moyenne 25. Marque : « iq wine » 5 clics, 108 impressions, position 4,8. Hors marque : **0 clic** ; « ai wine » 44 impr. (pos. 53), « sommelier virtuel » 36 (pos. 84), « sommelier digital » 10 (pos. 81), « vin apogée » 3 (pos. 87). 26 clics viennent de requêtes anonymisées par Google | CONFIRMÉ |
| Rapport IA générative (bêta) | **Existe et a des données** : 77 impressions sur 3 mois, sur 17 pages, surtout des chemins nus (`/conditions`, `/cellier-intelligent`, `/le-film`, `/sommelier-ia`, `/tarifs`) | CONFIRMÉ |
| Contrôle « IA générative dans la Recherche » | **Inclure** | CONFIRMÉ, sain |
| Changement d'adresse | **Déjà déclaré** : `iqwine.ca` → `iqwine.ai`, « migration en cours ». Propriété `iqwine.ca` : 0 page indexée, 89 non indexées (67 « détectées, non indexées »). **Ne rien relancer** | CONFIRMÉ, sain |
| Core Web Vitals | « Aucune donnée » (trafic insuffisant pour CrUX) | CONFIRMÉ |

**Lecture.** Le contenu français est bien dans Google, mais sous les chemins nus. Les paires hreflang déclarent des pages françaises que Google a sorties de l'index. Le correctif est prêt sur la branche `visibilite/canonique-fr`, commit `02e1a73` :
- le `x-default` d'une page intérieure désigne sa version française ;
- le chemin nu répond 308 vers le français, sauf choix anglais (307) ;
- l'accueil reste inchangé.

Il touche une décision d'Éric documentée dans le code (`x-default` neutre) : **arbitrage requis**.

## 2. Vercel (équipe « Eric Bigras' projects », forfait Hobby, projet `iqwine-web`)

| Point | Constat |
|---|---|
| Branche de production | **`production`** (Settings > Environments > Production > Branch Tracking). Un push sur `main` crée seulement une préversion (« Recent Previews : main »). La doc a donc été poussée sur `main` sans risque de mise en ligne |
| Domaines | `iqwine.ai` (Production, proxy Cloudflare détecté) ; `www.iqwine.ai`, `iqwine.ca` et `www.iqwine.ca` → 308 vers `iqwine.ai` ; **`iqwine-web.vercel.app` = domaine Production, servi sans redirection** |
| Web Analytics | **Non activé.** Doc officielle (maj 2026-08-25) : Hobby = 50 000 événements par mois inclus, collecte suspendue au-delà (jamais facturée), fenêtre de 1 mois, **ni événements personnalisés ni UTM sur Hobby**. Pro : 0,03 $ US les 1 000 événements |
| Usage (30 jours) | 27 k requêtes CDN sur 1 M, 11 k invocations sur 1 M : très loin des plafonds |
| Sécurité du compte | Vercel affiche « Enable 2FA » : l'A2F n'est pas activée sur le compte |
| ⚠ Forfait | Le site d'un service commercial tourne sur Hobby. Les conditions de Vercel réservent Hobby à un usage personnel non commercial (à confirmer dans les conditions en vigueur) : **risque à arbitrer**, non vérifié ici |

## 3. Cloudflare (zone `iqwine.ai`, forfait Free)

| Point | Constat |
|---|---|
| Politique « AI Crawler and Agent access » | **Search : Allow · Training : Disallow · Agents : Allow** ; agents personnels (Claude, OpenAI, Gemini, Meta) : Allow |
| Bot Fight Mode | **Désactivé** · AI Labyrinth : désactivé · Browser Integrity Check : activé · Règles personnalisées WAF : **0** · Limitation de débit : **0** |
| Bot Preference Sync | Non activé : robots.txt n'est pas réécrit par Cloudflare (concorde avec l'audit) |
| Robots observés en 7 jours (journal AI Crawl Control) | Googlebot 424 autorisées · BingBot 114 · Applebot 33 · OAI-SearchBot 10 · PerplexityBot 10 · Claude-SearchBot 2 · ChatGPT-User 5 autorisées et 5 en échec · DuckAssistBot, MistralAI-User, Perplexity-User, Baidu : 1 chacun |
| Bloqués (interrupteur « Block » activé) | GPTBot (20 refus), ClaudeBot (4), CCBot (3), Bytespider, Amazonbot, PetalBot (59), Meta-ExternalAgent, FacebookBot, Google-CloudVertexBot, Anchor Browser, Arquivo, **et Claude-User** (143 autorisées et 287 refusées sur 7 jours) |
| Analytique | Cloudflare Web Analytics existe pour la zone en installation automatique (2,5 k pages vues sur 24 h), mais **ce sont des pages de `staging.iqwine.ai`** (tests e2e). La vitrine ne remonte rien : la CSP du site bloque le script |
| `/.env.prod` | Chemin le plus sondé par des robots (72) : il répond **404**, rien n'est exposé |

**Lecture.**
- La politique « refuser l'entraînement, autoriser la recherche » est réelle et fonctionne : passages confirmés dans les journaux.
- **Écart** : Cloudflare range Claude-User (lecture à la demande d'une personne qui pose une question à Claude) parmi les « AI Crawler ». Il est donc bloqué, alors que ChatGPT-User et Perplexity-User passent. La simulation de l'audit l'avait vu passer : c'était faux. Seule la vérification par IP faite par Cloudflare compte.
- Proposition, sans l'appliquer : passer Claude-User et Google-CloudVertexBot (agents à la demande, pas de l'entraînement) sur « Allow ». Ça ne touche pas les robots d'entraînement, conformément à ta consigne.

## 4. Google Play Console (compte développeur « iQWine », **compte personnel**)

| Point | Constat |
|---|---|
| Appli | `ca.iqwine.app`, « iQWine – Sommelier personnel », en production depuis le 2026-09-20, **6 installations** au total ; fiche : 1 visiteur et 0 clic d'installation sur 28 jours |
| ⚠ Action requise | **« Déclarez votre statut de commerçant d'ici le 1er février 2027 »** : sinon les applis et le profil développeur sont retirés de Google Play. Seul le propriétaire du compte peut le faire |
| Fiche en ligne (publique) | FR : « Les disponibilités SAQ, succursale par succursale… » ; EN : titre « iQWine — Cellar & Sommelier », « SAQ » 3 fois. Dernière publication : 2026-10-03 |
| **Brouillon non publié** (statut « Modifications à l'état de brouillon ») | FR : « Les disponibilités des **points de vente** de vins, **succursale** par succursale, et l'historique des prix pour reconnaître **un bon prix** ». EN : titre corrigé « iQWine – Personal Sommelier », « price history, so you recognize **a good price** ». Le brouillon retire « SAQ » mais remplace par deux termes eux aussi interdits, et garde la promesse de bon prix |
| Coordonnées de la fiche | Site Web **`https://app.iqwine.ai`** ; courriel public `a***@iqwine.ca` (alias admin) |
| Politique de confidentialité (Contenu de l'appli) | **`https://app.iqwine.ai/confidentialite`** |
| Identité légale | Compte personnel au nom d'Eric Bigras. **Aucun changement proposé** (consigne d'Éric) ; une conversion en compte d'organisation reste une décision séparée |

## 5. App Store Connect (utilisateur « Admin iqwine », équipe Groupe Medtech inc.)

| Point | Constat |
|---|---|
| Version | iOS 1.2.1, « Prête pour la distribution » ; catégories Cuisine et boissons, Style de vie |
| Description FR | 3 « point(s) de vente » et 1 « succursale » : « Vous êtes dans un point de vente… », « Parmi les vins disponibles dans les points de vente pris en charge… lesquels sont en succursale près de vous », « Repérer, parmi les vins des points de vente pris en charge… » ; aussi « Photographier un plat pour obtenir un accord » (point d'entrée à vérifier, décision du 2026-10-12) |
| Description EN | « IN STORE… price history, so you recognize **a good price** when it comes along » ; 0 « SAQ » |
| Liens publics | Conditions, confidentialité, support et site sur `iqwine.ai` : conforme |
| Politique de confidentialité (Confidentialité de l'app) | **`https://app.iqwine.ai/confidentialite`** |
| Notes pour l'examen (privées, vues seulement par Apple) | mentionnent `app.iqwine.ai` (architecture WKWebView) : normal, non public |
| App Analytics | **« This app is currently unavailable for Analytics »** pour cet utilisateur : il manque le droit d'accès (rôle à accorder par le titulaire du compte) |

## 6. Ce qui reste non vérifié

- **Bing Webmaster Tools** : pas configuré.
- **Sources d'acquisition App Store** : accès Analytics refusé à l'utilisateur.
- **Statistiques d'acquisition Play** au-delà de l'aperçu sur 28 jours.

## 7. Gestes effectués sur autorisation d'Éric (2026-11-06, soir)

| Console | Geste | Résultat vérifié |
|---|---|---|
| Vercel | `iqwine-web.vercel.app` passé de « Production » à **redirection 308 vers `iqwine.ai`** | `curl https://iqwine-web.vercel.app/fr/tarifs` → 308 vers `https://iqwine.ai/fr/tarifs` ; `iqwine.ai` répond 200 ; les préversions (URL de déploiement) restent inchangées, toujours derrière l'authentification Vercel |
| Google Play | Brouillon de la fiche **corrigé et enregistré, non publié** : FR « … disponibilité en magasin, magasin par magasin, partout au Québec, et leur prix affiché » ; EN « … in-store availability, store by store, across Québec, and their listed price ». Titre EN « iQWine – Personal Sommelier » conservé | Console : « Vos modifications ont été enregistrées » ; plus aucun « SAQ », « succursale », « point de vente » ni « bon prix » dans le brouillon FR/EN |
| Google Play | Coordonnées (site web, courriel) : **non modifiées**. Le formulaire n'offre que « Enregistrer et publier », ce qui publierait immédiatement | En attente du GO de publication |
| Google Play | URL de confidentialité (Contenu de l'appli) : **non modifiée**. L'enregistrement s'applique à l'appli publiée | En attente du GO |
| App Store Connect | URL de confidentialité : **non modifiable** depuis cette page avec cet utilisateur, aucun contrôle d'édition alors que la bannière dit les autres changements « immédiatement disponibles » | À faire avec la prochaine version iOS, en même temps que les descriptions (texte prêt dans `FICHES-BOUTIQUES-CORRECTIONS.md`) |
| Cloudflare | Claude-User : **non modifié**. Son blocage vient de la politique « Training : Disallow » (Cloudflare le classe « AI Crawler »). L'interrupteur par robot ne peut pas le lever, et le menu n'offre aucune exception | Le débloquer exigerait de toucher la politique d'entraînement, ce qu'Éric a exclu pour ce lot |

### Google-CloudVertexBot : laissé bloqué

Selon la documentation de Google (liste des robots courants de Google ; Agent Search de Vertex AI), il n'explore un site **qu'à la demande de son propriétaire**, pour construire un agent Vertex AI sur ce contenu, et ne sert ni à Google Search ni aux autres produits. Il n'apporte rien à notre visibilité ; le bloquer n'a aucun effet sur la recherche.

### Statut de commerçant (Google Play) : accompagnement, rien de soumis

- **Où** : Play Console > Gérer le compte > Détails du compte > « À propos de vous » > Statut de commerçant. Pour l'instant : « Action requise », date limite 2027-02-01.
- **Qui** : seul le **propriétaire du compte** peut déclarer, c'est-à-dire le compte Google `admin@iqwine.ca`. La session utilisée aujourd'hui (Eric Bigras, gmail) voit le bouton grisé.
- **Ce que demande Google** (aide Play Console, réponse 17594752) :
  - déclarer si l'on est commerçant (EEE et Royaume-Uni) ;
  - pour un commerçant, une autocertification de conformité aux lois locales ;
  - pour un **compte personnel**, un **téléphone** de contact affiché publiquement, et l'**adresse** aussi affichée publiquement ;
  - à partir du 2027-03-01, les coordonnées, le D-U-N-S et le lien vers les conditions de l'appli deviennent visibles.
- **Enjeu** : le compte est personnel. L'adresse légale enregistrée est une adresse personnelle, et elle deviendrait publique. Une déclaration fausse (« non-commerçant » pour éviter l'affichage) expose à la suspension du compte.
- **Décision d'Éric, avant la déclaration** :
  - soit déclarer sur le compte personnel, en acceptant l'affichage de l'adresse et d'un téléphone ;
  - soit passer d'abord à un **compte d'organisation** (Groupe Medtech inc., D-U-N-S requis), pour afficher les coordonnées de l'entreprise.

## 8. Publication du 2026-11-06 (GO d'Éric)

- **Site** : `production` = `main` = `5efdbba` (fusion de `visibilite/lot-a-publier` et de la correction de l'en-tête mobile). Déploiement Vercel de production : succès.
- **Vérifié en production** :
  - routage 210/210 contre `https://iqwine.ai` ;
  - les 38 URL du sitemap répondent 200 ;
  - canonical et x-default conformes ;
  - `/tarifs`, `/sommelier-ia` → 308 vers le français, `/pricing` → 308 vers `/en/pricing`, sans `Vary` ni cookie ;
  - `/` → 307 `private, no-store` avec `Vary: Cookie, Accept-Language` ;
  - aucun « 12 conseils », « point de vente » ni « succursale » ; « SAQ » seulement au §7 légal ;
  - en-tête mobile sans chevauchement de 320 à 768 px, en FR et en EN.
- **Search Console** : indexation demandée pour `/fr/sommelier-ia`, `/fr/tarifs`, `/fr/cellier-intelligent`, `/fr/apogee` (4 confirmations « Indexation demandée »). La canonique choisie par Google reste « Page en double » **tant que Google n'a pas réexploré** : à confirmer dans 2 à 6 semaines.
- **Google Play** : 5 modifications **en cours d'examen** (fiche FR, nom, description courte et description EN, politique `https://iqwine.ai/fr/confidentialite`). Coordonnées publiées : `support@iqwine.ca`, `https://iqwine.ai`. Déclaration IA : icône et image de présentation étiquetées, sur indication d'Éric. Aucune autre modification en attente.
- **Non fait** : Bing (prochaine étape), captures (compte de démonstration), Claude-User (exception ciblée à étudier), statut de commerçant (décision d'Éric).

## 9. Bing, Play et statut de commerçant (GO d'Éric, 2026-11-06 au soir)

- **Bing** : `public/BingSiteAuth.xml` (jeton identique à celui de la propriété `https://iqwine.ai/` dans Bing) publié par `518157b`, `production` = `main`. Chaîne locale verte avant publication (typecheck, lint, build). Le fichier répond 200 en `application/xml`. Vérification par fichier XML : **réussie**, le tableau de bord est accessible. Sitemap `https://iqwine.ai/sitemap.xml` **resoumis** le 2026-11-07 UTC, statut « Processing » ; Bing comptait 22 URL depuis le 2026-08-02, le sitemap actuel en contient 38.
- **Google Play, fiche publique** :
  - **Soumis** : 5 modifications le 2026-11-06.
  - **Approuvé** : la console affiche « Dernière publication le 6 novembre 2026 » et plus aucune modification en attente.
  - **Visible** : titres « iQWine – Sommelier personnel » et « Personal Sommelier », nouveaux paragraphes « magasin par magasin » et « store by store », politique `https://iqwine.ai/fr/confidentialite`.
  - **Pas encore visible** : site Web (`https://app.iqwine.ai`) et courriel (`admin@iqwine.ca`) de la fiche, alors que la console indique `https://iqwine.ai` et `support@iqwine.ca`. À revérifier ; rien n'a été resoumis.
- **Statut de commerçant** : l'aide Google (answer/17594752) distingue « professionnel » et « non-professionnel », un choix différent du type de compte (personnel ou organisation). Le compte Play est **personnel**. S'il est déclaré professionnel, le **téléphone et l'adresse** du titulaire deviennent publics à partir du 2027-03-01. La déclaration est réservée au propriétaire du compte. Arbitrage d'Éric requis.
- **Captures** : non faites. L'extension Chrome n'a pas la permission sur `app.iqwine.ai`, et la connexion au compte démo de production se fait par mot de passe : Éric doit l'ouvrir lui-même.
