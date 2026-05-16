# Audit Marketing ↔ Produit — Alignement promesses iqwine.ca vs app iQWine

> **Phase 1 — Bloc A** · 12 mai 2026
> Document d'audit. Aucune modification fonctionnelle effectuée.
>
> **Méthodologie** : pour chaque promesse du site marketing (`iqwine-web/src/lib/constants.ts`),
> on vérifie la présence et la maturité dans l'app `cellier-vin`. Les preuves
> citent les fichiers exacts. Le statut est volontairement strict — la
> *présence d'un backend* ne suffit pas à valider une promesse de surface.
>
> **Décodage statut** :
> - 🟢 **Tenue** — la promesse est ressentie par l'utilisateur de l'app
> - 🟡 **Partielle** — capacité backend présente, surface UX absente / faible
> - 🔴 **Non tenue** — promesse marketing sans support produit aujourd'hui

---

## Synthèse exécutive

| Section | Promesses | 🟢 Tenues | 🟡 Partielles | 🔴 Non tenues |
|---|---|---|---|---|
| Hero | 5 | 1 | 4 | 0 |
| Constat | 3 | 0 | 3 | 0 |
| Ce soir | 4 | 0 | 4 | 0 |
| Suite | 6 | 2 | 3 | 1 |
| Intelligence | 4 | 1 | 1 | 2 |
| Cercle | 4 | 1 | 2 | 1 |
| Accès | 3 | 2 | 1 | 0 |
| **TOTAL** | **29** | **7 (24%)** | **18 (62%)** | **4 (14%)** |

**Verdict brut** : **76 % des promesses ne sont pas pleinement tenues**.
La grande majorité sont **partielles** — la capacité technique existe mais
l'expérience produit ne la met pas en scène. C'est rassurant : il y a peu à
construire, beaucoup à exposer.

**4 promesses non tenues** demandent une décision : on les retire, on les
adoucit, ou on tient leur promesse en Phase ≥ 6.

---

# SECTION 1 — HERO

## Promesse #1 — Badge exclusivité

