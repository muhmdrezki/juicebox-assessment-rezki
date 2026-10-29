'use client';
/*
 * Walkthrough route ("/walkthrough") — Figma "Step 2.1" × 3.
 *
 * Vue 3 equivalent: pages/Walkthrough/index.vue. Like a Vue page, this is
 * where state lives and components are wired together:
 *   const index = ref(0)                    → useState(0)
 *   <WalkthroughSlider v-model="index" />   → activeIndex + onChange props
 *
 * Header back: previous slide, or home from the first slide (router.push).
 * Actions: "Continue" (outline) → next slide; on the last slide
 * "Get started" (white) → /form (R-WALK-3).
 */
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/atoms/Button';
import HexagonArt from '@/components/atoms/HexagonArt';
import { cx } from '@/lib/cx';
import { HEXAGON_MORPH } from '@/lib/morph';
import { transitionTypesFor } from '@/lib/nav';
import WalkthroughSlider, { type WalkthroughSlide } from '@/components/organisms/WalkthroughSlider';
import ScreenLayout from '@/components/templates/ScreenLayout';
import styles from './page.module.css';

/** Copy from Figma, one entry per slide. */
const SLIDES: readonly WalkthroughSlide[] = [
  {
    id: 'listened',
    text: 'Professionals around the world shared how they feel about technology and I’ve listened. Now it’s your turn.',
  },
  {
    id: 'questions',
    text: 'I’ll ask you a handful of meaningful questions and compare your responses with people in your industry.',
  },
  {
    id: 'insights',
    text: 'You’ll get insights into current industry sentiments and a reality check about technology in a few minutes. Deal? Great!',
  },
];

/** Walkthrough: hexagon, swipeable copy, dots and Continue / Get started. */
export default function WalkthroughPage() {
  const [index, setIndex] = useState(0); // ≈ const index = ref(0)
  const router = useRouter(); // ≈ useRouter() from vue-router
  const actions = useRef<HTMLDivElement>(null);
  const keepFocusInActions = useRef(false);

  const isLast = index === SLIDES.length - 1;

  // Every slide change goes through here (Continue, back, swipe, arrow keys).
  // If keyboard focus is on the action button, remember it: the button is
  // swapped (Continue ↔ Get started) and focus must follow to the new one.
  // Only ever set to true here (cleared by the effect below): when the page
  // moves the slider, Swiper echoes the change back after the old button has
  // already unmounted, and that echo must not wipe the flag.
  function changeSlide(next: number) {
    if (actions.current?.contains(document.activeElement)) keepFocusInActions.current = true;
    setIndex(next);
  }

  // Header back: previous slide, or home from the first slide. Always a
  // <button> (never swapped for a link), so keyboard focus stays on it.
  function goBack() {
    if (index > 0) changeSlide(index - 1);
    else router.push('/', { transitionTypes: transitionTypesFor('back') }); // ≈ router.push('/') in Vue Router
  }

  // ≈ watch(index, …): after the swap, put the focus back on the new button.
  useEffect(() => {
    if (!keepFocusInActions.current) return;
    keepFocusInActions.current = false;
    actions.current?.querySelector<HTMLElement>('a, button')?.focus();
  }, [index]);

  return (
    <ScreenLayout
      back={{ onClick: goBack }}
      media={
        // HEXAGON_MORPH: morphs from the home hexagon, and into the form's hexagon on "Get started".
        <HexagonArt
          box="small"
          className={cx(styles.hexagon, HEXAGON_MORPH.always)}
          sizes="(min-width: 1024px) 370px, 146px"
          preload
        />
      }
      actions={
        <div ref={actions}>
          {isLast ? (
            <Button href="/form" variant="light" direction="forward">
              Get started
            </Button>
          ) : (
            <Button variant="outline" onClick={() => changeSlide(index + 1)}>
              Continue
            </Button>
          )}
        </div>
      }
    >
      <h1 className="visually-hidden">How it works</h1>
      <WalkthroughSlider slides={SLIDES} activeIndex={index} onChange={changeSlide} />
    </ScreenLayout>
  );
}
