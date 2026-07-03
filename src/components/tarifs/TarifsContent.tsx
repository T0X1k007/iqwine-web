'use client';

import Link from 'next/link';
import { ArrowRight, Wine, MessageCircle, Check, Minus, ShieldCheck, CalendarClock, Lock, XCircle } from 'lucide-react';
import OctaveWordmark from '@/components/octave/OctaveWordmark';
import Button from '@/components/ui/Button';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import Pricing from '@/components/sections/Pricing';
import SectionFaq from '@/components/sections/SectionFaq';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { PLANS, formatPriceCad } from '@/lib/plans';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * /tarifs, page de DÉCISION. Aide le visiteur à choisir (positionnement par
 * profil), puis les prix, le « comment ça marche », les bénéfices, la FAQ, les
 * plateformes, un CTA. Contenu 100 % original. Réutilise Pricing + SectionFaq.
 */

type T = (fr: string, en: string) => string;

const POSITIONS: { fr: [string, string]; en: [string, string]; highlight?: boolean }[] = [
  {
    fr: ['Standard', 'L’amateur de vin avec une cave personnelle.'],
    en: ['Standard', 'The wine lover with a personal cellar.'],
  },
  {
    fr: ['Pro', 'L’habitué qui consulte Octave souvent et possède une plus grande cave.'],
    en: ['Pro', 'The regular who asks Octave often and keeps a larger cellar.'],
    highlight: true,
  },
  {
    fr: ['Passionné', 'Plusieurs utilisateurs, plusieurs palais, une cave partagée.'],
    en: ['Passionné', 'Several users, several palates, one shared cellar.'],
  },
];

const STEPS: { icon: typeof Wine; fr: [string, string]; en: [string, string] }[] = [
  {
    icon: Wine,
    fr: ['Importez ou créez votre cave', 'Scannez vos étiquettes ou ajoutez vos bouteilles. Octave apprend ce que vous avez.'],
    en: ['Import or create your cellar', 'Scan your labels or add your bottles. Octave learns what you have.'],
  },
  {
    icon: MessageCircle,
    fr: ['Demandez conseil à Octave', 'Le repas, le moment, l’envie, dites-lui, comme à un sommelier.'],
    en: ['Ask Octave', 'The meal, the moment, the mood, just tell him, like a sommelier.'],
  },
  {
    icon: Wine,
    fr: ['Ouvrez la bonne bouteille', 'La bonne, au bon moment. Et vous savez pourquoi.'],
    en: ['Open the right bottle', 'The right one, at the right time. And you know why.'],
  },
];

const BENEFITS: { fr: string; en: string }[] = [
  { fr: 'Savoir quelle bouteille ouvrir ce soir.', en: 'Know which bottle to open tonight.' },
  { fr: 'Servir plusieurs vins dans le bon ordre.', en: 'Serve several wines in the right order.' },
  { fr: 'Recevoir des invités sans une hésitation.', en: 'Host guests without a second of doubt.' },
  { fr: 'Bâtir un accord à partir d’une carte au restaurant.', en: 'Build a pairing from a restaurant wine list.' },
  { fr: 'Trouver le meilleur rapport qualité-prix près de vous.', en: 'Find the best value near you.' },
  { fr: 'Vérifier qu’une bouteille correspond à votre palais.', en: 'Check that a bottle matches your palate.' },
];

const REASSURANCE: { icon: typeof ShieldCheck; fr: [string, string]; en: [string, string] }[] = [
  {
    icon: CalendarClock,
    fr: ['Essai gratuit 14 jours', 'Découvrez Octave avant tout choix.'],
    en: ['Free trial, 14 days', 'Discover Octave before you choose.'],
  },
  {
    icon: XCircle,
    fr: ['Résiliable en tout temps', 'Aucun engagement, aucune pénalité.'],
    en: ['Cancel anytime', 'No commitment, no penalty.'],
  },
  {
    icon: Lock,
    fr: ['Données privées', 'Hébergées au Canada, jamais revendues.'],
    en: ['Private data', 'Hosted in Canada, never resold.'],
  },
  {
    icon: ShieldCheck,
    fr: ['Conçu au Québec', 'Pensé pour le marché local.'],
    en: ['Built in Québec', 'Made for the local market.'],
  },
];

// Comparatif : il doit VENDRE LA MONTÉE EN GAMME, pas niveler les plans. Chaque
// cellule est soit un booléen (✓ / —), soit une « intensité » progressive
// (1→3 pastilles) qui montre qu’un même bénéfice s’enrichit avec le plan, soit
// un court texte qualitatif. Le palais qui apprend est VISIBLE dès Standard.
// Prix, recommandations et utilisateurs restent calculés depuis PLANS plus bas.
type CompareCell = boolean | { level: 1 | 2 | 3 } | { text: { fr: string; en: string } };

