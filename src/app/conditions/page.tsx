import type { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL_ENTITY, LEGAL_EFFECTIVE_DATE } from '@/lib/legal-meta';
import { LegalPage, LegalSection, LegalList } from '@/components/legal/legal-ui';

export const metadata: Metadata = {
  title: 'Conditions d’utilisation — iQWine',
  description: 'Conditions d’utilisation du service iQWine.',
};

/**
 * /conditions — Conditions d’utilisation publiques du site iQWine. Contenu
 * aligné sur la page canonique de l’application. À garder synchrone avec
 * cellier-vin (lib/legal/legal-meta.ts).
 */
export default function ConditionsPage() {
  return (
    <LegalPage title="Conditions d’utilisation" meta={`En vigueur le ${LEGAL_EFFECTIVE_DATE}`}>
      <LegalSection title="1. Qui nous sommes">
        iQWine est un service exploité par {LEGAL_ENTITY.legalName} (« iQWine »,
        « nous »), entreprise constituée au {LEGAL_ENTITY.jurisdiction}. Les
        présentes conditions régissent votre utilisation du service.
      </LegalSection>

      <LegalSection title="2. Acceptation">
        En créant un compte ou en utilisant iQWine, vous acceptez les présentes
        conditions ainsi que la{' '}
        <Link href="/confidentialite" className="text-or underline underline-offset-2 hover:text-foreground">
          Politique de confidentialité
        </Link>
        . Si vous n’y consentez pas, n’utilisez pas le service.
      </LegalSection>

      <LegalSection title="3. Le service">
        iQWine est un assistant numérique de gestion de cave à vin : inventaire,
        fenêtres de consommation, recommandations assistées par intelligence
        artificielle et fonctionnalités connexes. Un essai gratuit de 14 jours
        est offert, sans engagement. L’essai gratuit est limité à une
        utilisation par utilisateur. La suppression d’un compte ne réinitialise
        pas l’admissibilité à l’essai gratuit.
      </LegalSection>

      <LegalSection title="4. Votre compte">
        Vous êtes responsable de la confidentialité de vos identifiants et de
        l’exactitude des renseignements fournis. Un seul compte par personne,
        sauf forfaits multi-utilisateurs.
      </LegalSection>

      <LegalSection title="5. Forfaits, facturation et changements">
        Les forfaits payants sont facturés d’avance selon la périodicité choisie
        (mensuelle ou annuelle). Les limites d’utilisation dépendent du forfait.
        <LegalList
          items={[
            'Bonification (forfait supérieur) : effet immédiat, avec ajustement du montant au prorata de la période en cours.',
            'Réduction de forfait : effective au prochain renouvellement ; vous conservez votre forfait actuel jusque-là.',
            'Changement de périodicité (mensuel ↔ annuel) : effectif au prochain renouvellement.',
          ]}
        />
        <strong className="text-foreground">Aucun remboursement.</strong> Les
        sommes versées ne sont pas remboursables, en tout ou en partie, et aucun
        crédit remboursable n’est émis. La seule exception est la bonification
        vers un forfait supérieur, dont l’accès supplémentaire est fourni
        immédiatement contre l’ajustement proraté correspondant. Vous pouvez
        changer ou résilier votre forfait à tout moment depuis votre espace de
        facturation ; la résiliation prend effet à la fin de la période en cours,
        sans remboursement de la période entamée.
      </LegalSection>

      <LegalSection title="6. Le Sommelier Virtuel et les recommandations">
        Les fenêtres de consommation (apogée, période de garde), les
        recommandations de service, les accords mets-vins et les autres
        suggestions du Sommelier Virtuel constituent une{' '}
        <strong className="text-foreground">aide à la décision</strong> fondée
        sur les données disponibles et l’expertise du moteur. Le comportement
        réel d’une bouteille donnée dépend notamment de sa conservation, de son
        transport, de l’état du bouchon, de l’environnement et de variations
        propres au produit et au millésime. iQWine ne garantit pas le
        comportement réel d’une bouteille spécifique, ni un résultat de
        dégustation. Ces recommandations ne constituent pas un avis
        professionnel et ne remplacent pas votre propre jugement.
      </LegalSection>

      <LegalSection title="7. Données de tiers et disponibilités">
        Certaines informations relatives aux produits, aux prix, aux
        disponibilités et aux points de vente peuvent provenir de sources
        publiques ou de détaillants tiers. Elles sont fournies à titre
        informatif seulement et peuvent différer de celles affichées par les
        détaillants concernés. Malgré nos efforts pour les maintenir à jour,
        leur exactitude, leur disponibilité et leur exhaustivité ne peuvent être
        garanties. iQWine n’est pas responsable de l’exactitude, de la
        disponibilité ni des prix affichés par des tiers.
      </LegalSection>

      <LegalSection title="8. Enrichissement automatique">
        Les fiches de vin peuvent être complétées automatiquement à partir de
        sources multiples et de synthèses générées par IA, signalées comme
        telles. Ces contenus sont fournis à titre d’information et peuvent
        comporter des imprécisions.
      </LegalSection>

      <LegalSection title="9. Usage acceptable">
        Vous vous engagez à ne pas détourner le service, à ne pas contourner ses
        limites techniques ou de sécurité, et à respecter les droits des tiers.
      </LegalSection>

      <LegalSection title="10. Limitation de responsabilité">
        Le service est fourni « tel quel » et « selon disponibilité ». Dans les
        limites permises par le droit applicable, iQWine ne saurait être tenue
        responsable des décisions prises sur la base des recommandations, de la
        perte de valeur, de la dégradation ou de la non-conformité d’une
        bouteille, ni des informations provenant de tiers. Rien dans les
        présentes ne limite les droits que la loi vous accorde de manière
        impérative.
      </LegalSection>

      <LegalSection title="11. Résiliation">
        Vous pouvez supprimer votre compte à tout moment depuis vos paramètres.
        Nous pouvons suspendre ou résilier un compte en cas de manquement aux
        présentes conditions.
      </LegalSection>

      <LegalSection title="12. Modifications">
        Nous pouvons modifier les présentes conditions. En cas de modification
        importante, votre acceptation vous sera redemandée avant que vous
        puissiez continuer à utiliser le service. La date d’entrée en vigueur
        ci-dessus indique la version applicable.
      </LegalSection>

      <LegalSection title="13. Droit applicable">
        Les présentes conditions sont régies par les lois applicables au{' '}
        {LEGAL_ENTITY.jurisdiction}, sans égard aux règles de conflit de lois.
      </LegalSection>

      <LegalSection title="14. Contact">
        Pour toute question relative aux présentes conditions : depuis
        l’application (section Support) ou via notre page{' '}
        <Link href="/contact" className="text-or underline underline-offset-2 hover:text-foreground">
          Contact
        </Link>
        .
      </LegalSection>
    </LegalPage>
  );
}
