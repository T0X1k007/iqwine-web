'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/lib/i18n';
import {
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  alternatePath,
  BCP47,
  type Locale,
} from '@/lib/locale';

/**
 * LE SÉLECTEUR DE LANGUE — de vrais liens, pas des boutons.
 *
 * ── Pourquoi ce n'est pas un détail de balisage ───────────────────────────
 * C'étaient deux `<button onClick>`. Trois conséquences :
 *
 *   · **sans JavaScript, on ne pouvait pas changer de langue.** Les pages se
 *     rendaient bien, mais on restait prisonnier de celle qu'on avait reçue ;
 *   · **aucun robot ne pouvait découvrir l'autre version.** Un crawler suit des
 *     liens ; il ne clique pas. Les `hreflang` et le sitemap le disent aussi,
 *     mais un lien réel entre les deux versions reste le chemin de découverte
 *     le plus sûr — et c'était le seul qui manquait ;
 *   · un bouton qui navigue ment sur sa nature : pas d'ouverture dans un
 *     onglet, pas de copie de l'adresse, pas d'annonce « lien » au lecteur
 *     d'écran.
 *
 * Ce sont désormais des `<Link>` vers l'ÉQUIVALENT EXACT de la page courante.
 * Le `onClick` ne fait que mémoriser le choix — il n'empêche pas la navigation,
 * donc tout continue de fonctionner si le script ne s'exécute jamais.
 *
 * `hrefLang` sur chaque lien : l'attribut dit au moteur ce qu'il trouvera au
 * bout, et c'est précisément ce qu'on cherche à lui apprendre.
 */

const LIBELLE: Record<Locale, string> = { fr: 'FR', en: 'EN' };

export default function LanguageToggle() {
  const { locale } = useLocale();
  const pathname = usePathname() ?? '/';

  /**
   * Mémorise le choix MANUEL — il prévaut ensuite sur `Accept-Language` lors
   * de toute arrivée par la racine. Sans `preventDefault` : le lien navigue de
   * lui-même, le cookie n'est qu'un souvenir.
   */
  function memoriser(cible: Locale) {
    if (typeof document === 'undefined') return;
    document.cookie = `${LOCALE_COOKIE}=${cible}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
  }

  return (
    <div
      role="group"
      aria-label={locale === 'fr' ? 'Langue' : 'Language'}
      className="flex items-center rounded-md border border-border overflow-hidden font-body text-[11px] font-medium tracking-[0.16em]"
    >
      {LOCALES.map((l) => {
        const actif = l === locale;
        return (
          <Link
            key={l}
            href={alternatePath(pathname, l)}
            hrefLang={BCP47[l]}
            onClick={() => memoriser(l)}
            aria-current={actif ? 'true' : undefined}
            lang={BCP47[l]}
            className={`px-2.5 py-1.5 transition-colors duration-[140ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
              actif
                ? // Même défaut que les boutons dorés : l'ivoire sur l'or ne
                  // donnait que 1,68 de contraste, pour 4,5 exigés — et ici sur
                  // du 11 px, la taille la plus fragile de la page. `on-gold`
                  // porte le ratio à 9,8.
                  'bg-or text-on-gold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {LIBELLE[l]}
          </Link>
        );
      })}
    </div>
  );
}
