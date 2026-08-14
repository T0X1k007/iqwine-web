import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import { LegalPage, LegalSection, LegalList } from '@/components/legal/legal-ui';
import { TexteRiche } from '@/components/legal/TexteRiche';
import { NOTICE_EN, texteLegal, type LangueLegale } from '@/lib/legal-terms';
import type { ReactNode } from 'react';

const TEXTES = {
  fr: {
    title: 'Conditions d’utilisation · iQWine',
    description: 'Conditions d’utilisation du service iQWine.',
  },
  en: {
    title: 'Terms of Use · iQWine',
    description: 'Terms of use for the iQWine service.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/conditions', locale, TEXTES);
}

/**
 * /conditions — les Conditions d'utilisation publiques du site.
 *
 * Le texte n'est PLUS rédigé ici : il vient de `legal-terms.generated.json`,
 * copie committée du canonique (clés `Legal.terms.*` de cellier-vin),
 * régénérée par `npm run legal:synchroniser` et gardée par
 * `npm run legal:verifier`. La version EN est une vraie traduction ; le
 * bandeau rappelle que le français fait foi. 21 sections, mêmes numéros que
 * l'application — c'est le même contrat.
 */
export default async function ConditionsPage({ params }: ParamsLocale) {
  const { locale } = await params;
  const langue: LangueLegale = locale === 'en' ? 'en' : 'fr';
  const t = (cle: string) => texteLegal(langue, cle);

  const appleItems = Array.from({ length: 9 }, (_, i) => t(`s13AppleItem${i + 1}`));

  return (
    <LegalPage title={t('h1')} meta={t('effectiveOn')}>
      {langue === 'en' && (
        <p className="mb-10 rounded-lg border border-border px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
          {NOTICE_EN}
        </p>
      )}

      <LegalSection title={t('s1Title')}>{t('s1Body')}</LegalSection>

      <LegalSection title={t('s2Title')}>
        <p>
          <TexteRiche>{t('s2Body')}</TexteRiche>
        </p>
        <p>{t('s2Age')}</p>
      </LegalSection>

      <LegalSection title={t('s3Title')}>{t('s3Body')}</LegalSection>
      <LegalSection title={t('s4Title')}>{t('s4Body')}</LegalSection>

      <LegalSection title={t('s5Title')}>
        {t('s5Intro')}
        <LegalList items={[t('s5Item1'), t('s5Item2'), t('s5Item3')]} />
        <p>
          <TexteRiche>{t('s5Price')}</TexteRiche>
        </p>
        <p>
          <TexteRiche>{t('s5Refund')}</TexteRiche>
        </p>
      </LegalSection>

      <LegalSection title={t('s6Title')}>
        <TexteRiche>{t('s6Body')}</TexteRiche>
      </LegalSection>
      <LegalSection title={t('s7Title')}>{t('s7Body')}</LegalSection>
      <LegalSection title={t('s8Title')}>{t('s8Body')}</LegalSection>
      <LegalSection title={t('s9Title')}>{t('s9Body')}</LegalSection>

      <LegalSection title={t('s10Title')}>
        <p>{t('s10Body')}</p>
        <p>{t('s10Mark')}</p>
      </LegalSection>

      <LegalSection title={t('s11Title')}>{t('s11Body')}</LegalSection>

      <LegalSection title={t('s12Title')}>
        <p>{t('s12Body')}</p>
        <p>{t('s12Auto')}</p>
        <p>{t('s12Pro')}</p>
      </LegalSection>

      <LegalSection title={t('s13Title')}>
        <p>{t('s13Intro')}</p>
        <SousTitre>{t('s13AppleTitle')}</SousTitre>
        <p>{t('s13AppleIntro')}</p>
        <LegalList items={appleItems} />
        <SousTitre>{t('s13GoogleTitle')}</SousTitre>
        <p>{t('s13GoogleBody')}</p>
      </LegalSection>

      <LegalSection title={t('s14Title')}>{t('s14Body')}</LegalSection>
      <LegalSection title={t('s15Title')}>{t('s15Body')}</LegalSection>
      <LegalSection title={t('s16Title')}>{t('s16Body')}</LegalSection>
      <LegalSection title={t('s17Title')}>{t('s17Body')}</LegalSection>
      <LegalSection title={t('s18Title')}>{t('s18Body')}</LegalSection>

      <LegalSection title={t('s19Title')}>
        <p>
          <TexteRiche>{t('s19Item1')}</TexteRiche>
        </p>
        <p>
          <TexteRiche>{t('s19Item2')}</TexteRiche>
        </p>
        <p>
          <TexteRiche>{t('s19Item3')}</TexteRiche>
        </p>
        <p>
          <TexteRiche>{t('s19Item4')}</TexteRiche>
        </p>
      </LegalSection>

      <LegalSection title={t('s20Title')}>{t('s20Body')}</LegalSection>

      <LegalSection title={t('s21Title')}>
        <TexteRiche>{t('s21Body')}</TexteRiche>
      </LegalSection>
    </LegalPage>
  );
}

function SousTitre({ children }: { children: ReactNode }) {
  return (
    <h3 className="pt-2 font-[family-name:var(--font-display)] text-lg tracking-tight text-encre">
      {children}
    </h3>
  );
}
