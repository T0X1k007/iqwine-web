import type { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL_ENTITY, LEGAL_EFFECTIVE_DATE } from '@/lib/legal-meta';
import { LegalPage, LegalSection, LegalList } from '@/components/legal/legal-ui';

export const metadata: Metadata = {
  alternates: { canonical: '/confidentialite' },
  title: 'Politique de confidentialité — iQWine',
  description:
    'Politique de confidentialité et protection des renseignements personnels (Loi 25).',
};

/**
 * /confidentialite — Politique de confidentialité publique du site iQWine.
 * Contenu aligné sur la page canonique de l'application (Loi 25, Québec).
 * À garder synchrone avec cellier-vin.
 */
export default function ConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      meta={`En vigueur le ${LEGAL_EFFECTIVE_DATE} · Conforme à la Loi 25 (Québec)`}
    >
      <LegalSection title="Responsable de la protection des renseignements">
        iQWine est exploité par {LEGAL_ENTITY.legalName}, située à{' '}
        {LEGAL_ENTITY.city}, qui agit à titre de responsable des renseignements
        personnels au sens de la Loi 25. Toute demande (accès, rectification,
        suppression, retrait du consentement, plainte) peut être transmise
        depuis l’application (section Support) ou via notre page{' '}
        <Link href="/contact" className="text-or underline underline-offset-2 hover:text-foreground">
          Contact
        </Link>
        , et est traitée par notre responsable de la protection des
        renseignements personnels.
      </LegalSection>

      <LegalSection title="Renseignements que nous recueillons">
        À la création du compte : nom, adresse courriel, adresse IP (sécurité).
        À l’utilisation : données de votre cave (bouteilles, dégustations,
        préférences) et données techniques d’usage. Lorsque vous nous écrivez
        depuis le site, nous recueillons les renseignements que vous fournissez
        (nom, courriel, message). Les renseignements de paiement sont traités
        directement par notre prestataire de paiement (Stripe) et ne sont pas
        conservés par iQWine.
      </LegalSection>

      <LegalSection title="Finalités">
        Fournir et améliorer le service, générer des recommandations, assurer la
        facturation, la sécurité et le support, et répondre à vos demandes. Nous
        ne vendons jamais vos renseignements personnels et ne les utilisons pas à
        des fins de marketing sans votre consentement distinct.
      </LegalSection>

      <LegalSection title="Consentement et retrait">
        La création d’un compte requiert votre consentement explicite à la
        présente politique et aux conditions d’utilisation, dont nous conservons
        une preuve horodatée et versionnée. Le consentement marketing est
        distinct et facultatif. Vous pouvez retirer votre consentement à tout
        moment depuis vos paramètres ou en nous contactant.
      </LegalSection>

      <LegalSection title="Conservation des renseignements">
        Nous conservons vos renseignements le temps nécessaire aux finalités
        ci-dessus :
        <LegalList
          items={[
            'Données de compte et de cave : tant que votre compte est actif ; anonymisées ou supprimées après la suppression du compte.',
            'Renseignements de facturation et fiscaux : conservés pour la durée requise par nos obligations légales et comptables.',
            'Preuves de consentement : conservées à des fins probatoires conformément à la Loi 25.',
            'Admissibilité à l’essai gratuit : après la suppression de votre compte, nous conservons un registre minimal (adresse courriel normalisée et empreinte technique non réversible) à seule fin de prévenir l’abus des essais gratuits. Aucune adresse IP brute n’est conservée.',
            'Journaux techniques et de sécurité : conservés pour une durée limitée.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Communication à des tiers et hors Québec">
        Nous faisons appel à des prestataires pour exploiter le service, dont
        certains peuvent traiter des renseignements hors Québec : hébergement et
        base de données, courriel transactionnel, prestataire de paiement,
        fournisseurs d’intelligence artificielle, et observabilité (suivi des
        erreurs et journalisation). Nous mettons en place les mesures
        nécessaires pour que ces communications offrent une protection adéquate
        de vos renseignements. Nous ne vendons ni ne louons vos renseignements
        personnels.
      </LegalSection>

      <LegalSection title="Données de tiers (détaillants et sources publiques)">
        Certaines informations relatives aux produits, aux prix, aux
        disponibilités et aux points de vente peuvent provenir de sources
        publiques ou de détaillants tiers. Ces données appartiennent à leurs
        détenteurs respectifs, sont fournies à titre informatif seulement et
        peuvent différer de celles affichées par les détaillants concernés.
        Malgré nos efforts pour les maintenir à jour, leur exactitude, leur
        disponibilité et leur exhaustivité ne peuvent être garanties.
      </LegalSection>

      <LegalSection title="Vos droits (Loi 25)">
        Vous avez le droit d’accéder à vos renseignements, de les rectifier, de
        les faire supprimer, de retirer votre consentement et de porter plainte.
        Vous pouvez exporter vos données personnelles et supprimer votre compte
        directement depuis vos paramètres, section confidentialité.
      </LegalSection>
    </LegalPage>
  );
}
