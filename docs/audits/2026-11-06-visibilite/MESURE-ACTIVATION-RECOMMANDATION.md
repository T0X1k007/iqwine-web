# Mesure : définition d'activation et démarches avant activation

Préparé le 2026-11-06. **Toute nouvelle collecte reste désactivée.**
- Site : le code de mesure et d'attribution est **intégré à `main` et publié** depuis le 2026-11-07 (`b03372b`), interrupteurs éteints. Variables absentes : aucune balise, aucune origine ajoutée à la CSP, aucun stockage, liens d'inscription et de boutique inchangés (vérifié en production). Intégrer le code n'a rien allumé : l'activation reste une décision séparée, aux prérequis du §3.
- App, branche `dev/attribution-acquisition` : poussée, non fusionnée, non déployée.

## 0. DÉCISION D'ÉRIC (2026-11-06) : définition de référence

> **Activation** = premier conseil personnalisé d'Octave **effectivement livré** dans les 7 jours suivant l'inscription. Sont exclus : démos, erreurs, réponses interrompues, comptes internes, comptes de test et **les comptes personnels d'Éric**.
> Une explication d'étiquette compte **seulement** si elle contient un véritable conseil personnalisé selon le palais. Un scan d'identification ne compte jamais.

Les anciens indicateurs restent, sous des noms distincts :
- « Engagement sommelier : au moins une recommandation affichée » (runbook §5) ;
- « Entonnoir cave (P21B) ».

La collecte nouvelle reste éteinte.

## 1. Définition d'activation recommandée (proposition, adoptée ci-dessus)

> **Activé** = au moins **un conseil personnalisé d'Octave livré**, c'est-à-dire une `OctaveInteraction` à l'état `CONFIRMEE`, **dans les 7 jours** suivant l'inscription.

Exclusions :
- conseils non livrés : erreurs, flux interrompus, réponses vides (ils finissent à l'état `RENDUE`) ;
- démonstrations (`demoApple`) ;
- comptes de test et internes : adresses `@iqwine.*`, administrateur, Bouclier QA ou INTERNAL_TEAM ;
- comptes supprimés.

Elle est déjà calculée, à côté des autres, dans `scripts/lecture/attribution-acquisition.sql` (branche app).

**Écarts avec ce qui existe, à remplacer seulement sur ton accord :**

| Définition existante | Où | Différence |
|---|---|---|
| « ≥ 1 accord » : au moins un `recommendations_shown` | `docs/runbook-operations.md` §5, tableau `/admin/sommelier-analytics` | Événement émis par le navigateur (une recommandation **affichée**, pas forcément livrée en entier) ; limitée à l'accord du sommelier ; **sans délai** ; **sans exclusion** des comptes de test |
| Entonnoir P21B : `signup_started → session_minted → first_bottle → revelation_seen` | Axiom (`lib/analytics/product-events.ts`) | Mesure l'entrée en **cave**, pas le conseil ; impossible à joindre à la base (pas de jointure par source) |

**Recommandation** : adopter la définition « conseil livré à 7 jours » comme indicateur d'activation, et garder les deux autres comme indicateurs secondaires (engagement du sommelier, avancée dans la cave), renommés pour éviter la confusion. Les comptes personnels d'Éric doivent recevoir l'exception INTERNAL_TEAM : sans elle, ils sont comptés.

## 2. Une étiquette expliquée compte-t-elle ?

**Recommandation : oui**, si elle est livrée (`CONFIRMEE`) et personnalisée par le palais de la personne. Elle passe par le même compteur d'Octave que les autres conseils, et c'est un moment où Octave répond à la question d'une personne sur un vin précis.

**Non**, en revanche, pour un simple scan d'identification qui remplit une fiche sans avis d'Octave. Ce n'est pas un conseil.

À vérifier avant de figer : que le geste `etiquette-expliquee` intègre bien le palais dans `v0.163.0`. S'il est générique, le compter à part.

## 3. Démarches avant d'allumer quoi que ce soit

1. **Choix de l'outil** : Cloudflare Web Analytics (gratuit, sans témoin ni empreinte, 6 mois d'historique). Il est déjà présent dans le compte, mais il ne mesure aujourd'hui que le staging.
2. **Évaluation des facteurs relatifs à la vie privée** (Loi 25, art. 17) : des données techniques de visite sortent du Québec (Cloudflare, et l'hébergement Vercel déjà en place). À rédiger avant l'activation.
3. **Politique de confidentialité, dans l'app** (le site la synchronise depuis l'app), avec une nouvelle `LEGAL_VERSION` si le texte change :
   - mesure d'audience agrégée des visiteurs du site ;
   - source d'arrivée conservée avec le compte (déjà vrai pour l'inscription par courriel depuis juillet, à étendre à Google et Apple) ;
   - `sessionStorage` du site et témoin OAuth de 30 min de l'app ;
   - finalité, durée de conservation, et Cloudflare dans les prestataires hors Québec.
