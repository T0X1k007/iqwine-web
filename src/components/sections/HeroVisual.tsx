import { Wine } from 'lucide-react';

/**
 * HeroVisual — emplacement PHOTOGRAPHIE du hero (Phase 6, Q19 option B).
 *
 * Le hero s'ouvre sur l'émotion : le texte (à gauche) porte le « quoi »
 * (« Votre sommelier IA »), cette colonne porte le ressenti. La démonstration
 * vivante n'est pas perdue — elle vit en section 2 (SectionDemo).
 *
 * Ici, un emplacement TRAITÉ proprement (cadre portrait chaud, liseré or fin,
 * grain subtil, motif discret), jamais un vide béant. La VRAIE photographie
 * art de vivre s'insère en Phase 7 sans changer la structure : il suffira de
 * remplacer le fond dégradé par <img className="absolute inset-0 ...">.
 */
export default function HeroVisual() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div
        className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-or/20"
        style={{ boxShadow: '0 32px 80px rgba(0, 0, 0, 0.45)' }}
      >
        {/* Scène chaude (placeholder traité — remplacé par la photo en Phase 7) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 30% 25%, rgba(212, 165, 72, 0.22), transparent 60%),' +
              'radial-gradient(ellipse 90% 70% at 75% 80%, rgba(142, 42, 42, 0.30), transparent 65%),' +
              'linear-gradient(160deg, #241a14 0%, #1a1310 55%, #120c0a 100%)',
          }}
        />
        {/* Grain subtil */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(243, 236, 231, 0.6) 1px, transparent 1px)',
            backgroundSize: '7px 7px',
          }}
        />
        {/* Motif discret centré — éteint sous la vraie photo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Wine className="h-20 w-20 text-or/20" strokeWidth={0.75} aria-hidden />
        </div>
        {/* Vignette de lecture en bas (prépare une légende/overlay éventuel) */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background: 'linear-gradient(to top, rgba(18, 12, 10, 0.55), transparent)',
          }}
        />
      </div>
    </div>
  );
}
