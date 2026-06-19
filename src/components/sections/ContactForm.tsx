'use client';

import { useCallback, useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useLocale } from '@/lib/i18n';

/**
 * ContactForm, formulaire « Contactez-nous / Démonstration / Partenariat ».
 *
 * POST vers /api/contact (route locale) qui forward vers l'app cellier-vin.
 * Aucune adresse courriel exposée. Honeypot anti-bot, validation client +
 * serveur, états succès/erreur. Mirroir du pattern VagueFondateurs.
 */
type Category = 'CONTACT' | 'DEMO' | 'PARTNERSHIP';

const CATEGORY_LABELS: Record<Category, Record<'fr' | 'en', string>> = {
  CONTACT: { fr: 'Contactez-nous', en: 'Contact us' },
  DEMO: { fr: 'Démonstration', en: 'Demo request' },
  PARTNERSHIP: { fr: 'Partenariat', en: 'Partnership' },
};

export default function ContactForm() {
  const { locale } = useLocale();
  const t = useCallback(
    (fr: string, en: string) => (locale === 'fr' ? fr : en),
    [locale],
  );

  const [category, setCategory] = useState<Category>('CONTACT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
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
      if (message.trim().length < 5) {
        setError(t('Votre message est requis.', 'Your message is required.'));
        return;
      }
      setSubmitting(true);
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category,
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
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
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('Erreur inconnue.', 'Unknown error.'));
      } finally {
        setSubmitting(false);
      }
    },
    [category, name, email, message, website, t],
  );

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-10">
        <span className="inline-flex w-12 h-12 rounded-full bg-or/15 items-center justify-center">
          <Check className="w-6 h-6 text-or" strokeWidth={1.75} />
        </span>
        <p className="font-[family-name:var(--font-display)] text-2xl text-foreground">
          {t('Merci, message reçu.', 'Thank you, message received.')}
        </p>
        <p className="text-muted-foreground text-[15px] max-w-md">
          {t(
            'Notre équipe vous répondra par courriel sous peu.',
            'Our team will reply by email shortly.',
          )}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-category"
          className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-muted-foreground"
        >
          {t('Sujet', 'Subject')}
        </label>
        <select
          id="contact-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="bg-sunk border border-border text-foreground rounded-md px-4 py-3 text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
        >
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c][locale === 'fr' ? 'fr' : 'en']}
            </option>
          ))}
        </select>
      </div>

      <Input
        id="contact-name"
        label={t('Nom', 'Name')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        maxLength={200}
        placeholder={t('Votre nom', 'Your name')}
      />
      <Input
        id="contact-email"
        type="email"
        label={t('Courriel', 'Email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
        placeholder={t('vous@exemple.com', 'you@example.com')}
      />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-message"
          className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-muted-foreground"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          maxLength={5000}
          placeholder={t('Comment pouvons-nous aider ?', 'How can we help?')}
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

      {error && <p className="font-mono text-[12px] text-danger">{error}</p>}

      <Button type="submit" variant="or" size="lg" disabled={submitting} className="w-full">
        {submitting ? t('Envoi…', 'Sending…') : t('Envoyer', 'Send')}
        {!submitting && <ArrowRight className="w-4 h-4" strokeWidth={2} />}
      </Button>
    </form>
  );
}