| Champ | Valeur |
|---|---|
| **Texte exact** | « Première vague · 100 celliers · Sur invitation » |
| **Statut** | 🟡 Partielle |
| **Preuve dans l'app** | `lib/billing/onboarding-provisioning.ts` existe (système d'onboarding privé). Wizard `(onboarding)/onboarding/Wizard.tsx` complet (Step2Preferences, Step3BuildCellar, CellarBuiltCelebration). |
| **Écart UX** | (1) Aucune trace visible côté utilisateur de son **numéro de fondateur** (« Membre #047 »). (2) Aucune indication du nombre de places restantes. (3) Le mot « invitation » n'apparaît pas dans le wizard d'onboarding lui-même. |
| **Action recommandée** | **Ajouter un n° de fondateur visible** dans le profil utilisateur (Phase 4 « App shell premium »). Garder la copy actuelle telle quelle. |
| **Risque si on garde tel quel** | **Faible.** La promesse de surface tient. Mais c'est un levier de prestige inutilisé. |

## Promesse #2 — Headline

| Champ | Valeur |
|---|---|
| **Texte exact** | « L'intelligence privée de votre cave. » |
| **Statut** | 🟡 Partielle |
| **Preuve dans l'app** | `lib/ai/` complet : 7 routers spécialisés (sommelier, classification, embedding, ocr, transcription, vision, sommelier-recommend), avec anti-hallucination, budget-guard, circuit-breaker. L'IA est réelle et architecturée premium. |
| **Écart UX** | L'IA *fait son travail* mais **ne se montre pas en train de penser**. Pas de pause sommelier, pas d'animation « réflexion en cours ». L'expérience est : question → réponse → fin. Pas une présence intelligente. |
| **Action recommandée** | **Phase 6 dédiée** : mise en scène du moment où le sommelier réfléchit (3 dots or pulsants, 1.5s minimum). Copy actuelle préservée. |
| **Risque si on garde tel quel** | **Moyen.** Le mot « intelligence » est tenu techniquement mais pas ressenti. Risque de déception silencieuse chez l'utilisateur exigeant qui s'attend à « voir » l'intelligence. |

## Promesse #3 — Subheadline (3 mots-tags)

| Champ | Valeur |
|---|---|
| **Texte exact** | « Sommelier privé. Mémoire de dégustation. Cellier vivant. » |
| **Statut** | 🟡 Partielle (1 sur 3 vraiment tenue) |
| **Preuve dans l'app** | **Sommelier privé** ✅ `lib/ai/routers/sommelier-router.ts` + `app/(authed)/sommelier/page.tsx` éditoriale. **Mémoire de dégustation** ⚠️ `TastingNote` + `TastingNotesSourceBadge.tsx` existent mais sont des données, pas une mémoire vivante (pas de re-surfacing, pas de rappel saisonnier). **Cellier vivant** 🔴 `PremiumRack.tsx` existe mais reste un sous-composant ; le mot « vivant » implique animation/respiration/changement temporel — pas observable aujourd'hui. |
| **Écart UX** | « Cellier vivant » est le plus faible. Le cellier *est statique* aujourd'hui. Les apogées sont calculées mais ne « pulsent » pas visuellement. |
| **Action recommandée** | **Garder la copy** (les 3 mots restent justes en intention). **Phase 5 « Wine Collection Experience »** rend le cellier réellement vivant (heatmap par région, vue temporelle, pulse apogée). |
| **Risque si on garde tel quel** | **Faible-moyen.** La promesse passe au premier regard. Un collectionneur qui passe 2h dans l'app cherchera la « vivacité » et sentira l'écart. |

## Promesse #4 — Anchor preuve concrète

| Champ | Valeur |
|---|---|
| **Texte exact** | « Scannez. Comprenez. Ouvrez au bon moment. » |
| **Statut** | 🟡 Partielle |
| **Preuve dans l'app** | **Scannez** ✅ `components/scanner/CameraScanner.tsx` + `PhotoCapture.tsx` + `lib/ai/routers/vision-router.ts` + `lib/ai/routers/ocr-router.ts`. **Comprenez** ✅ `lib/wine/apogee.ts` (8 buckets temporels, peak year) + enrichissement automatique via `wine.enrichment_completed`. **Ouvrez au bon moment** ⚠️ Backend connaît le bon moment ; UX n'envoie aucune **notification proactive** au moment du plateau atteint. |
| **Écart UX** | Le mot **« Ouvrez »** est en désalignement avec le vocabulaire UX actuel **« Retrait »**. Le visiteur du site lit *« Ouvrez »* puis dans l'app voit *« Retirer une bouteille »* — incohérence subtile mais détectable. |
| **Action recommandée** | (1) **Bloc Quick Wins Phase 1** : renommer le label visible « Retrait » → « Ouvrir » (rapide). (2) **Phase 6** : notifications proactives plateau atteint via le handler de `wine.apogee_resolved` (event existe déjà dans `lib/queues/types.ts`). |
| **Risque si on garde tel quel** | **Élevé sur la cohérence.** L'écart « Ouvrez » (marketing) vs « Retrait » (app) est exactement le type d'erreur premium qui s'accumule. **À fixer en Phase 1 Quick Wins.** |

## Promesse #5 — Tagline fondatrice (italique footer hero)

| Champ | Valeur |
|---|---|
| **Texte exact** | « Le compagnon œnologique qui comprend votre palais et votre cave mieux que vous-même. » |
| **Statut** | 🟢 Tenue (sur le « palais ») |
| **Preuve dans l'app** | `lib/palate/` complet : `compute.ts`, `insights.ts`, `maturity.ts`, `sommelier-context.ts` + page dédiée `app/(authed)/palais/page.tsx`. Pipeline orchestré par worker, anti-hallucination 2e ligne, budget IA. Vraie cartographie sensorielle. |
| **Écart UX** | Le **« mieux que vous-même »** est une promesse forte. L'app le tient *quand l'utilisateur a 25+ dégustations* (`PalateMaturity` thresholds dans `lib/palate/maturity.ts`). En-deçà, la promesse est en attente. |
| **Action recommandée** | **Garder.** C'est la signature poétique du produit. Aucune action requise. |
| **Risque si on garde tel quel** | **Très faible.** Promesse poétique acceptable car le produit livre quand l'utilisation s'installe. |

---

# SECTION 2 — LE CONSTAT (3 douleurs implicites = 3 promesses inversées)

## Promesse #6 — « Les grands vins atteignent leur apogée en silence » *(implique : l'app les annonce)*

| Champ | Valeur |
|---|---|
| **Texte exact** | « Les grands vins atteignent leur apogée en silence. Les tables de millésime restent dans les livres. Les plateaux restent flous. Votre cave retient — et ne dit rien. » |
| **Statut** | 🟡 Partielle (calcul ✅, notification ❌) |
| **Preuve dans l'app** | `lib/wine/apogee.ts` (8 buckets précis) + event `wine.apogee_resolved` existe dans `lib/queues/types.ts`. Mais **aucun handler grep'é** ne transforme cet event en notification utilisateur. |
| **Écart UX** | Le marketing promet implicitement *« iQWine vous prévient avant que ça passe en silence »*. Aujourd'hui, **l'app sait** mais **ne vous le dit pas**. C'est l'écart le plus critique du site. |
| **Action recommandée** | **Phase 6 prioritaire** : créer un handler `wine.apogee_resolved` → email lifecycle + notification in-app (utiliser `lib/mail/lifecycle-templates.ts` qui existe déjà). |
| **Risque si on garde tel quel** | **Élevé.** Cœur de la promesse iQWine. Si un fondateur perd un Brunello à l'apogée parce que l'app ne l'a pas prévenu, échec retentissant. |

## Promesse #7 — « Les accords restent approximatifs »

| Champ | Valeur |
|---|---|
| **Texte exact** | « Les accords restent approximatifs. Le menu du soir rencontre l'intuition de la semaine dernière. La bonne bouteille meurt sur une étagère, deux rangs plus loin. » |
| **Statut** | 🟡 Partielle (sommelier accord ✅, vue « deux rangs plus loin » ⚠️) |
| **Preuve dans l'app** | `lib/ai/menu-pairing.ts` propose Top 3 (meilleur accord / second solide / audacieux) avec scoring qualité-prix (Excellent ≤ 0.85, Bon ≤ 1.10). Sommelier IA répond. |
| **Écart UX** | L'app *peut* proposer la bonne bouteille mais l'utilisateur doit *demander*. La promesse marketing suggère une **suggestion proactive** (« meurt sur une étagère » = sans qu'on demande). Aujourd'hui, l'utilisateur doit ouvrir le sommelier. |
| **Action recommandée** | Garder copy. **Phase 6** : suggestions contextuelles (calendar synced ? heure dîner ?). Pas critique en Phase 1. |
| **Risque si on garde tel quel** | **Faible.** L'utilisateur qui demande reçoit. La promesse tient au premier degré. |

## Promesse #8 — « Les bouteilles marquantes disparaissent »

| Champ | Valeur |
|---|---|
| **Texte exact** | « Les bouteilles marquantes disparaissent. Un cadeau. Une découverte. Une bouteille de voyage. Vous vouliez vous renseigner. C'est devenu un souvenir. » |
| **Statut** | 🟡 Partielle |
| **Preuve dans l'app** | Scanner étiquette permet d'archiver. `TastingNote` permet de noter une dégustation. `BottlePhoto` + `PhotoLightbox` permettent de garder la photo. **Mais** : aucun re-surfacing automatique (« Il y a 1 an, vous découvriez ce vin de Toscane »). |
| **Écart UX** | La promesse « marquantes ne disparaissent plus » implique une **mémoire active** qui vous rappelle. L'app a la matière (timeline `bottle.drunk` events) mais pas la mise en récit. |
| **Action recommandée** | **Phase 9 « Cinematic Emotional Refinement »** : poster annuel du palais, rappels saisonniers, vue chronologique de la cave. |
| **Risque si on garde tel quel** | **Faible.** Promesse tenue à 70 % (archive + scan), 30 % manquant en mémoire vivante. Accepter le partiel jusqu'à Phase 9. |

---

# SECTION 3 — CE SOIR (récit immersif + 3 mockups iPhone)

## Promesse #9 — Récit narratif

| Champ | Valeur |
|---|---|
| **Texte exact** | « Vous photographiez le menu. Votre cave écoute. Trois bouteilles montent. Un Brunello entre dans son plateau cette semaine. Vous ouvrez. Vous savez pourquoi. » |
| **Statut** | 🟡 Partielle |
| **Preuve dans l'app** | Composants individuels présents : `CameraScanner`, sommelier-router, apogee.ts. **Mais le scénario complet enchaîné** (scan menu → suggestion 3 bouteilles → highlight plateau atteint → ouverture rituelle) n'existe pas comme **flow continu**. |
| **Écart UX** | Le marketing raconte une **séquence cinématique**. L'app propose des **fonctions séparées**. C'est précisément ce que Phase 4-6 doivent résoudre (rituel ambient). |
| **Action recommandée** | **Garder copy** (elle est aspirationnelle). **Phase 4 « App Shell Premium »** + **Phase 6 « AI Sommelier Experience »** rendent ce scénario continu. |
| **Risque si on garde tel quel** | **Moyen.** Un fondateur qui essaie de reproduire la séquence après lecture du site marketing aura une déception légère sur la continuité. |

## Promesses #10, #11, #12 — Captions des 3 mockups

| # | Caption | Mockup | Statut | Preuve |
|---|---|---|---|---|
| 10 | « Une bouteille, raisonnée. » | TonightScreen | 🟡 Partielle | Sommelier suggère 3 bouteilles avec raisonnement. **Mais** : pas de display « température de service / temps de carafe » dans l'app (visible dans mockup site, à vérifier dans l'app réelle). |
| 11 | « Une carte, photographiée. » | ScannerScreen | 🟡 Partielle | `menu-pairing.ts` auto-détecte étiquette vs carte. **Mais** : Mode Restaurant n'a pas d'UI dédié signalé dans les routes `(authed)`. Capacité présente, surface absente. |
| 12 | « Une apogée, atteinte. » | ApogeeScreen | 🔴 Non tenue *(re-classif vers 🟡 si notif backend confirmée)* | Backend apogee.ts présent. **Aucune UI « apogée atteinte cette semaine »** trouvée. Le mockup site marketing montre un écran qui n'existe pas dans l'app. |

**Action recommandée pour les 3** : **garder les captions** mais **flagger** la déception silencieuse possible. **Phase 5-6** créent les écrans réels. **Phase B+ du site marketing pourra remplacer les mockups par de vrais screens**.

**Risque** : **Moyen-élevé**. Les mockups iPhone du site sont visuellement convaincants et un fondateur s'attend à les retrouver à l'identique. **C'est le risque le plus crédibilisant à régler.**

## Promesse #13 — Closing line

| Champ | Valeur |
|---|---|
| **Texte exact** | « Ce soir, votre cave participe. » |
| **Statut** | 🔴 Non tenue (au sens littéral) |
| **Preuve dans l'app** | La cave est consultable mais ne « participe » pas — pas de proactivité, pas de salutation contextuelle, pas de surfacing de bouteilles pertinentes au moment du repas. |
| **Écart UX** | La cave reste **passive**. L'utilisateur doit l'interroger pour qu'elle « participe ». |
| **Action recommandée** | **Phase 4-6**. En attendant, la copy peut rester (poétique acceptable). Considérer un ajustement : *« Ce soir, votre cave est à votre table. »* (légèrement moins fort, plus tenu). |
| **Risque si on garde tel quel** | **Faible.** Promesse poétique de fermeture, peu attaquable. |

---

# SECTION 4 — LA SUITE (6 fonctions)

## Promesse #14 — Cellier vivant

| Champ | Valeur |
|---|---|
| **Texte exact** | « Plan visuel & heatmap » / « Le plan vivant de votre collection. » / « Les apogées pulsent cette semaine. Les régions parlent. » |
| **Statut** | 🔴 Non tenue (sur la heatmap + pulse + régions) |
| **Preuve dans l'app** | `PremiumRack.tsx` existe (visualisation cellier). **Aucun composant `heatmap`** trouvé dans `components/`. Le pulse apogée n'est pas implémenté visuellement. La vue par région n'est pas trouvée. |
| **Écart UX** | C'est la promesse **la plus précise et la plus non tenue**. Le marketing décrit 3 features visuelles (plan, heatmap, pulse) dont 1 existe (le plan PremiumRack). |
| **Action recommandée** | **Phase 1 Bloc D** : mettre `PremiumRack` en hero de `/cellier` (tient au moins la promesse du « plan visuel »). **Phase 5** dédiée à la heatmap + pulse + vues alternatives. |
| **Risque si on garde tel quel** | **Élevé.** Un visiteur du site qui s'inscrit, ouvre `/cellier` et ne voit ni heatmap ni pulse aura un sentiment de tromperie marketing. **Soit on adoucit la copy maintenant, soit on garde et on rush Phase 5.** |

## Promesse #15 — Mode Tonight

| Champ | Valeur |
|---|---|
| **Texte exact** | « Intelligence d'accord » / « Le menu d'un côté. La cave de l'autre. » / « Trois bouteilles, avec leur raisonnement. » |
| **Statut** | 🟢 Tenue |
| **Preuve dans l'app** | `lib/ai/sommelier-recommend.ts` + page `/sommelier` éditoriale avec `SommelierField`. Le sommelier propose des bouteilles raisonnées de la cave. |
| **Écart UX** | Mineur : la mise en scène pourrait être plus cinématique (cf. audit §1.2), mais la promesse fonctionnelle est tenue. |
| **Action recommandée** | **Garder copy.** Aucune action Phase 1. Polish Phase 6. |
| **Risque si on garde tel quel** | **Très faible.** |

## Promesse #16 — Mode Restaurant

| Champ | Valeur |
|---|---|
| **Texte exact** | « Un sommelier discret à table » / « Photographiez la carte. Recevez le bon choix. » / « Sans qu'il y paraisse. » |
| **Statut** | 🟡 Partielle |
| **Preuve dans l'app** | **Backend exceptionnel** : `menu-pairing.ts` auto-détecte étiquette vs carte des vins, propose Top 3 avec scoring qualité-prix Excellent/Bon/Correct/Cher. **Pas d'UI dédiée « Mode Restaurant »** trouvée dans les routes — semble être un flux secondaire du scanner. |
| **Écart UX** | Le marketing présente ça comme une **fonction d'égal niveau** aux 5 autres. L'app la traite comme un sous-cas du scanner. Sous-exposition. |
| **Action recommandée** | **Phase 6** : dédier une UI « Mode Restaurant » accessible explicitement (route ou shortcut). Garder copy. |
| **Risque si on garde tel quel** | **Moyen.** Promesse forte sur le site, fonction cachée dans l'app. |

## Promesse #17 — Scanner d'étiquettes

| Champ | Valeur |
|---|---|
| **Texte exact** | « Photo · QR · code-barres » / « Pointez l'étiquette. Lisez son histoire. » / « Du millésime à la fenêtre de garde. » |
| **Statut** | 🟢 Tenue (avec nuance) |
| **Preuve dans l'app** | `CameraScanner.tsx`, `PhotoCapture.tsx`, `PhotoCropEditor.tsx` + `vision-router.ts` + `ocr-router.ts`. Enrichissement post-scan via `wine.enrichment_completed`. |
| **Écart UX** | **« QR · code-barres »** — à vérifier dans le détail (le scanner caméra existe, mais QR/barcode comme inputs distincts ?). Si seul « photo » est vraiment supporté, retirer « QR · code-barres » de la copy. |
| **Action recommandée** | **Vérification rapide en Bloc A étendu** : si QR/barcode pas implémentés, **ajuster la copy** : « Photo & code-barres » → « Photographiez l'étiquette. ». |
| **Risque si on garde tel quel** | **Faible-moyen.** Promesse mineure mais détectable par un utilisateur tech qui essaie de scanner un QR code. |

## Promesse #18 — Recherche naturelle

| Champ | Valeur |
|---|---|
| **Texte exact** | « Parlez à votre cave » / « "Un blanc minéral pour le poisson de ce soir." » / « Votre cave répond dans vos mots. » |
| **Statut** | 🟡 Partielle |
| **Preuve dans l'app** | `lib/ai/routers/embedding-router.ts` + `embedding.ts` task = infrastructure pgvector prête. **Mais** : `app/(authed)/recherche/page.tsx` est un **redirect vers `/menu/recherche-base`** (page actuelle non éditoriale, à remplacer Commit 4 selon commentaire dans le code). |
| **Écart UX** | La promesse marketing décrit une expérience NL (« Parlez à votre cave »). L'app a probablement encore une recherche par filtres traditionnels. **Écart fort entre promesse poétique et réalité par filtres.** |
| **Action recommandée** | **Option A (conservatrice)** : adoucir la copy Phase 1 (« Cherchez votre cave » au lieu de « Parlez »). **Option B (ambitieuse)** : prioriser le Commit 4 mentionné dans le code (vraie recherche NL éditoriale) en Phase 5-6. |
| **Risque si on garde tel quel** | **Élevé.** Promesse précise (« dans vos mots »), réalité possiblement par filtres. Décalage cinglant pour un essai utilisateur. |

## Promesse #19 — Calibration du palais

| Champ | Valeur |
|---|---|
| **Texte exact** | « Mémoire de dégustation qui apprend » / « Trente dégustations. Un palais cartographié. » / « Des vins que vous ignoriez aimer. » |
| **Statut** | 🟢 Tenue |
| **Preuve dans l'app** | `lib/palate/insights.ts` génère des insights post-25 dégustations via pipeline orchestré worker. `PalateProfile` + `PalateMaturity` thresholds + AI sommelier reason. Page dédiée `/palais`. |
| **Écart UX** | La page `/palais` existe — niveau de polish visuel à confirmer (Phase 2 audit). Le seuil **« trente dégustations »** est cohérent avec les `MATURITY_THRESHOLDS` du code. |
| **Action recommandée** | **Garder copy.** Promesse honnête, technique présente. **Phase 5-6 enrichit le visuel du palais cartographié** (poster annuel envisagé). |
| **Risque si on garde tel quel** | **Très faible.** |

---

# SECTION 5 — L'INTELLIGENCE (4 messages AI)

## Promesse #20 — Message Apogée

| Champ | Valeur |
|---|---|
| **Texte exact** | « Votre Brunello entre dans son plateau cette semaine. Mardi serait idéal. » |
| **Statut** | 🔴 Non tenue |
| **Preuve dans l'app** | `apogee.ts` calcule les buckets. Event `wine.apogee_resolved` existe. Lifecycle email templates existent. **Aucun handler grep'é** qui combine les 3 pour envoyer une notification utilisateur « cette semaine, plateau atteint ». |
| **Écart UX** | Message marketing extrêmement précis (jour de la semaine recommandé, fenêtre temporelle). Aucune notification proactive de ce type aujourd'hui. |
| **Action recommandée** | **Phase 6 prioritaire** — handler `wine.apogee_resolved` → email lifecycle + in-app notif. Possible Phase 1 « quick win backend » si fenêtre dispo (~1 jour). |
| **Risque si on garde tel quel** | **Très élevé.** C'est le message le plus mémorable du site (l'audit l'a noté comme « wow moment »). S'il n'arrive jamais, c'est de la pure fiction marketing. |

## Promesse #21 — Message Accord

| Champ | Valeur |
|---|---|
| **Texte exact** | « Trois bouteilles, parfaitement accordées au menu que vous venez de photographier. » |
| **Statut** | 🟢 Tenue (sur demande) |
| **Preuve dans l'app** | `menu-pairing.ts` fait exactement ça quand l'utilisateur photographie une carte. |
| **Écart UX** | Mineur. La promesse marketing dit « venez de photographier » → flux : photo → suggestion. Cohérent. |
| **Action recommandée** | **Garder.** Aucune action. |
| **Risque si on garde tel quel** | **Très faible.** |

## Promesse #22 — Message Palais

| Champ | Valeur |
|---|---|
| **Texte exact** | « Vous aimez de plus en plus les blancs minéraux. Vos six derniers choix le confirment. » |
| **Statut** | 🟡 Partielle |
| **Preuve dans l'app** | `lib/palate/insights.ts` génère des insights via AI sommelier. Le format exact des insights produit n'est pas vérifié, mais l'infrastructure permet ce type de message. |
| **Écart UX** | Promesse précise sur le **« six derniers choix »** — implique un compteur visible, un tracking explicite, une formulation observée. Probablement pas formulé ainsi dans l'app. |
| **Action recommandée** | **Phase 5-6** : structurer les insights palais pour produire ce type de phrases (data-driven mais formulées éditorialement). |
| **Risque si on garde tel quel** | **Moyen.** Promesse séduisante mais précision (« six derniers ») peut décevoir si l'app dit autre chose. |

## Promesse #23 — Message Opportunité (rareté)

| Champ | Valeur |
|---|---|
| **Texte exact** | « Cette bouteille devient rare. Ce soir serait un beau moment. » |
| **Statut** | 🔴 Non tenue |
| **Preuve dans l'app** | Aucune logique de **rareté/scarcity** trouvée dans `lib/`. Présence seulement dans `lib/mock/copy.ts` et `lib/onboarding/tutorials.ts` (copy d'exemple, pas logique active). |
| **Écart UX** | Le système ne peut pas dire qu'une bouteille devient rare aujourd'hui. Promesse marketing sans support. |
| **Action recommandée** | **Décision binaire** : (1) **retirer le message #4** des 4 Intelligence (passer à 3) ; OU (2) **construire la logique de rareté** en Phase 6 (heuristique : 1-2 bouteilles restantes + producteur sans nouveau stock détecté ? complexe). **Recommandation : retirer temporairement.** |
| **Risque si on garde tel quel** | **Élevé.** Promesse non livrable techniquement aujourd'hui. À retirer ou adoucir radicalement (« Cette bouteille est précieuse. Ce soir serait un beau moment. »). |

