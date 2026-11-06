'use client';

import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import FilAriane from '@/components/ui/FilAriane';
import LocaleLink from '@/components/ui/LocaleLink';
import Button from '@/components/ui/Button';
import { useLocale } from '@/lib/i18n';
import { buildSignupUrl } from '@/lib/constants';
import { SIGNUP_CTA, SIGNUP_REASSURANCE } from '@/lib/trial';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import { FREE_PLAN, STANDARD_PLAN } from '@/lib/plans';
import { ArrowRight } from 'lucide-react';

/**
 * /comparatif-applications-vin ↔ /en/wine-app-comparison — UNE seule page
 * comparative (audit du 2026-11-06, lot P6, décision 6 d'Éric à prendre).
 *
 * ── Les règles de cette page, et elles ne se négocient pas ────────────────
 *   · chaque cellule sur un concurrent dit ce que SON ÉDITEUR publie, avec la
 *     source et la date du relevé (`RELEVE`) ; aucune note, aucun avis, aucun
 *     nombre d'utilisateurs, aucun prix qui bouge tous les mois ;
 *   · aucune exclusivité revendiquée, aucun dénigrement ; une section dit
 *     honnêtement quand une autre application convient mieux ;
 *   · rien n'est repris de `SectionComparison` ni de `SectionTroisMoments`
 *     (archivés, affirmations fausses sur Vivino, constat C-14) ;
 *   · le détaillant provincial n'y figure pas : la règle LOCKED interdit son
 *     nom dans le texte visible, et le décrire sans le nommer le désignerait ;
 *   · à relire avant publication, puis tous les six mois (date dans `RELEVE`).
 */

const RELEVE = { fr: 'relevé le 6 novembre 2026', en: 'checked on November 6, 2026' };

type Cellule = { fr: string; en: string };
type Ligne = {
  nom: string;
  pourQuoi: Cellule;
  modele: Cellule;
  plateformes: Cellule;
  francais: Cellule;
  importer: Cellule;
  nous?: boolean;
};

