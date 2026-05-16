# Baseline pré-Phase 1 Premium — 12 mai 2026

> Document de sécurité Phase 0. Permet un rollback complet à l'état du
> 2026-05-12 avant toute refonte premium. Aucune modification fonctionnelle
> n'a été apportée pour générer ce baseline.

## Référence rapide rollback

```bash
# Rollback total iQWine_Web (site marketing)
cd /Users/eric/Projects/iQWine_Web
git checkout v1.0-snapshot-pre-premium-2026-05-12

# Rollback total cellier-vin (app)
cd /Users/eric/Projects/cellier-vin
git checkout v1.0-snapshot-pre-premium-2026-05-12

# Restauration DB cellier (Postgres)
docker exec -i cellier-pg pg_restore -U cellier -d cellier -c \
  < ~/Backups/iqwine-premium-rollback/cellier-pre-premium-2026-05-12.dump
```

---

## Tags git créés

| Repo | Tag | Hash commit | Remote |
|---|---|---|---|
| iQWine_Web | `v1.0-snapshot-pre-premium-2026-05-12` | `1c06be0` | ✅ pushed origin |
| cellier-vin | `v1.0-snapshot-pre-premium-2026-05-12` | `f6e2c0b` | local-only (pas de remote) |

## Branches de travail

| Repo | Branche | Tracking |
|---|---|---|
| iQWine_Web | `premium-2026` (active) | `origin/premium-2026` (pushed) |
| cellier-vin | `premium-2026` (active) | local-only |

## Backup Postgres

- **Fichier** : `~/Backups/iqwine-premium-rollback/cellier-pre-premium-2026-05-12.dump`
- **Taille** : 177 KB
- **Format** : custom (`-F c`) → restauration sélective table par table possible
- **DB source** : `cellier` (conteneur OrbStack `cellier-pg`, status `Up 2 days`)
- **User** : `cellier`

## Vercel deployment snapshot

Le site marketing iqwine.ca est sur Vercel — chaque commit a son URL preview
permanente. L'état production du `2026-05-12` correspond au déploiement du
commit `1c06be0` (tag `v1.0-snapshot-pre-premium-2026-05-12`).

- **URL prod** : https://iqwine.ca · https://iqwine-web.vercel.app
- **Projet Vercel** : `iqwine-web` (team `Eric Bigras' projects`, Hobby)
- **Repo source** : https://github.com/T0X1k007/iqwine-web

---

## État fonctionnel au 2026-05-12

### Site marketing iqwine.ca (7 sections live)

| # | Section | ID anchor | Status visuel |
|---|---|---|---|
| 1 | Hero (logo + headline + anchor + CTA + tagline) | `#hero` | ✅ Live, capturé |
| 2 | Le Constat (3 douleurs) | `#problem` | ✅ Live |
| 3 | Ce soir (3 mockups iPhone) | `#cesoir` | ✅ Live |
| 4 | La Suite (6 fonctions) | `#platform` | ✅ Live |
| 5 | Intelligence (4 messages AI) | `#impact` | ✅ Live |
| 6 | Le Cercle (manifesto + 3 facets) | `#circle` | ✅ Live |
| 7 | L'Accès (Cercle des fondateurs · 100) | `#beta` | ✅ Live |

Hero baseline capturé (rendu fidèle au state pré-Phase 1) :
- Logo iQWine doré centré
- Headline « L'intelligence privée / de votre cave. »
- Subheadline « Sommelier privé. Mémoire de dégustation. Cellier vivant. »
- Anchor encadré or « Scannez. Comprenez. Ouvrez au bon moment. »
- CTA Demander l'accès + Voir la suite
- Tagline italique fondatrice

### App iQWine (cellier-vin)

#### Routes `(authed)` actuelles (11 routes)
```
app/(authed)/
├── page.tsx           # Home (sommelier hero + 4 functional blocks)
├── ajout/             # /ajout — ajout de bouteille
├── bouteille/[id]/    # /bouteille/[id] — fiche détaillée
├── cellier/           # /cellier — vue cellier (SectionsOverview)
├── menu/              # /menu
├── palais/            # /palais — palate calibration
├── recherche/         # /recherche — search
├── retrait/           # /retrait — retirer bouteille (Phase 1 candidate → "Ouvrir")
├── sommelier/         # /sommelier — sommelier IA dédié
├── stats/             # /stats — statistiques (Phase 1 candidate → "Histoire")
├── vin/               # /vin
└── wishlist/          # /wishlist — liste désirs (Phase 1 candidate → "Carnet")
```

