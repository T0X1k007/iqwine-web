'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/ui/SectionWrapper';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import IPhoneFrame from '@/components/mockup/IPhoneFrame';
import TonightScreen from '@/components/mockup/screens/TonightScreen';
import ApogeeScreen from '@/components/mockup/screens/ApogeeScreen';
import ScannerScreen from '@/components/mockup/screens/ScannerScreen';
import { useLocale } from '@/lib/i18n';
import { getCeSoir, getEyebrows } from '@/lib/constants';

/**
 * Section Ce soir — preuve immersive du produit.
 *
 * Desktop : 3 mockups iPhone disposés en éventail (Tonight au centre, plus
 * grand et avancé en Z ; Scanner gauche reculé ; Apogée droite reculé).
 * Mobile : 1 phone Tonight visible + carrousel horizontal swipe pour les
 * deux autres (snap, dots indicateurs).
 *
 * Captions sous chaque phone, fermeture éditoriale grand format.
 */
export default function CeSoir() {
  const { locale } = useLocale();
  const ceSoir = getCeSoir(locale);
  const eyebrows = getEyebrows(locale);

  return (
    <SectionWrapper id="cesoir" withDivider>
      {/* Header — eyebrow + titre + intro narrative */}
      <FadeInOnScroll>
        <div className="text-center mb-12 sm:mb-16">
          <div className="iq-eyebrow mb-6">{eyebrows.ceSoir}</div>
          <h2 className="iq-h2 max-w-3xl mx-auto mb-6">{ceSoir.title}</h2>
          <p className="iq-lead italic max-w-2xl mx-auto leading-relaxed">
            {ceSoir.intro}
          </p>
        </div>
      </FadeInOnScroll>

      {/* Desktop : 3 phones en éventail */}
      <div className="hidden lg:block">
        <FadeInOnScroll delay={0.2}>
          <div className="relative flex items-center justify-center min-h-[680px] mt-8">
            {/* Scanner — gauche, reculé */}
            <div
              className="absolute z-10"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-140%, -50%) translateY(20px) scale(0.88)',
              }}
            >
              <PhoneWithCaption caption={ceSoir.captions.scanner}>
                <IPhoneFrame width={260} float floatDelay={0.5}>
                  <ScannerScreen />
                </IPhoneFrame>
              </PhoneWithCaption>
            </div>

            {/* Tonight — centre, hero */}
            <div
              className="relative z-20"
              style={{ transform: 'translateY(-10px)' }}
            >
              <PhoneWithCaption caption={ceSoir.captions.tonight} hero>
                <IPhoneFrame width={300} float floatDelay={0}>
                  <TonightScreen />
                </IPhoneFrame>
              </PhoneWithCaption>
            </div>

            {/* Apogée — droite, reculé */}
            <div
              className="absolute z-10"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(40%, -50%) translateY(20px) scale(0.88)',
              }}
            >
              <PhoneWithCaption caption={ceSoir.captions.apogee}>
                <IPhoneFrame width={260} float floatDelay={1.0}>
                  <ApogeeScreen />
                </IPhoneFrame>
              </PhoneWithCaption>
            </div>
          </div>
        </FadeInOnScroll>
      </div>

      {/* Mobile/tablet : Tonight hero + carrousel swipe */}
      <div className="lg:hidden">
        <CeSoirMobile captions={ceSoir.captions} />
      </div>

      {/* Closing line — éditorial grand format italique */}
      <FadeInOnScroll delay={0.4}>
        <div className="text-center mt-16 sm:mt-20">
          <div className="flex items-center justify-center gap-4 max-w-xl mx-auto">
            <div className="flex-1 h-px bg-or/25" />
            <p className="font-[family-name:var(--font-display)] italic text-or text-xl sm:text-2xl tracking-tight whitespace-nowrap">
              {ceSoir.closing}
            </p>
            <div className="flex-1 h-px bg-or/25" />
          </div>
        </div>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}

/* ─────────────────────────────────────────────────────────── */

function PhoneWithCaption({
  children,
  caption,
  hero = false,
}: {
  children: React.ReactNode;
  caption: string;
  hero?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      {children}
      <p
        className={`font-mono text-[10px] tracking-[0.28em] uppercase mt-6 text-center ${
          hero ? 'text-or' : 'text-muted-foreground'
        }`}
      >
        {caption}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */

function CeSoirMobile({
  captions,
}: {
  captions: { tonight: string; scanner: string; apogee: string };
}) {
  const [active, setActive] = useState(0);
  const [containerWidth, setContainerWidth] = useState(280);

  useEffect(() => {
    const w = Math.min(window.innerWidth - 80, 320);
    setContainerWidth(w);
  }, []);

  const screens = [
    { key: 'tonight', label: captions.tonight, Component: TonightScreen },
    { key: 'scanner', label: captions.scanner, Component: ScannerScreen },
    { key: 'apogee', label: captions.apogee, Component: ApogeeScreen },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Carousel snap */}
      <div className="w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        <div className="flex gap-6 px-[calc(50%-160px)]">
          {screens.map((s, i) => {
            const Screen = s.Component;
            return (
              <div
                key={s.key}
                className="snap-center shrink-0 flex flex-col items-center"
                onClick={() => setActive(i)}
              >
                <IPhoneFrame width={containerWidth} float floatDelay={i * 0.5}>
                  <Screen />
                </IPhoneFrame>
                <p
                  className={`font-mono text-[10px] tracking-[0.28em] uppercase mt-5 text-center transition-colors ${
                    active === i ? 'text-or' : 'text-muted-foreground'
                  }`}
                >
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex items-center gap-2 mt-6">
        {screens.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setActive(i)}
            className="rounded-full"
            animate={{
              width: active === i ? 20 : 6,
              backgroundColor:
                active === i ? 'rgb(201, 163, 106)' : 'rgba(245, 239, 230, 0.3)',
              height: 6,
            }}
            transition={{ duration: 0.3 }}
            aria-label={`Aller à l'écran ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