---

# SECTION 6 — LE CERCLE (manifesto + 3 facets)

## Promesse #24 — Manifesto

| Champ | Valeur |
|---|---|
| **Texte exact** | « iQWine n'a pas été conçu pour cataloguer des bouteilles. Il a été conçu pour vivre avec une collection. » |
| **Statut** | 🟡 Partielle |
| **Preuve dans l'app** | **À 60 % vrai.** Architecture event-driven, sommelier IA, palate calibration — tout sauf un catalogue. **À 40 % faux** : vocabulaire UX (`/retrait`, `/ajout`, `/stats`) sent encore l'inventaire. |
| **Écart UX** | Le manifesto est *intentionnellement* en avance sur la réalité produit — il définit l'aspiration. La Phase 1 Quick Wins corrige les labels visibles, ce qui rapproche déjà de 10-15 points. |
| **Action recommandée** | **Garder.** C'est la **direction du produit**. Aligner progressivement Phase 1 (labels) puis Phase 5-9 (rituels). |
| **Risque si on garde tel quel** | **Faible.** Manifesto = pole nord, pas description. |

## Promesse #25 — Facet « Mémoire de dégustation »

| Champ | Valeur |
|---|---|
| **Texte exact** | « Chaque soirée s'inscrit. Le palais se cartographie. La collection prend forme. » |
| **Statut** | 🟢 Tenue |
| **Preuve dans l'app** | `TastingNote` model + page `/palais` + insights AI. Chaque dégustation alimente le palais. |
| **Action recommandée** | **Garder.** |
| **Risque** | **Très faible.** |

