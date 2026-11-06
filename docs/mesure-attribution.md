# Mesure d'audience et attribution : préparation (2026-11-06)

Suite de l'audit de visibilité du 2026-11-06 (annexe 6, constats M-01 à M-08 et M-13). **Rien n'est allumé** : chaque élément ci-dessous attend un geste d'Éric. Ce document sert à l'arbitrage, il ne décide rien.

## 1. Comparatif des trois outils

Faits relevés le 2026-11-06 : console Vercel et Cloudflare (par DATA), documentation officielle (sources en bas).

| | Vercel Web Analytics (Hobby) | Cloudflare Web Analytics | GA4 (déjà câblé, éteint) |
|---|---|---|---|
| Coût réel | 0 $. 50 000 événements/mois inclus, **collecte suspendue au-delà** (jamais facturée). Ordre de grandeur : 549 visiteurs/jour × 2 pages ≈ 33 000 pages vues/mois, donc près du plafond. | 0 $. Pas de plafond publié ; échantillonnage à la lecture sur les gros volumes. | 0 $ (offre standard). Coût caché : bandeau de consentement à construire et entretenir. |
| Compatibilité CSP | Même origine (`/_vercel/insights`) : **CSP inchangée**. | Ajouter `https://static.cloudflareinsights.com/beacon.min.js` à `script-src` et `https://cloudflareinsights.com` à `connect-src` (installation manuelle). Préparé ici, conditionnel. | Ajouter `www.googletagmanager.com` et `*.google-analytics.com` (plusieurs directives). Non préparé. |
| Données collectées | Horodatage, chemin, référent, paramètres de requête filtrés, géolocalisation (pays, région, ville), OS, navigateur, type d'appareil. Visiteur reconnu par une **empreinte calculée sur la requête**, effacée après 24 h. Pas de témoin. | Chemin **sans chaîne de requête**, référent, navigateur, OS, appareil, pays, mesures de performance (Core Web Vitals). Aucun témoin ni stockage local ; Cloudflare dit ne pas faire d'empreinte. | Témoin `_ga` (identifiant client, jusqu'à 2 ans), adresse IP traitée, événements, UTM, parcours complet. |
| Acquisition | Référents (domaine) ; **pas d'UTM sur Hobby**. | Référents (domaine) ; **pas d'UTM**. | Complet : UTM, canaux, référents. |
| Conversion (événements) | **Non sur Hobby** (événements personnalisés réservés à Pro). | **Non** (« Not yet »). | Oui. |
| Historique | **1 mois**. | **6 mois** (7 jours non échantillonnés). | 2 à 14 mois selon réglage. |
| Entretien | Activer dans la console + une balise. Risque : les règles d'usage de Vercel réservent Hobby à un usage personnel non commercial, et citent « annoncer un produit ou un service » comme usage commercial ; Vercel peut suspendre un compte pour ce motif. Le site entier y est déjà exposé ; y ajouter la mesure aggrave ce point. | Un jeton (non secret) dans une variable ; désactiver l'injection automatique pour `iqwine.ai`. | Consentement, CSP, mise à jour de la Politique, avis juridique recommandé. |

**Recommandation : Cloudflare Web Analytics**, dans le forfait gratuit déjà utilisé pour la zone. Raisons : aucune collecte suspendue en cours de mois, six mois d'historique au lieu d'un, aucune empreinte de visiteur (Vercel en calcule une), pas de chaîne de requête journalisée, et pas d'appui supplémentaire sur un forfait Hobby que ses conditions réservent au non-commercial. Le prix à payer est un ajustement de CSP, préparé derrière le même interrupteur.

Aucun des deux outils gratuits ne mesure les UTM ni les conversions. Ce manque est compensé ailleurs, sans outil tiers : la source part dans le lien d'inscription (section 3) et l'app la garde dans le compte, où une requête de lecture agrégée la relie à l'activation et au paiement (dépôt `cellier-vin`).

`src/lib/analytics.ts` n'est **pas** branché : Cloudflare ne reçoit pas d'événements personnalisés.

## 2. Loi 25 : lecture factuelle (pas un avis juridique)

Texte : *Loi sur la protection des renseignements personnels dans le secteur privé* (RLRQ c. P-39.1), telle que modifiée par la Loi 25.

| Question | Cloudflare WA | Vercel WA | GA4 |
|---|---|---|---|
| Renseignement personnel (art. 2 : permet d'identifier directement ou indirectement) ? | L'adresse IP transite par Cloudflare **de toute façon** (la zone est déjà mandataire inverse) ; la balise ajoute chemin, référent, navigateur, performance, sans identifiant. Risque faible mais l'IP reste un renseignement potentiellement identifiant. | Empreinte dérivée de la requête (donc de l'IP), gardée 24 h : identifiant technique indirect. | Identifiant persistant + IP : oui. |
| Technologie qui permet d'identifier, de localiser ou de profiler (art. 8.1) ? | Non selon le fournisseur (pas d'empreinte, pas de témoin). Pays déduit de l'IP. | Reconnaissance du visiteur sur 24 h, géolocalisation à la ville. À qualifier. | Oui : information préalable et fonctions désactivées par défaut (art. 9.1), donc consentement. |
| Communication hors Québec (art. 17) ? | Oui (Cloudflare, États-Unis et réseau mondial). | Oui (Vercel, États-Unis). | Oui (Google, États-Unis). |
| Politique publiée (art. 8.2) le mentionne ? | **Non** | **Non** | **Non** |

