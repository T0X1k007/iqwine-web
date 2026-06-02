'use client';

import { useCallback, useState, type FormEvent } from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import TurnstileModal from '@/components/ui/TurnstileModal';
import { useLocale } from '@/lib/i18n';
import { getBeta, getEyebrows, MSP_SIZES, APP_SIGNUP_URL } from '@/lib/constants';

/**
 * VagueFondateurs — V4 rebuild de BetaAccess.
 *
 * Corrige le bug critique : BetaAccess V3 affichait "100 celliers · Lock"
 * mais N'AVAIT PAS DE FORMULAIRE. V4 ajoute le formulaire complet branché
 * sur /api/beta-signup (existant : Resend + Turnstile + rate-limit Zod).
 *
 * Layout 2 colonnes (lg+) :
 *   LEFT  — display "100" CountUp + lock signal + détail italic éditorial
 *   RIGHT — formulaire fondateurs (nom, email, taille cellier, plan, note)
 *
 * Plan choice (NEW V4) — prepend dans `note` côté client pour éviter toute
 * modification backend ("aucune modification backend sensible" Eric V4-bis).
 *
 * Turnstile via modal existant. Pas de localStorage, pas de cookie, pas
 * de tracking. CTA "Demander l'accès" (jamais "Acheter maintenant").
 */

type CellarSize = (typeof MSP_SIZES)[number];

type PlanChoice = 'standard' | 'pro' | 'undecided';

const PLAN_LABELS: Record<PlanChoice, Record<'fr' | 'en', string>> = {
  standard: {
    fr: 'Standard · 149 $/an',
    en: 'Standard · $149/year',
  },
  pro: {
    fr: 'Pro · 299 $/an',
    en: 'Pro · $299/year',
  },
  undecided: {
    fr: 'Je verrai à la fin de mes 14 jours',
    en: 'I\'ll decide after my 14 free days',
  },
};

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

