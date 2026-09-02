'use client';

import { useCallback, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useLocale } from '@/lib/i18n';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import TurnstileField, { type TurnstileFieldHandle } from '@/components/ui/TurnstileField';

/**
 * ContactForm, le formulaire public de /contact.
 *
 * POST vers /api/contact (route locale) qui forward vers l'app cellier-vin.
 * Aucune adresse courriel exposée. Validation client + serveur, états
 * succès/erreur. Mirroir du pattern VagueFondateurs.
 *
 * ── Le sujet choisi ici DÉCIDE où le courriel atterrit ────────────────────
 * Ce n'est pas un simple libellé. L'application range la demande sous cette
 * catégorie et sa table de routage (`lib/mail/routage-demandes.ts`) en déduit
 * l'alias destinataire : `support@` pour les questions générales et
 * techniques, `billing@` pour l'argent, `bonjour@` pour l'institutionnel. Un
 * sujet absent d'ici est un courriel qui arrive au mauvais endroit, ou une
 * personne qui n'a pas le mot pour dire ce qu'elle veut.
 *
 * ── La liste doit être un SOUS-ENSEMBLE de ce que l'app accepte ───────────
 * Le serveur de l'application valide la catégorie contre
 * `CATEGORIES_BY_SOURCE.SITE` et refuse tout le reste par un 400, que notre
 * relais traduit en 502. Offrir ici un sujet que l'app ne connaît pas ne
 * produit donc pas une dégradation discrète : il produit un formulaire qui
 * affiche « Envoi impossible » APRÈS que la personne a écrit son message.
 */
type Category = 'CONTACT' | 'INFO' | 'BILLING' | 'SUPPORT' | 'DEMO' | 'PARTNERSHIP';

const CATEGORY_LABELS: Record<Category, Record<'fr' | 'en', string>> = {
  CONTACT: { fr: 'Contactez-nous', en: 'Contact us' },
  INFO: { fr: 'Demande d’information', en: 'Information request' },
  BILLING: { fr: 'Facturation', en: 'Billing' },
  SUPPORT: { fr: 'Support', en: 'Support' },
  DEMO: { fr: 'Démonstration', en: 'Demo request' },
  PARTNERSHIP: { fr: 'Partenariat', en: 'Partnership' },
};

/**
 * L'ORDRE du menu, et la seule liste réellement proposée.
 *
 * Il va du plus courant au plus rare : on écrit d'abord pour une question ou
 * un pépin, on demande une démonstration ou un partenariat beaucoup plus
 * rarement.
 *
 * ── « Support » est ouvert le 2026-09-02, sciemment en avance ─────────────
 * L'application ne l'acceptait que depuis la source APP — une demande faite
 * depuis un compte. Le correctif est fusionné sur `main` de `cellier-vin`
 * (commit `c5cee701`), validé sur staging, et attend sa promotion en
 * production. Eric a demandé de l'ouvrir ici SANS attendre cette promotion,
 * annoncée à moins d'une heure.
 *
 * Ce que cela coûte tant qu'elle n'a pas eu lieu : quelqu'un qui choisit
 * « Support » voit « Envoi impossible » APRÈS avoir écrit son message, parce
 * que l'application refuse encore la catégorie. Décision assumée, fenêtre
 * courte. Si elle devait durer, retirer `SUPPORT` de cette liste referme le
 * trou — une ligne, sans rien casser d'autre.
 */
const CATEGORIES_OFFERTES: Category[] = [
  'CONTACT',
  'INFO',
  'SUPPORT',
  'BILLING',
  'DEMO',
  'PARTNERSHIP',
];

interface ContactFormProps {
  /** Clé publique Turnstile, lue au runtime par la coquille serveur. `''` = anti-bot inactif. */
  turnstileSiteKey?: string;
}