La Politique servie (`src/lib/legal-terms.generated.json`, synchronisée depuis l'app, version du 2026-09-25) ne parle que des **comptes** : renseignements à l'inscription, à l'usage, communication à des prestataires « hébergement et base de données, courriel transactionnel, paiement, IA, observabilité ». Elle ne dit **rien** des visiteurs du site, d'une mesure d'audience, de témoins ou de stockage local, ni de la source d'acquisition gardée avec le compte (déjà le cas pour l'inscription par courriel depuis le 2026-07-31).

### Ajouts à faire à la Politique (côté app, source canonique, puis `legal:synchroniser`)

1. **Section 2, visiteurs du site** : mesure d'audience agrégée de iqwine.ai (pages vues, page d'origine, type d'appareil et de navigateur, pays), sans témoin ni identifiant, par Cloudflare Web Analytics.
2. **Section 2, source d'acquisition** : la campagne ou le domaine d'où vient le visiteur (jamais le chemin ni la requête) est gardé dans l'onglet (`sessionStorage`), transmis à l'inscription et conservé avec le compte, y compris pour Google et Apple (témoin technique de 30 minutes au plus, supprimé après usage, côté app).
3. **Section 3, finalités** : « mesurer la fréquentation du site et l'efficacité de nos canaux d'acquisition, sous forme agrégée ».
4. **Section 5, conservation** : durée de la mesure d'audience chez le prestataire (6 mois pour Cloudflare) et de la source d'acquisition (durée de vie du compte).
5. **Section 6, prestataires hors Québec** : ajouter « mesure d'audience (Cloudflare, États-Unis) ». L'évaluation des facteurs relatifs à la vie privée exigée par l'art. 17 est à documenter avant l'allumage.
6. Si GA4 est un jour retenu : section dédiée aux témoins, consentement préalable, et avis juridique.

## 3. Source d'acquisition jusqu'à l'inscription

- À l'atterrissage, `AttributionArrivee` lit l'UTM d'arrivée (`utm_source`, `utm_medium`, `utm_campaign`, 64 caractères `[A-Za-z0-9._+-]`, comme `parseSignupEntry` de l'app) ou, à défaut, le **domaine** du référent (`hostname` sans `www.`, jamais le chemin ni la requête), et le garde dans `sessionStorage`.
- **Pourquoi pas un témoin** : la valeur ne sert qu'au clic, dans le navigateur, puis part dans le lien. `sessionStorage` n'est jamais envoyé au serveur et disparaît à la fermeture de l'onglet.
- Un UTM explicite remplace ce qui était gardé ; un référent ne fait que combler un vide.
- Au clic (phase de capture, y compris clic du milieu et menu contextuel), le lien d'essai reçoit cette source à la place de `utm_source=marketing`. `src` (emplacement du CTA), `plan`, `period` et `lang` ne changent pas. Sans source connue, le repli `marketing / cta / trial` est intact.
- Ce comportement **n'est pas** derrière l'interrupteur : il ne collecte rien de nouveau côté site et alimente un champ que l'app garde déjà. Il s'active donc au déploiement de cette branche, d'où l'ajout 2 à la Politique.

### Boutiques (interrupteur `NEXT_PUBLIC_CAMPAGNES_BOUTIQUES=1`)

- **App Store** : `pt=<jeton fournisseur>&ct=site-<emplacement>` (30 caractères au plus). Le jeton fournisseur se génère dans App Store Connect à la création du premier lien de campagne ; sans lui, rien n'est ajouté. Données visibles après 24 h et à partir de 5 unités.
- **Google Play** : `referrer=utm_source%3Diqwine.ai%26utm_medium%3Dsite%26utm_campaign%3D<emplacement>`. Compté dans Play Console, rapports d'acquisition, canal « Tracked channels (UTM) », seulement pour les visites faites dans l'appli Play Store (pas `play.google.com` sur ordinateur).
- Les données structurées et `llms.txt` gardent les URL canoniques.

## 4. Allumage, le jour venu (gestes d'Éric)

1. Mettre à jour la Politique (section 2) et documenter l'évaluation de l'art. 17.
2. Cloudflare, Web Analytics : ajouter le site `iqwine.ai` en **installation manuelle** (ou désactiver l'injection automatique pour ce nom d'hôte) et copier le jeton du site.
3. Vercel, projet `iqwine-web`, variables d'environnement **Production** : `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN=<jeton>`. Si les campagnes de boutique sont voulues : `NEXT_PUBLIC_CAMPAGNES_BOUTIQUES=1` et `NEXT_PUBLIC_APP_STORE_PT=<jeton fournisseur>` (App Store Connect, Analytics > Campaigns). Ces variables sont lues **au build** : redéployer.
4. Vérifier en ligne : en-tête CSP avec les deux origines Cloudflare, balise présente, aucune erreur CSP dans la console, une visite visible dans Cloudflare sous 24 h.

Éteindre : retirer la variable et redéployer. La CSP revient à l'identique.

## 5. Vérifier en local

```
corepack pnpm typecheck && corepack pnpm lint && corepack pnpm test:attribution && corepack pnpm build
timeout 400 corepack pnpm start &      # puis verifier:routage, curl de l'en-tête CSP
```

Interrupteur éteint : l'en-tête CSP est identique à celui de la production, aucun script tiers dans le HTML.

## Sources (consultées le 2026-11-06)

- Cloudflare Web Analytics, FAQ (CSP, conservation, requêtes, UTM, événements) : https://developers.cloudflare.com/web-analytics/faq/
- Cloudflare Web Analytics, page produit (témoins, empreinte, gratuité) : https://www.cloudflare.com/web-analytics/
- Vercel Web Analytics, limites et prix (maj 2026-08-25) : https://vercel.com/docs/analytics/limits-and-pricing
- Vercel Web Analytics, confidentialité (données, empreinte 24 h) : https://vercel.com/docs/analytics/privacy-policy
- Vercel, Fair Use Guidelines (Hobby non commercial) : https://vercel.com/docs/limits/fair-use-guidelines
- Apple, Campaign links : https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links/
- Google Play, Install Referrer : https://developer.android.com/google/play/installreferrer/library
- Play Console, acquisition et canaux : https://support.google.com/googleplay/android-developer/answer/6263332