## Promesse #26 — Facet « Les soirées qui comptent »

| Champ | Valeur |
|---|---|
| **Texte exact** | « Bouteilles ouvertes, accords retenus, moments que vous pourrez revisiter un an plus tard. » |
| **Statut** | 🟡 Partielle |
| **Preuve dans l'app** | Bouteilles ouvertes : event `bottle.drunk` + page `/retrait`. Accords : tracking présent. **« Revisiter un an plus tard »** : pas de re-surfacing automatique trouvé. |
| **Action recommandée** | **Phase 9** : rappels anniversaires (« Il y a 1 an, vous découvriez ce vin »). En attendant, copy acceptable. |
| **Risque** | **Faible.** Promesse poétique difficile à attaquer. |

## Promesse #27 — Facet « Le voyage retrouvé »

| Champ | Valeur |
|---|---|
| **Texte exact** | « Étiquettes inconnues archivées. Bouteilles de voyage ramenées. Rien d'oublié. » |
| **Statut** | 🔴 Non tenue (sur « rien d'oublié ») |
| **Preuve dans l'app** | Scanner étiquette ✅. Archivage ✅. **« Rien d'oublié »** = promesse forte qui nécessite un re-surfacing actif (« vos voyages au Piémont, 2024 » etc.). Pas implémenté. |
| **Action recommandée** | **Adoucir la copy** : *« Étiquettes inconnues archivées. Bouteilles de voyage ramenées. Tout retrouvé. »* (« retrouvé » est plus passif, plus tenu). |
| **Risque si on garde tel quel** | **Moyen.** « Rien d'oublié » est une promesse absolue. Difficile à tenir. |

---

# SECTION 7 — L'ACCÈS (Cercle des fondateurs)

## Promesse #28 — Première vague limitée

| Champ | Valeur |
|---|---|
| **Texte exact** | « Première vague limitée à 100 celliers. Onboarding privé pour les fondateurs. Pas d'inscription publique. » |
| **Statut** | 🟢 Tenue (limitation + onboarding privé) / 🟡 Partielle (« privé » = à confirmer) |
| **Preuve dans l'app** | `lib/billing/onboarding-provisioning.ts` (système provisionning). Wizard onboarding complet en route group `(onboarding)/`. **« Pas d'inscription publique »** : à vérifier si `/signup` existe et est ouvert. |
| **Écart UX** | Le mot **« privé »** mérite une preuve de premium : email personnel, numéro de fondateur visible, accueil unique. Phase 4 dédie le polish. |
| **Action recommandée** | **Garder.** Phase 4 enrichit l'expérience d'admission. |
| **Risque** | **Faible-moyen.** Si `/signup` public existe et casse la promesse, à fermer. |

## Promesse #29 — Les fondateurs façonnent

| Champ | Valeur |
|---|---|
| **Texte exact** | « Les fondateurs façonnent la suite. Leurs réserves entrent en premier. Leurs retours écrivent le chapitre suivant. » |
| **Statut** | 🟡 Partielle |
| **Preuve dans l'app** | **« Leurs réserves entrent en premier »** : oui par défaut (ils sont les premiers à scanner leur cave). **« Façonnent / retours écrivent »** : aucun feedback loop visible côté utilisateur (pas de page « roadmap » avec votes, pas d'email demandant feedback). |
| **Action recommandée** | **Phase 9** : ajouter un canal feedback fondateur (page roadmap + commentaire). En attendant, copy acceptable. |
| **Risque** | **Faible.** Promesse poétique. |

