'use client';

import { Children, isValidElement, cloneElement, type ReactNode } from 'react';

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

// Stagger CSS-only — chaque enfant reçoit un animationDelay incrémental.
// staggerItemVariants conservé pour rétrocompat (si une carte le passe à <motion.div>).
export const staggerItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function StaggerChildren({
  children,
  className = '',
  staggerDelay = 0.06,
}: StaggerChildrenProps) {
  return (
    <div className={className}>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        const existingStyle =
          (child.props as { style?: React.CSSProperties })?.style ?? {};
        return cloneElement(child as React.ReactElement<{ style?: React.CSSProperties; className?: string }>, {
          style: {
            ...existingStyle,
            animationDelay: `${i * staggerDelay}s`,
            animationDuration: '0.5s',
          },
          className: `iq-fade-up ${(child.props as { className?: string })?.className ?? ''}`,
        });
      })}
    </div>
  );
}