#### Composants navigation actuels
- `components/layout/SideNav.tsx` (desktop)
- `components/layout/BottomNav.tsx` (mobile)
- `components/layout/AppShell.tsx` (wrapper)
- `components/admin/AdminSideNav.tsx` (admin, hors scope Phase 1)

#### Bijou caché identifié dans l'audit
- `components/cellier-visuel/PremiumRack.tsx` — visualisation premium des sections de cave
- Actuellement utilisé en sous-composant. Phase 1 Bloc D = mise en hero `/cellier`

---

## Scope du vocabulaire à toucher en Phase 1 (Bloc Quick Wins)

Note : la décision Phase 1 actuelle est **LABELS UNIQUEMENT**, **pas de
rename de routes ni de répertoires**. Les chiffres ci-dessous sont fournis
pour cadrer l'effort réel sur les labels uniquement.

| Mot | Fichiers contenants | Type d'occurrence |
|---|---|---|
| `retrait` | 14 | Routes + composants + labels |
| `Retrait` | 10 | Labels UI |
| `wishlist` | 11 | Routes + composants + API |
| `Wishlist` | 8 | Labels UI |
| `stats` | 20 | Routes + composants |
| `Stats` | 23 | Labels UI |
| `ajout` | 61 | ⚠️ DANGER — beaucoup en CTA « Ajouter » (verbe) à GARDER |
| `Ajout` | 22 | Composants + labels |

Phase 1 actuelle ne touche **que les labels visibles dans la nav**
(SideNav + BottomNav + breadcrumbs) — pas les noms de routes, pas les
imports, pas l'API. Estimation : 3 à 5 fichiers seulement.

---

## Modifications interdites Phase 1 (rappel)

- ❌ Rename de routes (`/retrait`, `/wishlist`, `/stats`, `/ajout`)
- ❌ Suppression de `/ajout` ou `/menu`
- ❌ Middleware redirects
- ❌ Refonte nav 4 ancres complète
- ❌ Modification API routes
- ❌ Modification DB schema
- ❌ Sound design
- ❌ Haptics

## Modifications autorisées Phase 1

- ✅ Labels visibles dans la nav (Wishlist → Carnet, Stats → Histoire, Retrait → Ouvrir)
- ✅ Document audit URL/promesse (Bloc A, doc-only)
- ✅ Repositionnement PremiumRack en hero `/cellier` (si scope contrôlé)

---

## Décisions documentées (validées par Eric, 2026-05-12)

| Décision | Choix |
|---|---|
| `/ajout` | **Garder** (pas de suppression) |
| `/menu` | **Garder** (à clarifier plus tard) |
| PremiumRack hero `/cellier` | **GO si simple** (sinon mini-plan avant) |
| Rename routes | **Reporté Phase ≥2** |
| Refonte nav 4 ancres | **Reporté Phase ≥2** |
| Sound design / Haptics | **Reporté Phase 2** |

---

## Lighthouse baseline

À mesurer dans le browser de l'user (npx lighthouse non disponible
automatiquement ici). Commande recommandée :

```bash
# Site marketing
npx lighthouse https://iqwine.ca \
  --only-categories=performance,accessibility \
  --form-factor=mobile \
  --output=html \
  --output-path=docs/audits/2026-05-12-lighthouse-marketing.html

# App (en local dev)
cd /Users/eric/Projects/cellier-vin && npm run dev &
npx lighthouse http://localhost:3012 \
  --only-categories=performance,accessibility \
  --form-factor=mobile \
  --output=html \
  --output-path=../iQWine_Web/docs/audits/2026-05-12-lighthouse-app.html
```

## Screenshots baseline

- **Site marketing** : Hero capturé inline dans le rapport Phase 0
  (cf. message Claude du 2026-05-12).
- **Pour autres sections** : naviguer sur https://iqwine.ca (ou rebuild
  depuis tag `v1.0-snapshot-pre-premium-2026-05-12`).
- **App** : screenshots de l'app actuelle disponibles dans
  `~/Projects/cellier-vin/New_Cellier_web.png` et
  `~/Projects/cellier-vin/New_cellier_ios.png` (PNG fournis par Eric).

---

## Prochaine étape

Phase 0 complète. En attente du GO d'Eric pour démarrer **Phase 1 Bloc A**
(audit URL/promesse documenté — aucune modification code).
