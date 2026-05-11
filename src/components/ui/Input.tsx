'use client';

import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={id}
            className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-muted-foreground"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`bg-sunk border border-border text-foreground rounded-md px-4 py-3 text-[15px] placeholder:text-foreground-faint focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors duration-[140ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
            error ? 'border-danger/60 focus:border-danger focus:ring-danger/30' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="font-mono text-[11px] tracking-wide text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
