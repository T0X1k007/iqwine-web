import type { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL_ENTITY, LEGAL_EFFECTIVE_DATE } from '@/lib/legal-meta';

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
    <main className="mx-auto max-w-2xl px-6 py-24 text-muted-foreground">
      <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl tracking-tight text-foreground mb-2 leading-tight">
        Conditions d’utilisation
      </h1>
      <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-foreground-faint mb-12">
        En vigueur le {LEGAL_EFFECTIVE_DATE}
      </p>

      <Section title="1. Qui nous sommes">
        iQWine est un service exploité par {LEGAL_ENTITY.legalName} (« iQWine »,
        « nous »), entreprise constituée au {LEGAL_ENTITY.jurisdiction}. Les
        présentes conditions régissent votre utilisation du service.
      </Section>

      <Section title="2. Acceptation">
        En créant un compte ou en utilisant iQWine, vous acceptez les présentes
        conditions ainsi que la{' '}
        <Link href="/confidentialite" className="text-or underline underline-offset-2 hover:text-foreground">
          Politique de confidentialité
        </Link>
        . Si vous n’y consentez pas, n’utilisez pas le service.
      </Section>

      <Section title="3. Le service">
        iQWine est un assistant numérique de gestion de cave à vin : inventaire,
        fenêtres de consommation, recommandations assistées par intelligence
        artificielle et fonctionnalités connexes. Un essai gratuit de 14 jours
        est offert, sans engagement. L’essai gratuit est limité à une
        utilisation par utilisateur. La suppression d’un compte ne réinitialise
        pas l’admissibilité à l’essai gratuit.
      </Section>

      <Section title="4. Votre compte">
        Vous êtes responsable de la confidentialité de vos identifiants et de
        l’exactitude des renseignements fournis. Un seul compte par personne,
        sauf forfaits multi-utilisateurs.
      </Section>

      <Section title="5. Forfaits, facturation et changements">
        Les forfaits payants sont facturés d’avance selon la périodicité choisie
        (mensuelle ou annuelle). Les limites d’utilisation dépendent du forfait.
        <List
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
      </Section>

      <Section title="6. Le Sommelier Virtuel et les recommandations">
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
      </Section>

      <Section title="7. Données SAQ et données de tiers">
        Certaines informations — notamment les prix, les disponibilités, les
        images et les descriptifs provenant de la Société des alcools du Québec
        (SAQ) ou d’autres sources tierces — sont fournies par ces tiers, à titre
        indicatif. Elles peuvent être inexactes, incomplètes ou modifiées sans
        préavis. iQWine n’est pas responsable de l’exactitude, de la
        disponibilité ni des prix affichés par des tiers.
      </Section>

      <Section title="8. Enrichissement automatique">
        Les fiches de vin peuvent être complétées automatiquement à partir de
        sources multiples et de synthèses générées par IA, signalées comme
        telles. Ces contenus sont fournis à titre d’information et peuvent
        comporter des imprécisions.
      </Section>

      <Section title="9. Usage acceptable">
        Vous vous engagez à ne pas détourner le service, à ne pas contourner ses
        limites techniques ou de sécurité, et à respecter les droits des tiers.
      </Section>

      <Section title="10. Limitation de responsabilité">
        Le service est fourni « tel quel » et « selon disponibilité ». Dans les
        limites permises par le droit applicable, iQWine ne saurait être tenue
        responsable des décisions prises sur la base des recommandations, de la
        perte de valeur, de la dégradation ou de la non-conformité d’une
        bouteille, ni des informations provenant de tiers. Rien dans les
        présentes ne limite les droits que la loi vous accorde de manière
        impérative.
      </Section>

      <Section title="11. Résiliation">
        Vous pouvez supprimer votre compte à tout moment depuis vos paramètres.
        Nous pouvons suspendre ou résilier un compte en cas de manquement aux
        présentes conditions.
      </Section>

      <Section title="12. Modifications">
        Nous pouvons modifier les présentes conditions. En cas de modification
        importante, votre acceptation vous sera redemandée avant que vous
        puissiez continuer à utiliser le service. La date d’entrée en vigueur
        ci-dessus indique la version applicable.
      </Section>

      <Section title="13. Droit applicable">
        Les présentes conditions sont régies par les lois applicables au{' '}
        {LEGAL_ENTITY.jurisdiction}, sans égard aux règles de conflit de lois.
      </Section>

      <Section title="14. Contact">
        Pour toute question relative aux présentes conditions : depuis
        l’application (section Support) ou via notre page{' '}
        <Link href="/contact" className="text-or underline underline-offset-2 hover:text-foreground">
          Contact
        </Link>
        .
      </Section>

      <p className="mt-16">
        <Link href="/" className="text-or underline underline-offset-4 hover:text-foreground">
          ← Retour à l’accueil
        </Link>
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-foreground mb-3">
        {title}
      </h2>
      <div className="text-[15px] leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}
