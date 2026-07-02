'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useLocale } from '@/lib/i18n';

interface Testimonial {
  fr: string;
  en: string;
  who: { fr: string; en: string };
}

/**
 * Carrousel de témoignages à rotation LENTE (~5,5 s), une voix à la fois, fondu
 * doux. Donne l'impression que des amateurs vivent avec Octave. reduced-motion :
 * statique sur la première voix. Pas de « avis d'exemple ».
 */
export default function TestimonialRotator({ items }: { items: Testimonial[] }) {
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduced || items.length <= 1) return;
    const id = setInterval(() => setIdx((p) => (p + 1) % items.length), 5500);
    return () => clearInterval(id);
  }, [reduced, items.length]);

  const tm = items[idx];
  if (!tm) return null;

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="min-h-[210px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.figure
            key={idx}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <Quote size={28} strokeWidth={1.5} className="text-or/50 mx-auto mb-5" aria-hidden />
            <blockquote className="font-[family-name:var(--font-display)] italic text-foreground/90 text-xl sm:text-2xl leading-relaxed">
              {locale === 'fr' ? tm.fr : tm.en}
            </blockquote>
            <figcaption className="mt-6 font-body text-[11px] tracking-[0.16em] uppercase text-foreground-faint">
              {locale === 'fr' ? tm.who.fr : tm.who.en}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {items.map((_, d) => (
          <button
            key={d}
            type="button"
            aria-label={`Témoignage ${d + 1}`}
            onClick={() => setIdx(d)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              d === idx ? 'w-5 bg-or' : 'w-1.5 bg-foreground-faint/40 hover:bg-foreground-faint/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