export default function ContactForm({ turnstileSiteKey = '' }: ContactFormProps) {
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
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<TurnstileFieldHandle | null>(null);
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
      /**
       * Le message est requis pour TOUS les sujets, et il l'était déjà.
       *
       * Ce contrôle ne portait que sur `CONTACT`, au nom de la friction des
       * pistes démo/partenariat. Mais le relais `/api/contact` refuse depuis
       * toujours un message de moins de 5 caractères, quelle que soit la
       * catégorie : choisir « Démonstration » et n'écrire rien ne réduisait
       * donc aucune friction — cela produisait « Message requis (5–5000
       * caractères) » APRÈS l'envoi, une erreur serveur là où le formulaire
       * aurait dû le dire tout de suite. On aligne le client sur la règle
       * réellement appliquée plutôt que d'inventer une seconde règle.
       */
      if (message.trim().length < 5) {
        setError(t('Votre message est requis.', 'Your message is required.'));
        return;
      }
      // Anti-bot : quand le widget est actif (clé de site posée), on n'envoie
      // pas sans jeton — le serveur refuserait, autant l'annoncer ici.
      if (turnstileSiteKey && !turnstileToken) {
        setError(
          t(
            'Veuillez confirmer que vous n’êtes pas un robot.',
            'Please confirm you are not a robot.',
          ),
        );
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
            turnstileToken,
          }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(
            data.error ||
              t('Une erreur est survenue. Réessayez.', 'Something went wrong. Try again.'),
          );
        }
        track(ANALYTICS_EVENTS.CONTACT_SUBMITTED, { category });
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('Erreur inconnue.', 'Unknown error.'));
        // Un jeton Turnstile ne vaut qu'un envoi : Cloudflare refuse un rejeu.
        // Sans ce reset, la deuxième tentative échouerait toujours, et la
        // personne conclurait que le formulaire est cassé.
        turnstileRef.current?.reset();
      } finally {
        setSubmitting(false);
      }
    },
    [category, name, email, message, website, turnstileToken, turnstileSiteKey, t],
  );

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-10">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-or-jour/15">
          <Check className="h-6 w-6 text-or-jour" strokeWidth={1.75} />
        </span>
        <p className="font-[family-name:var(--font-display)] text-2xl text-encre">
          {t('Merci, message reçu.', 'Thank you, message received.')}
        </p>
        <p className="max-w-md text-[15px] text-encre-2">
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
          className="font-body text-[11px] font-medium uppercase tracking-[0.22em] text-encre-3"
        >
          {t('Sujet', 'Subject')}
        </label>
        <select
          id="contact-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="rounded-md border border-encre/20 bg-[#fdfaf3] px-4 py-3 text-[15px] text-encre transition-colors focus:border-bordeaux-jour focus:outline-none focus:ring-1 focus:ring-bordeaux-jour/25"
        >
          {CATEGORIES_OFFERTES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c][locale === 'fr' ? 'fr' : 'en']}
            </option>
          ))}
        </select>
      </div>

      <Input
        ton="jour"
        id="contact-name"
        label={t('Nom', 'Name')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        maxLength={200}
        placeholder={t('Votre nom', 'Your name')}
      />
      <Input
        ton="jour"
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
          className="font-body text-[11px] font-medium uppercase tracking-[0.22em] text-encre-3"
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
          className="resize-y rounded-md border border-encre/20 bg-[#fdfaf3] px-4 py-3 text-[15px] text-encre transition-colors placeholder:text-encre-3 focus:border-bordeaux-jour focus:outline-none focus:ring-1 focus:ring-bordeaux-jour/25"
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

      {/*
        * LA PREUVE D'HUMANITÉ, juste avant le bouton.
        *
        * Placée là et non en tête : elle se résout pendant que la personne
        * écrit son message, donc elle est déjà verte quand elle arrive au
        * bouton. En haut du formulaire, le défi aurait eu le temps d'expirer.
        *
        * Sans clé de site, ce composant ne rend rien et ne charge aucun
        * script : le formulaire est alors exactement celui d'avant.
        */}
      <TurnstileField
        ref={turnstileRef}
        siteKey={turnstileSiteKey}
        onToken={setTurnstileToken}
      />

      {error && <p className="font-body text-[12px] text-danger">{error}</p>}

      <Button type="submit" variant="or" size="lg" disabled={submitting} className="w-full">
        {submitting ? t('Envoi…', 'Sending…') : t('Envoyer', 'Send')}
        {!submitting && <ArrowRight className="w-4 h-4" strokeWidth={2} />}
      </Button>
    </form>
  );
}
