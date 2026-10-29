'use client';
/*
 * LottiePlayer (atom) — plays a Lottie JSON animation. Always decorative,
 * so it is hidden from screen readers (WCAG 1.1.1).
 *
 * Vue 3 equivalent: atoms/LottiePlayer/index.vue with
 *   onMounted   → load lottie-web and start the animation
 *   onUnmounted → anim.destroy()
 *   emit('ready') / emit('complete') → here the `onReady` / `onComplete` callback props
 * Here mount + unmount live in one useEffect: the function it returns is the cleanup.
 *
 * - lottie-web touches `window`, so it is imported dynamically inside the
 *   effect (browser only); the server render is just an empty <div>.
 * - The JSON is fetched from /public, so it is not in the JS bundle.
 * - Plays `plays` times then rests on the last frame: no endless motion (WCAG 2.2.2).
 * - Reduced motion: nothing is downloaded or played at all (WCAG 2.3.3).
 */
import { useEffect, useRef } from 'react';
import type { AnimationItem } from 'lottie-web';
import { prefersReducedMotion } from '@/lib/motion';

type LottiePlayerProps = {
  /** URL of the Lottie JSON in /public, e.g. "/lottie/hexagon.json". */
  src: string;
  /** How many times to play before stopping. */
  plays?: number;
  /** Called when the animation is on screen and playing ≈ emit('ready'). */
  onReady?: () => void;
  /** Called once the last play has finished ≈ emit('complete'). */
  onComplete?: () => void;
  className?: string;
};

/** Decorative Lottie animation that plays a few times, then rests. */
export default function LottiePlayer({ src, plays = 2, onReady, onComplete, className }: LottiePlayerProps) {
  const container = useRef<HTMLDivElement>(null);

  // Keep the latest callbacks in refs, so a new function from the parent
  // doesn't restart the animation (they are not effect dependencies).
  const onReadyRef = useRef(onReady);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onReadyRef.current = onReady;
    onCompleteRef.current = onComplete;
  }, [onReady, onComplete]);

  // useEffect with [src, plays] ≈ onMounted + watch([src, plays]);
  // the returned function ≈ onUnmounted (and runs before a re-run).
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let anim: AnimationItem | undefined;
    let cancelled = false; // the component may unmount while we are still loading

    async function start() {
      const [{ default: lottie }, animationData] = await Promise.all([
        import('lottie-web/build/player/lottie_light'), // SVG renderer, no expressions: smaller bundle
        fetch(src).then((res) => {
          if (!res.ok) throw new Error(`Lottie not found: ${src}`);
          return res.json();
        }),
      ]);
      if (cancelled || !container.current) return;

      anim = lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData,
      });
      // Lottie's own "SVG is built" event, so `onReady` never fires before there is something to see.
      anim.addEventListener('DOMLoaded', () => onReadyRef.current?.());

      // Replay until we reach `plays`, then stay on the last frame and report it.
      let played = 1;
      anim.addEventListener('complete', () => {
        if (played < plays) {
          played += 1;
          anim?.goToAndPlay(0, true);
        } else {
          onCompleteRef.current?.();
        }
      });
    }

    // Decorative only: if loading fails, show nothing rather than an error.
    start().catch(() => {});

    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, [src, plays]);

  return <div ref={container} className={className} aria-hidden="true" />;
}
