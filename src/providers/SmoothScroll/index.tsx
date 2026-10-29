'use client';
/*
 * SmoothScroll (provider) — turns on Lenis smooth scrolling for the whole
 * app, driven by GSAP's frame loop so scrolling and animations stay in sync.
 *
 * Vue 3 equivalent: a plugin installed in main.js (app.use(...)) or a
 * wrapper in App.vue whose onMounted creates Lenis and onUnmounted destroys it.
 *
 * Wrapping `children` lets the root layout stay a Server Component: only
 * this small wrapper runs in the browser.
 *
 * Not started when the user prefers reduced motion (WCAG 2.3.3): the
 * browser's normal scrolling is used instead.
 */
import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motion';

/** Provides Lenis smooth scrolling to everything inside it. */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  // Runs once after mount (empty deps ≈ onMounted); the return ≈ onUnmounted.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ autoRaf: false });
    // GSAP's ticker gives time in seconds; Lenis wants milliseconds.
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0); // keep scroll smooth after a tab switch

    return () => {
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33); // GSAP's default
      lenis.destroy();
    };
  }, []);

  return children;
}