const LIGNES: Ligne[] = [
  {
    nom: 'iQWine',
    nous: true,
    pourQuoi: {
      fr: 'Un sommelier, Octave, qui apprend votre palais et conseille depuis votre cave, au restaurant et en magasin au Québec',
      en: 'A sommelier, Octave, who learns your palate and advises from your cellar, at the restaurant and in store in Québec',
    },
    modele: {
      fr: `Gratuite jusqu’à ${FREE_PLAN.maxBottles} bouteilles, sans date de fin ; forfaits Passionné et Premium`,
      en: `Free up to ${FREE_PLAN.maxBottles} bottles, no end date; Enthusiast and Premium plans`,
    },
    plateformes: { fr: 'iPhone, Android (au Canada), web', en: 'iPhone, Android (in Canada), web' },
    francais: { fr: 'Oui, et en anglais', en: 'Yes, and English' },
    importer: { fr: 'Fichier CSV, Excel ou JSON, exports d’autres applications compris', en: 'CSV, Excel or JSON file, exports from other apps included' },
  },
  {
    nom: 'Vivino',
    pourQuoi: {
      fr: 'Les notes et avis d’une très grande communauté, le scan d’étiquettes et de cartes des vins, l’achat de vin dans l’application selon le marché',
      en: 'Ratings and reviews from a very large community, label and wine list scanning, buying wine in the app depending on the market',
    },
    modele: { fr: 'Gratuite, avec un abonnement Premium', en: 'Free, with a Premium subscription' },
    plateformes: { fr: 'iPhone, Android', en: 'iPhone, Android' },
    francais: { fr: 'Oui', en: 'Yes' },
    importer: { fr: 'Non précisé par l’éditeur', en: 'Not stated by the publisher' },
  },
  {
    nom: 'CellarTracker',
    pourQuoi: {
      fr: 'La gestion de cave et une vaste base de notes de dégustation, surtout communautaires, avec des données de valeur du marché',
      en: 'Cellar management and a vast base of tasting notes, mostly from the community, with market value data',
    },
    modele: {
      fr: 'Gratuite ; abonnement pour des fonctions supplémentaires, au montant choisi selon la taille de la cave (en dollars américains)',
      en: 'Free; a subscription for extra features, with an amount chosen by cellar size (in US dollars)',
    },
    plateformes: { fr: 'iPhone, Android, web', en: 'iPhone, Android, web' },
    francais: { fr: 'Non (anglais)', en: 'No (English)' },
    importer: { fr: 'Exporte la cave en fichier (CSV notamment)', en: 'Exports your cellar to a file (CSV among others)' },
  },
  {
    nom: 'InVintory',
    pourQuoi: {
      fr: 'La gestion de cave pour collectionneurs : cave en 3D, valeur de la collection, sommelier IA',
      en: 'Cellar management for collectors: 3D cellar, collection value, AI sommelier',
    },
    // L'essai d'InVintory, pas le nôtre : la garde de l'essai d'iQWine ne s'applique pas (invintory.com/llms.txt).
    // eslint-disable-next-line no-restricted-syntax
    modele: { fr: 'Gratuite ; forfait Premium avec essai de 14 jours', en: 'Free; Premium plan with a 14-day trial' },
    plateformes: { fr: 'iPhone, Android, web', en: 'iPhone, Android, web' },
    francais: { fr: 'Oui', en: 'Yes' },
    importer: { fr: 'Importe depuis CellarTracker, Vivino ou un tableur', en: 'Imports from CellarTracker, Vivino or a spreadsheet' },
  },
  {
    nom: 'Oeni',
    pourQuoi: {
      fr: 'La gestion de cave : cave en 3D, date d’apogée, valeur de la cave mise à jour chaque mois, accords mets-vins',
      en: 'Cellar management: 3D cellar, peak date, cellar value updated monthly, food pairings',
    },
    modele: { fr: 'Gratuite en partie ; Oeni Plus, avec essai de 30 jours', en: 'Partly free; Oeni Plus, with a 30-day trial' },
    plateformes: { fr: 'iPhone, Android', en: 'iPhone, Android' },
    francais: { fr: 'Oui', en: 'Yes' },
    importer: { fr: 'Importe depuis un fichier Excel', en: 'Imports from an Excel file' },
  },
];

const AUTRES: { nom: string; quand: Cellule }[] = [
  {
    nom: 'Vivino',
    quand: {
      fr: 'si ce qui compte d’abord pour vous, c’est l’avis d’une très grande communauté sur une bouteille, ou acheter du vin directement dans l’application là où ce service existe.',
      en: 'if what matters most to you is the opinion of a very large community on a bottle, or buying wine right in the app where that service exists.',
    },
  },
  {
    nom: 'CellarTracker',
    quand: {
      fr: 'si vous collectionnez depuis longtemps, lisez l’anglais sans effort et voulez la profondeur de millions de notes de dégustation et de données de marché.',
      en: 'if you’ve been collecting for years, read English comfortably and want the depth of millions of tasting notes and market data.',
    },
  },
  {
    nom: 'InVintory',
    quand: {
      fr: 'si vous gérez une grande collection comme un actif : valeur suivie en continu, analyses de la collection, accessoires connectés pour la cave.',
      en: 'if you manage a large collection as an asset: continuously tracked value, collection analytics, connected accessories for the cellar.',
    },
  },
  {
    nom: 'Oeni',
    quand: {
      fr: 'si vous voulez avant tout voir votre cave en 3D et suivre sa valeur, mise à jour chaque mois.',
      en: 'if you mainly want to see your cellar in 3D and follow its value, updated every month.',
    },
  },
];

