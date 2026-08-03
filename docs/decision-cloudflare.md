# Cloudflare — ce qui a été mesuré, et pourquoi on n'a pas migré

> **Décision d'Eric, 2026-08-03, en fin de journée** : le site marketing reste
> hébergé chez **Vercel**. Cloudflare passe **devant**, en proxy, pour le WAF,
> le cache et l'analytique. Aucun changement d'hébergeur.
>
> Cette décision annule celle du matin (« option (b) — Cloudflare remplace
> Vercel »). Ce document existe pour qu'on ne refasse pas le chemin.

## Le fait qui a tout tranché

**Le plan Workers gratuit coupe une requête à 10 millisecondes de temps
processeur.** Un rendu serveur Next en consomme couramment vingt à cent.

Ce n'est pas un réglage : c'est un plafond. Le seul moyen de le lever est le
plan payant, à 5 USD par mois **au niveau du compte entier**.

### Ce que ça donnait, mesuré sur un vrai Worker déployé

```
  actif statique (binding ASSETS) ..... 200 en 0,07 s
  robots.txt (prérendu) ............... 200
  toute route qui EXÉCUTE du code ..... aucune réponse, délai de 25 s
  le MÊME code, runtime workerd LOCAL . 200 partout
```

La dégradation était progressive, et c'est ce qui rend le piège vicieux : les
135 contrôles de routage sont **passés** dix minutes après le déploiement, puis
tout s'est éteint. Cloudflare tolère un dépassement occasionnel ; il cesse de le
faire quand il devient systématique.

**Une validation trop courte aurait conclu que ça marchait.**

## Ce que j'avais mesuré avant, et qui répondait à la mauvaise question

| Mesure | Verdict |
| ------ | ------- |
| Taille du Worker compressé | **2 436 KiB sur 3 072** — 21 % de marge, ça tenait |
| Taille du plus gros actif | 5,17 Mio sur 25 permis — ça tenait |
| Nombre de fichiers | 119 sur 20 000 — ça tenait |
| **Temps processeur** | **10 ms — ça ne tenait pas** |

La taille était la contrainte évidente, celle qu'on pense à vérifier. Le temps
processeur était la vraie, et elle ne se voit qu'en exécutant. Je ne l'ai
découverte qu'en déployant — après avoir annoncé « on atterrit sur le plan
gratuit », ce qui était vrai et hors sujet.

## L'arbitrage, tel qu'il se pose

```
CE QUE « TOUT CHEZ CLOUDFLARE » APPORTERAIT
  un fournisseur de moins — une facture, un tableau de bord
  cohérence avec les 3 autres sites déjà sur Cloudflare Pages
  moins de dépendance envers Vercel, qui édite Next

CE QUE ÇA COÛTERAIT
  5 USD/mois
  un adaptateur (OpenNext) entre Next et Cloudflare : une couche de plus,
  qui suit les versions de Next avec un décalage — on est sur Next 16,
  récent. Symptôme vécu : marche en local, tombe une fois déployé.

CE QUE « CLOUDFLARE DEVANT VERCEL » DONNE DÉJÀ
  WAF, protection DDoS, plafonnement de débit
  règles de cache au bord
  analytique et journaux
  la même posture de sécurité que app.iqwine.ai
  coût zéro · une heure · réversible en décochant le nuage orange
```

À 549 visiteurs quotidiens, le site n'approche aucune limite de Vercel. La
quasi-totalité du bénéfice attendu s'obtient **sans déménager**.

## Ce que la journée a livré, et qui ne dépendait pas de Cloudflare

Tout ceci est **en production sur Vercel**, vérifié en ligne :

- les slugs anglais (`/en/pricing`, `/en/our-story`, …) et neuf redirections
  permanentes depuis les anciennes adresses, en un saut ;
- `x-default` qui déclarait une négociation de langue **qui n'avait pas lieu** ;
- `og:url`, **absent de toutes les pages** — Next ne le déduit pas du canonical ;
- 7 800 Ko d'images devenus **304 Ko** en AVIF, sans différence perceptible ;
- trois adresses de l'ancien domaine oubliées dans le code ;
- le vérificateur de routage passé de 62 à **135 contrôles**.

L'empaquetage Workers, lui, a été retiré : adaptateur, `wrangler.jsonc`,
`open-next.config.ts`, garde de taille. Le reste — `sharp`, la génération
d'images, `unoptimized: true` — **reste**, parce qu'il vaut indépendamment de
l'hébergeur.

## Si la question se rouvre un jour

Les deux conditions qui la rendraient raisonnable :

1. **le trafic ou la facture Vercel deviennent significatifs** — le plan payant
   Cloudflare à 5 USD serait alors une économie, pas une dépense ;
2. **le site redevient purement statique** — plus de middleware de négociation
   de langue, plus de routes serveur. Cloudflare Pages le sert alors
   gratuitement, comme il sert déjà `iqforge-web-learn`, migré depuis Vercel le
   2026-07-01 en export statique.

Aujourd'hui, ni l'une ni l'autre.
