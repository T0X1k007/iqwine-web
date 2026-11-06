'use client';

import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import FilAriane from '@/components/ui/FilAriane';
import LocaleLink from '@/components/ui/LocaleLink';
import OctaveAnneau from '@/components/octave/OctaveAnneau';
import Button from '@/components/ui/Button';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { SIGNUP_CTA, SIGNUP_REASSURANCE } from '@/lib/trial';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import {
  GUIDE_PREMIERS_PAS,
  PAGES_GUIDE,
  type PageGuide,
  type QuestionGuide,
} from '@/lib/guide';
import { ArrowRight } from 'lucide-react';

/**
 * LE GUIDE D'OCTAVE, sur iqwine.ai (audit du 2026-11-06, lot P7).
 *
 * Il vivait seulement dans l'application (`app.iqwine.ai/apprendre`), qui est
 * fermée aux moteurs (`noindex, nofollow`) : ses réponses, les plus citables
 * du produit, n'existaient pour personne hors de l'app. On en republie ici la
 * part PUBLIQUE (voir `src/lib/guide.ts` pour ce qui est retiré et pourquoi),
 * sans toucher au noindex de l'application.
 *
 * Deux composants : l'accueil du Guide (premiers pas + sommaire des pages
 * thématiques) et la page thématique (sections à ancres, chaque réponse
 * TOUJOURS dans le HTML, sans accordéon : c'est une page de lecture).
 *
 * Ton : ivoire du début à la fin, sans nuit. Une page de réponses calmes,
 * Octave en signature, jamais un mur de texte : 40 à 80 mots par réponse.
 */

function Reponse({ item, t }: { item: QuestionGuide; t: (fr: string, en: string) => string }) {
  return (
    <article id={item.id} className="scroll-mt-28 border-b border-encre/10 py-6 last:border-b-0">
      <h3 className="font-[family-name:var(--font-display)] text-[21px] font-medium leading-snug text-encre sm:text-[23px]">
        {t(item.q.fr, item.q.en)}
      </h3>
      <p className="mt-2.5 max-w-[66ch] text-[15.5px] leading-relaxed text-encre-2 md:text-[16px]">
        {t(item.a.fr, item.a.en)}
      </p>
    </article>
  );
}

function Cta({ source }: { source: string }) {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  return (
    <div className="mt-7">
      <a
        href={buildSignupUrl(source, { lang: locale })}
        onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source })}
      >
        <Button variant="primary" size="lg">{t(SIGNUP_CTA.fr, SIGNUP_CTA.en)}</Button>
      </a>
      <p className="mt-4 text-[13px] tracking-wide text-encre-3">
        {t(SIGNUP_REASSURANCE.fr, SIGNUP_REASSURANCE.en)}
      </p>
    </div>
  );
}