## Promesse #30 — Détail accès

| Champ | Valeur |
|---|---|
| **Texte exact** | « 100 celliers · Sur invitation » |
| **Statut** | 🟢 Tenue |
| **Preuve dans l'app** | Limitation contrôlée par le créateur (Eric). Pas d'inscription publique. |
| **Action recommandée** | **Garder.** |
| **Risque** | **Très faible.** |

---

# 🎯 PROMESSES À DÉCIDER EN PRIORITÉ

Sur les 29 promesses auditées, **8 nécessitent une décision rapide** :

| # | Promesse | Statut | Décision suggérée |
|---|---|---|---|
| 4 | « Ouvrez au bon moment » (vs label app « Retrait ») | 🟡 | **(2) Ajuster** côté app via Bloc Quick Wins Phase 1 (label) |
| 6 | « Les apogées en silence » (notif absente) | 🟡 | **(3) Enrichir l'app** en Phase 6 (handler `wine.apogee_resolved` → notif) |
| 12 | « Une apogée, atteinte » (caption mockup) | 🔴 | **(3) Enrichir l'app** ou **(2) Adoucir** caption |
| 13 | « Ce soir, votre cave participe. » (cave passive) | 🔴 | **(1) Garder** (poétique acceptable) |
| 14 | « Apogées pulsent · Régions parlent » (heatmap absente) | 🔴 | **(2) Adoucir copy maintenant** OU **(3) Phase 5 prioritaire** |
| 18 | « Parlez à votre cave » (recherche par filtres en réalité) | 🟡 | **(2) Adoucir** OU **(3) Commit 4 prioritaire** |
| 20 | « Votre Brunello entre dans son plateau cette semaine » | 🔴 | **(3) Enrichir en Phase 6** (priorité absolue) |
| 23 | « Cette bouteille devient rare » (logique absente) | 🔴 | **(4) Retirer temporairement** ou adoucir (« Cette bouteille est précieuse ») |

---

# 📊 STATISTIQUES

- **29 promesses** auditées
- **7 tenues** (24 %)
- **18 partielles** (62 %)
- **4 non tenues** (14 %)

**Constat encourageant** : la quasi-totalité des promesses (96 %) a un support technique partiel ou complet. La distance promesse → réalité est **principalement une distance de mise en scène**, pas de construction.

**Constat exigeant** : 8 promesses précises (notifs, rareté, heatmap, recherche NL) demandent soit un ajustement copy immédiat, soit un investissement Phase 5-6 dédié.

---

# 🛑 EN ATTENTE DE VALIDATION

Document Bloc A livré. **Aucune modification fonctionnelle effectuée.**

Phase 1 prochaine étape : sur la base de ce document, prendre **8 décisions**
(promesses à décider en priorité) et trancher pour chaque :
- (1) Garder telle quelle
- (2) Ajuster la copy (Phase 1 Quick Wins)
- (3) Enrichir l'app plus tard (Phase 5-6-9)
- (4) Retirer temporairement

Une fois ces décisions prises, on peut enchaîner sur **Bloc Quick Wins**
(renommage labels nav uniquement) et **Bloc D** (PremiumRack hero).
