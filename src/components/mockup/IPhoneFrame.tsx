'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface IPhoneFrameProps {
  children: ReactNode;
  /** Largeur cible du frame en px (défaut 280, le frame scale interne) */
  width?: number;
  /** Floating motion subtil (défaut true) */
  float?: boolean;
  /** Délai du floating (échelonner plusieurs phones) */
  floatDelay?: number;
  /** Glow chaud or sous le phone (défaut true) */
  glow?: boolean;
  /** Class extras sur le wrapper */
  className?: string;
}

/**
 * IPhoneFrame — frame iPhone 15 Pro Apple-grade.
 *
 * Proportions iPhone 15 Pro (logique 393×852, ratio 0.461).
 * - Bezel 9px noir mat
 * - Radius extérieur 47px / écran 38px
 * - Dynamic Island 120×34 (pill capsule centrée en haut)
 * - Status bar 47px (heure left, signal/wifi/batterie right)
 * - Drop shadow chaud or-doux (jamais froide)
 * - Floating Y±5px sur 8s ease-out — luxe lent, jamais bounce
 *
 * L'écran intérieur est une div positionnée absolue avec overflow hidden,
 * radius 38px. Children = contenu de l'écran (UI React libre).
 */
export default function IPhoneFrame({
  children,
  width = 280,
  float = true,
  floatDelay = 0,
  glow = true,
  className = '',
}: IPhoneFrameProps) {
  // Ratio iPhone 15 Pro : 393×852 logique → height = width * 852/393
  const height = Math.round((width * 852) / 393);
  const bezel = Math.max(8, Math.round(width * 0.024)); // ~9px @ 280
  const radiusOuter = Math.round(width * 0.165);        // ~47px @ 280
  const radiusInner = Math.round(width * 0.135);        // ~38px @ 280
  const islandWidth = Math.round(width * 0.30);         // ~84 @ 280
  const islandHeight = Math.round(width * 0.085);       // ~24 @ 280
  const islandTop = Math.round(width * 0.038);          // ~11 @ 280

  const floatVariants = {
    rest: { y: 0 },
    floating: {
      y: [0, -5, 0],
      transition: {
        duration: 8,
        ease: [0.45, 0, 0.55, 1] as [number, number, number, number],
        repeat: Infinity,
        delay: floatDelay,
      },
    },
  };

  return (
    <motion.div
      variants={floatVariants}
      initial="rest"
      animate={float ? 'floating' : 'rest'}
      style={{ width, height }}
      className={`relative ${className}`}
    >
      {/* Glow chaud or sous le phone — jamais froid, jamais saturé */}
      {glow && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(201,163,106,0.18), transparent 70%)',
            filter: 'blur(40px)',
            transform: 'translateY(20%) scale(1.1)',
          }}
        />
      )}

      {/* Bezel noir mat — frame physique du téléphone */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1a1a1d 0%, #0a0a0c 50%, #1a1a1d 100%)',
          borderRadius: radiusOuter,
          boxShadow: [
            // Highlight bord supérieur (lumière depuis le haut, Apple-like)
            'inset 0 1px 0 rgba(255,255,255,0.06)',
            // Inset bezel definition
            'inset 0 0 0 1px rgba(255,255,255,0.04)',
            // Drop shadow ambient (ombre froide subtile)
            '0 1px 3px rgba(0,0,0,0.4)',
            // Drop shadow profond (ombre chaude or-doux)
            '0 30px 80px rgba(201,163,106,0.10)',
            '0 60px 120px rgba(0,0,0,0.5)',
          ].join(', '),
        }}
      />

      {/* Écran — radius intérieur, overflow hidden */}
      <div
        className="absolute bg-black overflow-hidden"
        style={{
          top: bezel,
          left: bezel,
          right: bezel,
          bottom: bezel,
          borderRadius: radiusInner,
        }}
      >
        {children}

        {/* Dynamic Island — par-dessus le contenu, position fixe */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 z-50"
          style={{
            top: islandTop,
            width: islandWidth,
            height: islandHeight,
            background: '#000',
            borderRadius: 999,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        />
      </div>
    </motion.div>
  );
}
