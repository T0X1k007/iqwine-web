'use client';

import { useCallback, useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useLocale } from '@/lib/i18n';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * BetaForm — candidature bêta-testeur (page /beta). Formulaire de sélection
 * court (bonnes pratiques Centercode/BetaTesting : ~8 questions, une ouverte à
 * la fin pour jauger la motivation et la qualité de communication).
 *
 * POST vers /api/contact avec category='BETA' ; les réponses sont assemblées en
 * un message structuré (FR, pour l'admin). Même flux/honeypot que ContactForm.
 */

type Opt = { value: string; fr: string; en: string };

const CELLAR: Opt[] = [
  { value: 'real', fr: 'Oui, une vraie cave', en: 'Yes, a real cellar' },
  { value: 'starting', fr: 'Je débute une collection', en: 'Starting a collection' },
  { value: 'soon', fr: 'Pas encore, mais bientôt', en: 'Not yet, but soon' },
];
const BOTTLES: Opt[] = [
  { value: '<25', fr: 'Moins de 25', en: 'Fewer than 25' },
  { value: '25-100', fr: '25 à 100', en: '25 to 100' },
  { value: '100-300', fr: '100 à 300', en: '100 to 300' },
  { value: '300+', fr: 'Plus de 300', en: 'More than 300' },
];
const TOOL: Opt[] = [
  { value: 'memory', fr: 'De mémoire / rien', en: 'From memory / nothing' },
  { value: 'spreadsheet', fr: 'Un tableur', en: 'A spreadsheet' },
  { value: 'app', fr: 'Une autre app', en: 'Another app' },
];
const DEVICE: Opt[] = [
  { value: 'iphone', fr: 'iPhone', en: 'iPhone' },
  { value: 'web', fr: 'Web (ordinateur)', en: 'Web (desktop)' },
  { value: 'both', fr: 'Les deux', en: 'Both' },
];
const TIME: Opt[] = [
  { value: '<1', fr: 'Moins d’1 h', en: 'Less than 1 h' },
  { value: '1-3', fr: '1 à 3 h', en: '1 to 3 h' },
  { value: '3+', fr: 'Plus de 3 h', en: 'More than 3 h' },
];

const labelFr = (opts: Opt[], value: string) => opts.find((o) => o.value === value)?.fr ?? value;

const SELECT_CLASS =
  'bg-sunk border border-border text-foreground rounded-md px-4 py-3 text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors';
const LABEL_CLASS =
  'font-body text-[11px] font-medium tracking-[0.22em] uppercase text-muted-foreground';

export default function BetaForm() {
  const { locale } = useLocale();
  const t = useCallback((fr: string, en: string) => (locale === 'fr' ? fr : en), [locale]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cellar, setCellar] = useState('');
  const [bottles, setBottles] = useState('');
  const [tool, setTool] = useState('');
  const [toolOther, setToolOther] = useState('');
  const [device, setDevice] = useState('');
  const [time, setTime] = useState('');
  const [motivation, setMotivation] = useState('');
  const [website, setWebsite] = useState(''); // honeypot, doit rester vide
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
        setError(t('Courriel invalide.', 'Invalid email.'));
        return;
      }
      if (!cellar || !bottles || !tool || !device || !time) {
        setError(t('Merci de répondre à toutes les questions.', 'Please answer every question.'));
        return;
      }
      if (motivation.trim().length < 10) {
        setError(
          t('Dites-nous-en un peu plus (quelques mots).', 'Tell us a little more (a few words).'),
        );
        return;
      }

      const message = [
        'Candidature bêta-testeur',
        '',
        `Cave : ${labelFr(CELLAR, cellar)}`,
        `Bouteilles : ${labelFr(BOTTLES, bottles)}`,
        `Gestion actuelle : ${labelFr(TOOL, tool)}${
          tool === 'app' && toolOther.trim() ? ` — ${toolOther.trim()}` : ''
        }`,
        `Appareil : ${labelFr(DEVICE, device)}`,
        `Temps par semaine : ${labelFr(TIME, time)}`,
        '',
        'Attentes / à tester en premier :',
        motivation.trim(),
      ].join('\n');

      setSubmitting(true);
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: 'BETA',
            name: name.trim(),
            email: email.trim(),
            message,
            website,
          }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(
            data.error ||
              t('Une erreur est survenue. Réessayez.', 'Something went wrong. Try again.'),
          );
        }
        track(ANALYTICS_EVENTS.BETA_SUBMITTED, {});
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('Erreur inconnue.', 'Unknown error.'));
      } finally {
        setSubmitting(false);
      }
    },
    [name, email, cellar, bottles, tool, toolOther, device, time, motivation, website, t],
  );

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-10">
        <span className="inline-flex w-12 h-12 rounded-full bg-or/15 items-center justify-center">
          <Check className="w-6 h-6 text-or" strokeWidth={1.75} />
        </span>
        <p className="font-[family-name:var(--font-display)] text-2xl text-foreground">
          {t('Merci, candidature reçue.', 'Thank you, application received.')}
        </p>
        <p className="text-muted-foreground text-[15px] max-w-md">
          {t(
            'Les places sont limitées — nous revenons vers les profils retenus par courriel.',
            'Spots are limited — we get back to selected applicants by email.',
          )}
        </p>
      </div>
    );
  }

  const renderSelect = (
    id: string,
    label: string,
    value: string,
    setValue: (v: string) => void,
    options: Opt[],
  ) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        className={SELECT_CLASS}
      >
        <option value="" disabled>
          {t('Choisir…', 'Choose…')}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {locale === 'fr' ? o.fr : o.en}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="beta-name"
        label={t('Nom', 'Name')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        maxLength={200}
        placeholder={t('Votre nom', 'Your name')}
      />
      <Input
        id="beta-email"
        type="email"
        label={t('Courriel', 'Email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
        placeholder={t('vous@exemple.com', 'you@example.com')}
      />

      {renderSelect(
        'beta-cellar',
        t('Possédez-vous déjà une cave ?', 'Do you already own a cellar?'),
        cellar,
        setCellar,
        CELLAR,
      )}
      {renderSelect(
        'beta-bottles',
        t('Combien de bouteilles, environ ?', 'About how many bottles?'),
        bottles,
        setBottles,
        BOTTLES,
      )}
      {renderSelect(
        'beta-tool',
        t('Comment gérez-vous votre cave aujourd’hui ?', 'How do you manage your cellar today?'),
        tool,
        setTool,
        TOOL,
      )}
      {tool === 'app' && (
        <Input
          id="beta-tool-other"
          label={t('Laquelle ?', 'Which one?')}
          value={toolOther}
          onChange={(e) => setToolOther(e.target.value)}
          maxLength={80}
          placeholder={t('Ex. CellarTracker, Vivino…', 'e.g. CellarTracker, Vivino…')}
        />
      )}
      {renderSelect(
        'beta-device',
        t('Sur quel appareil testeriez-vous surtout ?', 'Which device would you test on most?'),
        device,
        setDevice,
        DEVICE,
      )}
      {renderSelect(
        'beta-time',
        t('Combien de temps par semaine pour tester ?', 'How much time per week to test?'),
        time,
        setTime,
        TIME,
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="beta-motivation" className={LABEL_CLASS}>
          {t(
            'Qu’aimeriez-vous tester en premier, et qu’attendez-vous d’iQWine ?',
            'What would you test first, and what do you expect from iQWine?',
          )}
        </label>
        <textarea
          id="beta-motivation"
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          required
          rows={5}
          maxLength={2000}
          placeholder={t('Quelques phrases suffisent.', 'A few sentences are enough.')}
          className="bg-sunk border border-border text-foreground rounded-md px-4 py-3 text-[15px] placeholder:text-foreground-faint focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors resize-y"
        />
      </div>

      {/* Honeypot, masqué, doit rester vide */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute -left-[9999px] w-px h-px opacity-0"
      />

      {error && <p className="font-body text-[12px] text-danger">{error}</p>}

      <Button type="submit" variant="or" size="lg" disabled={submitting} className="w-full">
        {submitting ? t('Envoi…', 'Sending…') : t('Envoyer ma candidature', 'Send my application')}
        {!submitting && <ArrowRight className="w-4 h-4" strokeWidth={2} />}
      </Button>
    </form>
  );
}
