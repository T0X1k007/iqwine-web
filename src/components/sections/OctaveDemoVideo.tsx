'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { Locale } from '@/lib/i18n';

/**
 * OctaveDemoVideo, démo réelle de l'app (screen-recording) dans un cadre
 * iPhone premium, en boucle automatique et muette.
 *
 * Le bezel reprend le style sombre de DemoPhone (rounded-[3rem], bg-sunk,
 * ring-white/5) MAIS sans l'encoche : la vidéo possède déjà sa propre barre
 * de statut iOS retirée au montage (crop), fondu entrée/sortie pour une boucle
 * douce. Ratio vidéo 600×1220 ≈ 30:61 → object-cover remplit sans crop.
 *
 * ── prefers-reduced-motion : PAUSE RÉELLE, pas seulement un attribut ──────
 * Mesuré le 2026-08-14 (QA de /carte-des-vins) : `autoPlay={!reduced}` ne
 * suffisait pas. Le rendu SERVEUR ne connaît pas la préférence, pose donc
 * `autoplay`, et le navigateur démarre la lecture AVANT que le hook client ne
 * bascule — retirer l'attribut ensuite n'arrête pas une vidéo déjà lancée.
 * Résultat : une personne qui a demandé moins de mouvement en recevait quand
 * même. On agit donc sur l'ÉLÉMENT (`pause()`) et on lui rend les contrôles,
 * pour qu'elle déclenche elle-même si elle le souhaite.
 */
export default function OctaveDemoVideo({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const t = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  /**
   * ── LE TÉLÉCHARGEMENT ATTEND QUE LA VIDÉO SOIT EN VUE (QA v3, 2026-08-14)
   *
   * Mesuré : 1,68 Mo partaient AU CHARGEMENT de /carte-des-vins, alors que la
   * vidéo vit en section 3, très loin sous la ligne de flottaison. `autoplay`
   * l'emporte sur `preload="metadata"` : le navigateur télécharge tout pour
   * pouvoir démarrer. Un visiteur qui ne descend jamais jusque-là payait donc
   * 1,68 Mo de données mobiles pour rien.
   *
   * Correctif : `preload="none"` et pas d'attribut `autoplay` ; un
   * IntersectionObserver arme la source et lance la lecture quand la vidéo
   * approche de l'écran. L'expérience est IDENTIQUE (elle démarre seule quand
   * on la regarde), la vidéo n'est ni raccourcie ni dégradée, et le poster
   * occupe l'espace entre-temps, donc aucun décalage de mise en page.
   *
   * Repli sans IntersectionObserver (très anciens navigateurs) : on charge
   * immédiatement, comme avant.
   */
  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const demarrer = () => {
      if (reduced) {
        v.controls = true;
        return;
      }
      v.controls = false;
      // Le navigateur peut refuser la lecture automatique : on la redemande
      // une fois, sans jamais lever d'erreur visible.
      void v.play().catch(() => {});
    };

    if (reduced) {
      v.pause();
      v.controls = true;
      v.currentTime = 0;
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      v.load();
      demarrer();
      return;
    }

    const obs = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) {
          if (!e.isIntersecting) continue;
          obs.disconnect();
          v.load();
          demarrer();
        }
      },
      // 200 px d'avance : la vidéo est prête quand elle arrive à l'écran.
      { rootMargin: '200px' },
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <div className="mx-auto w-full max-w-[320px]">
      <p className="mb-4 text-center font-body text-[11px] tracking-[0.26em] uppercase text-foreground-faint">
        {t('Octave en action', 'Octave in action')}
      </p>

      {/* Cadre iPhone (bezel sombre, sans encoche), profondeur */}
      <div className="relative rounded-[3rem] border border-black/30 bg-sunk p-3 shadow-[0_50px_120px_-35px_rgba(40,28,16,0.55)] ring-1 ring-white/5">
        {/* ÉCRAN, la vidéo le remplit (ratio ≈ écran, object-cover propre) */}
        <div className="relative overflow-hidden rounded-[2.4rem] bg-sunk">
          <video
            ref={ref}
            className="block aspect-[30/61] w-full h-full object-cover"
            poster="/video/octave-demo-poster.jpg"
            loop
            // `muted` ET `playsInline` restent OBLIGATOIRES : sans eux, iOS
            // refuse toute lecture automatique et ouvrirait la vidéo en plein
            // écran. La lecture est déclenchée par l'observateur ci-dessus.
            muted
            playsInline
            preload="none"
            aria-label={t(
              "Démonstration de l'application iQWine : les vins retenus par Octave, avec le pourquoi de chacun.",
              'iQWine app demo: the wines Octave selected, each with its reason.'
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
