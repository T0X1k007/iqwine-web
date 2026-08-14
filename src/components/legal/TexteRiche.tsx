import LocaleLink from '@/components/ui/LocaleLink';
import type { ReactNode } from 'react';

/**
 * Rend les balises du texte légal canonique (mêmes conventions que next-intl
 * côté cellier-vin) : <b> → emphase, <privacy> → lien Politique de
 * confidentialité, <contact> → lien page Contact. Pas d'imbrication dans le
 * corpus — le parseur reste volontairement plat.
 */

const LIEN = 'text-or underline underline-offset-2 hover:text-foreground';
const BALISE = /<(b|privacy|contact)>(.*?)<\/\1>/g;

export function TexteRiche({ children }: { children: string }) {
  const noeuds: ReactNode[] = [];
  let curseur = 0;
  const re = new RegExp(BALISE);
  let m: RegExpExecArray | null;
  while ((m = re.exec(children)) !== null) {
    if (m.index > curseur) noeuds.push(children.slice(curseur, m.index));
    const [, balise, contenu] = m;
    if (balise === 'b') {
      noeuds.push(
        <strong key={m.index} className="text-foreground">
          {contenu}
        </strong>,
      );
    } else {
      noeuds.push(
        <LocaleLink
          key={m.index}
          href={balise === 'privacy' ? '/confidentialite' : '/contact'}
          className={LIEN}
        >
          {contenu}
        </LocaleLink>,
      );
    }
    curseur = m.index + m[0].length;
  }
  if (curseur < children.length) noeuds.push(children.slice(curseur));
  return <>{noeuds}</>;
}
