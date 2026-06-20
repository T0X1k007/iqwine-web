'use client';

import { useReducedMotion } from 'framer-motion';
import type { Locale } from '@/lib/i18n';

/**
 * OctaveDemoVideo — démo réelle de l'app (screen-recording) dans un cadre
 * iPhone premium, en boucle automatique et muette.
 *
 * Le bezel reprend le style sombre de DemoPhone (rounded-[3rem], #0b0b0d,
 * ring-white/5) MAIS sans l'encoche : la vidéo possède déjà sa propre barre
 * de statut iOS retirée au montage (crop). Le ratio vidéo (220×452 ≈ 55:113)
 * colle au ratio de l'écran, donc object-cover remplit proprement sans crop.
 *
 * prefers-reduced-motion → pas d'autoplay : on laisse le poster + les
 * contrôles natifs pour que l'utilisateur déclenche lui-même.
 */
export default function OctaveDemoVideo({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion();
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <div className="mx-auto w-full max-w-[320px]">
      <p className="mb-4 text-center font-mono text-[11px] tracking-[0.26em] uppercase text-foreground-faint">
        {t('Octave en action', 'Octave in action')}
      </p>

      {/* Cadre iPhone (bezel sombre, sans encoche) — profondeur */}
      <div className="relative rounded-[3rem] border border-black/30 bg-[#0b0b0d] p-3 shadow-[0_50px_120px_-35px_rgba(40,28,16,0.55)] ring-1 ring-white/5">
        {/* ÉCRAN — la vidéo le remplit (ratio ≈ écran, object-cover propre) */}
        <div className="relative overflow-hidden rounded-[2.4rem] bg-[#0b0b0d]">
          <video
            className="block aspect-[55/113] w-full h-full object-cover"
            poster="/video/octave-demo-poster.jpg"
            autoPlay={!reduced}
            loop
            muted
            playsInline
            controls={!!reduced}
            preload="metadata"
            aria-label={t(
              "Démonstration de l'application iQWine : Octave répond en sommelier et propose des bouteilles.",
              'iQWine app demo: Octave answers like a sommelier and suggests bottles.'
            )}
          >
            <source src="/video/octave-demo.webm" type="video/webm" />
            <source src="/video/octave-demo.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
