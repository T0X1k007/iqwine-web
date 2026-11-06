import type { Metadata } from 'next';
import { pageMetadata, type ParamsLocale } from '@/lib/page-metadata';
import ComparatifContent from '@/components/fonctions/ComparatifContent';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbLd } from '@/lib/structured-data';
import { DEFAULT_LOCALE, isLocale } from '@/lib/locale';

/**
 * /comparatif-applications-vin ↔ /en/wine-app-comparison (lot P6 de l'audit
 * du 2026-11-06). Une seule page, honnête, datée et sourcée : voir l'en-tête
 * de `ComparatifContent`. Balisage : le fil d'Ariane seulement. Aucun
 * `Review`, aucune `aggregateRating`, aucun `ItemList` classé.
 */
const TEXTES = {
  fr: {
    title: 'Vivino, CellarTracker, iQWine : quelle appli de vin choisir ?',
    description:
      'Vivino, CellarTracker, InVintory, Oeni et iQWine : ce que fait chacune selon son éditeur, quand en choisir une autre, comment changer sans tout ressaisir.',
  },
  en: {
    title: 'Vivino, CellarTracker, iQWine: which wine app to choose?',
    description:
      'Vivino, CellarTracker, InVintory, Oeni and iQWine: what each does, per its publisher, when to pick another one, and how to switch without retyping.',
  },
} as const;

export async function generateMetadata({ params }: ParamsLocale): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/comparatif-applications-vin', locale, TEXTES);
}

export default async function ComparatifPage({ params }: ParamsLocale) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return (
    <>
      <JsonLd
        data={breadcrumbLd(l, [
          { nom: l === 'fr' ? 'Accueil' : 'Home', chemin: '/' },
          { nom: l === 'fr' ? 'Comparer les applications' : 'Compare wine apps', chemin: '/comparatif-applications-vin' },
        ])}
      />
      <ComparatifContent />
    </>
  );
}