const COMPARE_FEATURES: {
  label: { fr: string; en: string };
  hint?: { fr: string; en: string };
  values: [CompareCell, CompareCell, CompareCell];
}[] = [
  {
    label: { fr: 'Octave apprend votre palais', en: 'Octave learns your palate' },
    hint: { fr: 'Dès la première recommandation', en: 'From your very first recommendation' },
    values: [true, true, true],
  },
  {
    label: { fr: 'Profil de goût qui s’affine', en: 'Taste profile that sharpens' },
    hint: {
      fr: 'Plus vous échangez, plus il vous cerne',
      en: 'The more you interact, the better he reads you',
    },
    values: [{ level: 1 }, { level: 2 }, { level: 3 }],
  },
  {
    label: { fr: 'Mode restaurant', en: 'Restaurant mode' },
    hint: { fr: 'Un accord à partir de la carte', en: 'A pairing from the wine list' },
    values: [true, true, true],
  },
  {
    label: { fr: 'Disponibilité locale en direct', en: 'Live local availability' },
    values: [true, true, true],
  },
  {
    label: { fr: 'Carnet de dégustation', en: 'Tasting journal' },
    values: [true, true, true],
  },
  {
    label: { fr: 'Cave partagée', en: 'Shared cellar' },
    hint: { fr: 'Plusieurs palais, une cave', en: 'Several palates, one cellar' },
    values: [false, false, true],
  },
  {
    label: { fr: 'Priorité à Octave', en: 'Priority with Octave' },
    hint: { fr: 'Vos demandes passent devant', en: 'Your requests move to the front' },
    values: [false, true, true],
  },
];

const PLAN_NAMES: Record<string, string> = { standard: 'Standard', pro: 'Pro', famille: 'Passionné' };

