'use client';

/**
 * HOME, refonte v3 « À l'unisson », architecture SIX SECTIONS
 * (décision d'Eric, 2026-08-13 : la homepage séduit en six chapitres ;
 * les pages Fonction prouveront en profondeur).
 *
 *   1. HERO, le besoin : « Vous ne cherchez plus un bon vin. »
 *   2. LA QUESTION, « Lequel vais-je aimer, moi ? »
 *   3. EN MAGASIN, première preuve : Octave m'aide à choisir.
 *   4. OÙ QUE LE CHOIX ARRIVE, restaurant + repas, un seul diptyque.
 *   5. IL APPREND QUI VOUS ÊTES, le différenciateur (palais).
 *   6. LA RÉSOLUTION, cave + apogée + signature + CTA.
 *
 * Sections héritées RETIRÉES de l'assemblage (fichiers et assets CONSERVÉS
 * pour les pages Fonction, rien n'est perdu, cf. docs/refonte-v3-contenus.md) :
 * Film, Pourquoi, CaveWeb, Piliers, Demo (interactive), Palais (ancienne),
 * Saq, MomentsEnjeu, TroisMoments, Comparison, Confiance, Cercle, Tarifs
 * (la page /tarifs demeure, la nav y mène), Faq, FinalCta (remplacée par la
 * résolution).
 */

import dynamic from 'next/dynamic';
import HeroRayon from '@/components/sections/HeroRayon';

const SectionQuestion = dynamic(() => import('@/components/sections/SectionQuestion')); // 2
const SectionRayonMagasin = dynamic(() => import('@/components/sections/SectionRayonMagasin')); // 3
const SectionChoixPartout = dynamic(() => import('@/components/sections/SectionChoixPartout')); // 4
const SectionPalaisOctave = dynamic(() => import('@/components/sections/SectionPalaisOctave')); // 5
const SectionResolution = dynamic(() => import('@/components/sections/SectionResolution')); // 6
const StickyCTA = dynamic(() => import('@/components/ui/StickyCTA'));
const ScrollDepthTracker = dynamic(() => import('@/components/analytics/ScrollDepthTracker'));

export default function HomeClient() {
  return (
    <>
      <main>
        <HeroRayon />
        <SectionQuestion />
        <SectionRayonMagasin />
        <SectionChoixPartout />
        <SectionPalaisOctave />
        <SectionResolution />
      </main>
      <StickyCTA />
      <ScrollDepthTracker />
    </>
  );
}
