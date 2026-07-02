'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { FrameChrome } from '@/components/screenshot/ScreenshotFrame';
import { useLocale } from '@/lib/i18n';

/**
 * HeroDemo — visuel produit du hero. VRAIES captures de l'app iQWine présentées
 * dans le cadre iPhone éditorial premium (FrameChrome), en crossfade automatique
 * sur trois écrans qui montrent la valeur : recommandation depuis la cave →
 * disponibilité locale en direct → apogée & palais. reduced-motion : fige sur le
 * premier écran (la recommandation). Aucun mockup dessiné : produit réel, fini.
 */

const SCENES = [
  {
    src: '/screenshots/02-home-suggestions.png',
    fr: 'Octave recommande, depuis votre cave',
    en: 'Octave recommends, from your cellar',
  },
  {
    src: '/screenshots/06-recherche-hors-cave.png',
    fr: 'En tablette, près de vous — en direct',
    en: 'On the shelf, near you — live',
  },
  {
    src: '/screenshots/01-fiche-vin.png',
    fr: 'Apogée et palais, pour chaque bouteille',
    en: 'Peak and palate, for every bottle',
  },
] as const;

const WIDTH = 300;

export default function HeroDemo() {
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((p) => (p + 1) % SCENES.length), 4200);
    return () => clearInterval(id);
  }, [reduced]);

  const scene = SCENES[i] ?? SCENES[0];
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const caption = t(scene.fr, scene.en);

  return (
    <div className="flex w-full flex-col items-center">
      <FrameChrome width={WIDTH} frame="iphone" glow rotation={-2}>
        <AnimatePresence>
          <motion.div
            key={scene.src}
            className="absolute inset-0"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'opacity' }}
          >
            <Image
              src={scene.src}
              alt={caption}
              fill
              sizes={`${WIDTH}px`}
              priority={i === 0}
              style={{ objectFit: 'cover' }}
            />
          </motion.div>
        </AnimatePresence>
      </FrameChrome>

      <p className="mt-6 min-h-[1.4em] text-center font-body text-[11px] tracking-[0.24em] uppercase text-foreground-faint">
        <AnimatePresence mode="wait">
          <motion.span
            key={scene.src}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {caption}
          </motion.span>
        </AnimatePresence>
      </p>
    </div>
  );
}
