'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useLocale } from '@/lib/i18n';
import { localePath } from '@/lib/locale';

/**
 * UN LIEN INTERNE QUI RESTE DANS SA LANGUE.
 *
 * ── Le défaut qu'il empêche ───────────────────────────────────────────────
 * Depuis que chaque langue a ses propres URL, un `href="/tarifs"` écrit en dur
 * renvoie un anglophone vers la version française. Il ne casse rien, il
 * fonctionne, il affiche une page, et c'est précisément ce qui le rend
 * dangereux : la personne sort de sa langue sans qu'aucune erreur ne le
 * signale, et sans comprendre ce qui vient de se passer.
 *
 * Pire pour les moteurs : `/tarifs` est désormais une redirection permanente.
 * Chaque lien interne qui la vise fait passer le robot par un saut inutile et
 * dilue le maillage, on redirigerait notre propre navigation.
 *
 * ── L'usage ───────────────────────────────────────────────────────────────
 * On écrit le chemin NU, comme avant :
 *
 *     <LocaleLink href="/tarifs">Tarifs</LocaleLink>
 *
 * et le composant le préfixe de la langue courante. Les ancres et les
 * paramètres survivent : `/#piliers` devient `/fr/#piliers`.
 *
 * Une règle ESLint refuse les `href` internes en dur ailleurs, c'est elle qui
 * fait que le prochain lien écrit ne recréera pas le problème.
 */
export default function LocaleLink({
  href,
  ...rest
}: Omit<ComponentProps<typeof Link>, 'href'> & { href: string }) {
  const { locale } = useLocale();

  // Externe, ancre pure, courriel, téléphone : on ne touche à rien.
  const externe = /^(https?:|mailto:|tel:|#)/.test(href);
  if (externe) return <Link href={href} {...rest} />;

  // Sépare le chemin de son ancre et de sa requête, pour ne préfixer QUE le
  // chemin, `/#piliers` doit devenir `/fr/#piliers`, jamais `/fr%23piliers`.
  const coupe = href.search(/[?#]/);
  const chemin = coupe === -1 ? href : href.slice(0, coupe);
  const suffixe = coupe === -1 ? '' : href.slice(coupe);

  return <Link href={`${localePath(chemin, locale)}${suffixe}`} {...rest} />;
}