const AUTREMENT: { texte: Cellule; href: string; lien: Cellule }[] = [
  {
    texte: {
      fr: 'Octave apprend votre palais de vos dégustations notées, sur tous les forfaits, et vous montre ce qu’il a compris de vous.',
      en: 'Octave learns your palate from your rated tastings, on every plan, and shows you what he has understood about you.',
    },
    href: '/guide/conseils-d-octave#votre-palais',
    lien: { fr: 'Votre palais', en: 'Your palate' },
  },
  {
    texte: {
      fr: 'Le choix d’une bouteille est calculé, jamais improvisé ; un prix inconnu est annoncé comme une estimation ; et il sait dire « je ne sais pas ».',
      en: 'The choice of a bottle is computed, never improvised; an unknown price is labelled an estimate; and he knows how to say “I don’t know”.',
    },
    href: '/sommelier-ia#verifiable',
    lien: { fr: 'Octave vérifiable', en: 'Verifiable Octave' },
  },
  {
    texte: {
      fr: 'Chaque fenêtre d’apogée dit d’où elle vient : le producteur, la fiche en magasin, ou une estimation d’iQWine, avec sa fiabilité.',
      en: 'Every drinking window says where it comes from: the producer, the in-store listing, or an iQWine estimate, with its reliability.',
    },
    href: '/apogee',
    lien: { fr: 'L’apogée', en: 'The drinking window' },
  },
  {
    texte: {
      fr: 'En magasin, la disponibilité et le prix, magasin par magasin, partout au Québec.',
      en: 'In store, availability and price, store by store, across Québec.',
    },
    href: '/choisir-un-vin',
    lien: { fr: 'Choisir un vin en magasin', en: 'Choosing a wine in store' },
  },
  {
    texte: {
      fr: 'Conçu en français, au Québec, et hébergé au Canada. iQWine ne vend pas de vin et ne touche aucune commission.',
      en: 'Designed in French, in Québec, and hosted in Canada. iQWine sells no wine and takes no commission.',
    },
    href: '/notre-maison',
    lien: { fr: 'Notre histoire', en: 'Our story' },
  },
];

