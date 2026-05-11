'use client';

import SectionWrapper from '@/components/ui/SectionWrapper';
import TitleAccent from '@/components/ui/TitleAccent';
import FadeInOnScroll from '@/components/motion/FadeInOnScroll';
import { useLocale } from '@/lib/i18n';
import { getShift, getEyebrows } from '@/lib/constants';

export default function TheShift() {
  const { locale } = useLocale();
  const shift = getShift(locale);
  const eyebrows = getEyebrows(locale);

  return (
    <SectionWrapper withDivider>
      <div className="max-w-3xl mx-auto text-center">
        <FadeInOnScroll>
          <div className="iq-eyebrow mb-8">{eyebrows.shift}</div>

          {/* Display title — flat ivory, no gradient animation.
              Single accent via terminal period. */}
          <h2 className="iq-display mb-8">
            <TitleAccent text={shift.title} />
          </h2>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.2}>
          <div className="space-y-2">
            {shift.lines.map((line) => (
              <p
                key={line}
                className="iq-lead"
              >
                {line}
              </p>
            ))}
          </div>
        </FadeInOnScroll>
      </div>
    </SectionWrapper>
  );
}
