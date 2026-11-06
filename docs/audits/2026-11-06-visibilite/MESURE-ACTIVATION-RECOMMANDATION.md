# Mesure : définition d'activation et démarches avant activation

Préparé le 2026-11-06. **Toute nouvelle collecte reste désactivée.**
- Site, branche `visibilite/mesure` : l'interrupteur `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN` est absent, rien n'est chargé et la CSP est inchangée.
- App, branche `dev/attribution-acquisition` : poussée, non fusionnée, non déployée.

## 1. Définition d'activation recommandée

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
   - Vercel : `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN` en Production, puis redéploiement ;
   - Cloudflare Web Analytics : site `iqwine.ai` en installation manuelle, ou injection automatique désactivée pour ce nom d'hôte, afin d'éviter un double comptage ;
   - optionnel : `NEXT_PUBLIC_CAMPAGNES_BOUTIQUES=1` et `NEXT_PUBLIC_APP_STORE_PT` (jeton de campagne App Store Connect).
5. **Correctif à faire avant d'allumer** : sur la branche `visibilite/mesure`, la transmission de la source vers l'inscription n'a **pas** d'interrupteur. Il faut lui en ajouter un avant toute fusion.
6. **App** : passer la branche `dev/attribution-acquisition` par son processus normal (Release Gate, staging, GO prod), après la mise à jour de la Politique.

## 4. Coût

- Cloudflare Web Analytics : 0 $.
- Vercel : le site tourne sur Hobby, que les règles d'usage de Vercel réservent à un usage non commercial. **Pro coûte 20 $ US par mois** (1 siège déployeur et 20 $ US de crédit d'usage inclus ; chaque siège déployeur de plus à 20 $ US par mois ; sièges lecteurs gratuits) ; source : [vercel.com/pricing](https://vercel.com/pricing), [docs Pro](https://vercel.com/docs/plans/pro-plan), consultés le 2026-11-06. **Aucun changement de forfait sans ton accord.**
