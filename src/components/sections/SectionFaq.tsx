'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';

/**
 * SectionFaq (#faq) — lève les objections au point de décision (avant/avec le
 * pricing). Accordéon NATIF <details> : zéro JS, accessible, zéro coût perf.
 * Aucune fausse promesse ; réponses factuelles alignées sur le produit réel.
 */

const QA: { q: Record<'fr' | 'en', string>; a: Record<'fr' | 'en', string> }[] = [
  {
    q: { fr: 'Dois-je donner ma carte de crédit ?', en: 'Do I need a credit card?' },
    a: {
      fr: 'Non. L’essai dure 14 jours, sans carte. Vous décidez ensuite.',
      en: 'No. The trial is 14 days, no card. You decide afterwards.',
    },
  },
  {
    q: { fr: 'Puis-je résilier ?', en: 'Can I cancel?' },
    a: {
      fr: 'Oui, à tout moment, en un geste. Aucun engagement.',
      en: 'Yes, anytime, in one tap. No commitment.',
    },
  },
  {
    q: { fr: 'Mes données sont-elles privées ?', en: 'Is my data private?' },
    a: {
      fr: 'Vos goûts et votre cave vous appartiennent : chiffrés, privés, exportables.',
      en: 'Your taste and cellar are yours: encrypted, private, exportable.',
    },
  },
  {
    q: { fr: 'La disponibilité SAQ, c’est partout ?', en: 'Is SAQ availability everywhere?' },
    a: {
      fr: 'Les disponibilités en temps réel couvrent la SAQ (Québec). Ailleurs, iQWine recommande depuis votre cave et par scan d’étiquette ou de carte.',
      en: 'Live availability covers the SAQ (Québec). Elsewhere, iQWine recommends from your cellar and via label or menu scan.',
    },
  },
  {
    q: { fr: 'Dois-je saisir toute ma cave d’abord ?', en: 'Must I enter my whole cellar first?' },
    a: {
      fr: 'Non. Commencez par un plat ou par la SAQ — ajoutez vos bouteilles quand vous voulez.',
      en: 'No. Start from a dish or the SAQ — add your bottles whenever you like.',
    },
  },
  {
    q: { fr: 'Sur quels appareils ?', en: 'On which devices?' },
    a: {
      fr: 'Sur le web et sur mobile (iOS), installable en un geste.',
      en: 'On the web and on mobile (iOS), installable in one tap.',
    },
  },
];

export default function SectionFaq() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <SectionWrapper id="faq" withDivider rhythm="standard">
      <FadeInOnScroll>
        <div className="text-center mb-10 sm:mb-14">
          <div className="iq-eyebrow mb-5">{t('Questions', 'Questions')}</div>
          <h2 className="iq-h1 italic">{t('Avant de commencer.', 'Before you start.')}</h2>
        </div>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.1}>
        <div className="mx-auto max-w-2xl divide-y divide-border border-y border-border">
          {QA.map((item) => (
            <details key={item.q.en} className="group">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-5 select-none">
                <span className="iq-h4 text-foreground">{item.q[locale]}</span>
                <span
                  aria-hidden
                  className="text-or text-2xl leading-none transition-transform duration-[200ms] ease-[cubic-bezier(.32,.72,0,1)] group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="iq-body text-foreground-dim pb-5 -mt-1 max-w-xl">
                {item.a[locale]}
              </p>
            </details>
          ))}
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
