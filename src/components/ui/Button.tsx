'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'or';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// Brand motion : 120ms ios easing. Press = primary-dim. No bounce, no glow décoratif.
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hot active:bg-primary-dim shadow-[0_8px_24px_rgba(122,31,31,0.35)]',
  secondary:
    'border border-border-strong text-foreground hover:bg-elev hover:border-or/50',
  ghost: 'text-muted-foreground hover:text-foreground',
  or: 'bg-or text-primary-foreground hover:bg-or-soft active:bg-or-deep',
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