// Rendu d’une cellule du comparatif. Le niveau d’intensité (1→3) se lit comme
// trois pastilles : plus elles sont dorées, plus le bénéfice s’enrichit avec le
// plan — il reste présent (et doré) dès le niveau 1, jamais barré.
function renderCompareCell(cell: CompareCell, t: T) {
  if (typeof cell === 'boolean') {
    return cell ? (
      <Check size={17} strokeWidth={2} className="inline text-or" aria-label={t('Inclus', 'Included')} />
    ) : (
      <Minus size={15} className="inline text-foreground-faint/50" aria-label={t('Non inclus', 'Not included')} />
    );
  }
  if ('level' in cell) {
    const labels = [t('De base', 'Baseline'), t('Approfondi', 'In-depth'), t('Le plus fin', 'Finest')] as const;
    return (
      <span
        className="inline-flex items-center gap-1"
        role="img"
        aria-label={labels[cell.level - 1]}
      >
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full ${n <= cell.level ? 'bg-or' : 'bg-foreground-faint/25'}`}
          />
        ))}
      </span>
    );
  }
  return (
    <span className="text-[13px] text-foreground">{t(cell.text.fr, cell.text.en)}</span>
  );
}

export default function TarifsContent() {
  const { locale } = useLocale();
  const t: T = (fr, en) => (locale === 'fr' ? fr : en);

  // Lignes chiffrées du comparatif, lues depuis PLANS (jamais de tokens).
  const numericRows = [
    {
      label: t('Prix par mois', 'Price per month'),
      cells: PLANS.map((p) => `${formatPriceCad(p.priceMonthlyCents, locale)} $`),
    },
    {
      label: t('Recommandations d’Octave / mois', 'Octave recommendations / mo'),
      cells: PLANS.map((p) => p.monthlyRecommendations.toString()),
    },
    {
      label: t('Utilisateurs inclus', 'Users included'),
      cells: PLANS.map((p) => p.includedUsers.toString()),
    },
  ];

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative px-6 pt-32 pb-16 lg:pt-40 lg:pb-20 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(142,42,42,0.10),transparent_70%)]" aria-hidden />
        <div className="relative mx-auto max-w-3xl">
          <p className="iq-eyebrow mb-6">{t('Tarifs', 'Pricing')}</p>
          {/* Moment d'identité — le mot-symbole ◯ctave dans le grand titre Cormorant
              italique (anneau incliné pour lire comme un O italique). */}
          <h1 className="iq-display italic">
            {t('Trouvez votre ', 'Find your ')}
            <OctaveWordmark italic />.
          </h1>
          <p className="iq-lead mt-7 max-w-2xl mx-auto">
            {t(
              'Chaque formule commence par 14 jours gratuits, sans carte. Vous découvrez Octave, puis vous choisissez, ou pas.',
              'Every plan starts with 14 free days, no card. You discover Octave, then you choose, or not.',
            )}
          </p>
          <p className="mt-5 font-[family-name:var(--font-display)] italic text-or/90 text-base sm:text-lg">
            {t(
              'Une application créée par des passionnés, pour des passionnés de vin.',
              'An app built by enthusiasts, for wine enthusiasts.',
            )}
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href={buildSignupUrl('tarifs-hero', { lang: locale })}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'tarifs-hero' })}
            >
              <Button variant="cta" size="lg">
                {t('Essai gratuit 14 jours', 'Free Trial 14 Days')}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* LEQUEL EST POUR VOUS, positionnement par profil */}
      <section className="px-6 py-16 lg:py-20 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <p className="iq-eyebrow mb-5">{t('Lequel est pour vous ?', 'Which one is for you?')}</p>
              <h2 className="iq-h1 italic">{t('Chaque formule a son profil.', 'Each plan has a profile.')}</h2>
            </div>
          </FadeInOnScroll>
          <div className="grid gap-5 sm:grid-cols-3 max-w-4xl mx-auto">
            {POSITIONS.map((p, i) => {
              const [title, body] = locale === 'fr' ? p.fr : p.en;
              return (
                <FadeInOnScroll key={i} delay={Math.min(i * 0.06, 0.24)}>
                  <div
                    className={`h-full rounded-xl border p-6 ${
                      p.highlight ? 'border-or/30 bg-or/[0.04]' : 'border-white/5 bg-white/[0.015]'
                    }`}
                  >
                    <h3 className="font-[family-name:var(--font-display)] italic text-xl text-or">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-[15px] leading-relaxed mt-2">{body}</p>
                  </div>
                </FadeInOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* LES PRIX (réutilise la section Pricing : plans + toggle annuel) */}
      <Pricing />

      {/* RÉASSURANCE — près des prix */}
      <section className="px-6 pt-4 pb-12 lg:pb-16">
        <div className="mx-auto max-w-5xl grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REASSURANCE.map((r, i) => {
            const [title, body] = locale === 'fr' ? r.fr : r.en;
            const Icon = r.icon;
            return (
              <FadeInOnScroll key={i} delay={Math.min(i * 0.06, 0.24)}>
                <div className="h-full rounded-xl border border-white/5 bg-white/[0.015] p-5">
                  <Icon size={20} strokeWidth={1.6} className="text-or mb-3" aria-hidden />
                  <h3 className="font-[family-name:var(--font-display)] italic text-[17px] text-foreground">{title}</h3>
                  <p className="text-muted-foreground text-[13px] leading-relaxed mt-1">{body}</p>
                </div>
              </FadeInOnScroll>
            );
          })}
        </div>
      </section>

      {/* COMPARATIF DES PLANS */}
      <section className="px-6 py-16 lg:py-24 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <p className="iq-eyebrow mb-5">{t('Comparer', 'Compare')}</p>
              <h2 className="iq-h1 italic max-w-2xl mx-auto">
                {t(
                  'Le même Octave. Plus vous lui en confiez, mieux il vous connaît.',
                  'The same Octave. The more you entrust him, the better he knows you.',
                )}
              </h2>
            </div>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.1}>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[480px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 font-body text-[11px] tracking-[0.14em] uppercase text-foreground-faint font-normal">
                      {t('Fonctionnalité', 'Feature')}
                    </th>
                    {PLANS.map((p) => (
                      <th
                        key={p.id}
                        className={`p-4 text-center font-[family-name:var(--font-display)] italic text-lg ${p.highlight ? 'text-or' : 'text-foreground'}`}
                      >
                        {PLAN_NAMES[p.id]}
                        {p.highlight && (
                          <span className="block font-body not-italic text-[9px] tracking-[0.14em] uppercase text-or/70">
                            {t('Populaire', 'Popular')}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {numericRows.map((row, i) => (
                    <tr key={`n${i}`} className="border-b border-white/5">
                      <td className="p-4 text-[14px] text-muted-foreground">{row.label}</td>
                      {row.cells.map((c, j) => (
                        <td
                          key={j}
                          className={`p-4 text-center text-[15px] tabular-nums ${PLANS[j]?.highlight ? 'text-or bg-or/[0.04]' : 'text-foreground'}`}
                        >
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {COMPARE_FEATURES.map((row, i) => (
                    <tr key={`f${i}`} className="border-b border-white/5 last:border-0">
                      <td className="p-4">
                        <span className="block text-[14px] text-muted-foreground">
                          {locale === 'fr' ? row.label.fr : row.label.en}
                        </span>
                        {row.hint && (
                          <span className="block text-[12px] leading-snug text-foreground-faint/70 mt-0.5">
                            {locale === 'fr' ? row.hint.fr : row.hint.en}
                          </span>
                        )}
                      </td>
                      {row.values.map((v, j) => (
                        <td key={j} className={`p-4 text-center ${PLANS[j]?.highlight ? 'bg-or/[0.04]' : ''}`}>
                          {renderCompareCell(v, t)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* LIEN VERS /octave — comprendre la puissance d'Octave au moment du choix */}
      <section className="px-6 pb-8">
        <FadeInOnScroll>
          <div className="mx-auto max-w-4xl rounded-2xl border border-or/15 bg-or/[0.03] p-7 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div>
              <h3 className="font-[family-name:var(--font-display)] italic text-xl text-foreground">
                {t('Pas encore convaincu ?', 'Not convinced yet?')}
              </h3>
              <p className="text-muted-foreground text-[15px] mt-1">
                {t(
                  'Voyez Octave à l’œuvre, et pourquoi ce n’est pas un assistant générique.',
                  'See Octave at work, and why it isn’t a generic assistant.',
                )}
              </p>
            </div>
            <Link href="/sommelier-ia" className="shrink-0">
              <Button variant="secondary" size="lg">
                {t('Voir ce qu’Octave peut faire', 'See what Octave can do')}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </Link>
          </div>
        </FadeInOnScroll>
      </section>

      {/* COMMENT ÇA FONCTIONNE */}
      <section className="px-6 py-16 lg:py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <FadeInOnScroll>
            <div className="text-center mb-14">
              <p className="iq-eyebrow mb-5">{t('Comment ça fonctionne ?', 'How it works')}</p>
              <h2 className="iq-h1 italic">{t('En trois gestes.', 'In three moves.')}</h2>
            </div>
          </FadeInOnScroll>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((s, i) => {
              const [title, body] = locale === 'fr' ? s.fr : s.en;
              const Icon = s.icon;
              return (
                <FadeInOnScroll key={i} delay={Math.min(i * 0.08, 0.24)}>
                  <div className="text-center sm:text-left">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <span className="font-[family-name:var(--font-display)] italic text-or text-2xl tabular-nums">
                        {i + 1}
                      </span>
                      <Icon size={20} strokeWidth={1.5} className="text-or/70" aria-hidden />
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] italic text-xl text-foreground leading-snug">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-[15px] leading-relaxed mt-2">{body}</p>
                  </div>
                </FadeInOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* POURQUOI LES AMATEURS CHOISISSENT iQWINE, bénéfices */}
      <section className="px-6 py-16 lg:py-24 border-t border-white/5">
        <div className="mx-auto max-w-3xl">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <p className="iq-eyebrow mb-5">{t('Pourquoi iQWine', 'Why iQWine')}</p>
              <h2 className="iq-h1 italic">
                {t('Pourquoi les amateurs choisissent iQWine', 'Why wine lovers choose iQWine')}
              </h2>
            </div>
          </FadeInOnScroll>
          <ul className="space-y-px rounded-2xl overflow-hidden border border-white/5">
            {BENEFITS.map((b, i) => (
              <FadeInOnScroll key={i} delay={Math.min(i * 0.05, 0.25)}>
                <li className="flex items-center gap-4 bg-white/[0.015] px-6 py-5">
                  {/* Bénéfices = raisons de choisir → Check (sémantique honnête, pas déco). */}
                  <Check size={18} strokeWidth={1.75} className="text-or shrink-0" aria-hidden />
                  <span className="font-[family-name:var(--font-display)] italic text-lg text-foreground">
                    {locale === 'fr' ? b.fr : b.en}
                  </span>
                </li>
              </FadeInOnScroll>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ (réutilise la section existante) */}
      <SectionFaq />

      {/* PLATEFORMES */}
      <section className="px-6 py-14 border-t border-white/5 text-center">
        <p className="font-body text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
          {t('Disponible sur iPhone et sur le web', 'Available on iPhone and on the web')}
        </p>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 py-24 lg:py-32 border-t border-white/5 text-center">
        <FadeInOnScroll>
          <h2 className="iq-display italic max-w-3xl mx-auto">
            {t('Commencez ce soir.', 'Start tonight.')}
          </h2>
          <p className="iq-lead mt-6 max-w-xl mx-auto">
            {t('14 jours pour rencontrer Octave. Aucune carte requise.', '14 days to meet Octave. No card required.')}
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href={buildSignupUrl('tarifs-final', { lang: locale })}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'tarifs-final' })}
            >
              <Button variant="cta" size="lg">
                {t('Essai gratuit 14 jours', 'Free Trial 14 Days')}
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </a>
          </div>
        </FadeInOnScroll>
      </section>
    </main>
  );
}
