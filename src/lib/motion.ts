/*
 * Motion helpers shared by GSAP, Lottie and Lenis, so all three respect the
 * user's "reduce motion" setting the same way (WCAG 2.3.3).
 *
 * Vue 3 equivalent: a tiny helper in `helper/motion.js`.
 */

/** Matches when the user asked the OS for less motion. */
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Matches when motion is fine. Used with gsap.matchMedia(). */
export const MOTION_OK_QUERY = '(prefers-reduced-motion: no-preference)';

/** True when the user prefers reduced motion. Browser only (call inside effects). */
export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
