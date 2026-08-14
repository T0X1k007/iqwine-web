'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'or' | 'cta';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// Brand motion : 140ms ios easing. Press = active state + scale subtil tactile.
// No bounce, no glow décoratif. Active state critical pour feedback mobile.
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hot active:bg-primary-dim active:scale-[0.98] shadow-[0_8px_24px_rgba(122,31,31,0.35)]',
  secondary:
    'border border-border-strong text-foreground hover:bg-elev hover:border-or/50 active:bg-elev active:scale-[0.98]',
  ghost: 'text-muted-foreground hover:text-foreground active:text-foreground',
  // ── TEXTE SOMBRE SUR L'OR, corrigé le 2026-08-02 ────────────────────────
  //
  // Ces deux variantes posaient l'ivoire `#f6eedf` sur l'or `#d9b667` :
  // **1,68 de contraste**, mesuré par Lighthouse sur la production. Le seuil
  // WCAG AA est 4,5. Ce n'était pas une nuance discutable, c'était illisible,
  // et sur les boutons qui comptent le plus : « Essai gratuit » de la barre de
  // navigation, l'envoi du formulaire de contact, l'inscription bêta.
  //
  // Le jeton correct existait déjà et servait ailleurs (`text-on-gold`, dans la
  // bascule mensuel/annuel des tarifs). Le composant Bouton ne l'utilisait
  // simplement pas, l'écart vivait entre deux fichiers que personne ne lit
  // ensemble.
  //
  // Contrastes obtenus, sur les TROIS états et pas seulement au repos :
  //   or #d9b667 → 9,8 · or-soft #ebd7a6 (survol) → 13,4 · or-deep #a9812f
  //   (appui) → 5,3. Tous au-dessus de AA. Vérifier le survol et l'appui
  //   importe : un bouton lisible au repos peut devenir illisible sous le
  //   doigt, et c'est précisément l'instant où l'utilisateur le regarde.
  or: 'bg-or text-on-gold hover:bg-or-soft active:bg-or-deep active:scale-[0.98]',
  // Le commentaire d'origine annonçait un CTA « adaptatif, or sur sombre,
  // bordeaux sur clair, via le token --color-cta re-mappé dans
  // .section-light ». Vérifié : **cette redéfinition n'existe pas**.
  // `--color-cta` n'est déclaré qu'une fois, et vaut toujours l'or. La
  // variante est donc identique à `or` ; elle porte le même correctif.
  cta: 'bg-cta text-on-gold hover:bg-cta-hover active:bg-cta-active active:scale-[0.98]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-[15px]',
  lg: 'px-7 py-3.5 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-[140ms] ease-[cubic-bezier(.32,.72,0,1)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