export default function VagueFondateurs() {
  const { locale } = useLocale();
  const beta = getBeta(locale);
  const eyebrows = getEyebrows(locale);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cellarSize, setCellarSize] = useState<CellarSize | ''>('');
  const [planChoice, setPlanChoice] = useState<PlanChoice>('undecided');
  const [note, setNote] = useState('');
  const [website, setWebsite] = useState(''); // honeypot, must stay empty
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [turnstileOpen, setTurnstileOpen] = useState(false);

  const t = useCallback(
    (fr: string, en: string) => (locale === 'fr' ? fr : en),
    [locale],
  );

  const validate = useCallback((): string | null => {
    if (!name.trim()) return t('Votre nom est requis.', 'Your name is required.');
    if (!email.trim()) return t('Votre courriel est requis.', 'Your email is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      return t('Courriel invalide.', 'Invalid email.');
    }
    if (!cellarSize) return t('Sélectionnez la taille de votre cave.', 'Select your cellar size.');
    return null;
  }, [name, email, cellarSize, t]);

  const submitToApi = useCallback(
    async (captchaToken: string | null) => {
      setSubmitting(true);
      setError(null);
      try {
        // Compose note : plan choice prepended (zéro modification backend).
        const planLabel = PLAN_LABELS[planChoice][locale];
        const finalNote = [
          `Plan envisagé : ${planLabel}`,
          note.trim() ? note.trim() : null,
        ]
          .filter(Boolean)
          .join('\n\n');

        const res = await fetch('/api/beta-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company: name.trim(),
            email: email.trim(),
            mspSize: cellarSize,
            planChoice, // V15+ Option C — passé séparément pour structurer côté app
            note: finalNote,
            website,
            captchaToken,
          }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(
            data.error ||
              t(
                'Une erreur est survenue. Réessayez dans un instant.',
                'Something went wrong. Try again in a moment.',
              ),
          );
        }
        setSuccess(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : t('Erreur inconnue.', 'Unknown error.'),
        );
      } finally {
        setSubmitting(false);
        setTurnstileOpen(false);
      }
    },
    [name, email, cellarSize, note, planChoice, website, locale, t],
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      const err = validate();
      if (err) {
        setError(err);
        return;
      }
      // Si Turnstile configuré → modal puis submit. Sinon → submit direct.
      if (TURNSTILE_SITE_KEY) {
        setTurnstileOpen(true);
      } else {
        void submitToApi(null);
      }
    },
    [validate, submitToApi],
  );

  const handleTurnstileVerified = useCallback(
    (token: string) => {
      void submitToApi(token);
    },
    [submitToApi],
  );

  return (
    <SectionWrapper id="beta" withDivider rhythm="editorial">
      <FadeInOnScroll>
        <div className="text-center mb-12 sm:mb-16">
          <div className="iq-eyebrow mb-6">{eyebrows.beta}</div>
          <h2 className="iq-display italic max-w-3xl mx-auto">{beta.title}</h2>
          <p className="iq-lead mt-6 max-w-2xl mx-auto">{beta.description}</p>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-6xl mx-auto">
        {/* LEFT — CTA d'essai primaire (sans carte) + accès prioritaire optionnel */}
        <FadeInOnScroll delay={0.15} className="lg:col-span-5">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-14 h-14 rounded-full bg-or/10 border border-or/30 flex items-center justify-center mb-8">
              <Sparkles size={20} strokeWidth={1.5} className="text-or" />
            </div>

            <p className="font-[family-name:var(--font-display)] italic text-foreground-dim text-xl sm:text-2xl max-w-md leading-relaxed mb-8">
              {beta.detail}
            </p>

            <a href={APP_SIGNUP_URL} className="w-full sm:w-auto">
              <Button variant="or" size="lg" className="w-full sm:w-auto">
                {locale === 'fr'
                  ? 'Commencer — 14 jours, sans carte'
                  : 'Start free — 14 days, no card'}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>

            <div className="flex items-center gap-3 pt-6 mt-8 border-t border-border w-full lg:w-auto">
              <div className="w-8 h-px bg-or/40" />
              <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
                {beta.note}
              </p>
              <div className="w-8 h-px bg-or/40 lg:hidden" />
            </div>
          </div>
        </FadeInOnScroll>

        {/* RIGHT — formulaire */}
        <FadeInOnScroll delay={0.3} className="lg:col-span-7">
          <div className="relative bg-card border border-border-strong rounded-2xl p-6 sm:p-10">
            {success ? (
              <SuccessBanner locale={locale} email={email} />
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3 className="iq-h4 mb-2">
                  {t('Accès prioritaire fondateurs (optionnel)', 'Founder priority access (optional)')}
                </h3>
                <p className="iq-small text-foreground-dim mb-4">
                  {t(
                    'Facultatif. Votre essai gratuit démarre déjà en un clic ci-dessus. Laissez-nous un mot et nous accompagnons les fondateurs sous 48 h.',
                    'Optional. Your free trial already starts in one click above. Leave us a word and we onboard founders within 48 hours.',
                  )}
                </p>

                <Input
                  id="founder-name"
                  label={t('Nom', 'Name')}
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  id="founder-email"
                  label={t('Courriel', 'Email')}
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <CellarSizeSelect
                  value={cellarSize}
                  onChange={setCellarSize}
                  locale={locale}
                />

                <PlanChoiceField
                  value={planChoice}
                  onChange={setPlanChoice}
                  locale={locale}
                />

                <NoteField
                  value={note}
                  onChange={setNote}
                  locale={locale}
                />

                {/* Honeypot — invisible aux humains, attire les bots */}
                <input
                  type="text"
                  name="website"
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="hidden"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />

                {error && (
                  <p className="font-mono text-[11px] tracking-wide text-danger">
                    {error}
                  </p>
                )}

                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground-faint leading-relaxed mt-2">
                  {t(
                    '14 jours gratuits · Aucune carte requise · TPS/TVQ en sus',
                    '14 free days · No credit card · Taxes extra',
                  )}
                </p>

                <div className="flex items-center gap-4 mt-2">
                  <Button
                    type="submit"
                    variant="or"
                    size="lg"
                    disabled={submitting}
                    className="flex-1 sm:flex-none"
                  >
                    {submitting
                      ? t('Envoi…', 'Sending…')
                      : t('Demander l\'accès', 'Request access')}
                    {!submitting && <ArrowRight size={16} strokeWidth={1.75} />}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </FadeInOnScroll>
      </div>

      {TURNSTILE_SITE_KEY && (
        <TurnstileModal
          open={turnstileOpen}
          siteKey={TURNSTILE_SITE_KEY}
          locale={locale}
          title={t('Vérification', 'Verification')}
          description={t(
            'Une courte vérification pour protéger les fondateurs.',
            'A short verification to protect the founders.',
          )}
          loadingText={t('Chargement…', 'Loading…')}
          errorText={t(
            'La vérification a échoué. Réessayez.',
            'Verification failed. Try again.',
          )}
          cancelText={t('Annuler', 'Cancel')}
          onVerified={handleTurnstileVerified}
          onClose={() => setTurnstileOpen(false)}
        />
      )}
    </SectionWrapper>
  );
}

/* ───────────────────────── sub-fields ───────────────────────── */

function CellarSizeSelect({
  value,
  onChange,
  locale,
}: {
  value: CellarSize | '';
  onChange: (v: CellarSize | '') => void;
  locale: 'fr' | 'en';
}) {
  const labels: Record<CellarSize, Record<'fr' | 'en', string>> = {
    '1-50': { fr: '1 à 50 bouteilles', en: '1 to 50 bottles' },
    '51-200': { fr: '51 à 200 bouteilles', en: '51 to 200 bottles' },
    '201-500': { fr: '201 à 500 bouteilles', en: '201 to 500 bottles' },
    '501-1500': { fr: '501 à 1 500 bouteilles', en: '501 to 1,500 bottles' },
    '1500+': { fr: 'Plus de 1 500 bouteilles', en: 'More than 1,500 bottles' },
  };
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="founder-cellar"
        className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-muted-foreground"
      >
        {t('Taille de votre cave', 'Cellar size')}
      </label>
      <select
        id="founder-cellar"
        required
        value={value}
        onChange={(e) => onChange(e.target.value as CellarSize | '')}
        className="bg-sunk border border-border text-foreground rounded-md px-4 py-3 text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors duration-[140ms]"
      >
        <option value="" disabled>
          {t('Sélectionnez…', 'Select…')}
        </option>
        {MSP_SIZES.map((s) => (
          <option key={s} value={s}>
            {labels[s as CellarSize][locale]}
          </option>
        ))}
      </select>
    </div>
  );
}

