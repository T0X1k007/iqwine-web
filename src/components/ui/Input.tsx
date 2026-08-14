'use client';

import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /**
   * Le TON du champ (passe claire v3, 2026-08-14). Les formulaires de
   * `/contact` et `/beta` vivent désormais sur l'ivoire : un champ resté en
   * palette de nuit y dessinait une barre noire au milieu de la page, le seul
   * élément sombre restant. La nuit demeure le défaut, aucun autre appelant
   * n'est affecté.
   */
  ton?: 'jour' | 'nuit';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ton = 'nuit', ...props }, ref) => {
    const jour = ton === 'jour';
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={id}
            className={`font-body text-[11px] font-medium uppercase tracking-[0.22em] ${
              jour ? 'text-encre-3' : 'text-muted-foreground'
            }`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`rounded-md border px-4 py-3 text-[15px] transition-colors duration-[140ms] ease-[cubic-bezier(.2,.8,.2,1)] focus:outline-none focus:ring-1 ${
            jour
              ? 'border-encre/20 bg-[#fdfaf3] text-encre placeholder:text-encre-3 focus:border-bordeaux-jour focus:ring-bordeaux-jour/25'
              : 'border-border bg-sunk text-foreground placeholder:text-foreground-faint focus:border-primary focus:ring-primary/30'
          } ${error ? 'border-danger/60 focus:border-danger focus:ring-danger/30' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="font-body text-[11px] tracking-wide text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