const SOURCES: { nom: string; liens: { libelle: string; url: string }[] }[] = [
  {
    nom: 'Vivino',
    liens: [
      { libelle: 'App Store (Canada)', url: 'https://apps.apple.com/ca/app/id414461255' },
      { libelle: 'Google Play', url: 'https://play.google.com/store/apps/details?id=vivino.web.app' },
    ],
  },
  {
    nom: 'CellarTracker',
    liens: [
      { libelle: 'App Store (Canada)', url: 'https://apps.apple.com/ca/app/id6446102275' },
      { libelle: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.cellartracker.app' },
      { libelle: 'support.cellartracker.com : Voluntary Payment', url: 'https://support.cellartracker.com/article/25-voluntary-payment' },
      { libelle: 'support.cellartracker.com : Exporting Data', url: 'https://support.cellartracker.com/article/29-exporting-data' },
    ],
  },
  {
    nom: 'InVintory',
    liens: [
      { libelle: 'App Store (Canada)', url: 'https://apps.apple.com/ca/app/id1434754695' },
      { libelle: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.invintory.app' },
      { libelle: 'invintory.com/llms.txt', url: 'https://invintory.com/llms.txt' },
    ],
  },
  {
    nom: 'Oeni',
    liens: [
      { libelle: 'App Store (Canada)', url: 'https://apps.apple.com/ca/app/id6445827140' },
      { libelle: 'Google Play', url: 'https://play.google.com/store/apps/details?id=app.oeni' },
      { libelle: 'oeni.app (FAQ)', url: 'https://oeni.app/' },
    ],
  },
];

export default function ComparatifContent() {
  const { locale } = useLocale();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const c = (x: Cellule) => t(x.fr, x.en);

  return (
    <main>
      {/* ══ S1 · LA QUESTION — ivoire ══════════════════════════════════════ */}
      <section className="mouvement-jour relative" style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="mx-auto max-w-[1440px] px-6 pb-8 pt-8 lg:px-8 lg:pt-10">
          <FilAriane
            elements={[
              { label: t('Accueil', 'Home'), href: '/' },
              { label: t('Comparer les applications', 'Compare wine apps') },
            ]}
          />
          <div className="mx-auto mt-9 max-w-[860px]">
            <p className="text-[11.5px] font-medium uppercase tracking-[0.24em] text-or-jour">
              {t('Applications de vin', 'Wine apps')}
            </p>
            <h1
              className="mt-3 font-[family-name:var(--font-display)] font-medium leading-[1.08] tracking-[-0.02em] text-encre"
              style={{ fontSize: 'clamp(32px, 4.8vw, 56px)' }}
            >
              {t('Chaque application de vin ', 'Every wine app ')}
              <span className="text-bordeaux-jour">{t('répond à une autre question.', 'answers a different question.')}</span>
            </h1>
            <p className="mt-5 max-w-[62ch] text-[16.5px] leading-relaxed text-encre-2 md:text-[17.5px]">
              {t(
                'Est-ce un bon vin selon la foule ? Combien vaut ma cave ? Que dois-je ouvrir ce soir, avec ce plat, pour moi ? Choisir une application, c’est d’abord choisir sa question. Voici ce que fait chacune, selon ce que son éditeur publie.',
                'Is this a good wine according to the crowd? What is my cellar worth? What should I open tonight, with this dish, for me? Choosing an app starts with choosing your question. Here is what each one does, according to what its publisher says.',
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ══ S2 · LA RÉPONSE DIRECTE ET LE TABLEAU — ivoire ═══════════════════ */}
      <section className="mouvement-jour relative" id="tableau">
        <div className="mx-auto max-w-[1440px] px-6 pb-12 lg:px-8">
          <div className="mx-auto max-w-[860px] rounded-[18px] border border-or-jour/30 bg-[#fdfaf3] p-6 lg:p-7">
            <h2 className="font-[family-name:var(--font-display)] text-[25px] font-medium leading-tight text-encre sm:text-[28px]">
              {t('Quelle application de vin choisir ?', 'Which wine app should I choose?')}
            </h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-encre-2 md:text-[16px]">
              {t(
                'Tout dépend de ce que vous attendez d’elle. Pour l’avis d’une très grande communauté, Vivino. Pour une archive de notes de dégustation en anglais, CellarTracker. Pour suivre une grande collection comme un actif, InVintory ou Oeni. Pour un sommelier qui apprend votre goût et vous conseille depuis votre cave, au restaurant et en magasin au Québec, iQWine.',
                'It depends on what you expect from it. For the opinion of a very large community, Vivino. For an archive of tasting notes in English, CellarTracker. To track a large collection as an asset, InVintory or Oeni. For a sommelier who learns your taste and advises you from your cellar, at the restaurant and in store in Québec, iQWine.',
              )}
            </p>
          </div>

          <FadeInOnScroll>
            <div className="mx-auto mt-10 max-w-[1160px] overflow-x-auto rounded-[16px] border border-encre/10 bg-[#fdfaf3]">
              <table className="w-full min-w-[860px] border-collapse text-left text-[13.5px] leading-snug">
                <caption className="px-5 pt-4 text-left text-[12.5px] text-encre-3">
                  {t(
                    `Ce que chaque éditeur publie sur sa fiche d’application et son site, ${RELEVE.fr}. Sources en bas de page.`,
                    `What each publisher states on its app listing and website, ${RELEVE.en}. Sources at the bottom of the page.`,
                  )}
                </caption>
                <thead>
                  <tr className="border-b border-encre/10 text-[11px] uppercase tracking-[0.14em] text-encre-3">
                    <th scope="col" className="px-5 py-3 font-medium">{t('Application', 'App')}</th>
                    <th scope="col" className="px-4 py-3 font-medium">{t('Pensée d’abord pour', 'Built first for')}</th>
                    <th scope="col" className="px-4 py-3 font-medium">{t('Modèle', 'Model')}</th>
                    <th scope="col" className="px-4 py-3 font-medium">{t('Plateformes', 'Platforms')}</th>
                    <th scope="col" className="px-4 py-3 font-medium">{t('En français', 'In French')}</th>
                    <th scope="col" className="px-4 py-3 font-medium">{t('Une cave existante', 'An existing cellar')}</th>
                  </tr>
                </thead>
                <tbody>
                  {LIGNES.map((l) => (
                    <tr key={l.nom} className={`border-b border-encre/8 align-top last:border-b-0 ${l.nous ? 'bg-or-jour/[0.06]' : ''}`}>
                      <th scope="row" className="px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold text-encre">
                        {l.nom}
                      </th>
                      <td className="px-4 py-4 text-encre-2">{c(l.pourQuoi)}</td>
                      <td className="px-4 py-4 text-encre-2">{c(l.modele)}</td>
                      <td className="px-4 py-4 text-encre-2">{c(l.plateformes)}</td>
                      <td className="px-4 py-4 text-encre-2">{c(l.francais)}</td>
                      <td className="px-4 py-4 text-encre-2">{c(l.importer)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ══ S3 · QUAND CHOISIR UNE AUTRE APPLICATION — ivoire ═══════════════ */}
      <section className="mouvement-jour relative" id="autre-application">
        <div className="mx-auto max-w-[860px] px-6 py-10 lg:px-8 lg:py-12">
          <h2
            className="font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em] text-encre"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            {t('Quand choisir ', 'When to choose ')}
            <span className="text-bordeaux-jour">{t('une autre application', 'another app')}</span>
          </h2>
          <p className="mt-4 max-w-[62ch] text-[15.5px] leading-relaxed text-encre-2">
            {t(
              'iQWine n’est pas la bonne réponse pour tout le monde. Choisissez plutôt :',
              'iQWine isn’t the right answer for everyone. Choose instead:',
            )}
          </p>
          <ul className="mt-4 space-y-3">
            {AUTRES.map((a) => (
              <li key={a.nom} className="border-b border-encre/8 pb-3 text-[15.5px] leading-relaxed text-encre-2">
                <strong className="font-semibold text-encre">{a.nom}</strong> {c(a.quand)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ S4 · CE QU'IQWINE FAIT AUTREMENT — nuit ═════════════════════════
          Uniquement des différences VÉRIFIABLES, chacune reliée à la page
          qui la montre. Aucune exclusivité revendiquée. */}
      <section
        id="autrement"
        className="relative overflow-hidden text-foreground"
        style={{ background: 'linear-gradient(180deg, var(--color-papier) 0%, #2a1d13 6%, #150f0c 16%, #150f0c 100%)' }}
      >
        <div className="mx-auto max-w-[860px] px-6 pb-14 pt-20 lg:px-8">
          <h2
            className="font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            {t('Ce qu’iQWine fait ', 'What iQWine does ')}
            <span className="text-or">{t('autrement', 'differently')}</span>
          </h2>
          <ul className="mt-6 space-y-4">
            {AUTREMENT.map((a) => (
              <li key={a.href} className="border-b border-white/10 pb-4 text-[15.5px] leading-relaxed text-muted-foreground">
                {c(a.texte)}{' '}
                <LocaleLink href={a.href} className="inline-flex items-center gap-1 font-medium text-or transition-colors hover:text-or-soft">
                  {c(a.lien)}
                  <ArrowRight size={13} strokeWidth={1.75} aria-hidden />
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ S5 · CHANGER SANS TOUT RESSAISIR — retour au jour ══════════════ */}
      <section className="mouvement-jour relative" id="changer">
        <div className="mx-auto max-w-[860px] px-6 py-12 lg:px-8 lg:py-14">
          <h2
            className="font-[family-name:var(--font-display)] font-medium leading-[1.1] tracking-[-0.02em] text-encre"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            {t('Changer ', 'Switching ')}
            <span className="text-bordeaux-jour">{t('sans tout ressaisir', 'without retyping everything')}</span>
          </h2>
          <p className="mt-4 max-w-[62ch] text-[15.5px] leading-relaxed text-encre-2">
            {t(
              `Exportez votre cave en fichier depuis votre application actuelle, si elle le permet : CellarTracker, par exemple, propose un export en CSV. Importez-le ensuite dans iQWine, en CSV, Excel ou JSON. Octave reconnaît vos colonnes, vous montre ce qu’il a compris, et rien n’entre sans votre accord. Le forfait Gratuit accueille jusqu’à ${FREE_PLAN.maxBottles} bouteilles ; le Passionné, ${STANDARD_PLAN.maxBottles} ; le Premium, sans limite.`,
              `Export your cellar to a file from your current app, if it allows it: CellarTracker, for example, offers a CSV export. Then import it into iQWine, as CSV, Excel or JSON. Octave recognizes your columns, shows you what he understood, and nothing goes in without your say. The Free plan holds up to ${FREE_PLAN.maxBottles} bottles; Enthusiast, ${STANDARD_PLAN.maxBottles}; Premium, no limit.`,
            )}
          </p>
          <LocaleLink
            href="/guide/votre-cave#importer-collection"
            className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-medium text-bordeaux-jour transition-colors hover:text-or-jour"
          >
            {t('Importer sa cave, pas à pas', 'Importing your cellar, step by step')}
            <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
          </LocaleLink>
          {/* Capture à fournir par Éric (compte de démonstration) : l'écran
              d'import avec la correspondance des colonnes. Aucune image servie
              d'ici là. */}

          <div className="mt-10 text-center">
            <a
              href={buildSignupUrl('comparatif', { lang: locale })}
              onClick={() => track(ANALYTICS_EVENTS.SIGNUP_CLICK, { source: 'comparatif' })}
            >
              <Button variant="primary" size="lg">{t(SIGNUP_CTA.fr, SIGNUP_CTA.en)}</Button>
            </a>
            <p className="mt-4 text-[13px] tracking-wide text-encre-3">{t(SIGNUP_REASSURANCE.fr, SIGNUP_REASSURANCE.en)}</p>
          </div>
        </div>
      </section>

      {/* ══ S6 · SOURCES — ivoire, en petit ═════════════════════════════════ */}
      <section className="mouvement-jour relative" id="sources">
        <div className="mx-auto max-w-[860px] px-6 pb-14 lg:px-8">
          <h2 className="text-[11.5px] font-medium uppercase tracking-[0.2em] text-encre-3">
            {t(`Sources, ${RELEVE.fr}`, `Sources, ${RELEVE.en}`)}
          </h2>
          <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-encre-3">
            {SOURCES.map((s) => (
              <li key={s.nom}>
                <span className="font-medium text-encre-2">{s.nom} : </span>
                {s.liens.map((l, i) => (
                  <span key={l.url}>
                    {i > 0 && ' · '}
                    <a href={l.url} rel="nofollow noopener noreferrer" target="_blank" className="underline underline-offset-2 hover:text-bordeaux-jour">
                      {l.libelle}
                    </a>
                  </span>
                ))}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] leading-relaxed text-encre-3">
            {t(
              'Les noms cités appartiennent à leurs éditeurs. Ces informations peuvent changer : une erreur ou un changement ? ',
              'The names cited belong to their publishers. This information can change: spotted an error or a change? ',
            )}
            <LocaleLink href="/contact" className="underline underline-offset-2 hover:text-bordeaux-jour">
              {t('Écrivez-nous', 'Write to us')}
            </LocaleLink>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
