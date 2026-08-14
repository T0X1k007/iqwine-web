# Refonte v3 — directive permanente SEO (et sa limite)

> **Directives d'Eric, 2026-08-12.** Permanentes, pour la homepage ET toutes
> les futures pages fonctionnelles. La seconde prime sur la première :
> **le SEO ne doit jamais tuer l'émotion.**

## La règle au sommet

> Nous optimisons l'histoire pour qu'elle soit trouvée. Nous n'écrivons pas
> une histoire pour satisfaire Google.

Hiérarchie de conception de CHAQUE page, dans l'ordre :

1. **Intention humaine** — pourquoi cette personne est-elle arrivée ici ?
2. **Émotion** — quel problème, doute, désir ou moment vit-elle ?
3. **Histoire** — comment Octave entre-t-il naturellement dans ce moment ?
4. **Preuve** — comment montrons-nous que le produit résout le problème ?
5. **Conversion** — quelle est la prochaine action naturelle ?
6. **SEO** — comment structurer cette excellente expérience pour que Google
   la comprenne parfaitement ? (Title, H1/H2, données structurées, maillage,
   alt, contexte sémantique — jamais le copy d'ouverture.)

Formule de page fonctionnelle :
**problème humain → émotion → Octave → magie → preuve → profondeur → CTA**,
puis le SEO se construit autour. Pas l'inverse.

Règle de copy : entre une phrase optimisée mais générique et une phrase
mémorable qui exprime le même concept, choisir la seconde — le reste de la
page porte l'optimisation. Un visiteur ne doit jamais sentir « écrit pour
Google » ; il doit sentir « ils comprennent exactement ma situation ».

Ouvertures de référence (validées comme ton, pas comme copy figé) :
- Carte des vins : « La carte arrive. Et soudain, 80 vins vous regardent. »
- Accords : « Le plat est prêt. Maintenant, quelle bouteille ? »
- Apogée : « Vous l'avez gardée six ans. Ce soir ? »
- Cellier : « Vous savez que vous l'avez. Mais où ? »
- Point de vente : « 300 bouteilles devant vous. Une décision à prendre. »

**Octave est le fil narratif entre toutes les pages** — chaque page raconte un
nouveau moment de la relation avec son sommelier, jamais sept produits
différents.

## Le principe SEO

**Une intention de recherche claire = une excellente page qui y répond.**

- Une page = UNE intention principale ; les intentions secondaires s'organisent
  autour. Jamais deux pages en concurrence sur la même intention
  (anti-cannibalisation).
- Architecture en clusters (Sommelier IA · Accords · Cellier · Restaurant),
  chaque cluster = page principale + contenus reliés, développés seulement si
  leur potentiel le justifie.
- Les territoires listés par Eric (sommelier IA, accord mets-vins, scanner une
  carte des vins, gestion de cave à vin, apogée d'un vin, etc.) sont des
  **hypothèses stratégiques** : AVANT de figer pages, URLs et copy → vraie
  analyse volume × intention × difficulté × concurrence × pertinence produit ×
  conversion. Le branding et le langage de recherche ne coïncident pas
  toujours.
- URLs : ne jamais casser une URL indexée sans 301 + canonical + liens
  internes + sitemap. Les routes existantes qui ont de l'autorité ne bougent
  pas arbitrairement.
- Bilingue : l'architecture doit permettre une stratégie par marché (les
  intentions QC ≠ FR ≠ US) — pas une traduction littérale des mots-clés.
- Maillage : la home envoie l'autorité vers les pages fonctionnelles par des
  liens contextuels naturels (restaurant → analyse de carte ; plat → accords ;
  cellier → cellier intelligent ; apogée → comprendre l'apogée) ; les pages se
  relient entre elles sans liens artificiels — un graphe sémantique.

## SEO technique — à protéger pendant toute la refonte

HTML sémantique · un H1 par page · hiérarchie H2/H3 · Title + meta description
uniques · canonical · Open Graph · Schema.org pertinent · sitemap · robots ·
breadcrumbs si pertinents · alt utiles et naturels · noms de fichiers d'images
descriptifs · formats modernes + dimensions définies + lazy intelligent ·
Core Web Vitals · contenu important dans le HTML rendu · les animations ne
sacrifient jamais performance, accessibilité ou crawlabilité.

(Le socle existe déjà — MFP-09 : canonicals, hreflang, slugs EN, AVIF
pré-convertis, llms.txt, vérificateur de routage 135 contrôles. La refonte le
préserve.)

## Mesurabilité

Préparer la lecture : impressions, clics, positions, CTR, landing pages
organiques, conversions SEO, performance par cluster. Le SEO se juge au
résultat business, pas au trafic.

## Livrable de la phase « SEO + architecture des pages fonctionnelles »

(Après validation visuelle de la homepage.) Un tableau, pour CHAQUE page
proposée :

URL | intention principale | mots-clés primaires | secondaires | Title | H1 |
Meta description | contenu/sections | assets existants à réutiliser | liens
internes entrants/sortants | CTA | Schema potentiel

— validé par Eric avant tout code. Voir aussi `refonte-v3-contenus.md`
(classification des contenus existants et pré-architecture).

## La règle permanente

Pour chaque décision sur iQWine.ai, penser simultanément :
**MARQUE × UX × CONVERSION × SEO × PERFORMANCE** — aucun des cinq en dernière
minute.

Trois tests simultanés pour chaque page : Google (« je comprends précisément
de quoi parle cette page »), le visiteur (« ils comprennent exactement mon
problème »), la marque (« ça ne pourrait être qu'iQWine »).
