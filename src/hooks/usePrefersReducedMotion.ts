'use client';
/*
 * usePrefersReducedMotion — true while the user asks for reduced motion,
 * and updates live if they change the setting.
 *
 * Vue 3 equivalent: a composable `usePrefersReducedMotion()` returning a
 * ref that a matchMedia 'change' listener keeps up to date (≈ VueUse's
 * usePreferredReducedMotion).
 *
 * useSyncExternalStore is React's way to read a browser value that can
 * change outside React. On the server it returns `false` (no window), so
 * the first client render matches the HTML (no hydration warning).
 */
import { useSyncExternalStore } from 'react';
import { REDUCED_MOTION_QUERY } from '@/lib/motion';

/** Listen for changes of the reduced-motion media query. */
function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/** Reactive "prefers reduced motion" flag. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}
