# « Passionné » / « Enthusiast » — un libellé, un seul forfait

Décision d'Eric, 2026-08-02. Le forfait `FAMILLE` s'affiche **Passionné** en
français et **Enthusiast** en anglais.

C'est un changement de **libellé**, et rien d'autre :

- l'identifiant métier reste `FAMILLE` (application) / `famille` (site) ;
- le `priceId` Stripe reste le même — **un seul produit, un seul prix** ;
- le niveau d'accès, les quotas et toute la logique interne sont inchangés ;
- un client qui change de langue ne change **pas** de forfait.

La consigne était explicite : ne pas dupliquer le produit Stripe pour
contourner une contrainte d'affichage. Deux produits, ce seraient deux
historiques d'abonnement, deux rapports de revenus, deux jeux de price IDs à
tenir synchronisés — et un changement de langue deviendrait un changement de
produit. Le coût dépasse de très loin le confort d'un mot traduit.

---

## La limite Stripe — vérifiée, pas supposée

C'est le point qu'Eric demandait de documenter **avant** d'envisager de toucher
au nom du produit Stripe. Voici ce qui a été constaté dans le SDK installé
(`stripe`, `esm/resources/`), et non déduit d'un souvenir :

**`Product.name` est un `string` unique.** Aucun champ de variante linguistique,
aucune table de traduction, aucune propriété de localisation. Les deux seules
occurrences du mot « locale » dans `Products.d.ts` concernent le *langage de
requête de recherche*, sans rapport avec l'affichage.

**Le paramètre `locale` localise l'interface DE STRIPE, pas notre contenu.** La
documentation du SDK est littérale : « The IETF language tag of the locale
Customer Portal is displayed **in** ». Il traduit les boutons, les libellés de
formulaire et les mentions de Stripe. Le nom du produit y est rendu tel qu'il
est enregistré.

**Conséquence.** Les surfaces suivantes afficheront **un seul nom**, quel que
soit le visiteur :

| Surface Stripe                          | Nom affiché                  |
| --------------------------------------- | ---------------------------- |
| Ligne d'article dans Checkout            | le `name` du Product         |
| Liste des forfaits du portail client     | le `name` du Product         |
| Factures et reçus **générés par Stripe** | le `name` du Product         |

**Aucune modification du produit Stripe n'a été faite.** Le nom y reste
« Passionné ». Trois options, à trancher plus tard et sans urgence :

1. **le laisser tel quel** — cohérent avec un lancement québécois, et un
   anglophone voit de toute façon « Enthusiast » partout ailleurs ;
2. **le rendre neutre** (« iQWine Passionné · Enthusiast ») — lisible dans les
   deux langues, au prix d'un nom un peu lourd sur la facture ;
3. **le passer en anglais** le jour où le marché anglophone domine.

Aucune n'exige de dupliquer quoi que ce soit.

---

## Ce qui EST localisé (surfaces contrôlées par iQWine)

| Surface                          | Où                                                  |
| -------------------------------- | --------------------------------------------------- |
| Site — grille et comparatif      | `src/lib/plans.ts` → `planLabel(id, locale)`         |
| Site — données structurées       | `src/lib/structured-data.ts`                         |
| Application — écrans             | `lib/billing/plan-label.ts` → `planLabel(tier, l)`   |
| Application — courriels          | retrait bêta, cadeau                                 |
| Checkout d'un CADEAU             | `product_data.name` construit à la volée → localisé  |
| Factures émises par iQWine       | via le même `planLabel`                              |

**Le cas du cadeau mérite une note.** `gift-checkout.ts` construit un
`product_data.name` **à la volée**, pour un prix ad hoc — et non un `priceId`
existant. Ce nom-là traverse donc bien Stripe en étant localisé. Ce n'est pas
une exception à la limite ci-dessus : c'est un mécanisme différent, où le nom
n'est pas lu depuis un Product persistant.

---

## Ce qui n'est PAS localisé, délibérément

**L'administration.** `PLAN_TIER_FR` reste français : le Superadmin est en
français et le restera. Y introduire une locale ferait dépendre d'une variable
un écran qui n'a qu'un lecteur.

**Les journaux, les diagnostics et les rapports internes.** Même raison : il n'y
a personne à servir dans une autre langue, et un libellé variable rendrait deux
lignes de journal incomparables.

**Tout ce qui décide.** Le routage, les comparaisons de palier, les quotas, les
gardes : ils lisent `PlanTier`, jamais un libellé. C'est ce qui rend cette
localisation sûre — un mot affiché ne peut pas changer un comportement.