4. **Configuration, le jour de l'activation** :
   - Cloudflare, Worker `iqwine-web` : `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN` en variable de build et dans les `vars` du Worker, puis publication (`main` vers `production`). Détail : `docs/mesure-attribution.md` §4 ;
   - Cloudflare Web Analytics : site `iqwine.ai` en installation manuelle, ou injection automatique désactivée pour ce nom d'hôte, afin d'éviter un double comptage ;
   - optionnel : `NEXT_PUBLIC_CAMPAGNES_BOUTIQUES=1` et `NEXT_PUBLIC_APP_STORE_PT` (jeton de campagne App Store Connect).
5. **Interrupteur de la source d'arrivée** : fait (`875d3b3`, intégré à `main` par `b03372b`). `NEXT_PUBLIC_ATTRIBUTION_ARRIVEE=1` le monte ; absent, rien n'est gardé ni réécrit.
6. **App** : passer la branche `dev/attribution-acquisition` par son processus normal (Release Gate, staging, GO prod), après la mise à jour de la Politique.

## 4. Coût (Vercel : non vérifié en console pour les taxes)

- Cloudflare Web Analytics : 0 $.
- Vercel : le site tourne sur Hobby, que les règles d'usage de Vercel réservent à un usage non commercial. **Pro coûte 20 $ US par mois** (1 siège déployeur et 20 $ US de crédit d'usage inclus ; chaque siège déployeur de plus à 20 $ US par mois ; sièges lecteurs gratuits) ; source : [vercel.com/pricing](https://vercel.com/pricing), [docs Pro](https://vercel.com/docs/plans/pro-plan), consultés le 2026-11-06. **Aucun changement de forfait sans ton accord.**

Vercel Pro, précisions : 20 $ US par mois de base (1 siège déployeur, 20 $ US de crédit d'usage), facturé en dollars US. Les taxes applicables (TPS/TVQ) ne sont pas affichées dans la documentation consultée : à confirmer à l'écran de paiement, sans s'engager. Contrôle des dépenses : « Spend Management » sur Pro (notification, webhook ou mise en pause des projets à un seuil). Aucun changement de forfait sans l'accord d'Éric.

## 5. Brouillons prêts pour l'allumage (2026-11-07) : **non validés**

Rien ci-dessous n'est une validation juridique. Ce sont des brouillons pour la personne responsable de la protection des renseignements personnels, à relire avant toute activation.

### 5.1 Évaluation des facteurs relatifs à la vie privée (Loi 25, art. 17) : trame

| Rubrique | Contenu proposé |
|---|---|
| Finalité | Compter les visites agrégées du site vitrine et savoir quelle source amène une inscription |
| Données | Page vue, référent, pays, type d'appareil (Cloudflare Web Analytics, sans témoin ni empreinte) ; source d'arrivée (`utm_source` ou domaine du référent) gardée dans l'onglet (`sessionStorage`), puis transmise à l'inscription |
| Personnes visées | Visiteurs du site ; la source n'est liée à une personne qu'à la création d'un compte |
| Lieu | Cloudflare (États-Unis et réseau mondial), Vercel ou Cloudflare pour l'hébergement |
| Protection équivalente | À évaluer : contrat de traitement Cloudflare (DPA), clauses types, absence d'identifiant persistant côté site |
| Conservation | Web Analytics : 6 mois (fixé par Cloudflare) ; source au compte : durée de vie du compte |
| Conclusion | À rédiger par le responsable, après lecture du DPA |

### 5.2 Politique de confidentialité : ajouts proposés (dépôt de l'app, nouvelle `LEGAL_VERSION`)

> **Mesure d'audience du site iqwine.ai.** Nous comptons les visites de notre site de façon agrégée avec Cloudflare Web Analytics, qui n'utilise ni témoin ni identifiant persistant. Nous voyons, par exemple, combien de personnes ont consulté une page, sans pouvoir savoir qui elles sont.
>
> **Provenance de l'inscription.** Si vous arrivez sur notre site depuis un lien de campagne ou un autre site, nous gardons cette provenance dans l'onglet de votre navigateur, le temps de votre visite. Si vous créez un compte, elle est enregistrée avec lui, pour savoir quels canaux nous font connaître. Elle n'est pas utilisée pour vous profiler ni pour de la publicité ciblée.
>
> **Prestataire hors Québec.** Cloudflare, Inc. (États-Unis) fournit la mesure d'audience.

### 5.3 Ordre d'allumage (inchangé)

EFVP signée, Politique publiée dans l'app, puis les interrupteurs. Rien n'est allumé.

## 6. Écart constaté et corrigé (2026-11-07)

- **Constat** : Cloudflare Web Analytics était en installation automatique sur toute la zone `iqwine.ai` depuis le 2026-07-05 (site `iqwine.ai`, jeton `e492d9…`). La balise était injectée dans les pages servies aux navigateurs sur `iqwine.ai`, `www.`, `app.` et `mos.`. L'affirmation du §3.1 (« ne mesure aujourd'hui que le staging ») était fausse, et la décision « collecte éteinte » n'était pas appliquée.
- **Correction** : mesure du site désactivée (`enabled: false`) le 2026-11-07 vers 14:50 UTC. Vérifié ensuite, avec un agent de navigateur : aucune balise `cloudflareinsights` (ni Google, ni Vercel) sur `iqwine.ai`, `app.`, `mos.` et `staging.`.
- **Non touché** : journaux de sécurité (Security Events, AI Crawl Control) et journaux techniques du Worker (Workers Logs).
- **Données déjà recueillies** : elles restent dans Cloudflare jusqu'à leur expiration (6 mois). Rien n'a été effacé.


## 7. Code intégré, collecte toujours éteinte (2026-11-07)

- `visibilite/mesure` fusionnée dans `main` (`b03372b`), publiée en production, puis supprimée (locale et GitHub).
- Les ajouts CSP passent par `lib/regles-de-bord` (export Cloudflare et Worker). L'interrupteur d'attribution est une constante au build : éteint, son code n'est même pas dans le bundle.
- Preuve en production, navigateur sans tête, arrivée avec `utm_source` et référent Google, sur 4 pages : aucune requête de mesure (Cloudflare, Google, Vercel) ; seuls hôtes tiers, ceux de Turnstile sur la page contact ; aucun témoin, `sessionStorage` et `localStorage` vides ; lien d'inscription au repli `utm_source=marketing` ; CSP sans origine de mesure ; routage 210/210.
- Restent dans le bundle, préexistants et inertes : le module Google Analytics de `@next/third-parties` (monté seulement si `NEXT_PUBLIC_GA_ID`, absent) et le témoin de langue, posé seulement au clic du sélecteur de langue.
- Application : aucune dépendance. Éteint, le site envoie exactement les mêmes paramètres qu'avant ; la branche `dev/attribution-acquisition` de l'app (OAuth Google et Apple, lecture SQL) reste non fusionnée et ne sert qu'à l'allumage.

**Clôture du ménage (2026-11-07).** Dépôt réduit à `main` et `production`, en local comme sur GitHub, et un seul dossier de travail (`~/Projects/iQWine_Web`). Branches distantes retirées après vérification (aucun commit ni correctif absent de `main`, aucune PR ouverte) : `visibilite/mesure`, `visibilite/lot-a-publier`, `hebergement/cloudflare`, `feat/marketing-v4`, `feat/mvp-conversion-pr1-3`, `premium-2026`. Branche `dev/attribution-acquisition` de l'app non touchée. Collecte toujours éteinte. Chantier terminé.
