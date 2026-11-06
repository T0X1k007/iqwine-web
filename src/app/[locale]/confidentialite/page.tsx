import LocaleLink from '@/components/ui/LocaleLink';
import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import { NOTICE_EN, textePolitique, type LangueLegale } from '@/lib/legal-terms';
import { LegalPage, LegalSection, LegalList } from '@/components/legal/legal-ui';

const TEXTES = {
  fr: {
    title: 'Politique de confidentialité · iQWine',
    description:
      'Politique de confidentialité et protection des renseignements personnels (Loi 25).',
  },
  en: {
    title: 'Privacy Policy · iQWine',
    description:
      'Privacy policy and protection of personal information (Quebec’s Law 25).',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/confidentialite', locale, TEXTES);
}

/**
 * LES AJOUTS PROPRES AU SITE, et eux seuls.
 *
 * Le canonique décrit l'APPLICATION. Le site, lui, recueille aussi ce que
 * l'on écrit dans son formulaire de contact, et offre la page Contact comme
 * voie de demande. L'ancienne page manuscrite le disait ; la synchronisation
 * ne doit pas le faire disparaître, sans quoi la Politique du site cesserait
 * de décrire une collecte qu'il fait réellement (Loi 25, transparence).
 *
 * Le français reprend les phrases de l'ancienne page, à peine détachées de
 * leur paragraphe. L'anglais est une traduction faite le 2026-11-06, À FAIRE
 * RELIRE : ce sont les trois seules phrases de /en/privacy qui ne viennent
 * pas du canonique.
 */
const AJOUTS_SITE = {
  p1: {
    fr: 'Depuis le site, vous pouvez aussi passer par notre page ',
    en: 'From this website, you can also use our ',
  },
  p1Lien: { fr: 'Contact', en: 'Contact page' },
  p2: {
    fr: 'Lorsque vous nous écrivez depuis le site, nous recueillons les renseignements que vous fournissez (nom, courriel, message).',
    en: 'When you write to us from this website, we collect the information you provide (name, email, message).',
  },
  p3: {
    fr: 'Les renseignements transmis depuis le site servent aussi à répondre à vos demandes.',
    en: 'Information sent from this website is also used to answer your requests.',
  },
} as const;

/**
 * /confidentialite, Politique de confidentialité publique du site iQWine.
 *
 * ── Le texte n'est PLUS rédigé ici (audit du 2026-11-06, constat V-16) ────
 * Il vient de `legal-terms.generated.json`, copie committée des clés
 * `Legal.privacy.*` de cellier-vin, régénérée par `npm run legal:synchroniser`
 * et gardée par `npm run legal:verifier`, exactement comme les Conditions.
 *
 * Deux défauts y ont mis fin :
 *   1. la page manuscrite avait DÉRIVÉ du canonique : elle ignorait les
 *      photos et dictées transmises au fournisseur d'IA, et ce fournisseur
 *      lui-même (Google Gemini, aux États-Unis), que l'app divulgue ;
 *   2. /en/privacy servait ce texte FRANÇAIS sous une URL anglaise, alors
 *      que le canonique possède sa version anglaise. Elle est servie telle
 *      quelle, avec le bandeau « la version française fait foi » que les
 *      Conditions portent déjà (`NOTICE_EN`, lui aussi tiré du canonique).
 *
 * Mêmes huit sections, même ordre, mêmes titres que la page de l'app.
 */
export default async function ConfidentialitePage({ params }: ParamsLocale) {
  const { locale } = await params;
  const langue: LangueLegale = locale === 'en' ? 'en' : 'fr';
  const t = (cle: string) => textePolitique(langue, cle);

  return (
    <LegalPage title={t('h1')} meta={t('effectiveOn')} langue={langue}>
      {langue === 'en' && (
        <p className="mb-10 rounded-lg border border-border px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
          {NOTICE_EN}
        </p>
      )}

      <LegalSection title={t('p1Title')}>
        <p>{t('p1Body')}</p>
        <p>
          {AJOUTS_SITE.p1[langue]}
          <LocaleLink href="/contact" className="text-or underline underline-offset-2 hover:text-foreground">
            {AJOUTS_SITE.p1Lien[langue]}
          </LocaleLink>
          .
        </p>
      </LegalSection>

      <LegalSection title={t('p2Title')}>
        <p>{t('p2Body')}</p>
        <p>{AJOUTS_SITE.p2[langue]}</p>
      </LegalSection>

      <LegalSection title={t('p3Title')}>
        <p>{t('p3Body')}</p>
        <p>{AJOUTS_SITE.p3[langue]}</p>
      </LegalSection>

      <LegalSection title={t('p4Title')}>{t('p4Body')}</LegalSection>

      <LegalSection title={t('p5Title')}>
        {t('p5Intro')}
        <LegalList items={[1, 2, 3, 4, 5].map((n) => t(`p5Item${n}`))} />
      </LegalSection>

      <LegalSection title={t('p6Title')}>{t('p6Body')}</LegalSection>
      {/* §7 nomme « la Société des alcools du Québec (SAQ) » comme source :
          raison sociale exigée par la divulgation, exception LOCKED au
          vocabulaire « en magasin ». Ne pas la réécrire ici. */}
      <LegalSection title={t('p7Title')}>{t('p7Body')}</LegalSection>
      <LegalSection title={t('p8Title')}>{t('p8Body')}</LegalSection>
    </LegalPage>
  );
}