function PlanChoiceField({
  value,
  onChange,
  locale,
}: {
  value: PlanChoice;
  onChange: (v: PlanChoice) => void;
  locale: 'fr' | 'en';
}) {
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const options: PlanChoice[] = ['standard', 'pro', 'undecided'];
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-muted-foreground">
        {t('Plan envisagé', 'Plan considered')}
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              type="button"
              key={opt}
              onClick={() => onChange(opt)}
              className={`text-left rounded-md px-4 py-3 text-[13px] transition-colors duration-[140ms] ease-[cubic-bezier(.32,.72,0,1)] border flex items-center gap-2 ${
                selected
                  ? 'border-or/60 bg-or/8 text-foreground'
                  : 'border-border text-foreground-dim hover:border-or/30 hover:text-foreground'
              }`}
              aria-pressed={selected}
            >
              {selected ? (
                <Check
                  size={14}
                  strokeWidth={2}
                  className="text-or flex-shrink-0"
                />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-border-strong flex-shrink-0" />
              )}
              <span>{PLAN_LABELS[opt][locale]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NoteField({
  value,
  onChange,
  locale,
}: {
  value: string;
  onChange: (v: string) => void;
  locale: 'fr' | 'en';
}) {
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="founder-note"
        className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-muted-foreground"
      >
        {t('Un mot sur votre cellier (optionnel)', 'A word about your cellar (optional)')}
      </label>
      <textarea
        id="founder-note"
        rows={3}
        maxLength={2000}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-sunk border border-border text-foreground rounded-md px-4 py-3 text-[15px] placeholder:text-foreground-faint focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors duration-[140ms] resize-none"
        placeholder={t(
          'Vos vignobles favoris, vos millésimes, votre rapport au vin…',
          'Your favorite wineries, your vintages, your relationship with wine…',
        )}
      />
    </div>
  );
}

function SuccessBanner({ locale, email }: { locale: 'fr' | 'en'; email: string }) {
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  return (
    <div className="flex flex-col items-center text-center py-4">
      <div className="w-14 h-14 rounded-full bg-or/10 border border-or/30 flex items-center justify-center mb-6">
        <Check size={22} strokeWidth={1.5} className="text-or" />
      </div>
      <h3 className="iq-h3 italic mb-3">
        {t('Bien reçu.', 'Received.')}
      </h3>
      <p className="iq-lead max-w-md mb-6">
        {t(
          'Nous prenons contact sous 48 heures à',
          'We\'ll reach out within 48 hours at',
        )}{' '}
        <span className="text-or font-medium">{email}</span>.
      </p>
      <p className="font-[family-name:var(--font-display)] italic text-foreground-faint text-sm sm:text-base max-w-md leading-relaxed">
        {t(
          '« Bienvenue dans la première vague. »',
          '"Welcome to the first wave."',
        )}
      </p>
    </div>
  );
}
