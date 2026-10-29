'use client';
/*
 * WalkthroughSlider (organism) — the swipeable tutorial copy (Swiper.js)
 * with the progress dots underneath.
 *
 * Vue 3 equivalent: organisms/WalkthroughSlider/index.vue using
 * <swiper> / <swiper-slide> as a controlled component ≈ v-model:
 *   prop `activeIndex` ≈ modelValue  → the slider follows it (slideTo)
 *   `onChange(index)`  ≈ emit('update:modelValue') → reports swipes / arrow keys
 * The page owns the index; Swiper stays an implementation detail in here.
 *
 * Accessibility: Swiper's A11y module labels the region and each slide
 * ("2 of 3"); Keyboard module adds arrow-key navigation; off-screen slides
 * are hidden from screen readers; one live region of our own announces
 * changes. Reduced motion: slides change instantly (speed 0).
 */
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import Dots from '@/components/atoms/Dots';
import HighlightText from '@/components/atoms/HighlightText';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './index.module.css';

export type WalkthroughSlide = { id: string; text: string };

type WalkthroughSliderProps = {
  slides: readonly WalkthroughSlide[];
  /** Index of the visible slide (owned by the page) ≈ modelValue. */
  activeIndex: number;
  /** Called when the user swipes or uses the arrow keys ≈ emit('update:modelValue'). */
  onChange: (index: number) => void;
};

/** Slide transition length in ms (Figma prototype "Push", spring ≈ 0.5 s). */
const SLIDE_SPEED_MS = 500;

/** Swiper with the walkthrough copy and the progress dots. */
export default function WalkthroughSlider({ slides, activeIndex, onChange }: WalkthroughSliderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  // The live region stays empty until the first change, so the first slide
  // isn't read twice when the page loads.
  const [hasChanged, setHasChanged] = useState(false);

  // ≈ watch(() => props.activeIndex, i => swiper.slideTo(i)): follow the page's index.
  useEffect(() => {
    if (swiper && swiper.activeIndex !== activeIndex) swiper.slideTo(activeIndex);
  }, [swiper, activeIndex]);

  return (
    <div className={styles.slider}>
      <Swiper
        modules={[A11y, Keyboard]}
        className={styles.swiper}
        speed={reducedMotion ? 0 : SLIDE_SPEED_MS}
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{
          containerRoleDescriptionMessage: 'walkthrough',
          itemRoleDescriptionMessage: 'step',
          slideLabelMessage: '{{index}} of {{slidesLength}}',
          wrapperLiveRegion: false, // we announce changes ourselves (below), once
        }}
        onSwiper={setSwiper}
        onSlideChange={(s) => {
          setHasChanged(true);
          onChange(s.activeIndex);
        }}
      >
        {/* v-for="(slide, i) in slides" :key="slide.id" */}
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.id} aria-hidden={i !== activeIndex}>
            <HighlightText text={slide.text} active={i === activeIndex} className={styles.text} />
          </SwiperSlide>
        ))}
      </Swiper>

      <Dots count={slides.length} active={activeIndex} className={styles.dots} />

      <p className="visually-hidden" aria-live="polite">
        {hasChanged ? `Step ${activeIndex + 1} of ${slides.length}. ${slides[activeIndex]?.text ?? ''}` : ''}
      </p>
    </div>
  );
}