/** Les liens de sortie communs aux pages du Guide (maillage contextuel). */
function AllerPlusLoin({ t }: { t: (fr: string, en: string) => string }) {
  const liens = [
    { href: '/apogee', fr: 'Lire la fenêtre de dégustation', en: 'Reading the drinking window' },
    { href: '/sommelier-ia#verifiable', fr: 'Ce qu’Octave ne fait jamais', en: 'What Octave never does' },
    { href: '/cellier-intelligent', fr: 'L’application de cave', en: 'The cellar app' },
    { href: '/carte-des-vins', fr: 'La carte des vins au restaurant', en: 'Restaurant wine lists' },
  ];
  return (
    <div className="mx-auto mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[14px]">
      {liens.map((l) => (
        <LocaleLink
          key={l.href}
          href={l.href}
          className="inline-flex items-center gap-1.5 font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
        >
          {t(l.fr, l.en)}
          <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
        </LocaleLink>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// L'accueil du Guide
// ─────────────────────────────────────────────────────────────────────────

export function GuideAccueilContent() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <main>
      <section className="mouvement-jour relative" style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="mx-auto max-w-[1440px] px-6 pb-8 pt-8 lg:px-8 lg:pt-10">
          <FilAriane
            elements={[
              { label: t('Accueil', 'Home'), href: '/' },
              { label: t('Le Guide d’Octave', 'Octave’s Guide') },
            ]}
          />
          <div className="mx-auto mt-9 max-w-[820px]">
            <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
              {t('Le Guide d’Octave', 'Octave’s Guide')}
            </p>
            <h1
              className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
              style={{ fontSize: 'clamp(34px, 5vw, 58px)' }}
            >
              {t('Le vin et votre cave, ', 'Wine and your cellar, ')}
              <span className="text-bordeaux-jour">{t('expliqués simplement.', 'explained simply.')}</span>
            </h1>
            <p className="mt-5 max-w-[60ch] text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]">
              {t(
                'Les questions qu’on pose à un sommelier, et les réponses d’Octave : choisir un vin pour un plat ou sur une carte, tenir sa cave, comprendre comment il apprend votre goût. Clairement, sans jargon, et sans jamais inventer un vin.',
                'The questions you’d ask a sommelier, and Octave’s answers: choosing a wine for a dish or from a list, keeping your cellar, understanding how he learns your taste. Clearly, without jargon, and without ever making up a wine.',
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Les pages thématiques : le sommaire, chaque question est un lien. */}
      <section className="mouvement-jour relative">
        <div className="mx-auto grid max-w-[1060px] gap-6 px-6 pb-6 lg:grid-cols-2 lg:px-8">
          {PAGES_GUIDE.map((page: PageGuide) => (
            <FadeInOnScroll key={page.path}>
              <div className="h-full rounded-[18px] border border-encre/10 bg-[#fdfaf3] p-6 shadow-[0_24px_60px_-34px_rgba(60,38,18,0.35)] lg:p-7">
                <h2 className="font-[family-name:var(--font-display)] text-[28px] font-medium leading-tight text-encre">
                  <LocaleLink href={page.path} className="transition-colors hover:text-bordeaux-jour">
                    {t(page.titre.fr, page.titre.en)}
                  </LocaleLink>
                </h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-encre-2">{t(page.accroche.fr, page.accroche.en)}</p>
                <ul className="mt-4 space-y-1.5 border-t border-encre/10 pt-4">
                  {page.sections
                    .flatMap((s) => s.questions)
                    .map((q) => (
                      <li key={q.id}>
                        <LocaleLink
                          href={`${page.path}#${q.id}`}
                          className="text-[14px] leading-snug text-encre-2 transition-colors hover:text-bordeaux-jour"
                        >
                          {t(q.q.fr, q.q.en)}
                        </LocaleLink>
                      </li>
                    ))}
                </ul>
              </div>
            </FadeInOnScroll>
          ))}
        </div>
      </section>

      <section className="mouvement-jour relative" id="premiers-pas">
        <div className="mx-auto max-w-[820px] px-6 py-10 lg:px-8 lg:py-14">
          <h2
            className="font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em] text-encre"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            {t('Premiers pas', 'First steps')}
          </h2>
          <div className="mt-2">
            {GUIDE_PREMIERS_PAS.map((q) => (
              <Reponse key={q.id} item={q} t={t} />
            ))}
          </div>
          <figure className="mt-8 rounded-[16px] border border-or-jour/30 bg-[#fdfaf3] px-5 py-4">
            <blockquote className="font-[family-name:var(--font-display)] text-[17px] italic leading-snug text-encre sm:text-[18.5px]">
              {t(
                '« Je préfère vous dire “je ne sais pas” plutôt que vous induire en erreur. »',
                '“I’d rather tell you ‘I don’t know’ than mislead you.”',
              )}
            </blockquote>
            <figcaption className="mt-2.5 inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.22em] text-or-jour">
              <OctaveAnneau size={14} className="text-or-jour" />
              Octave
            </figcaption>
          </figure>
          <div className="text-center">
            <Cta source="guide" />
          </div>
          <AllerPlusLoin t={t} />
        </div>
      </section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Une page thématique
// ─────────────────────────────────────────────────────────────────────────

export function GuidePageContent({ page }: { page: PageGuide }) {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const autres = PAGES_GUIDE.filter((p) => p.path !== page.path);

  return (
    <main>
      <section className="mouvement-jour relative" style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="mx-auto max-w-[1440px] px-6 pb-6 pt-8 lg:px-8 lg:pt-10">
          <FilAriane
            elements={[
              { label: t('Accueil', 'Home'), href: '/' },
              { label: t('Le Guide d’Octave', 'Octave’s Guide'), href: '/guide' },
              { label: t(page.titre.fr, page.titre.en) },
            ]}
          />
          <div className="mx-auto mt-9 max-w-[820px]">
            <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
              {t('Le Guide d’Octave', 'Octave’s Guide')}
            </p>
            <h1
              className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
              style={{ fontSize: 'clamp(34px, 5vw, 56px)' }}
            >
              {t(page.titre.fr, page.titre.en)}
            </h1>
            <p className="mt-4 max-w-[60ch] text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]">
              {t(page.accroche.fr, page.accroche.en)}
            </p>
            {/* Sommaire : une ancre par section. */}
            <nav aria-label={t('Sommaire', 'Contents')} className="mt-6 flex flex-wrap gap-2">
              {page.sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-full border border-encre/12 px-3.5 py-1.5 text-[13px] text-encre-2 transition-colors hover:border-bordeaux-jour/40 hover:text-bordeaux-jour"
                >
                  {t(s.titre.fr, s.titre.en)}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Capture à fournir par Éric (compte de démonstration) : un écran réel
          par page thématique (Conseils : une recommandation avec son
          « pourquoi » ; Cave : l'écran d'import avec la correspondance des
          colonnes). Aucune image servie tant qu'elle n'existe pas. */}

      <section className="mouvement-jour relative">
        <div className="mx-auto max-w-[820px] px-6 pb-10 lg:px-8 lg:pb-14">
          {page.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 pt-8">
              <h2
                className="font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em] text-encre"
                style={{ fontSize: 'clamp(26px, 3.6vw, 40px)' }}
              >
                {t(s.titre.fr, s.titre.en)}
              </h2>
              <div className="mt-1">
                {s.questions.map((q) => (
                  <Reponse key={q.id} item={q} t={t} />
                ))}
              </div>
            </section>
          ))}

          <div className="mt-10 rounded-[16px] border border-encre/10 bg-[#fdfaf3] p-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-encre-3">
              {t('Dans le Guide', 'In the Guide')}
            </p>
            <ul className="mt-2 space-y-1.5">
              {autres.map((p) => (
                <li key={p.path}>
                  <LocaleLink
                    href={p.path}
                    className="inline-flex items-center gap-1.5 text-[15px] font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
                  >
                    {t(p.titre.fr, p.titre.en)}
                    <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
                  </LocaleLink>
                </li>
              ))}
              <li>
                <LocaleLink
                  href="/guide"
                  className="inline-flex items-center gap-1.5 text-[15px] font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
                >
                  {t('Premiers pas', 'First steps')}
                  <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
                </LocaleLink>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <Cta source="guide" />
          </div>
          <AllerPlusLoin t={t} />
        </div>
      </section>
    </main>
  );
}
